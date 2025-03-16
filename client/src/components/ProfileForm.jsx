import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaChevronDown, FaHome, FaChartBar, FaFileAlt } from 'react-icons/fa';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const ProfileForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        contact: '',
        address: '',
        medicalHistory: ''
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [hasProfile, setHasProfile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setIsLoggedIn(true);
            setUserName(user.name);
            checkProfileAndFetch();
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const checkProfileAndFetch = async () => {
        try {
            // First check if profile exists
            const existsResponse = await axios.get('http://localhost:4000/profile/exists', { withCredentials: true });
            setHasProfile(existsResponse.data.exists);

            if (existsResponse.data.exists) {
                // If profile exists, fetch it
                const profileResponse = await axios.get('http://localhost:4000/profile', { withCredentials: true });
                if (profileResponse.data.profile) {
                    setFormData(profileResponse.data.profile);
                }
            }
        } catch (err) {
            setError('Failed to fetch profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserName('');
        navigate('/login');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.post('http://localhost:4000/profile', formData, { withCredentials: true });
            setSuccessMessage(response.data.message);
            setHasProfile(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Error saving profile');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-gray-800">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-[#6C5BD4] text-white shadow-lg">
                    <div className="container mx-auto flex justify-between items-center py-4 px-6">
                      {/* Logo and Brand */}
                      <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>MyLabVerse</h1>
                      </div>
            
                      {/* Navigation Links */}
                      <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/userdashboard" className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200">
                          <FaHome /> <span>Dashboard</span>
                        </Link>
                        <Link to="/viewreport" className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200">
                          <FaFileAlt /> <span>Reports</span>
                        </Link>
                        <Link to="/graph" className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200">
                          <FaChartBar /> <span>Analytics</span>
                        </Link>
                        <Link to="/prescriptionocr" className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200">
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
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                            {successMessage}
                        </div>
                    )}

                    <h2 className="text-3xl font-semibold text-center mb-8">
                        {hasProfile ? 'Update Your Profile' : 'Create Your Profile'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    max="150"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                required
                                pattern="[0-9]{10}"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Medical History (Optional)
                            </label>
                            <textarea
                                name="medicalHistory"
                                value={formData.medicalHistory}
                                onChange={handleChange}
                                rows="4"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#6C5BD4] text-white py-3 rounded-md hover:bg-[#5544b4] transition-colors duration-200"
                        >
                            {hasProfile ? 'Update Profile' : 'Create Profile'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ProfileForm;
