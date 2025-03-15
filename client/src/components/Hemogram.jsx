import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBars, FaUserCircle, FaFileAlt, FaFlask, FaTachometerAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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

    // Fetch the list of registered users (excluding admins)
    useEffect(() => {
        // Fetch client list
        axios.get('http://localhost:4000/clients', { withCredentials: true })
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
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalOpen(true); // Show confirmation modal
    };

    const confirmSubmit = () => {
        axios.post('http://localhost:4000/hemogram-report', formData, { withCredentials: true })
            .then(() => {
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
                setModalOpen(false);
                setShowSuccess(true); // Show success message
                setTimeout(() => {
                    setShowSuccess(false);
                }, 3000); // Hide success message after 3 seconds
            })
            .catch(error => {
                console.error('Error submitting report:', error);
                setModalOpen(false);
            });
    };
    const f = document.getElementsByTagName('input');
    for (let i = 0; i < f.length; i++) {
      f[i].addEventListener("wheel", (event) => {
        // console.log("AAA");
        event.preventDefault(); // Disable scroll increment/decrement
      });
    }

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
                    {showSuccess && (
                        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg">
                            Report submitted successfully!
                        </div>
                    )}
                    <h2 className="text-3xl font-semibold text-center mb-6">Submit Haemogram Report Details</h2>
                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Patient Name:
                                </label>
                                <select
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Select</option>
                                    {clients.map(client => (
                                        <option key={client._id} value={client.name}>{client.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Hemoglobin:
                                </label>
                                <input
                                    type="number"
                                    name="hemoglobin"
                                    value={formData.hemoglobin}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    RBC Count:
                                </label>
                                <input
                                    type="number"
                                    name="rbc_count"
                                    value={formData.rbc_count}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    WBC Count:
                                </label>
                                <input
                                    type="number"
                                    name="wbc_count"
                                    value={formData.wbc_count}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Platelet Count:
                                </label>
                                <input
                                    type="number"
                                    name="platelet_count"
                                    value={formData.platelet_count}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Polymorphs:
                                </label>
                                <input
                                    type="number"
                                    name="polymorphs"
                                    value={formData.polymorphs}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Lymphocytes:
                                </label>
                                <input
                                    type="number"
                                    name="lymphocytes"
                                    value={formData.lymphocytes}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Eosinophils:
                                </label>
                                <input
                                    type="number"
                                    name="eosinophils"
                                    value={formData.eosinophils}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Monocytes:
                                </label>
                                <input
                                    type="number"
                                    name="monocytes"
                                    value={formData.monocytes}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Basophils:
                                </label>
                                <input
                                    type="number"
                                    name="basophils"
                                    value={formData.basophils}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    PCV:
                                </label>
                                <input
                                    type="number"
                                    name="pcv"
                                    value={formData.pcv}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    MCV:
                                </label>
                                <input
                                    type="number"
                                    name="mcv"
                                    value={formData.mcv}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    MCH:
                                </label>
                                <input
                                    type="number"
                                    name="mch"
                                    value={formData.mch}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    MCHC:
                                </label>
                                <input
                                    type="number"
                                    name="mchc"
                                    value={formData.mchc}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    RDW:
                                </label>
                                <input
                                    type="number"
                                    name="rdw"
                                    value={formData.rdw}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    RBCs:
                                </label>
                                <select
                                    name="rbcs"
                                    value={formData.rbcs}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Select Option</option>
                                    <option value="normal">Normal</option>
                                    <option value="low">Low</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    WBCs:
                                </label>
                                <select
                                    name="wbcs"
                                    value={formData.wbcs}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Select Option</option>
                                    <option value="normal">Normal</option>
                                    <option value="low">Low</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Platelet Option:
                                </label>
                                <select
                                    name="platelet_option"
                                    value={formData.platelet_option}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Select Option</option>
                                    <option value="normal">Normal</option>
                                    <option value="low">Low</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700"
                            >
                                Submit
                            </button>
                    </form>
                    {modalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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

export default HemogramReport;