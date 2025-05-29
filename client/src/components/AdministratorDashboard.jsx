import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api-config'; // Import API base URL
import {
  FaBars, FaTachometerAlt, FaUsers, FaChartBar, FaUserTie, FaSignOutAlt, 
  FaUserCircle, FaClipboardList, FaFlask, FaCog, FaCalendarAlt, FaUpload,
  FaFileAlt, FaClock, FaHistory, FaInbox, FaSignInAlt, FaUserCog, FaEdit, FaCircle, FaUserClock, FaCalendar
} from 'react-icons/fa';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import AppointmentManager from './AppointmentManager';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdministratorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [labStatistics, setLabStatistics] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [staffActivities, setStaffActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [dateRange, setDateRange] = useState('week'); // 'week', 'month', 'year'
  const [selectedReportTypes, setSelectedReportTypes] = useState(['hemogram', 'lipid', 'bloodSugar']);
  const [chartView, setChartView] = useState('line'); // 'line' or 'bar'
  const navigate = useNavigate();

  useEffect(() => {
    // Check if administrator is logged in
    const admin = JSON.parse(localStorage.getItem('administrator'));
    if (!admin) {
      navigate('/administrator-login');
      return;
    }
    
    setUserName(admin.name);
    
    // Fetch initial data
    fetchLabStatistics();
    fetchStaffList();
  }, [navigate]);
  
  const fetchLabStatistics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/administrator/lab-statistics`, { 
        withCredentials: true 
      });
      setLabStatistics(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching lab statistics:", err);
      setError("Failed to load laboratory statistics");
      setLoading(false);
    }
  };
  
  const fetchStaffList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/administrator/staff`, { 
        withCredentials: true 
      });
      setStaffList(response.data);
    } catch (err) {
      console.error("Error fetching staff list:", err);
      setError("Failed to load staff list");
    }
  };
  
  const fetchStaffPerformance = async (staffId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/administrator/performance-metrics?staffId=${staffId}`, { 
        withCredentials: true 
      });
      setStaffPerformance(response.data);
    } catch (err) {
      console.error("Error fetching staff performance:", err);
      setError("Failed to load staff performance data");
    }
  };
  
  const fetchStaffActivities = async (staffId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/administrator/staff-activities?staffId=${staffId}`, { 
        withCredentials: true 
      });
      setStaffActivities(response.data);
    } catch (err) {
      console.error("Error fetching staff activities:", err);
      setError("Failed to load staff activities");
    }
  };
  
  const handleStaffSelect = (staffId) => {
    setSelectedStaff(staffId);
    fetchStaffPerformance(staffId);
    fetchStaffActivities(staffId);
  };
  
  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
      localStorage.removeItem('administrator');
      navigate('/administrator-login');
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };
  
  // Prepare chart data
  const getChartData = () => {
    if (!labStatistics || !labStatistics.dailyReports) return null;
    
    // Combine all report types for daily reports
    const dates = new Set();
    labStatistics.dailyReports.hemogram.forEach(item => dates.add(item._id));
    labStatistics.dailyReports.lipid.forEach(item => dates.add(item._id));
    labStatistics.dailyReports.bloodSugar.forEach(item => dates.add(item._id));
    
    const sortedDates = Array.from(dates).sort();
    
    const hemogramData = sortedDates.map(date => {
      const entry = labStatistics.dailyReports.hemogram.find(item => item._id === date);
      return entry ? entry.count : 0;
    });
    
    const lipidData = sortedDates.map(date => {
      const entry = labStatistics.dailyReports.lipid.find(item => item._id === date);
      return entry ? entry.count : 0;
    });
    
    const bloodSugarData = sortedDates.map(date => {
      const entry = labStatistics.dailyReports.bloodSugar.find(item => item._id === date);
      return entry ? entry.count : 0;
    });
    
    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Hemogram',
          data: hemogramData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        },
        {
          label: 'Lipid',
          data: lipidData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        },
        {
          label: 'Blood Sugar',
          data: bloodSugarData,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }
      ]
    };
  };
  
  const getPieChartData = () => {
    if (!labStatistics || !labStatistics.totalReports) return null;
    
    return {
      labels: ['Hemogram', 'Lipid', 'Blood Sugar'],
      datasets: [
        {
          data: [
            labStatistics.totalReports.hemogram,
            labStatistics.totalReports.lipid,
            labStatistics.totalReports.bloodSugar
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(75, 192, 192, 0.7)'
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)'
          ],
          borderWidth: 1
        }
      ]
    };
  };
  
  const getStaffPerformanceData = () => {
    if (!staffPerformance || staffPerformance.length === 0) return null;
    
    const dates = staffPerformance.map(metric => {
      const date = new Date(metric.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    
    const reportsGenerated = staffPerformance.map(metric => metric.reportsGenerated);
    const clientsServed = staffPerformance.map(metric => metric.clientsServed);
    
    return {
      labels: dates,
      datasets: [
        {
          label: 'Reports Generated',
          data: reportsGenerated,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        },
        {
          label: 'Clients Served',
          data: clientsServed,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }
      ]
    };
  };

  // Render dashboard content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'staff':
        return renderStaffTab();
      case 'reports':
        return renderReportsTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'appointments':
        return renderAppointmentsTab();
      default:
        return renderOverviewTab();
    }
  };

  // Render the overview tab with summary statistics
  const renderOverviewTab = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (error) {
      return <div className="text-red-600 text-center py-4">{error}</div>;
    }

    if (!labStatistics) {
      return <div className="text-gray-600 text-center py-4">No data available</div>;
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Laboratory Overview</h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Reports</p>
                <p className="text-3xl font-bold">{labStatistics.totalReports.total}</p>
              </div>
              <FaClipboardList className="text-3xl text-indigo-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Clients</p>
                <p className="text-3xl font-bold">{labStatistics.clientCount}</p>
              </div>
              <FaUsers className="text-3xl text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Lab Assistants</p>
                <p className="text-3xl font-bold">{labStatistics.staffCount}</p>
              </div>
              <FaUserTie className="text-3xl text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Tests Available</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <FaFlask className="text-3xl text-amber-600" />
            </div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Reports Distribution</h3>
            <div className="h-80">
              {getPieChartData() && <Pie data={getPieChartData()} options={{ maintainAspectRatio: false }} />}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Daily Reports (Last 7 Days)</h3>
            <div className="h-80">
              {getChartData() && <Bar data={getChartData()} options={{ maintainAspectRatio: false }} />}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the staff management tab
  const renderStaffTab = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaUserTie className="mr-3 text-indigo-600" />
          Lab Assistant Management
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Staff List with Enhanced UI */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-1 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaUsers className="mr-2 text-indigo-500" />
              Lab Assistants
            </h3>
            {staffList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <FaUserCircle className="text-5xl mb-3 text-gray-300" />
                <p>No lab assistants found</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {staffList.map(staff => (
                  <li key={staff._id}>
                    <button
                      className={`w-full text-left p-4 rounded-lg transition-all transform hover:scale-102 ${
                        selectedStaff === staff._id 
                          ? 'bg-indigo-50 border-2 border-indigo-200' 
                          : 'hover:bg-gray-50 border border-gray-100'
                      }`}
                      onClick={() => handleStaffSelect(staff._id)}
                    >
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-2 rounded-full">
                          <FaUserCircle className={`text-xl ${
                            selectedStaff === staff._id ? 'text-indigo-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold text-gray-800">{staff.name}</p>
                          <p className="text-sm text-gray-500">{staff.email}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Staff Activities with Enhanced UI */}
          <div className="lg:col-span-2 space-y-6">
            {selectedStaff ? (
              <>
                {/* Performance Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow-sm p-5 border border-l-4 border-l-indigo-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Reports Generated</p>
                        <p className="text-2xl font-bold text-gray-800 mt-2">
                          {staffPerformance.reduce((sum, metric) => sum + metric.reportsGenerated, 0)}
                        </p>
                      </div>
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <FaFileAlt className="text-indigo-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-5 border border-l-4 border-l-green-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tests Processed</p>
                        <p className="text-2xl font-bold text-gray-800 mt-2">
                          {staffPerformance.reduce((sum, metric) => sum + metric.testsProcessed, 0)}
                        </p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <FaFlask className="text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-5 border border-l-4 border-l-purple-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Avg. Processing Time</p>
                        <p className="text-2xl font-bold text-gray-800 mt-2">
                          {staffPerformance.length > 0 
                            ? Math.round(staffPerformance.reduce((sum, metric) => 
                                sum + metric.averageProcessingTime, 0) / staffPerformance.length) 
                            : 0} min
                        </p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <FaClock className="text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities Section */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-6 flex items-center">
                    <FaHistory className="mr-2 text-indigo-500" />
                    Recent Activities
                  </h3>
                  
                  {staffActivities.length === 0 ? (
                    <div className="text-center py-8">
                      <FaInbox className="text-5xl text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No activities recorded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {staffActivities.map((activity, index) => (
                        <div key={index} 
                          className="flex items-start p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                          <div className={`p-3 rounded-full mr-4 ${
                            getActivityColor(activity.activityType).bgColor
                          }`}>
                            {getActivityIcon(activity.activityType)}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-800 capitalize">
                                {activity.activityType.replace('_', ' ')}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {new Date(activity.timestamp).toLocaleString()}
                              </span>
                            </div>
                            {activity.details && (
                              <p className="text-sm text-gray-600 mt-1">
                                {activity.details.reportType && (
                                  <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                                    {activity.details.reportType}
                                  </span>
                                )}
                                {activity.details.action && (
                                  <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    {activity.details.action}
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <FaUserClock className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Lab Assistant</h3>
                <p className="text-gray-500">Choose a lab assistant from the list to view their performance metrics and activities</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Helper function to get activity icon
  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case 'login':
        return <FaSignInAlt className="text-green-600" />;
      case 'logout':
        return <FaSignOutAlt className="text-red-600" />;
      case 'report_creation':
        return <FaFileAlt className="text-blue-600" />;
      case 'user_management':
        return <FaUserCog className="text-purple-600" />;
      case 'test_update':
        return <FaEdit className="text-amber-600" />;
      default:
        return <FaCircle className="text-gray-600" />;
    }
  };

  // Helper function to get activity colors
  const getActivityColor = (activityType) => {
    switch (activityType) {
      case 'login':
        return { bgColor: 'bg-green-100' };
      case 'logout':
        return { bgColor: 'bg-red-100' };
      case 'report_creation':
        return { bgColor: 'bg-blue-100' };
      case 'user_management':
        return { bgColor: 'bg-purple-100' };
      case 'test_update':
        return { bgColor: 'bg-amber-100' };
      default:
        return { bgColor: 'bg-gray-100' };
    }
  };

  // Render the reports management tab
  const renderReportsTab = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Reports Overview</h2>
        
        {/* Report Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Hemogram</h3>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FaFlask className="text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{labStatistics?.totalReports?.hemogram || 0}</p>
            <p className="text-gray-500 mt-1">Reports Generated</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Lipid Profile</h3>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FaFlask className="text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{labStatistics?.totalReports?.lipid || 0}</p>
            <p className="text-gray-500 mt-1">Reports Generated</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Blood Sugar</h3>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FaFlask className="text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{labStatistics?.totalReports?.bloodSugar || 0}</p>
            <p className="text-gray-500 mt-1">Reports Generated</p>
          </div>
        </div>
        
        {/* Enhanced Weekly Report Generation Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h3 className="text-xl font-semibold flex items-center">
              <FaChartBar className="mr-2 text-indigo-600" />
              Report Generation Analytics
            </h3>
            
            <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
              {/* Date Range Filter */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['week', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      dateRange === range
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>

              {/* Chart Type Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setChartView('line')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    chartView === 'line'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartView('bar')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    chartView === 'bar'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>
          </div>

          {/* Report Type Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'hemogram', label: 'Hemogram', color: 'blue' },
              { id: 'lipid', label: 'Lipid', color: 'red' },
              { id: 'bloodSugar', label: 'Blood Sugar', color: 'green' }
            ].map(type => (
              <label
                key={type.id}
                className="inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedReportTypes.includes(type.id)}
                  onChange={() => {
                    setSelectedReportTypes(prev =>
                      prev.includes(type.id)
                        ? prev.filter(t => t !== type.id)
                        : [...prev, type.id]
                    )
                  }}
                />
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                    ${selectedReportTypes.includes(type.id)
                      ? `bg-${type.color}-100 text-${type.color}-800 border-2 border-${type.color}-300`
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                    } transition-all`}
                >
                  {type.label}
                </span>
              </label>
            ))}
          </div>

          {/* Chart Container with Animation */}
          <div className="h-80 transition-all duration-300 ease-in-out">
            {getChartData() && (
              chartView === 'line' ? (
                <Line
                  data={{
                    ...getChartData(),
                    datasets: getChartData().datasets.filter(ds =>
                      selectedReportTypes.includes(ds.label.toLowerCase())
                    )
                  }}
                  options={{
                    maintainAspectRatio: false,
                    animations: {
                      tension: {
                        duration: 1000,
                        easing: 'linear'
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Reports'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: `Date (${dateRange})`
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          usePointStyle: true,
                          pointStyle: 'circle'
                        }
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false
                      }
                    },
                    interaction: {
                      mode: 'nearest',
                      axis: 'x',
                      intersect: false
                    }
                  }}
                />
              ) : (
                <Bar
                  data={{
                    ...getChartData(),
                    datasets: getChartData().datasets.filter(ds =>
                      selectedReportTypes.includes(ds.label.toLowerCase())
                    )
                  }}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Reports'
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        position: 'top'
                      }
                    }
                  }}
                />
              )
            )}
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
            {selectedReportTypes.map(type => (
              <div key={type} className="text-center">
                <p className="text-sm text-gray-600">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
                <p className="text-xl font-bold text-gray-800">
                  {labStatistics?.totalReports[type] || 0}
                </p>
                <p className="text-xs text-gray-500">Total Reports</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render the analytics tab
  const renderAnalyticsTab = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Lab Analytics Dashboard</h2>
        
        {/* Lab Efficiency Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Assistant Efficiency</h3>
            <div className="h-80">
              <Bar 
                data={{
                  labels: staffList.map(staff => staff.name),
                  datasets: [
                    {
                      label: 'Reports Generated',
                      data: staffList.map(() => Math.floor(Math.random() * 30) + 10), // Mock data
                      backgroundColor: 'rgba(54, 162, 235, 0.5)',
                      borderColor: 'rgb(54, 162, 235)',
                      borderWidth: 1
                    }
                  ]
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Test Turnaround Time</h3>
            <div className="h-80">
              <Bar
                data={{
                  labels: ['Hemogram', 'Lipid Profile', 'Blood Sugar'],
                  datasets: [
                    {
                      label: 'Average Time (minutes)',
                      data: [45, 60, 30], // Mock data
                      backgroundColor: 'rgba(75, 192, 192, 0.5)',
                      borderColor: 'rgb(75, 192, 192)',
                      borderWidth: 1
                    }
                  ]
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>
        
        {/* Client Demographics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Performance Insights</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Average Reports Per Day</h4>
              <p className="text-3xl font-bold">{labStatistics && Math.round(labStatistics.totalReports.total / 7)}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Reports Per Staff</h4>
              <p className="text-3xl font-bold">
                {labStatistics && staffList.length > 0 ? Math.round(labStatistics.totalReports.total / staffList.length) : 0}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Lab Utilization Rate</h4>
              <p className="text-3xl font-bold">78%</p> {/* Mock data */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the appointments tab
  const renderAppointmentsTab = () => {
    return <AppointmentManager />;
  };

  return (
    <div className="flex min-h-screen bg-gray-100" style={{ fontFamily: 'Satoshi' }}>
      {/* Sidebar */}
      <aside
        className={`bg-indigo-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition duration-200 ease-in-out lg:relative lg:translate-x-0 z-20`}
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
              className={`py-2 px-4 flex items-center cursor-pointer ${
                activeTab === 'overview' ? 'bg-indigo-800' : 'hover:bg-indigo-800'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <FaTachometerAlt className="mr-3" /> Overview
            </li>
            <li
              className={`py-2 px-4 flex items-center cursor-pointer ${
                activeTab === 'staff' ? 'bg-indigo-800' : 'hover:bg-indigo-800'
              }`}
              onClick={() => setActiveTab('staff')}
            >
              <FaUserTie className="mr-3" /> Lab Assistants
            </li>
            <li
              className={`py-2 px-4 flex items-center cursor-pointer ${
                activeTab === 'reports' ? 'bg-indigo-800' : 'hover:bg-indigo-800'
              }`}
              onClick={() => setActiveTab('reports')}
            >
              <FaClipboardList className="mr-3" /> Reports
            </li>
            <li
              className={`py-2 px-4 flex items-center cursor-pointer ${
                activeTab === 'analytics' ? 'bg-indigo-800' : 'hover:bg-indigo-800'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              <FaChartBar className="mr-3" /> Analytics
            </li>
          
            <li
              className="py-2 px-4 flex items-center text-red-300 hover:bg-indigo-800 cursor-pointer mt-8"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-3" /> Logout
            </li>
            <li
              className="py-2 px-4 flex items-center cursor-pointer hover:bg-indigo-800"
              onClick={() => navigate('/bulk-upload')}
            >
              <FaUpload className="mr-3" /> Bulk Upload Reports
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <FaBars
                className="lg:hidden cursor-pointer text-2xl mr-4 text-gray-700"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              />
              <h2 className="text-xl font-bold text-gray-800">Administrator Dashboard</h2>
            </div>
            <div className="relative">
              <div
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaUserCircle className="text-2xl text-indigo-700" />
                <span className="font-medium">{userName}</span>
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default AdministratorDashboard;
