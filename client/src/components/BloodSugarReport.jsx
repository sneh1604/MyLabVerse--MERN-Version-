import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBars, FaUserCircle, FaFileAlt, FaFlask, FaTachometerAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function BloodSugarReport() {
    const [clients, setClients] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        clientName: '',
        clientId: '',
        fastingBloodSugar: '',
        postprandialBloodSugar: '',
        hba1c: '',
        totalCholesterol: '',
        triglycerides: ''
    });

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
            if (['fastingBloodSugar', 'postprandialBloodSugar', 'hba1c', 'totalCholesterol', 'triglycerides'].includes(name)) {
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
        setModalOpen(true);
    };

    const confirmSubmit = () => {
        axios.post('http://localhost:4000/blood-sugar-report', formData, { withCredentials: true })
            .then(response => {
                setFormData({
                    clientName: '',
                    clientId: '',
                    fastingBloodSugar: '',
                    postprandialBloodSugar: '',
                    hba1c: '',
                    totalCholesterol: '',
                    triglycerides: ''
                });
                setModalOpen(false);
            })
            .catch(error => console.error('Error submitting report:', error));
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
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
                <main className="flex-grow p-6 bg-gray-100">
                    <h2 className="text-3xl font-semibold text-center mb-6">Submit Blood Sugar Test Details</h2>
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-lg">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Client Name:
                                </label>
                                <select
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Select Client</option>
                                    {clients.map(client => (
                                        <option key={client._id} value={client.name}>
                                            {client.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Fasting Blood Sugar:
                                </label>
                                <input
                                    type="number"
                                    name="fastingBloodSugar"
                                    value={formData.fastingBloodSugar}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Postprandial Blood Sugar:
                                </label>
                                <input
                                    type="number"
                                    name="postprandialBloodSugar"
                                    value={formData.postprandialBloodSugar}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    HbA1c:
                                </label>
                                <input
                                    type="number"
                                    name="hba1c"
                                    value={formData.hba1c}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Total Cholesterol:
                                </label>
                                <input
                                    type="number"
                                    name="totalCholesterol"
                                    value={formData.totalCholesterol}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Triglycerides:
                                </label>
                                <input
                                    type="number"
                                    name="triglycerides"
                                    value={formData.triglycerides}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                        >
                            Submit Report
                        </button>
                    </form>
                    {modalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-md shadow-lg">
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
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default BloodSugarReport;
