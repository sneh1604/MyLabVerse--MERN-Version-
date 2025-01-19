import React, { useState, useEffect } from 'react';
import { FaUser, FaChevronDown , FaHome, FaChartBar, FaFileAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import userImage from './../assets/user.png'; // Update this path to your user image
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';


const UserDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
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
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Satoshi' }}>
      {/* Header */}
      <header className="bg-[#6C5BD4] p-4 shadow-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
      <h1 className="text-2xl font-bold">MyLabVerse</h1>
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
                <span className="text-sm sm:text-lg">{userName}</span>
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


      {/* Main content */}
      <main className="p-6 container mx-auto">
        {/* User Dashboard Details */}
        <section className="flex flex-col md:flex-row items-center mb-12">
        <div className="md:w-2/3 text-center md:text-left">
        <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
        <p className="bg-[#6C5BD4] p-6 rounded-lg shadow-lg">
              Welcome to your dashboard, {userName}! Here, you can manage your lab reports, view test results, and analyze your health data. Use the navigation links above to explore different sections of your dashboard.
              <br /><br />
              Your dashboard provides a comprehensive overview of all your lab activities. Stay informed with our easy-to-use interface, and make the most out of your MyLabVerse experience.
            </p>
          </div>

          <div className="mt-6 md:mt-0 md:w-1/3 flex justify-center">
            {/* Image Placeholder */}
            
              <img 
                src={userImage} 
                alt="User Illustration" 
                className="w-32 sm:w-40 md:w-48 rounded-full shadow-lg" 
              />
          </div>
        </section>

        {/* Dashboard Features Section */}
        <section >
        <h2 className="text-2xl font-semibold text-center mb-6">Dashboard Features</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
              { title: 'View Your Reports', description: 'Access all your lab reports with ease.' },
              { title: 'Analyze Health Data', description: 'Analyze trends and health data over time.' },
              { title: 'Manage Your Profile', description: 'Keep your profile updated and secure.' },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white text-black p-6 rounded-lg shadow-lg hover:bg-[#FF6000] hover:text-white transition duration-300"
              >
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;
