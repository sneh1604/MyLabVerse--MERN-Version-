import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaChevronDown, FaHome, FaChartBar, FaFileAlt, 
  FaHeartbeat, FaFlask, FaCalendarCheck, FaClipboardList,
  FaExclamationCircle, FaCheckCircle, FaCamera, FaCopy,
  FaPrescription, FaArrowRight
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import userImage from './../assets/user.png';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const UserDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  
  // Example data for dashboard metrics
  const [metrics, setMetrics] = useState({
    totalReports: 8,
    pendingReports: 2,
    completedReports: 6,
    latestTestDate: '15 Nov 2023',
    healthScore: 85,
    nextAppointment: '22 Dec 2023'
  });

  // OCR related state
  const [ocrData, setOcrData] = useState({
    recentScans: 3,
    lastScanDate: '18 Nov 2023',
    savedPrescriptions: 5
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleQuickScan = () => {
    if (selectedFile) {
      // In a real application, you would upload the file to your OCR service here
      // For now, we'll just navigate to the OCR page
      navigate('/prescriptionocr', { state: { file: selectedFile } });
    } else {
      alert('Please select a prescription image to scan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: 'Satoshi' }}>
      {/* Top Navigation Bar */}
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
        {/* Welcome Banner with User Info */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-xl shadow-xl overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-stretch">
            <div className="p-6 md:p-8 flex-grow">
              <h1 className="text-3xl font-bold mb-4">Welcome back, {userName}!</h1>
              <p className="mb-4 opacity-90 max-w-2xl">
                Your health dashboard provides a comprehensive overview of your lab activities and test results.
                Stay informed about your health metrics and manage your medical reports with ease.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <button
                  onClick={() => navigate("/viewreport")}
                  className="bg-white text-indigo-700 px-4 py-2 rounded-md hover:bg-opacity-90 transition duration-200 font-medium"
                >
                  View Reports
                </button>
                <button
                  onClick={() => navigate("/graph")}
                  className="bg-transparent border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:bg-opacity-10 transition duration-200 font-medium"
                >
                  Health Analytics
                </button>
              </div>
            </div>
            <div className="bg-indigo-800 p-6 md:p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={userImage}
                    alt="User"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-inner"
                  />
                  <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                </div>
                <div className="mt-2">
                  <Link to="/profile" className="text-sm bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-full inline-block mt-2">
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-800">{metrics.totalReports}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaClipboardList className="text-blue-500 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{metrics.pendingReports}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <FaExclamationCircle className="text-amber-500 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-800">{metrics.completedReports}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="text-green-500 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Score</p>
                <p className="text-2xl font-bold text-gray-800">{metrics.healthScore}/100</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaHeartbeat className="text-purple-500 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Recent Reports</h2>
                <Link to="/viewreport" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-6 whitespace-nowrap text-sm font-medium text-gray-900">15 Nov 2023</td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">Hemogram</td>
                      <td className="py-3 px-6 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900">View</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-6 whitespace-nowrap text-sm font-medium text-gray-900">10 Nov 2023</td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">Lipid Profile</td>
                      <td className="py-3 px-6 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900">View</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-6 whitespace-nowrap text-sm font-medium text-gray-900">05 Nov 2023</td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">Blood Sugar</td>
                      <td className="py-3 px-6 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      </td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900">View</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* OCR Feature Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Prescription OCR</h2>
                    <p className="text-blue-100 text-sm">
                      Easily digitize your medical prescriptions with our OCR technology
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-full">
                    <FaCamera className="text-white text-xl" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">Extract Medical Information</h3>
                    <p className="text-gray-600 mb-4">
                      Our advanced OCR technology can extract medication names, dosages, and instructions from your prescriptions automatically.
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Save Digital Copies
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Track Medications
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Share Securely
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-l border-gray-200 pl-4 hidden md:block"></div>
                  
                  <div className="md:w-1/3 flex flex-col justify-center">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center p-4 bg-indigo-100 rounded-full mb-2">
                        <FaPrescription className="text-indigo-600 text-2xl" />
                      </div>
                      <h4 className="font-medium">No More Paper Hassle</h4>
                    </div>
                    <button 
                      onClick={() => navigate('/prescriptionocr')} 
                      className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Try OCR Now <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panels */}
          <div>
            {/* Next Appointment */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Next Appointment</h2>
              <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold">{metrics.nextAppointment}</p>
                  </div>
                  <div>
                    <FaCalendarCheck className="text-indigo-600 text-2xl" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Test Type</p>
                  <p className="font-semibold">Annual Health Checkup</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-indigo-700 flex-grow">
                  Reschedule
                </button>
                <button className="border border-indigo-600 text-indigo-600 text-sm font-medium px-4 py-2 rounded-md hover:bg-indigo-50">
                  Cancel
                </button>
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Health Tips</h2>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <div className="bg-green-100 p-2 rounded-full h-min">
                    <FaFlask className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Stay Hydrated</h3>
                    <p className="text-sm text-gray-600">Drink at least 8 glasses of water daily for optimal health.</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full h-min">
                    <FaHeartbeat className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Regular Exercise</h3>
                    <p className="text-sm text-gray-600">Aim for at least 30 minutes of moderate exercise daily.</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full h-min">
                    <FaClipboardList className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Schedule Regular Checkups</h3>
                    <p className="text-sm text-gray-600">Don't skip your annual health examination.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
