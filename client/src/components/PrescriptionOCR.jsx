import React, { useState, useEffect } from 'react';
import { FaUser, FaChevronDown, FaHome, FaChartBar, FaFileAlt, FaUpload, FaPrescriptionBottleAlt, FaStethoscope, FaPills } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import axios from 'axios';

const PrescriptionOCR = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  // Example data for demonstration
  const tmp = {
    "patient_details": {
      "name": "Atul Shah",
      "age": null,
      "sex": null
    },
    "medications": [
      {
        "medicine": "Deplatt CV 75/75/20",
        "technical_summary": "Likely a combination drug containing Ramipril (ACE inhibitor) and Atorvastatin (statin). Ramipril lowers blood pressure and reduces risk of cardiovascular events. Atorvastatin lowers cholesterol levels.",
        "patient_summary": "This medicine helps control blood pressure and cholesterol to protect your heart."
      },
      {
        "medicine": "Metolar 25",
        "technical_summary": "Metoprolol (Beta-blocker). Reduces heart rate and blood pressure, used for hypertension and angina.",
        "patient_summary": "This medicine helps lower your blood pressure and heart rate."
      },
      {
        "medicine": "Telma 40",
        "technical_summary": "Telmisartan (Angiotensin II receptor blocker - ARB). Lowers blood pressure. Often used in hypertension.",
        "patient_summary": "This medicine also helps to lower your blood pressure."
      },
      {
        "medicine": "Glycomet SR 500",
        "technical_summary": "Metformin (Biguanide). Used to improve blood sugar control in type 2 diabetes.",
        "patient_summary": "This medicine helps control your blood sugar levels."
      },
      {
        "medicine": "Oxra-S 10/100",
        "technical_summary": "Likely a combination of Oxcarbazepine (anticonvulsant) and another drug (the '100' suggests dosage). Requires more information to definitively state the purpose, but possibly for seizure control or nerve pain.",
        "patient_summary": "This medicine is likely to help manage seizures or nerve pain. Please clarify with your doctor if you are unsure."
      },
      {
        "medicine": "L Dio-1",
        "technical_summary": "Insufficient information to determine the medicine. Needs clarification.",  
        "patient_summary": "Please ask your doctor what this medication is for."
      },
      {
        "medicine": "Atchol 20",
        "technical_summary": "Insufficient information. Needs clarification.",
        "patient_summary": "Please ask your doctor what this medication is for."
      }
    ],
    "motivational_note_for_patient": "Remember to take your medications as prescribed by your doctor. Maintaining a healthy lifestyle with proper diet and exercise will also significantly benefit your health.",
    "notes": "The prescription is partially illegible and some medication names are unclear. Some dosages are also missing. The patient's age and sex are missing. It's crucial to clarify the complete prescription details with the prescribing physician to ensure accurate understanding and treatment."
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsLoggedIn(true);
      setUserName(user.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/login');
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    const fileInput = document.getElementById("prescription-file");
    const file = fileInput?.files?.[0];

    if (!file) {
      setError('Please select an image file first');
      return;
    }

    setUploading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/process_prescription', formData, {
        withCredentials: false,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.data;
      setResult(data);
    } catch (err) {
      console.error("Error processing prescription:", err);
      // For demo purposes, use example data
      setResult(tmp);
      // Comment out the line above and uncomment below for production
      // setError(`Failed to process the image. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  const getMedicationIcon = (index) => {
    const icons = [<FaPills />, <FaStethoscope />, <FaPrescriptionBottleAlt />];
    return icons[index % icons.length];
  };

  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: 'Satoshi' }}>
      {/* Header */}
      <header className="bg-[#6C5BD4] text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <h1 
              className="text-2xl font-bold cursor-pointer" 
              onClick={() => navigate("/")}
            >
              MyLabVerse
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/userdashboard"
              className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200"
            >
              <FaHome /> <span>Dashboard</span>
            </Link>
            <Link
              to="/viewreport"
              className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200"
            >
              <FaFileAlt /> <span>Reports</span>
            </Link>
            <Link
              to="/graph"
              className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200"
            >
              <FaChartBar /> <span>Analytics</span>
            </Link>
            <Link
              to="/prescriptionocr"
              className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200"
            >
              <FaFileAlt /> <span>OCR</span>
            </Link>
          </nav>

          {/* User Menu */}
          {isLoggedIn && (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md transition duration-200">
                <FaUser className="text-sm" />
                <span className="text-sm font-medium">{userName}</span>
                <FaChevronDown className="text-sm" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-gray-700`}
                      >
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-gray-700 w-full text-left`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Prescription Scanner</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your prescription and get detailed information about your medications including their purposes and effects.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-full mb-6 text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg px-6 py-10 cursor-pointer hover:border-indigo-500 transition-colors duration-200 relative">
                <input
                  id="prescription-file"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                
                {previewUrl ? (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Prescription preview" 
                      className="mx-auto max-h-48 rounded shadow-sm" 
                    />
                    <p className="mt-2 text-sm text-gray-500">{fileName}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Click or drag and drop to upload your prescription
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <button
              className="bg-[#6C5BD4] hover:bg-[#5544b4] text-white font-medium py-3 px-6 rounded-md shadow-sm transition duration-200 flex items-center"
              disabled={uploading}
              onClick={handleImageUpload}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FaFileAlt className="mr-2" /> Analyze Prescription
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="max-w-5xl mx-auto">
            {/* Patient Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-indigo-500">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <FaUser className="mr-2 text-indigo-600" /> Patient Details
              </h2>
              <div className="pl-2 border-l-2 border-gray-200">
                {result.patient_details.name && (
                  <p className="text-lg mb-2">
                    <span className="font-medium text-gray-700">Name:</span> {result.patient_details.name}
                  </p>
                )}
                {result.patient_details.age && (
                  <p className="text-lg mb-2">
                    <span className="font-medium text-gray-700">Age:</span> {result.patient_details.age}
                  </p>
                )}
                {result.patient_details.sex && (
                  <p className="text-lg mb-2">
                    <span className="font-medium text-gray-700">Sex:</span> {result.patient_details.sex}
                  </p>
                )}
                {!result.patient_details.name && !result.patient_details.age && !result.patient_details.sex && (
                  <p className="text-gray-500 italic">No patient details found in the prescription</p>
                )}
              </div>
            </div>

            {/* Medications */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              <FaPills className="mr-2 text-[#FF6000]" /> Prescribed Medications
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {result.medications.map((med, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white flex items-center justify-between">
                    <h3 className="text-xl font-bold">{med.medicine}</h3>
                    <div className="bg-white text-indigo-600 p-2 rounded-full">
                      {getMedicationIcon(index)}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Technical Information
                      </h4>
                      <p className="text-gray-700">
                        {med.technical_summary}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        For Patient
                      </h4>
                      <p className="text-gray-800 font-medium">
                        {med.patient_summary}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes & Recommendations */}
            <div className="bg-gradient-to-r from-[#6C5BD4] to-indigo-600 rounded-lg shadow-lg p-6 text-white mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaStethoscope className="mr-2" /> Health Recommendations
              </h3>
              <p className="text-lg">{result.motivational_note_for_patient}</p>
            </div>

            {/* Doctor's Notes - Commented out but kept for future reference */}
            {/* <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <FaNotesMedical className="mr-2 text-orange-500" /> Additional Notes
              </h3>
              <p className="text-gray-700">{result.notes}</p>
            </div> */}
          </div>
        )}
      </main>
    </div>
  );
};

export default PrescriptionOCR;
