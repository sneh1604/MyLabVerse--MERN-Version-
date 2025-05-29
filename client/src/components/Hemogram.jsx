import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBars, FaUserCircle, FaFileAlt, FaFlask, FaTachometerAlt, FaUsers, FaInfoCircle, FaCheck } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config/api-config';

function HemogramReport() {
    const [clients, setClients] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        clientName: '',
        clientId: '',  // New field for client ID
        hemoglobin: '',
        rbc_count: '',
        wbc_count: '',
        platelet_count: '',
        polymorphs: '',
        lymphocytes: '',
        eosinophils: '',
        monocytes: '',
        basophils: '',
        pcv: '',
        mcv: '',
        mch: '',
        mchc: '',
        rdw: '',
        rbcs: '',
        wbcs: '',
        platelet_option: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [tooltipVisible, setTooltipVisible] = useState(null);
    const [showError, setShowError] = useState(false);  // Add this line

    const normalRanges = {
        hemoglobin: "13.5-17.5 g/dL",
        rbc_count: "4.7-6.1 million/µL",
        wbc_count: "4,500-11,000/µL",
        platelet_count: "150,000-450,000/µL",
        polymorphs: "40-75%",
        lymphocytes: "20-45%",
        eosinophils: "1-6%",
        monocytes: "2-10%",
        basophils: "0-1%",
        pcv: "41-50%",
        mcv: "80-96 fL",
        mch: "27.5-33.2 pg",
        mchc: "33.4-35.5 g/dL",
        rdw: "11.6-14.6%"
    };

    // Fetch the list of registered users (excluding admins)
    useEffect(() => {
        // Fetch client list
        axios.get(`${API_BASE_URL}/clients`, { withCredentials: true })
            .then(response => setClients(response.data))
            .catch(error => console.error('Error fetching clients:', error));
    }, []);

    // Handle changes in the form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'clientName') {
            const selectedClient = clients.find(client => client.name === value);
            if (selectedClient) {
                setFormData(prevState => ({
                    ...prevState,
                    clientName: selectedClient.name,
                    clientId: selectedClient._id  // Set client ID based on selected client
                }));
            }
        } else {
            // Validation for numeric inputs
            const numericFields = [
                'hemoglobin', 'rbc_count', 'wbc_count', 'platelet_count', 'polymorphs', 
                'lymphocytes', 'eosinophils', 'monocytes', 'basophils', 'pcv', 
                'mcv', 'mch', 'mchc', 'rdw'
            ];
    
            if (numericFields.includes(name)) {
                const numericValue = parseFloat(value);
                // Prevent setting values that are less than or equal to 0
                if (numericValue <= 0 || isNaN(numericValue)) {
                    return;
                }
            }
    
            // Update form data
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (key !== 'clientName' && !formData[key]) {
                newErrors[key] = 'This field is required';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (!isValid) {
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }
        setModalOpen(true);
    };

    const confirmSubmit = async () => {
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/hemogram-report`, formData, { withCredentials: true });
            setModalOpen(false);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setFormData({
                    clientName: '',
                    clientId: '',
                    hemoglobin: '',
                    rbc_count: '',
                    wbc_count: '',
                    platelet_count: '',
                    polymorphs: '',
                    lymphocytes: '',
                    eosinophils: '',
                    monocytes: '',
                    basophils: '',
                    pcv: '',
                    mcv: '',
                    mch: '',
                    mchc: '',
                    rdw: '',
                    rbcs: '',
                    wbcs: '',
                    platelet_option: ''
                });
            }, 3000);
        } catch (error) {
            console.error('Error submitting report:', error);
        } finally {
            setLoading(false);
        }
    };

    const f = document.getElementsByTagName('input');
    for (let i = 0; i < f.length; i++) {
      f[i].addEventListener("wheel", (event) => {
        // console.log("AAA");
        event.preventDefault(); // Disable scroll increment/decrement
      });
    }

    const formSections = [
        {
            title: "Patient Information",
            fields: [
                { name: "clientName", label: "Patient Name", type: "select", options: clients },
            ]
        },
        {
            title: "Primary Blood Counts",
            fields: [
                { name: "hemoglobin", label: "Hemoglobin", type: "number", unit: "g/dL", range: "13.5-17.5" },
                { name: "rbc_count", label: "RBC Count", type: "number", unit: "million/µL", range: "4.7-6.1" },
                { name: "wbc_count", label: "WBC Count", type: "number", unit: "/µL", range: "4,500-11,000" },
                { name: "platelet_count", label: "Platelet Count", type: "number", unit: "/µL", range: "150,000-450,000" }
            ]
        },
        {
            title: "Differential Count",
            fields: [
                { name: "polymorphs", label: "Polymorphs", type: "number", unit: "%", range: "40-75" },
                { name: "lymphocytes", label: "Lymphocytes", type: "number", unit: "%", range: "20-45" },
                { name: "eosinophils", label: "Eosinophils", type: "number", unit: "%", range: "1-6" },
                { name: "monocytes", label: "Monocytes", type: "number", unit: "%", range: "2-10" },
                { name: "basophils", label: "Basophils", type: "number", unit: "%", range: "0-1" }
            ]
        },
        {
            title: "Additional Parameters",
            fields: [
                { name: "pcv", label: "PCV", type: "number", unit: "%", range: "41-50" },
                { name: "mcv", label: "MCV", type: "number", unit: "fL", range: "80-96" },
                { name: "mch", label: "MCH", type: "number", unit: "pg", range: "27.5-33.2" },
                { name: "mchc", label: "MCHC", type: "number", unit: "g/dL", range: "33.4-35.5" },
                { name: "rdw", label: "RDW", type: "number", unit: "%", range: "11.6-14.6" }
            ]
        },
        {
            title: "Morphology",
            fields: [
                { name: "rbcs", label: "RBCs", type: "select", options: ["", "normal", "low", "high"] },
                { name: "wbcs", label: "WBCs", type: "select", options: ["", "normal", "low", "high"] },
                { name: "platelet_option", label: "Platelets", type: "select", options: ["", "normal", "low", "high"] }
            ]
        }
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar */}
            <aside
                className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } transition duration-200 ease-in-out lg:relative lg:translate-x-0`}
            >
                <div className="flex items-center justify-between px-4">
                    <h1 className="text-2xl font-bold">MyLabVerse</h1>
                    <FaBars
                        className="lg:hidden cursor-pointer text-2xl"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    />
                </div>
                <nav>
                    <ul>
                        <li className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/dashboard")}>
                            <FaTachometerAlt className="mr-3" /> Dashboard
                        </li>
                        <li className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/registered-users")}>
                            <FaUsers className="mr-3" /> Registered Users
                        </li>
                        <li className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/test-list")}>
                            <FaFileAlt className="mr-3" /> TestLists
                        </li>
                        <li
                            className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer"
                            onClick={() => navigate("/make-report")}
                        >
                            <FaFlask className="mr-3" /> Make Report
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between p-4 bg-blue-600 text-white">
                    <FaBars
                        className="lg:hidden cursor-pointer text-2xl"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    />
                    <h2 className="text-lg font-semibold">Make Report</h2>
                    <div className="relative">
                        <div
                            className="flex items-center space-x-4 cursor-pointer"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <FaUserCircle className="text-2xl" />
                            <span>Admin</span>
                        </div>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                                <div
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => navigate("/profile")}
                                >
                                    Profile
                                </div>
                                <div
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => navigate("/login")}
                                >
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                </header>
                <main className="flex-grow p-6 bg-transparent">
                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center"
                            >
                                <FaCheck className="mr-2" />
                                Report submitted successfully!
                            </motion.div>
                        )}
                        {showError && (
                            <motion.div
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center z-50"
                            >
                                <FaInfoCircle className="mr-2" />
                                Please fill all required fields correctly
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-semibold text-center mb-6">Haemogram Report</h2>
                        
                        {/* Progress Steps */}
                        <div className="flex justify-between mb-8">
                            {[1, 2, 3].map((step) => (
                                <div key={step} 
                                     className="flex flex-col items-center relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        currentStep >= step ? 'bg-purple-600 text-white' : 'bg-gray-200'
                                    }`}>
                                        {step}
                                    </div>
                                    <span className="text-sm mt-2">
                                        {step === 1 ? 'Patient Info' : step === 2 ? 'Blood Counts' : 'Additional Tests'}
                                    </span>
                                    {step < 3 && (
                                        <div className={`absolute top-5 left-full w-full h-0.5 -z-10 ${
                                            currentStep > step ? 'bg-purple-600' : 'bg-gray-200'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {formSections.slice((currentStep - 1) * 2, currentStep * 2).map((section, idx) => (
                                <motion.div
                                    key={section.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="bg-white p-6 rounded-lg shadow-lg"
                                >
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                        {section.title}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {section.fields.map((field) => (
                                            <div key={field.name} className="relative group">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {field.label}
                                                    {field.range && (
                                                        <span className="ml-2 text-xs text-gray-500">
                                                            ({field.range} {field.unit})
                                                        </span>
                                                    )}
                                                </label>
                                                {field.type === 'select' ? (
                                                    <select
                                                        name={field.name}
                                                        value={formData[field.name]}
                                                        onChange={handleChange}
                                                        className={`w-full p-2 border rounded-lg ${
                                                            errors[field.name] ? 'border-red-500' : 'border-gray-300'
                                                        } focus:ring-2 focus:ring-purple-400 focus:border-transparent`}
                                                    >
                                                        {field.name === 'clientName' ? (
                                                            <>
                                                                <option value="">Select Patient</option>
                                                                {clients.map(client => (
                                                                    <option key={client._id} value={client.name}>
                                                                        {client.name}
                                                                    </option>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            field.options.map(option => (
                                                                <option key={option} value={option}>
                                                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                                                </option>
                                                            ))
                                                        )}
                                                    </select>
                                                ) : (
                                                    <div className="relative">
                                                        <input
                                                            type={field.type}
                                                            name={field.name}
                                                            value={formData[field.name]}
                                                            onChange={handleChange}
                                                            className={`w-full p-2 border rounded-lg ${
                                                                errors[field.name] ? 'border-red-500' : 'border-gray-300'
                                                            } focus:ring-2 focus:ring-purple-400 focus:border-transparent`}
                                                        />
                                                        {field.unit && (
                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                                                {field.unit}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                {errors[field.name] && (
                                                    <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}

                            <div className="flex justify-between mt-6">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(current => current - 1)}
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Previous
                                    </button>
                                )}
                                {currentStep < 3 ? (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(current => current + 1)}
                                        className="ml-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="ml-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Report'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Confirmation Modal */}
                    {modalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
                            >
                                <h3 className="text-lg font-semibold mb-4">Confirm Submission</h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to submit this report?
                                </p>
                                <div className="flex justify-end gap-4">
                                    <button
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                        onClick={() => setModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                        onClick={confirmSubmit}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default HemogramReport;