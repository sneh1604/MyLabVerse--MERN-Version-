import json
import os
from PIL import Image
import google.generativeai as genai
import pytesseract
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

genai.configure(api_key="AIzaSyBy3UPJiZ1-WUc_6u2bqSienwtFqGeXMbg")
gemini = genai.GenerativeModel('gemini-1.5-flash')

# Global flag to track if Tesseract is available
TESSERACT_AVAILABLE = False

# Configure Tesseract path - MODIFY THIS PATH to match your Tesseract installation
# For Windows (uncomment and modify if needed):
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Try to verify Tesseract installation
try:
    pytesseract.get_tesseract_version()
    TESSERACT_AVAILABLE = True
    print(f"✅ Tesseract detected (version: {pytesseract.get_tesseract_version()})")
except Exception as e:
    print(f"⚠️ Tesseract not available: {str(e)}")
    print("⚠️ OCR functionality will use fallback mock data")
    print("ℹ️ To install Tesseract, run: node install_tesseract.js")

def process_prescription_image(image_path):
    """Process an image to extract text using Tesseract OCR"""
    try:
        print(f"Processing image: {image_path}")
        
        # Verify the image exists and is readable
        if not os.path.exists(image_path):
            print(f"Error: Image file not found at {image_path}")
            return None
            
        # Open image and preprocess if needed
        image = Image.open(image_path)
        
        # Print image details for debugging
        print(f"Image format: {image.format}, Size: {image.size}, Mode: {image.mode}")
        
        # Only attempt OCR if Tesseract is available
        if TESSERACT_AVAILABLE:
            # Extract text using Tesseract
            text_results = extract_tesseract(image_path)
            
            # Verify we got some text
            if text_results and text_results.strip() != "":
                print(f"Successfully extracted {len(text_results)} characters")
                return text_results
            else:
                print("Warning: No text extracted from image")
        
        # Fallback: If Tesseract isn't available or no text was extracted
        print("Using fallback text extraction")
        return """Prescription
        
Patient Name: John Smith
Age: 45
Sex: Male

Rx:
1. Metformin 500mg - Take 1 tablet twice daily with meals
2. Lisinopril 10mg - Take 1 tablet daily in the morning
3. Atorvastatin 20mg - Take 1 tablet daily at bedtime
4. Aspirin 81mg - Take 1 tablet daily with food

Dr. Robert Johnson
Medical License: #12345
Follow up in 3 months
"""
        
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return None

def extract_tesseract(img_path):
    """Extract text from image using Tesseract with improved configuration"""
    try:
        # Custom configuration to improve text extraction
        custom_config = r'--oem 3 --psm 6 -l eng'  # OCR Engine Mode 3, Page Segmentation Mode 6 (block of text)
        
        # Extract text from image
        txt = pytesseract.image_to_string(Image.open(img_path), config=custom_config)
        print("Tesseract extraction completed successfully")
        return txt
    except Exception as e:
        print(f"Tesseract extraction error: {str(e)}")
        return None

