import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaUser, 
  FaFileMedical, 
  FaBell, 
  FaHeartbeat, 
  FaLaptopMedical, 
  FaFileAlt,
  FaMicroscope,
  FaChartLine,
  FaUserMd,
  FaUserShield,
  FaArrowRight,
  FaFlask
} from 'react-icons/fa'; 
import { FiMenu } from 'react-icons/fi';
import logo from './../assets/logo.png';
import hero from './../assets/image.png';
import AdminAccessButton from './AdminAccessButton';

const Home = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/userdashboard');
      }
    }
  }, [navigate]);

  const closePopup = () => setShowPopup(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="min-h-screen bg-[#242424] text-white">
      {/* Header */}
      <header className="bg-[#6C5BD4] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="MyLabVerse Logo" className="h-8 mr-2" />
            <div className="text-3xl font-bold" style={{ fontFamily: 'Satoshi' }}>MyLabVerse</div>
          </div>
          
          {/* Centered Navigation */}
          <nav className={`flex-1 justify-center items-center hidden md:flex`}>
            <ul className="flex space-x-6 text-lg">
              <li><Link to="/" className="hover:underline hover:text-[#FF6000]">Home</Link></li>
              <li><Link to="/login" className="hover:underline hover:text-[#FF6000]">Reports</Link></li>
              <li><Link to="/features" className="hover:underline hover:text-[#FF6000]">Features</Link></li>
              <li><Link to="/about" className="hover:underline hover:text-[#FF6000]">About</Link></li>
            </ul>
          </nav>
          
          {/* Access Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              className="px-4 py-2 flex items-center space-x-2 bg-[#FF6000] text-white rounded-md hover:bg-[#e15500] transition-colors"
              onClick={() => navigate('/login')}
            >
              <FaUser className="text-sm" />
              <span>User Login</span>
            </button>
            <button
              className="px-4 py-2 flex items-center space-x-2 bg-indigo-800 text-white rounded-md hover:bg-indigo-900 transition-colors border border-indigo-700"
              onClick={() => navigate('/administrator-login')}
            >
              <FaUserShield className="text-sm" />
              <span>Admin</span>
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              <FiMenu className="text-2xl" />
            </button>
          </div>
        </div>
        
        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#6C5BD4] p-4 absolute z-50 w-full left-0 mt-2 shadow-lg">
            <ul className="flex flex-col space-y-4">
              <li><Link to="/" className="hover:underline hover:text-[#FF6000]">Home</Link></li>
              <li><Link to="/login" className="hover:underline hover:text-[#FF6000]">Reports</Link></li>
              <li><Link to="/features" className="hover:underline hover:text-[#FF6000]">Features</Link></li>
              <li><Link to="/about" className="hover:underline hover:text-[#FF6000]">About</Link></li>
              <li>
                <button
                  className="w-full px-4 py-2 flex items-center space-x-2 bg-[#FF6000] text-white rounded-md hover:bg-[#e15500] transition-colors mb-2"
                  onClick={() => navigate('/login')}
                >
                  <FaUser className="text-lg" />
                  <span>User Login</span>
                </button>
              </li>
              <li>
                <button
                  className="w-full px-4 py-2 flex items-center space-x-2 bg-indigo-800 text-white rounded-md hover:bg-indigo-900 transition-colors"
                  onClick={() => navigate('/administrator-login')}
                >
                  <FaUserShield className="text-lg" />
                  <span>Administrator Access</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Welcome Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center border border-indigo-500 max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: 'Satoshi' }}>
              Welcome to MyLabVerse
            </h2>
            <p className="mb-6 text-gray-300" style={{ fontFamily: 'Satoshi' }}>
              Your comprehensive laboratory management system. Please select your access type:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className="px-6 py-3 bg-[#FF6000] text-white rounded-md hover:bg-[#e15500] transition-colors flex items-center justify-center"
                onClick={() => navigate('/login')}
              >
                <FaUser className="mr-2" /> User Login
              </button>
              <button
                className="px-6 py-3 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition-colors flex items-center justify-center"
                onClick={() => navigate('/register')}
              >
                <FaUser className="mr-2" /> Register
              </button>
              <button
                className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center col-span-1 md:col-span-2"
                onClick={() => navigate('/administrator-login')}
              >
                <FaUserShield className="mr-2" /> Administrator Access
              </button>
            </div>
            <button
              className="mt-6 text-gray-400 hover:text-white hover:underline transition-colors"
              onClick={closePopup}
            >
              Explore the site first
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-8">
        {/* Hero Section */}
        <section className="text-center mb-12 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2">
            <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-[#FF6000]" style={{ fontFamily: 'Satoshi' }}>
              Welcome to MyLabVerse
            </h1>
            <p className="text-lg mb-4 text-gray-300" style={{ fontFamily: 'Satoshi' }}>
              MyLabVerse is your one-stop solution for managing laboratory tests, appointments, and user data efficiently.
            </p>
            <p className="text-lg mb-6 text-gray-300" style={{ fontFamily: 'Satoshi' }}>
              Our mission is to provide a seamless experience for managing all your lab-related needs with cutting-edge features and tools.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button 
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-[#FF6000] text-white rounded-md hover:bg-[#e15500] transition-colors flex items-center"
              >
                Get Started <FaArrowRight className="ml-2" />
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="px-6 py-3 border border-gray-500 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-[#FF6000] rounded-lg blur opacity-50"></div>
              <div className="relative bg-gray-900 rounded-lg p-2">
                <img src={hero} alt="Doctor Illustration" className="w-full h-auto max-w-md mx-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Creative Cards */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-[#FF6000]" style={{ fontFamily: 'Satoshi' }}>
            Our Advanced Features
          </h2>
          
          {/* Top Features Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* OCR Feature Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-xl shadow-xl overflow-hidden transform transition-transform hover:-translate-y-2">
              <div className="p-6">
                <div className="bg-white bg-opacity-20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <FaFileMedical className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Satoshi' }}>
                  Medical Prescription OCR
                </h3>
                <p className="text-gray-300 mb-6">
                  Transform paper prescriptions into digital format instantly using advanced OCR technology. Extract medication names, dosages, and instructions automatically.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center text-white bg-indigo-600 bg-opacity-50 hover:bg-opacity-70 px-4 py-2 rounded-md transition-colors"
                >
                  Try OCR <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
            
            {/* Notifications Feature Card */}
            <div className="bg-gradient-to-br from-[#FF6000] to-amber-700 rounded-xl shadow-xl overflow-hidden transform transition-transform hover:-translate-y-2">
              <div className="p-6">
                <div className="bg-white bg-opacity-20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <FaBell className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Satoshi' }}>
                  Automated Notifications
                </h3>
                <p className="text-gray-100 mb-6">
                  Stay informed with automated notifications for test results, appointments, and important health alerts. Never miss critical information.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center text-white bg-amber-800 bg-opacity-50 hover:bg-opacity-70 px-4 py-2 rounded-md transition-colors"
                >
                  Learn More <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
            
            {/* Reports Feature Card */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl shadow-xl overflow-hidden transform transition-transform hover:-translate-y-2">
              <div className="p-6">
                <div className="bg-white bg-opacity-20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <FaHeartbeat className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Satoshi' }}>
                  Patient-Friendly Reports
                </h3>
                <p className="text-gray-300 mb-6">
                  Understand your lab results easily with patient-friendly summaries and visual indicators. Track your health metrics over time.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center text-white bg-purple-800 bg-opacity-50 hover:bg-opacity-70 px-4 py-2 rounded-md transition-colors"
                >
                  View Demo <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Features Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Analytics Feature */}
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden p-6 flex flex-col md:flex-row items-center transform transition-transform hover:-translate-y-1">
              <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
                <div className="bg-indigo-700 bg-opacity-30 p-5 rounded-full">
                  <FaChartLine className="text-4xl text-indigo-400" />
                </div>
              </div>
              <div className="md:w-3/4 md:pl-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Satoshi' }}>
                  Health Analytics Dashboard
                </h3>
                <p className="text-gray-400 mb-4">
                  Track your health trends with our comprehensive analytics dashboard. Visualize your progress and identify areas for improvement.
                </p>
                <button
                  onClick={() => navigate('/login')} 
                  className="text-indigo-400 hover:text-indigo-300 flex items-center transition-colors"
                >
                  Explore Analytics <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>

            {/* Admin Dashboard Feature */}
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden p-6 flex flex-col md:flex-row items-center transform transition-transform hover:-translate-y-1">
              <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
                <div className="bg-[#FF6000] bg-opacity-30 p-5 rounded-full">
                  <FaUserMd className="text-4xl text-[#FF6000]" />
                </div>
              </div>
              <div className="md:w-3/4 md:pl-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Satoshi' }}>
                  Administrative Controls
                </h3>
                <p className="text-gray-400 mb-4">
                  Powerful tools for lab administrators to manage patients, reports, and staff efficiently. Complete oversight of lab operations.
                </p>
                <button
                  onClick={() => navigate('/administrator-login')} 
                  className="text-[#FF6000] hover:text-amber-400 flex items-center transition-colors"
                >
                  Admin Access <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Available Tests Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-[#FF6000]" style={{ fontFamily: 'Satoshi' }}>
            Available Laboratory Tests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Hemogram Test Card */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <FaMicroscope className="text-3xl text-white" />
                  <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold">Popular</div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: 'Satoshi' }}>Hemogram Test</h3>
                <p className="text-white text-opacity-90 mb-auto">
                  Comprehensive blood test to check your blood count, hemoglobin levels, and other key health indicators.
                </p>
                <div className="mt-6 pt-4 border-t border-white border-opacity-30">
                  <button 
                    className="px-4 py-2 bg-white text-blue-700 rounded-md hover:bg-blue-50 transition-colors w-full"
                    onClick={() => navigate('/login')}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Lipid Test Card */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <FaFileAlt className="text-3xl text-white" />
                  <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold">Essential</div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: 'Satoshi' }}>Lipid Test</h3>
                <p className="text-white text-opacity-90 mb-auto">
                  Analyze your cholesterol and triglyceride levels to assess your risk of heart disease.
                </p>
                <div className="mt-6 pt-4 border-t border-white border-opacity-30">
                  <button 
                    className="px-4 py-2 bg-white text-red-700 rounded-md hover:bg-red-50 transition-colors w-full"
                    onClick={() => navigate('/login')}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Blood Sugar Test Card */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg backdrop-blur-lg transform transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-400 to-teal-300 opacity-90 group-hover:opacity-95 transition-opacity"></div>
              <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity"></div>
              <div className="relative p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-md">
                    <FaFlask className="text-4xl text-white transform group-hover:rotate-12 transition-transform" />
                  </div>
                  <div className="bg-white bg-opacity-25 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                    Most Popular
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-yellow-50 transition-colors" 
                    style={{ fontFamily: 'Satoshi', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  Blood Sugar Test
                </h3>
                <p className="text-white text-opacity-90 mb-auto text-lg leading-relaxed">
                  Monitor your glucose levels with our state-of-the-art testing facilities. 
                  Get accurate results and instant digital reports.
                </p>
                <div className="mt-8 pt-6 border-t border-white border-opacity-20">
                  <button 
                    className="px-6 py-3 bg-white bg-opacity-95 text-green-700 rounded-xl font-semibold 
                             hover:bg-opacity-100 hover:shadow-lg transition-all duration-300 w-full 
                             flex items-center justify-center space-x-2 group"
                    onClick={() => navigate('/login')}
                  >
                    <span>Schedule Test</span>
                    <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </div>

            {/* Additional Tests Card */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <FaLaptopMedical className="text-3xl text-white" />
                  <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold">More Tests</div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: 'Satoshi' }}>Other Tests</h3>
                <p className="text-white text-opacity-90 mb-auto">
                  Discover more specialized tests available for your health monitoring and diagnosis.
                </p>
                <div className="mt-6 pt-4 border-t border-white border-opacity-30">
                  <button 
                    className="px-4 py-2 bg-white text-purple-700 rounded-md hover:bg-purple-50 transition-colors w-full"
                    onClick={() => navigate('/login')}
                  >
                    View All Tests
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-indigo-900 to-[#6C5BD4] rounded-xl p-8 md:p-12 shadow-xl">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Satoshi' }}>
                Ready to Transform Your Laboratory Experience?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Join MyLabVerse today and experience the future of laboratory management and health monitoring.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => navigate('/register')}
                  className="px-8 py-3 bg-white text-indigo-700 rounded-md font-medium hover:bg-gray-100 transition-colors"
                >
                  Create an Account
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 border border-white text-white rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Admin Access Button */}
      <div className="fixed bottom-6 right-6">
        <AdminAccessButton />
      </div>
    </div>
  );
};

export default Home;
