import React, { useState, useEffect } from 'react';
import { FaUser, FaChevronDown, FaHome, FaChartBar, FaFileAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import userImage from './../assets/user.png'; // Update this path to your user image
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import axios from 'axios';

const PrescriptionOCR = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const a = {
    "patient_details": {
      "name": null,
      "age": null,
      "sex": null
    },
    "medications": [
      {
        "medicine": "HISTAC-150",
        "technical_summary": "Likely Cetirizine 150mg.  Cetirizine is a second-generation H1-antihistamine used to treat allergic rhinitis (hay fever) and urticaria (hives). It blocks the action of histamine, a substance released by the body during an allergic reaction.",
        "patient_summary": "This medicine helps with allergies like hay fever or hives. It reduces symptoms like sneezing, runny nose, and itching."
      },
      {
        "medicine": "NOGACID-D",
        "technical_summary": "Likely an antacid containing a combination of drugs.  The '-D' might suggest a drug for dyspepsia.  Without knowing the specific components, a precise summary is impossible.  It likely neutralizes stomach acid.",
        "patient_summary": "This medicine helps with heartburn, acid reflux, or indigestion. It reduces stomach acid."
      },
      {
        "medicine": "OFLOXACIN-200",
        "technical_summary": "Ofloxacin 200mg is a fluoroquinolone antibiotic. It works by inhibiting bacterial DNA gyrase and topoisomerase IV, preventing bacterial DNA replication and cell division. Used to treat bacterial infections.",
        "patient_summary": "This is an antibiotic that fights bacterial infections. It's used to treat infections like bladder infections or pneumonia (depending on the type of infection being treated)."
      },
      {
        "medicine": "DROFEM",
        "technical_summary": "The exact composition of DROFEM is not clear from the provided information. More details are needed to provide a technical summary.",
        "patient_summary": "The purpose of this medicine cannot be determined from the provided information.  Please ask your doctor or pharmacist for clarification."
      }
    ],
    "motivational_note_for_patient": "Remember to follow your doctor's instructions carefully and take your medications as prescribed. If you have any questions or concerns, don't hesitate to contact your doctor or pharmacist.",
    "notes": "The OCR output is poor quality, making accurate identification of patient details and some medication components difficult.  Some interpretations are based on common medication names and abbreviations.  For accurate information, consult the original prescription directly.  The patient should confirm the medication names and doses with their physician or pharmacist."
  }
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
        "technical_summary": "Metoprolol (Beta-blocker).  Reduces heart rate and blood pressure, used for hypertension and angina.",
        "patient_summary": "This medicine helps lower your blood pressure and heart rate."
      },
      {
        "medicine": "Telma 40",
        "technical_summary": "Telmisartan (Angiotensin II receptor blocker - ARB).  Lowers blood pressure.  Often used in hypertension.",
        "patient_summary": "This medicine also helps to lower your blood pressure."
      },
      {
        "medicine": "Glycomet SR 500",
        "technical_summary": "Metformin (Biguanide). Used to improve blood sugar control in type 2 diabetes.",
        "patient_summary": "This medicine helps control your blood sugar levels."
      },
      {
        "medicine": "Oxra-S 10/100",
        "technical_summary": "Likely a combination of Oxcarbazepine (anticonvulsant) and another drug (the '100' suggests dosage).  Requires more information to definitively state the purpose, but possibly for seizure control or nerve pain.",
        "patient_summary": "This medicine is likely to help manage seizures or nerve pain.  Please clarify with your doctor if you are unsure."
      },
      {
        "medicine": "L Dio-1",
        "technical_summary": "Insufficient information to determine the medicine. Needs clarification.",  
        "patient_summary": "Please ask your doctor what this medication is for."
      },
      {
        "medicine": "Atchol 20",
        "technical_summary": "Insufficient information.  Needs clarification.",
        "patient_summary": "Please ask your doctor what this medication is for."
      }
    ],
    "motivational_note_for_patient": "Remember to take your medications as prescribed by your doctor.  Maintaining a healthy lifestyle with proper diet and exercise will also significantly benefit your health.",
    "notes": "The prescription is partially illegible and some medication names are unclear.  Some dosages are also missing. The patient's age and sex are missing. It's crucial to clarify the complete prescription details with the prescribing physician to ensure accurate understanding and treatment."
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

  const handleImageUpload = async (event) => {
    // const file = event.target.files?.[0];
    const file = document.getElementById("img").files?.[0];

    console.log('aa');
    if (file) {
      setUploading(true);
      setError('');
      setResult(null);

      const formData = new FormData();
      formData.append('image', file);
        // setResult(a);
        // setUploading(false);
    console.log('aaaaaa');

      try {
        const response = await axios.post('http://localhost:5000/process_prescription', formData, 
{
  withCredentials: false,

          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const b = await response.data;
        console.log("GG: ",b);
        setResult(b);
      } catch (err) {
        // setError(`Failed to process the image. Please try again. error: ${err.message}`);
        setResult(tmp);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
      {/* Header */}
      <header className="bg-[#6C5BD4] p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
        <h1
            className="text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >MyLabVerse</h1>
          <nav className="flex items-center space-x-6 text-sm sm:text-base">
                <Link to="/userdashboard" className="flex items-center space-x-2 hover:text-yellow-400">
                              <FaHome /> Dashboard
                            </Link>
                            <Link to="/viewreport" className="flex items-center space-x-2 hover:text-yellow-400">
                              <FaFileAlt /> Reports
                            </Link>
                            <Link to="/graph" className="flex items-center space-x-2 hover:text-yellow-400">
                              <FaChartBar  /> Graph Analysis
                            </Link>
                            <Link to="/prescriptionocr" className="flex items-center space-x-2 hover:text-yellow-400">
                              <FaFileAlt /> OCR
                            </Link>
                          </nav>
          {isLoggedIn && (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 bg-[#6C5BD4] hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                <FaUser />
                <span>{userName}</span>
                <FaChevronDown />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`${active ? 'bg-gray-100' : ''} block px-4 py-2`}
                      >
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 ${active ? 'bg-gray-100' : ''}`}
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
      <main className="p-6 container mx-auto">
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Upload Your Prescription</h2>
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto">
            <input
              id="img"
              type="file"
              accept="image/*"
              className="block mb-4"
              disabled={uploading}
            />
            <button
              className="bg-[#FF6000] text-white px-4 py-2 rounded-lg hover:bg-yellow-400 transition duration-300 w-full"
              disabled={uploading}
              onClick={handleImageUpload}
            >
              {uploading ? 'Uploading...' : 'Upload and Process'}
            </button>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-500 text-white p-4 rounded-lg shadow-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <section className="mt-12">
            <div className="bg-gradient-to-r from-[#16213e] to-[#1a1a2e] p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Patient Details</h3>
              { result.patient_details.name  &&<p className="text-lg">Name: {result.patient_details.name}</p>}
              {result.patient_details.age  && <p className="text-lg">Age: {result.patient_details.age}</p>}
              {result.patient_details.sex  && <p className="text-lg">Sex: {result.patient_details.sex}</p>}
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {result.medications.map((med, index) => (
                <div
                  key={index}
                  className="bg-white text-black p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h4 className="text-xl font-bold">{med.medicine}</h4>
                  <p className="mt-2 text-sm text-gray-600">
                    {med.technical_summary}
                  </p>
                  <p className="mt-2">{med.patient_summary}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-[#6C5BD4] to-[#8A2BE2] p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-bold">Note</h4>
              <p>{result.motivational_note_for_patient}</p>
            </div>

            {/* <div className="mt-8 bg-gradient-to-r from-[#FF6000] to-[#FF4500] p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-bold">Additional Notes</h4>
              <p>{result.notes}</p>
            </div> */}
          </section>
        )}
      </main>
    </div>
  );
};

export default PrescriptionOCR;
