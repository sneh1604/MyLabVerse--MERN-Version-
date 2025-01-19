import json
from PIL import Image
import google.generativeai as genai
import pytesseract
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

genai.configure(api_key="AIzaSyBy3UPJiZ1-WUc_6u2bqSienwtFqGeXMbg")
gemini = genai.GenerativeModel('gemini-1.5-flash')

def process_prescription_image(image_path):
    try:
        image = Image.open(image_path)
        text_results = extract_tessract(image_path)
        return text_results
    except Exception as e:
        return []

def extract_tessract(img):
    txt = pytesseract.image_to_string(img)
    return txt

def analyze_prescription(extracted_text):
    """
    Analyze the extracted text using Gemini model.
    """
    prompt = """
    You are best doctor. Analyze the OCR content of medical prescription and based on medicines and create simple summary about why each medicine is used. this summary should be in two parts one which is technical and other one which pateint can understand easily without any depth knowledge about medicines. 
    
    Based on the following extracted text from a medical prescription, please provide:
    1. Patient Details (Name, Age, Sex)
    2. Prescription Details (Medications)
    3. **NOTE** Every things you said and Output should be in json format only
    Extracted Output in JSON as template:
    {
        'patient_details': {'name','age','sex'},'medications':[{'medicine','technical_summary','patient_summary'}],'motivational_note_for_patient','notes'.
    }
    """
    
    try:
        # Generate response from Gemini
        response = gemini.generate_content(prompt + "\n".join(extracted_text))
        return response.text
    except Exception as e:
        print(f"Error analyzing prescription: {str(e)}")
        return "Error analyzing the prescription content."

@app.route('/process_prescription', methods=['POST'])
def process_prescription():
    print("QQQQQQQ")
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    image_file = request.files['image']
    
    if image_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Save the uploaded file temporarily
        temp_path = "temp_prescription.jpg"
        image_file.save(temp_path)
        
        # Process the image
        results = process_prescription_image(temp_path)
        
        if results:
            # Analyze the prescription
            analysis = analyze_prescription(results)
            aa = analysis.replace('```json\n','').replace('\n```','')
            print(aa)
            js = json.loads(aa)
            return js
        else:
            return jsonify({'error': 'No text could be extracted from the image'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/home',methods=['GET'])
def home():
    return jsonify({'hello':'aaa'})


if __name__ == '__main__':
    app.run(debug=True, port=5000,)