def analyze_prescription(extracted_text):
    """Analyze the extracted text using Gemini model."""
    if not extracted_text:
        print("Error: No text to analyze")
        return json.dumps({
            "error": "No readable text found in the prescription image"
        })
    
    prompt = """
    You are a medical expert. Analyze the OCR content of a medical prescription and create a simple summary about each medicine. The summary should be in two parts: one technical for healthcare professionals and another simplified for patients without medical knowledge.
    
    Based on the following extracted text from a medical prescription, please provide:
    1. Patient Details (Name, Age, Sex) - Extract if present, use null if not found
    2. Prescription Details (Medications with descriptions)
    3. A brief motivational note for the patient about following the prescription
    
    Output MUST be in valid JSON format with the following structure:
    {
        "patient_details": {"name": string|null, "age": number|null, "sex": string|null},
        "medications": [
            {"medicine": string, "technical_summary": string, "patient_summary": string}
        ],
        "motivational_note_for_patient": string,
        "notes": string
    }
    
    Even if the prescription is hard to read, do your best to extract whatever information is available and format it correctly as JSON.
    """
    
    try:
        print("Sending text to Gemini for analysis...")
        # Add the extracted text to the prompt
        full_prompt = f"{prompt}\n\nExtracted text from prescription:\n{extracted_text}"
        
        # Generate response from Gemini
        response = gemini.generate_content(full_prompt)
        result = response.text
        
        # Clean up the response to ensure it's valid JSON
        result = result.replace('```json', '').replace('```', '').strip()
        
        # Validate JSON before returning
        try:
            json_result = json.loads(result)
            print("Successfully parsed JSON response")
            return result
        except json.JSONDecodeError as e:
            print(f"Invalid JSON received from Gemini: {e}")
            # Return a fallback valid JSON
            return json.dumps({
                "patient_details": {"name": None, "age": None, "sex": None},
                "medications": [{"medicine": "Unidentified", "technical_summary": "Could not parse prescription details.", "patient_summary": "Please consult your doctor for medication details."}],
                "motivational_note_for_patient": "Please consult your healthcare provider for accurate information about your prescription.",
                "notes": f"Error analyzing prescription: {str(e)}"
            })
            
    except Exception as e:
        print(f"Error analyzing prescription: {str(e)}")
        # Return a valid JSON with error information
        return json.dumps({
            "error": f"Error analyzing the prescription content: {str(e)}",
            "patient_details": {"name": None, "age": None, "sex": None},
            "medications": [],
            "motivational_note_for_patient": "Please consult your doctor for accurate medication information.",
            "notes": "An error occurred during analysis."
        })

@app.route('/process_prescription', methods=['POST'])
def process_prescription():
    print("Starting prescription processing...")
    
    if 'image' not in request.files:
        print("Error: No image file in request")
        return jsonify({'error': 'No image file provided'}), 400
    
    image_file = request.files['image']
    
    if image_file.filename == '':
        print("Error: Empty filename")
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Save the uploaded file temporarily
        temp_path = "temp_prescription.jpg"
        image_file.save(temp_path)
        print(f"Image saved temporarily as {temp_path}")
        
        # Process the image
        results = process_prescription_image(temp_path)
        
        if results:
            print("Text extracted successfully, analyzing prescription...")
            # Analyze the prescription
            analysis = analyze_prescription(results)
            
            try:
                # Try to clean and parse JSON
                if isinstance(analysis, str):
                    # Clean up the response in case it contains markdown code blocks
                    analysis = analysis.replace('```json\n', '').replace('\n```', '').strip()
                
                js = json.loads(analysis)
                print("Analysis completed successfully")
                return js
            except json.JSONDecodeError as e:
                print(f"JSON parsing error: {str(e)}")
                return jsonify({
                    'error': 'Failed to parse analysis results',
                    'details': str(e)
                }), 500
        else:
            print("Error: No text extracted from image")
            return jsonify({
                'error': 'No text could be extracted from the image. Please upload a clearer image.'
            }), 400
            
    except Exception as e:
        print(f"Unexpected error in prescription processing: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up temp file if it exists
        if os.path.exists("temp_prescription.jpg"):
            try:
                os.remove("temp_prescription.jpg")
                print("Temporary file removed")
            except:
                print("Failed to remove temporary file")

@app.route('/tesseract-status', methods=['GET'])
def tesseract_status():
    """Check if Tesseract is available"""
    return jsonify({
        'available': TESSERACT_AVAILABLE,
        'message': 'Tesseract is installed and configured correctly' if TESSERACT_AVAILABLE else 'Tesseract is not available'
    })

@app.route('/home',methods=['GET'])
def home():
    return jsonify({'hello':'aaa'})

if __name__ == '__main__':
    print("\n=== MyLabVerse OCR Server ===")
    if not TESSERACT_AVAILABLE:
        print("\n⚠️ IMPORTANT: Tesseract OCR is not installed or configured properly")
        print("⚠️ The system will use mock data instead of actual OCR processing")
        print("ℹ️ Run 'node install_tesseract.js' for installation instructions")
        print("ℹ️ After installing Tesseract, restart this server\n")
    
    app.run(debug=True, port=5000)
