import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaCalendarAlt, 
  FaUserClock,
  FaClipboardCheck,
  FaVial,
  FaChartLine,
  FaMedal,
  FaExchangeAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend
);

const AdminPerformanceMetrics = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3);

  useEffect(() => {
    fetchPerformanceData();
  }, [timeframe]);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      // This would be a real API call in a production app
      // const response = await axios.get(`http://localhost:4000/admin/performance?timeframe=${timeframe}`);
      // setPerformanceData(response.data);
      
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        setPerformanceData(getMockData());
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching performance metrics:", error);
      setLoading(false);
    }
  };

  const getMockData = () => {
    // Mock data based on timeframe
    const data = {
      processedTests: timeframe === 'week' ? 245 : timeframe === 'month' ? 1240 : 3680,
      averageTime: timeframe === 'week' ? 1.5 : timeframe === 'month' ? 1.8 : 2.1,
      patientsSatisfaction: timeframe === 'week' ? 95 : timeframe === 'month' ? 93 : 91,
      completionRate: timeframe === 'week' ? 94 : timeframe === 'month' ? 92 : 90,
      errorRate: timeframe === 'week' ? 0.8 : timeframe === 'month' ? 1.2 : 1.5,
      topPerformers: [
        { name: "Dr. Johnson", testsProcessed: 42, avgTime: 1.2 },
        { name: "Dr. Smith", testsProcessed: 38, avgTime: 1.4 },
        { name: "Dr. Brown", testsProcessed: 37, avgTime: 1.5 },
      ],
      chartData: {
        labels: timeframe === 'week' 
          ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          : timeframe === 'month'
          ? Array.from({ length: 30 }, (_, i) => i + 1)
          : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Tests Processed',
            data: timeframe === 'week' 
              ? [32, 45, 39, 28, 34, 42, 25]
              : timeframe === 'month'
              ? Array.from({ length: 30 }, () => Math.floor(Math.random() * 20) + 30)
              : [290, 310, 340, 280, 320, 350, 370, 390, 410, 380, 340, 320],
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            fill: false,
            tension: 0.3
          }
        ]
      }
    };
    return data;
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Staff Performance Metrics</h3>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeframe('week')} 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              timeframe === 'week' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button 
            onClick={() => setTimeframe('month')} 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              timeframe === 'month' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
          <button 
            onClick={() => setTimeframe('year')} 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              timeframe === 'year' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Performance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-indigo-50 rounded-xl p-4">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <FaVial className="text-indigo-600" />
            </div>
            <h4 className="ml-2 text-sm font-medium text-gray-600">Tests Processed</h4>
          </div>
          <p className="text-2xl font-bold text-gray-800">{performanceData.processedTests}</p>
          <p className="text-xs text-gray-500 mt-1">in the last {timeframe}</p>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaUserClock className="text-blue-600" />
            </div>
            <h4 className="ml-2 text-sm font-medium text-gray-600">Avg. Process Time</h4>
          </div>
          <p className="text-2xl font-bold text-gray-800">{performanceData.averageTime} hrs</p>
          <p className="text-xs text-gray-500 mt-1">per test</p>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <FaClipboardCheck className="text-green-600" />
            </div>
            <h4 className="ml-2 text-sm font-medium text-gray-600">Completion Rate</h4>
          </div>
          <p className="text-2xl font-bold text-gray-800">{performanceData.completionRate}%</p>
          <p className="text-xs text-gray-500 mt-1">on schedule</p>
        </div>
        
        <div className="bg-amber-50 rounded-xl p-4">
          <div className="flex items-center mb-4">
            <div className="bg-amber-100 p-2 rounded-lg">
              <FaChartLine className="text-amber-600" />
            </div>
            <h4 className="ml-2 text-sm font-medium text-gray-600">Patient Satisfaction</h4>
          </div>
          <p className="text-2xl font-bold text-gray-800">{performanceData.patientsSatisfaction}%</p>
          <p className="text-xs text-gray-500 mt-1">positive feedback</p>
        </div>
        
        <div className="bg-red-50 rounded-xl p-4">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-2 rounded-lg">
              <FaExchangeAlt className="text-red-600" />
            </div>
            <h4 className="ml-2 text-sm font-medium text-gray-600">Error Rate</h4>
          </div>
          <p className="text-2xl font-bold text-gray-800">{performanceData.errorRate}%</p>
          <p className="text-xs text-gray-500 mt-1">tests retaken</p>
        </div>
      </div>
      
      {/* Performance Chart */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-700 mb-4">Performance Trend</h4>
        <div className="h-64">
          <Line 
            data={performanceData.chartData} 
            options={{ 
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Number of Tests'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: timeframe === 'week' ? 'Days of Week' : timeframe === 'month' ? 'Days of Month' : 'Months'
                  }
                }
              },
              plugins: {
                legend: {
                  position: 'top',
                }
              }
            }} 
          />
        </div>
      </div>
      
      {/* Top Performers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-700">Top Performing Staff</h4>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              className={`p-1 rounded-full ${
                currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaChevronLeft />
            </button>
            <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              className={`p-1 rounded-full ${
                currentPage === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th scope="col" className="text-sm font-medium text-gray-700 px-4 py-3 text-left">
                  Staff Name
                </th>
                <th scope="col" className="text-sm font-medium text-gray-700 px-4 py-3 text-left">
                  Tests Processed
                </th>
                <th scope="col" className="text-sm font-medium text-gray-700 px-4 py-3 text-left">
                  Avg. Time
                </th>
                <th scope="col" className="text-sm font-medium text-gray-700 px-4 py-3 text-left">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody>
              {performanceData.topPerformers.map((staff, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                    <div className="flex items-center">
                      {index === 0 && <FaMedal className="text-amber-500 mr-2" />}
                      {index === 1 && <FaMedal className="text-gray-400 mr-2" />}
                      {index === 2 && <FaMedal className="text-amber-700 mr-2" />}
                      {staff.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {staff.testsProcessed}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {staff.avgTime} hrs
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={index === 0 ? "bg-green-500 h-2 rounded-full" : "bg-indigo-500 h-2 rounded-full"} 
                        style={{ width: `${90 - (index * 5)}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPerformanceMetrics;
