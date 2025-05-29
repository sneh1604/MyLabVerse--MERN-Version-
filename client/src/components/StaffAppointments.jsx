import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { 
  FaCalendar, FaClock, FaUser, FaVial, FaCheck, FaTimes, 
  FaSpinner, FaCalendarCheck, FaEnvelope, FaHome, FaChartBar, 
  FaFileAlt, FaChevronDown, FaBars, FaUsersCog, FaFlask,
  FaClipboardList, FaTachometerAlt, FaUsers, FaCogs, FaCalendarAlt, 
  FaUserCircle, FaSignOutAlt, FaCogs as FaCog, FaUsers as FaUserIcon,
  FaFile as FaFileIcon, FaFlask as FaFlaskIcon, FaCalendarCheck as FaCalendarCheckIcon,
  FaStethoscope, FaListAlt, FaRegCheckCircle
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { API_BASE_URL } from '../config/api-config';

const StaffAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('all');
  const [groupedAppointments, setGroupedAppointments] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/staff/appointments`, {
        withCredentials: true
      });
      
      // Group appointments by date
      const grouped = response.data.reduce((acc, apt) => {
        const date = new Date(apt.appointmentDate).toISOString().split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(apt);
        return acc;
      }, {});
      
      setGroupedAppointments(grouped);
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/appointments/${appointmentId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchAppointments(); // Refresh list
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError('Failed to update appointment status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getAppointmentStats = () => {
    const total = appointments.length;
    const confirmed = appointments.filter(apt => apt.status === 'confirmed').length;
    const pending = appointments.filter(apt => apt.status === 'pending').length;
    const confirmationRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;

    return { total, confirmed, pending, confirmationRate };
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <FaSpinner className="animate-spin text-4xl text-indigo-600" />
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center py-8">
      <div className="text-xl font-semibold">{error}</div>
      <button 
        onClick={fetchAppointments}
        className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100" style={{ fontFamily: 'Satoshi' }}>
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
                    onClick={() => navigate("/staff-appointments")}
                  >
                    <FaCalendar className="mr-3" /> Appointments
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <FaBars
                className="lg:hidden cursor-pointer text-2xl mr-4 text-gray-700"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">Appointment Management</h2>
                <p className="text-sm text-gray-600">Manage patient appointments and schedules</p>
              </div>
            </div>

            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-200">
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
                        to="/staff-profile"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block px-4 py-2 text-gray-700`}
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
                        } block w-full text-left px-4 py-2 text-gray-700`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80">Today's Appointments</p>
                  <p className="text-3xl font-bold mt-2">{getAppointmentStats().total}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <FaCalendarCheck className="text-2xl" />
                </div>
              </div>
              <div className="mt-4 text-sm opacity-80">
                <span className="flex items-center">
                  <FaRegCheckCircle className="mr-1" />
                  Updated just now
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80">Confirmed</p>
                  <p className="text-3xl font-bold mt-2">{getAppointmentStats().confirmed}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <FaCheck className="text-2xl" />
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-white/20 rounded-full h-1.5 w-full">
                  <div 
                    className="bg-white rounded-full h-1.5" 
                    style={{ width: `${getAppointmentStats().confirmationRate}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-2 opacity-80">{getAppointmentStats().confirmationRate}% confirmation rate</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80">Pending Review</p>
                  <p className="text-3xl font-bold mt-2">{getAppointmentStats().pending}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <FaClock className="text-2xl" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm opacity-80">
                <FaStethoscope className="mr-2" />
                Requires attention
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80">Efficiency Score</p>
                  <p className="text-3xl font-bold mt-2">
                    {Math.round((getAppointmentStats().confirmed / Math.max(getAppointmentStats().total, 1)) * 100)}%
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <FaChartBar className="text-2xl" />
                </div>
              </div>
              <div className="mt-4 text-sm opacity-80">
                Based on confirmation rate
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex items-center justify-center p-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                <FaListAlt className="mr-2" />
                Generate Report
              </button>
              <button className="flex items-center justify-center p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                <FaCheck className="mr-2" />
                Batch Confirm
              </button>
              <button className="flex items-center justify-center p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
                <FaCalendar className="mr-2" />
                Schedule View
              </button>
              <button className="flex items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <FaChartBar className="mr-2" />
                Analytics
              </button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-gray-800">Appointments Overview</h3>
                <div className="flex items-center bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm">
                  <FaCalendarCheck className="mr-2" />
                  {appointments.length} Total
                </div>
              </div>
              <select 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Dates</option>
                {Object.keys(groupedAppointments).map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Existing appointments grid */}
          {Object.entries(groupedAppointments)
            .filter(([date]) => selectedDate === 'all' || date === selectedDate)
            .map(([date, dayAppointments]) => (
              <div key={date} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="bg-indigo-600 px-6 py-4">
                  <h2 className="text-white font-semibold flex items-center">
                    <FaCalendar className="mr-2" />
                    {new Date(date).toLocaleDateString(undefined, { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h2>
                </div>

                <div className="p-6 grid gap-4">
                  {dayAppointments.map(apt => (
                    <div key={apt._id} 
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex justify-between flex-wrap gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <FaUser className="text-gray-400" />
                            <span className="font-medium">{apt.userId.name}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <FaVial className="text-indigo-400" />
                            <span>{apt.testId.name}</span>
                            <span className="text-sm text-gray-500">
                              (₹{apt.testId.cost})
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <FaClock className="text-gray-400" />
                            <span>{apt.timeSlot}</span>
                          </div>

                          <div className="flex space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <FaEnvelope className="mr-1" />
                              {apt.userId.email}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between items-end">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(apt.status)}`}>
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </span>
                          
                          <div className="flex space-x-2 mt-4">
                            <button
                              onClick={() => updateStatus(apt._id, 'confirmed')}
                              disabled={apt.status === 'confirmed'}
                              className={`p-2 rounded-md ${
                                apt.status === 'confirmed'
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => updateStatus(apt._id, 'cancelled')}
                              disabled={apt.status === 'cancelled'}
                              className={`p-2 rounded-md ${
                                apt.status === 'cancelled'
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          
          {Object.keys(groupedAppointments).length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white p-6 rounded-lg shadow-sm inline-block">
                <FaCalendar className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No appointments scheduled</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StaffAppointments;
