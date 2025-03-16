import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBars, FaUserCircle, FaFileAlt, FaFlask, FaTachometerAlt, FaUsers, FaInfoCircle, FaCheck } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function LipidReport() {
    const [clients, setClients] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [showError, setShowError] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        clientName: '',
        clientId: '',
        serumCholesterol: '',
        serumTriglyceride: '',
        hdlCholesterol: '',
        ldlCholesterol: '',
        ldlHdlRatio: '',
        totalCholesterolHdlRatio: '',
        totalLipids: '',
        vldlCholesterol: ''
    });

    const normalRanges = {
        serumCholesterol: "150-200 mg/dL",
        serumTriglyceride: "50-150 mg/dL",
        hdlCholesterol: "40-60 mg/dL",
        ldlCholesterol: "less than 100 mg/dL",
        ldlHdlRatio: "less than 3.5",
        totalCholesterolHdlRatio: "less than 4.5",
        totalLipids: "400-1000 mg/dL",
        vldlCholesterol: "2-30 mg/dL"
    };

    const formSections = [
        {
            title: "Patient Information",
            fields: [
                { name: "clientName", label: "Patient Name", type: "select", options: clients },
            ]
        },
        {
            title: "Primary Lipid Parameters",
            fields: [
                { name: "serumCholesterol", label: "Serum Cholesterol", type: "number", unit: "mg/dL", range: "150-200", required: true },
                { name: "serumTriglyceride", label: "Serum Triglyceride", type: "number", unit: "mg/dL", range: "50-150", required: true },
                { name: "hdlCholesterol", label: "HDL Cholesterol", type: "number", unit: "mg/dL", range: "40-60", required: true },
                { name: "ldlCholesterol", label: "LDL Cholesterol", type: "number", unit: "mg/dL", range: "<100", required: true }
            ]
        },
        {
            title: "Derived Parameters",
            fields: [
                { name: "ldlHdlRatio", label: "LDL/HDL Ratio", type: "number", range: "<3.5", required: true },
                { name: "totalCholesterolHdlRatio", label: "Total Cholesterol/HDL Ratio", type: "number", range: "<4.5", required: true },
                { name: "totalLipids", label: "Total Lipids", type: "number", unit: "mg/dL", range: "400-1000", required: true },
                { name: "vldlCholesterol", label: "VLDL Cholesterol", type: "number", unit: "mg/dL", range: "2-30", required: true }
            ]
        }
    ];

    // Fetch the list of registered users (excluding admins)
    useEffect(() => {
        axios.get('http://localhost:4000/registered-users', { withCredentials: true })
            .then(response => {
                const nonAdminClients = response.data.filter(user => user.role !== 'admin');
                setClients(nonAdminClients);
            })
            .catch(error => console.error('Error fetching clients:', error));
    }, []);

    // Validate input values to ensure they are non-negative
    const validateNonNegative = (value) => {
        return value > 0;
    };

    // Handle changes in the form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'clientName') {
            const selectedClient = clients.find(client => client.name === value);
            if (selectedClient) {
                setFormData(prevState => ({
                    ...prevState,
                    clientName: selectedClient.name,
                    clientId: selectedClient._id
                }));
            }
        } else {
            // Validate non-negative values for number fields
            const newValue = name in formData ? parseFloat(value) : value;
            if (['serumCholesterol', 'serumTriglyceride', 'hdlCholesterol', 'ldlCholesterol', 'ldlHdlRatio', 'totalCholesterolHdlRatio', 'totalLipids', 'vldlCholesterol'].includes(name)) {
                if (validateNonNegative(newValue)) {
                    setFormData(prevState => ({ ...prevState, [name]: newValue }));
                }
            } else {
                setFormData(prevState => ({ ...prevState, [name]: value }));
            }
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (!isValid) {
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }
        setModalOpen(true);
    };

    // Add validateForm function
    const validateForm = () => {
        const newErrors = {};
        if (!formData.clientId) {
            newErrors.clientName = 'Please select a patient';
        }

        const requiredFields = [
            'serumCholesterol', 'serumTriglyceride', 'hdlCholesterol',
            'ldlCholesterol', 'ldlHdlRatio', 'totalCholesterolHdlRatio',
            'totalLipids', 'vldlCholesterol'
        ];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = 'This field is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const confirmSubmit = () => {
        setLoading(true);
        axios.post('http://localhost:4000/lipid-report', formData, { withCredentials: true })
            .then(response => {
                setFormData({
                    clientName: '',
                    clientId: '',
                    serumCholesterol: '',
                    serumTriglyceride: '',
                    hdlCholesterol: '',
                    ldlCholesterol: '',
                    ldlHdlRatio: '',
                    totalCholesterolHdlRatio: '',
                    totalLipids: '',
                    vldlCholesterol: ''
                });
                setModalOpen(false);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            })
            .catch(error => console.error('Error submitting report:', error))
            .finally(() => setLoading(false));
    };

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
                <header className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
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
                                className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center z-50"
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
                        <h2 className="text-3xl font-semibold text-center mb-6">Lipid Profile Report</h2>
                        
                        {/* Progress Steps */}
                        <div className="flex justify-between mb-8">
                            {[1, 2].map((step) => (
                                <div key={step} className="flex flex-col items-center relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                    }`}>
                                        {step}
                                    </div>
                                    <span className="text-sm mt-2">
                                        {step === 1 ? 'Patient Info & Primary Parameters' : 'Derived Parameters'}
                                    </span>
                                    {step < 2 && (
                                        <div className={`absolute top-5 left-full w-full h-0.5 -z-10 ${
                                            currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {formSections.slice(currentStep === 1 ? 0 : 2, currentStep === 1 ? 2 : 3).map((section, idx) => (
                                <motion.div
                                    key={section.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="bg-white p-6 rounded-lg shadow-lg"
                                >
                                    <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {section.fields.map(field => (
                                            <div key={field.name}>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    {field.label}:
                                                </label>
                                                {field.type === 'select' ? (
                                                    <select
                                                        name={field.name}
                                                        value={formData[field.name]}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    >
                                                        <option value="">Select</option>
                                                        {field.options.map(option => (
                                                            <option key={option._id} value={option.name}>{option.name}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div className="relative">
                                                        <input
                                                            type={field.type}
                                                            name={field.name}
                                                            value={formData[field.name]}
                                                            onChange={handleChange}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        />
                                                        {field.unit && (
                                                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                                {field.unit}
                                                            </span>
                                                        )}
                                                        {field.range && (
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                Normal range: {field.range}
                                                            </div>
                                                        )}
                                                    </div>
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
                                        onClick={() => setCurrentStep(1)}
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Previous
                                    </button>
                                )}
                                {currentStep < 2 ? (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(2)}
                                        className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
                                <h3 className="text-lg font-semibold">Confirm Submission</h3>
                                <p className="mt-2">Are you sure you want to submit this report?</p>
                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        className="bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300"
                                        onClick={() => setModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
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

export default LipidReport;
