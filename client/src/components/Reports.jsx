import React from 'react';
import { FaUser, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Reports = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userName, setUserName] = React.useState('');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsLoggedIn(true);
      setUserName(user.name); // Assuming user object contains 'name'
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center bg-blue-600 text-white p-4">
        <div className="text-2xl font-bold">MyLabVerse</div>
        <nav className="flex space-x-6 relative">
          <Link to="/userdashboard" className="hover:underline">Dashboard</Link>
          <Link to="/reports" className="hover:underline">Reports</Link>
          <Link to="/graph" className="hover:underline">Graph Analysis</Link>
        </nav>
        <div className="relative">
          {isLoggedIn ? (
            <div
              className="flex items-down cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FaUser className="mr-2" />
              {userName}
              <FaChevronDown className="ml-2" />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-10">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center">
              <FaUser className="mr-2" /> Login
            </Link>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Your Reports</h1>
        <p className="text-gray-700 text-lg text-center mb-4">
          Here, your lab reports will be displayed as soon as they are provided by the laboratory.
        </p>
        <p className="text-gray-700 text-lg text-center mb-6">
          This feature is coming soon! Stay tuned for updates.
        </p>
        <img
          src="https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif"
          alt="Coming Soon"
          className="w-64 h-64"
        />
      </main>
    </div>
  );
};

export default Reports;
