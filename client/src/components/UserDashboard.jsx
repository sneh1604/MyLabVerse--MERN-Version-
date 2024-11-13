import React, { useState, useEffect } from 'react';
import { FaUser, FaChevronDown , FaHome, FaChartBar, FaFileAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import userImage from './../assets/user.png'; // Update this path to your user image
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';


const UserDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-[#000000]" style={{ fontFamily: 'Satoshi' }}>
      {/* Header */}
      <header className="bg-[#6C5BD4] text-white p-4 shadow-lg" >
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MyLabVerse</h1>
          <nav className="flex items-center space-x-6">
            <Link to="/userdashboard" className="hover:text-yellow-400 flex items-center space-x-2">
              <FaHome className="mr-2" /> Dashboard
            </Link>
            <Link to="/viewreport" className="hover:text-yellow-400 flex items-center space-x-2">
              <FaFileAlt className="mr-2" /> Reports
            </Link>
            <Link to="/graph" className="hover:text-yellow-400 flex items-center space-x-2">
              <FaChartBar className="mr-2" /> Graph Analysis
            </Link>
          </nav>
          <div className="relative">
            {isLoggedIn && (
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex items-center space-x-2 bg-[#6C5BD4] hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none">
                    <FaUser />
                    <span className="text-lg">{userName}</span>
                    <FaChevronDown />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-gray-700 hover:bg-gray-200`}
                        >
                          Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200`}
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
        </div>
      </header>


      {/* Main content */}
      <main className="p-8">
        {/* User Dashboard Details */}
        <section className="mb-8 flex flex-col md:flex-row items-center">
          <div className="flex-none w-full md:w-2/3">
            <h1 className="text-3xl font-bold text-center mb-6 text-[#FFFFFF]" style={{ fontFamily: 'Satoshi' }}>User Dashboard</h1>
            <p className="text-[#FFFFFF] leading-loose bg-[#6C5BD4] p-6 rounded-lg shadow-lg text-center">
              Welcome to your dashboard, {userName}! Here, you can manage your lab reports, view test results, and analyze your health data. Use the navigation links above to explore different sections of your dashboard.
              <br /><br />
              Your dashboard provides a comprehensive overview of all your lab activities. Stay informed with our easy-to-use interface, and make the most out of your MyLabVerse experience.
            </p>
          </div>

          <div className="flex-none w-full md:w-1/3">
            {/* Image Placeholder */}
            <div className="flex justify-center md:justify-end">
              <img 
                src={userImage} 
                alt="User Illustration" 
                className="w-2/3 h-auto mt-8 md:mt-0 rounded-full   shadow-lg" 
              />
            </div>
          </div>
        </section>

        {/* Dashboard Features Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center text-[#FFFFFF]" style={{ fontFamily: 'Satoshi' }}>Dashboard Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FFFFFF] p-6 rounded-lg shadow-lg hover:bg-[#FF6000] hover:text-[#FFFFFF] transition duration-300">
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Satoshi' }}>1. View Your Reports</h3>
              <p className="text-[#000000]">Access and review all your lab reports with ease.</p>
            </div>
            <div className="bg-[#FFFFFF] p-6 rounded-lg shadow-lg hover:bg-[#FF6000] hover:text-[#FFFFFF] transition duration-300">
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Satoshi' }}>2. Analyze Health Data</h3>
              <p className="text-[#000000]">Use our tools to analyze your health data over time.</p>
            </div>
            <div className="bg-[#FFFFFF] p-6 rounded-lg shadow-lg hover:bg-[#FF6000] hover:text-[#FFFFFF] transition duration-300">
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Satoshi' }}>3. Manage Your Profile</h3>
              <p className="text-[#000000]">Keep your personal information up-to-date and secure.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;
