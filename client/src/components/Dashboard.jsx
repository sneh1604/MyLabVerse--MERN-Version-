import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBars,
  FaTachometerAlt,
  FaUsers,
  FaFileAlt,
  FaUserCircle,
  FaCalendarCheck,
  FaHourglassHalf,
  FaThumbsUp,
  FaFlask,
  FaClipboardList,
  FaCogs,
  FaEnvelopeOpenText,
  FaChartPie,
  FaCheckCircle
} from "react-icons/fa";

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/dashboard");

        if (response.data === "Success") {
          const user = JSON.parse(localStorage.getItem('user'));
          setUserName(user?.name || '');
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/admin-logout', {}, { withCredentials: true });
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUserName('');
      navigate('/login');
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100" style={{ fontFamily: "Satoshi" }}>
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
            <li
              className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <FaTachometerAlt className="mr-3" /> Dashboard
            </li>
            <li
              className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate("/registered-users")}
            >
              <FaUsers className="mr-3" /> Registered Users
            </li>
            <li
              className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate("/test-list")}
            >
              <FaFileAlt className="mr-3" /> Test Lists
            </li>
            <li
              className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate("/make-report")}
            >
              <FaFlask className="mr-3" /> Make Report
            </li>
            <li
              className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate("/settings")}
            >
              <FaCogs className="mr-3" /> Settings
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center">
            <FaBars
              className="lg:hidden cursor-pointer text-2xl mr-4"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <div>
              <h2 className="text-lg font-semibold">Admin Dashboard</h2>
              <p className="text-sm opacity-90">Welcome back, {userName}</p>
            </div>
          </div>
          <div className="relative">
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaUserCircle className="text-2xl" />
              <span>{userName}</span>
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
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </header>
        <main className="flex-grow p-6 bg-gray-100 overflow-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Today's Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-90">Today's Tests</p>
                    <p className="text-3xl font-bold mt-1">0</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <FaFlask className="text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-90">Pending Approvals</p>
                    <p className="text-3xl font-bold mt-1">0</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <FaHourglassHalf className="text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-90">Active Staff</p>
                    <p className="text-3xl font-bold mt-1">0</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <FaUsers className="text-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate("/make-report")}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-3"
              >
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <FaFlask className="text-indigo-600 text-xl" />
                </div>
                <span className="font-medium text-gray-700">New Report</span>
              </button>

              <button
                onClick={() => navigate("/registered-users")}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-3"
              >
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaUsers className="text-green-600 text-xl" />
                </div>
                <span className="font-medium text-gray-700">View Users</span>
              </button>

              <button
                onClick={() => navigate("/test-list")}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-3"
              >
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaFileAlt className="text-purple-600 text-xl" />
                </div>
                <span className="font-medium text-gray-700">Test Lists</span>
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-3"
              >
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaCogs className="text-blue-600 text-xl" />
                </div>
                <span className="font-medium text-gray-700">Settings</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 text-center text-gray-500">
                No recent activity to display
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
