import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaFileMedical, FaBell, FaHeartbeat } from 'react-icons/fa'; // Added icons for feature cards
import { FiMenu } from 'react-icons/fi';
import logo from './../assets/logo.png'; // Assuming the path to the image is here
import hero from './../assets/image.png';

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
              <li><Link to="/reports" className="hover:underline hover:text-[#FF6000]">Reports</Link></li>
              <li><Link to="/features" className="hover:underline hover:text-[#FF6000]">Features</Link></li>
              <li><Link to="/about" className="hover:underline hover:text-[#FF6000]">About</Link></li>
            </ul>
          </nav>
          
          {/* Log In Button */}
          <div className="hidden md:flex items-center">
            <button
              className="px-4 py-2 flex items-center space-x-2 bg-[#FF6000] text-white rounded-md hover:bg-[#e15500]"
              onClick={() => navigate('/login')}
            >
              <FaUser className="text-lg" />
              <span>Log In</span>
            </button>
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              <FiMenu className="text-2xl" />
            </button>
          </div>
        </div>
        
        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#6C5BD4] p-4">
            <ul className="flex flex-col space-y-4">
              <li><Link to="/" className="hover:underline hover:text-[#FF6000]">Home</Link></li>
              <li><Link to="/reports" className="hover:underline hover:text-[#FF6000]">Reports</Link></li>
              <li><Link to="/features" className="hover:underline hover:text-[#FF6000]">Features</Link></li>
              <li><Link to="/about" className="hover:underline hover:text-[#FF6000]">About</Link></li>
              <li>
                <button
                  className="w-full px-4 py-2 flex items-center space-x-2 bg-[#FF6000] text-white rounded-md hover:bg-[#e15500]"
                  onClick={() => navigate('/login')}
                >
                  <FaUser className="text-lg" />
                  <span>Log In</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Popup for Login and Register */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center text-black">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Satoshi' }}>Welcome to MyLabVerse</h2>
            <p className="mb-6" style={{ fontFamily: 'Satoshi' }}>Please login or register to continue.</p>
            <div className="space-x-4">
              <button
                className="px-6 py-2 bg-[#FF6000] text-white rounded"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className="px-6 py-2 bg-gray-600 text-white rounded"
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </div>
            <button
              className="mt-4 text-gray-600 hover:underline"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-8">
        <section className="text-center mb-12 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2">
            <h1 className="text-5xl font-extrabold mb-6" style={{ fontFamily: 'Satoshi' }}>Welcome to MyLabVerse</h1>
            <p className="text-lg mb-4" style={{ fontFamily: 'Satoshi' }}>
              MyLabVerse is your one-stop solution for managing laboratory tests, appointments, and user data efficiently.
            </p>
            <p className="text-lg" style={{ fontFamily: 'Satoshi' }}>
              Our mission is to provide a seamless experience for managing all your lab-related needs with cutting-edge features and tools.
            </p>
          </div>
          <div className="md:w-1/2">
            <img src={hero} alt="Doctor Illustration" className="w-full h-auto mt-8 md:mt-0" />
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold text-center mb-6" style={{ fontFamily: 'Satoshi' }}> Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#333] p-6 rounded-lg shadow-lg hover:bg-[#444] transition-all">
              <FaFileMedical className="text-4xl text-[#FF6000] mb-4" />
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Satoshi' }}>Medical Prescription OCR</h3>
              <p>Accurately extract data from medical prescriptions using our advanced OCR technology.</p>
            </div>
            <div className="bg-[#333] p-6 rounded-lg shadow-lg hover:bg-[#444] transition-all">
              <FaBell className="text-4xl text-[#FF6000] mb-4" />
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Satoshi' }}>Automated Notifications</h3>
              <p>Stay informed with automated email and message notifications for test results and appointments.</p>
            </div>
            <div className="bg-[#333] p-6 rounded-lg shadow-lg hover:bg-[#444] transition-all">
              <FaHeartbeat className="text-4xl text-[#FF6000] mb-4" />
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Satoshi' }}>Patient-Friendly Lab Reports</h3>
              <p>Understand your lab results with ease through our patient-friendly summaries.</p>
            </div>
          </div>
        </section>

        {/* Available Tests Section */}
        <section>
        <h2 className="text-4xl font-bold text-center mb-6" style={{ fontFamily: 'Satoshi' }}>Available Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hemogram Test Card */}
          <div className="bg-[#6C5BD4] text-white p-6 rounded-lg shadow-lg hover:bg-[#FF6000] transition duration-300">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Satoshi' }}>Hemogram Test</h3>
            <p className="mb-4" style={{ fontFamily: 'Satoshi' }}>
              Comprehensive blood test to check your blood count, hemoglobin levels, and other key health indicators.
            </p>
            <button 
              className="px-4 py-2 bg-white text-[#1C80AA] rounded-md hover:bg-gray-200 transition duration-300"
              onClick={() => navigate('/hemogram')}
            >
              View Details
            </button>
          </div>

          {/* Lipid Test Card */}
          <div className="bg-[#6C5BD4] text-white p-6 rounded-lg shadow-lg hover:bg-[#FF6000] transition duration-300">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Satoshi' }}>Lipid Test</h3>
            <p className="mb-4" style={{ fontFamily: 'Satoshi' }}>
              Analyze your cholesterol and triglyceride levels to assess your risk of heart disease.
            </p>
            <button 
              className="px-4 py-2 bg-white text-[#1C80AA] rounded-md hover:bg-gray-200 transition duration-300"
              onClick={() => navigate('/lipid')}
            >
              View Details
            </button>
          </div>

          {/* Blood Sugar Test Card */}
          <div className="bg-[#6C5BD4] text-white p-6 rounded-lg shadow-lg hover:bg-[#FF6000] transition duration-300">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Satoshi' }}>Blood Sugar Test</h3>
            <p className="mb-4" style={{ fontFamily: 'Satoshi' }}>
              Monitor your glucose levels to help manage and prevent diabetes.
            </p>
            <button 
              className="px-4 py-2 bg-white text-[#1C80AA] rounded-md hover:bg-gray-200 transition duration-300"
              onClick={() => navigate('/blood-sugar')}
            >
              View Details
            </button>
          </div>

          {/* Additional Tests */}
          <div className="bg-[#6C5BD4] text-white p-6 rounded-lg shadow-lg hover:bg-[#FF6000] transition duration-300">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Satoshi' }}>Other Test</h3>
            <p className="mb-4" style={{ fontFamily: 'Satoshi' }}>
              Discover more tests available for your health monitoring and diagnosis.
            </p>
            <button 
              className="px-4 py-2 bg-white text-[#1C80AA] rounded-md hover:bg-gray-200 transition duration-300"
              onClick={() => navigate('/other-tests')}
            >
              View Details
            </button>
          </div>
        </div>
      </section>

      </main>
    </div>
  );
};

export default Home;
