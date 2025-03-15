import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaBars, FaTachometerAlt, FaUsers, FaChartBar, FaUserTie, FaSignOutAlt, 
  FaUserCircle, FaClipboardList, FaFlask, FaCog, FaCalendarAlt
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
      const response = await axios.get('http://localhost:4000/administrator/lab-statistics', { 
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
      const response = await axios.get('http://localhost:4000/administrator/staff', { 
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
      const response = await axios.get(`http://localhost:4000/administrator/performance-metrics?staffId=${staffId}`, { 
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
      const response = await axios.get(`http://localhost:4000/administrator/staff-activities?staffId=${staffId}`, { 
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
      await axios.post('http://localhost:4000/logout', {}, { withCredentials: true });
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
        <h2 className="text-2xl font-bold text-gray-800">Lab Assistant Management</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Staff List */}
          <div className="bg-white rounded-lg shadow-md p-4 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Lab Assistants</h3>
            {staffList.length === 0 ? (
              <p className="text-gray-500">No lab assistants found</p>
            ) : (
              <ul className="space-y-2">
                {staffList.map(staff => (
                  <li key={staff._id}>
                    <button
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedStaff === staff._id ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleStaffSelect(staff._id)}
                    >
                      <div className="flex items-center">
                        <FaUserCircle className="mr-2 text-gray-600" />
                        <div>
                          <p className="font-semibold">{staff.name}</p>
                          <p className="text-sm text-gray-600">{staff.email}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Staff Performance */}
          <div className="bg-white rounded-lg shadow-md p-4 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            {!selectedStaff ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <FaUserTie className="text-5xl mb-4" />
                <p>Select a staff member to view performance metrics</p>
              </div>
            ) : staffPerformance.length === 0 ? (
              <div className="text-gray-500 text-center py-4">No performance data available for this staff member</div>
            ) : (
              <>
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Activity Summary</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Reports Generated</p>
                      <p className="text-2xl font-bold">
                        {staffPerformance.reduce((sum, metric) => sum + metric.reportsGenerated, 0)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Clients Served</p>
                      <p className="text-2xl font-bold">
                        {staffPerformance.reduce((sum, metric) => sum + metric.clientsServed, 0)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Tests Processed</p>
                      <p className="text-2xl font-bold">
                        {staffPerformance.reduce((sum, metric) => sum + metric.testsProcessed, 0)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Avg. Processing Time</p>
                      <p className="text-2xl font-bold">
                        {staffPerformance.length > 0 ? 
                          Math.round(staffPerformance.reduce((sum, metric) => sum + metric.averageProcessingTime, 0) / staffPerformance.length) : 
                          0} min
                      </p>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-700 mb-2">Performance Trend</h4>
                <div className="h-64">
                  {getStaffPerformanceData() && <Line data={getStaffPerformanceData()} options={{ maintainAspectRatio: false }} />}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Staff Activities */}
        {selectedStaff && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            {staffActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No activities recorded for this staff member</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {staffActivities.map((activity, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{activity.activityType.replace('_', ' ')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {activity.details && activity.details.reportType && (
                              <>Report Type: {activity.details.reportType}</>
                            )}
                            {activity.details && activity.details.action && (
                              <>, Action: {activity.details.action}</>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
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
        
        {/* Monthly Report Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Weekly Report Generation</h3>
          <div className="h-80">
            {getChartData() && <Line data={getChartData()} options={{ maintainAspectRatio: false }} />}
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
