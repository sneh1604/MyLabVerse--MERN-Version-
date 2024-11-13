import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { FaDownload, FaUser, FaChevronDown, FaHome, FaChartBar, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import {    
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement
} from 'chart.js';
import { Link, useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, BarElement, Title, Tooltip, Legend, PointElement);

const HemogramChart = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [graphData, setGraphData] = useState([]);
    const [normalRanges, setNormalRanges] = useState({});
    const [bloodSugarData, setBloodSugarData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Normal ranges for cholesterol
    const normalCholesterolRanges = {
        min: 0,
        max: 200 // Example normal range for total cholesterol
    };

    // Fetch hemogram and blood sugar data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const hemogramResponse = await axios.get('http://localhost:4000/hemogram-graph', { withCredentials: true });
                setGraphData(hemogramResponse.data.graphData);
                setNormalRanges(hemogramResponse.data.normalRanges);

                const bloodSugarResponse = await axios.get('http://localhost:4000/blood-sugar-graph', { withCredentials: true });
                setBloodSugarData(bloodSugarResponse.data);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();

        // Check user login status
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

    // Prepare data for Line Charts (Hemogram)
    const generatePrecautionText = (testValue, minRange, maxRange, testName) => {
        if (testValue < minRange) {
            return `${testName} is below normal. You should consult your doctor. Consider eating foods rich in nutrients to improve your levels.`;
        } else if (testValue > maxRange) {
            return `${testName} is above normal. Please reduce high-fat foods, and consider lifestyle changes. Consult your healthcare provider.`;
        } else {
            return `${testName} is within the normal range. Maintain a balanced diet and regular exercise to keep it stable.`;
        }
    };

    const prepareLineChartData = (label, data, minRange, maxRange) => {
        return {
            labels: graphData.map(report => report.date),
            datasets: [
                {
                    label,
                    data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false,
                },
                {
                    label: 'Normal Range Min',
                    data: new Array(graphData.length).fill(minRange || 0),
                    backgroundColor: 'rgba(0, 255, 0, 0.3)',
                    borderColor: 'rgba(0, 255, 0, 0.8)',
                    borderWidth: 2,
                    type: 'line',
                    fill: false,
                },
                {
                    label: 'Normal Range Max',
                    data: new Array(graphData.length).fill(maxRange || 0),
                    backgroundColor: 'rgba(255, 0, 0, 0.3)',
                    borderColor: 'rgba(255, 0, 0, 0.8)',
                    borderWidth: 2,
                    type: 'line',
                    fill: false,
                },
            ],
        };
    };

    // Prepare data for Bar Charts (Blood Sugar - Total Cholesterol)
    const prepareBarChartData = () => {
        return {
            labels: bloodSugarData.map(report => report.dateCreated),
            datasets: [
                {
                    label: 'Total Cholesterol',
                    data: bloodSugarData.map(report => report.totalCholesterol),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Normal Range Min',
                    data: new Array(bloodSugarData.length).fill(normalCholesterolRanges.min),
                    backgroundColor: 'rgba(0, 255, 0, 0.3)',
                    borderColor: 'rgba(0, 255, 0, 1)',
                    borderWidth: 1,
                    type: 'line',
                },
                {
                    label: 'Normal Range Max',
                    data: new Array(bloodSugarData.length).fill(normalCholesterolRanges.max),
                    backgroundColor: 'rgba(255, 0, 0, 0.3)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    borderWidth: 1,
                    type: 'line',
                },
            ],
        };
    };

    if (loading) return <div className="p-4 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 " style={{ fontFamily: 'Satoshi' }}>
            {/* Header */}
            <header className="bg-[#6C5BD4] text-white p-4 shadow-lg">
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
                  <Menu.Button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none">
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


            <h2 className="text-4xl font-bold text-center mb-12 mt-8 text-[#6C5BD4]">Graph Analysis of your report </h2>

            {/* Hemoglobin Chart */}
            <div className="mb-8 bg-black p-6 rounded-lg shadow-2xl r border-[#FF6000] border-4 max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-white">Hemoglobin</h3>
                <Line
                    data={prepareLineChartData('Hemoglobin', graphData.map(report => report.hemoglobin), normalRanges.hemoglobin?.min, normalRanges.hemoglobin?.max)}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Hemoglobin Levels Over Time', color: 'white' },
                        },
                        scales: {
                            y: { beginAtZero: true, title: { display: true, text: 'Values',color: 'white' },grid: {
                                color: '#2B2B2B', // Change this to your desired color for y-axis grid lines
                                borderColor: '#2B2B2B', // Change this to your desired border color
                            }, ticks: {
                                color: '#DDE6ED' // Change Y-axis labels to white
                            } },
                            x: { title: { display: true, text: 'Test Dates' ,color: 'white'} ,grid: {
                                color: '#2B2B2B', // Change this to your desired color for y-axis grid lines
                                borderColor: '#2B2B2B', // Change this to your desired border color
                            },ticks: {
                                color: '#DDE6ED' // Change Y-axis labels to white
                            } },
                        },
                    }}
                />
                  <div className="mt-4 p-4 bg-[#6C5BD4] text-white rounded-lg">
                    {generatePrecautionText(graphData[graphData.length - 1]?.hemoglobin || 0, normalRanges.hemoglobin?.min, normalRanges.hemoglobin?.max, 'Hemoglobin')}
                </div>
            </div>

            {/* RBC Count Chart */}
            <div className="mb-8 bg-black p-6 rounded-lg shadow-2xl r border-[#FF6000] border-4 max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-white">RBC Count</h3>
                <Line
                    data={prepareLineChartData('RBC Count', graphData.map(report => report.rbc_count), normalRanges.rbc_count?.min, normalRanges.rbc_count?.max)}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'RBC Count Over Time' , color: 'white' },
                            tooltip: {
                                bodyColor: 'white', // Change tooltip text color to white
                                titleColor: 'white', // Change tooltip title color to white
                            }
                        },
                        scales: {
                            y: { beginAtZero: true, title: { display: true, text: 'Values',color: 'white'  },grid: {
                                color: '#2B2B2B', // Change this to your desired color for y-axis grid lines
                                borderColor: '#2B2B2B', // Change this to your desired border color
                            },ticks: {
                                color: '#DDE6ED' // Change Y-axis labels to white
                            } },
                            x: { title: { display: true, text: 'Test Dates',color: 'white'  } ,grid: {
                                color: '#2B2B2B', // Change this to your desired color for y-axis grid lines
                                borderColor: '#2B2B2B', // Change this to your desired border color
                            },ticks: {
                                color: '#DDE6ED' // Change Y-axis labels to white
                            }},
                        },
                    }}
                />
                 <div className="mt-4 p-4 bg-[#6C5BD4] text-white rounded-lg">
                    {generatePrecautionText(graphData[graphData.length - 1]?.rbc_count || 0, normalRanges.rbc_count?.min, normalRanges.rbc_count?.max, 'RBC Count')}
                </div>
            </div>

            {/* WBC Count Chart */}
            <div className="mb-8 bg-black p-6 rounded-lg shadow-2xl r border-[#FF6000] border-4 max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-white">WBC Count</h3>
                <Line
                    data={prepareLineChartData('WBC Count', graphData.map(report => report.wbc_count), normalRanges.wbc_count?.min, normalRanges.wbc_count?.max)}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'WBC Count Over Time',color: 'white' },
                        },
                        scales: {
                            y: { beginAtZero: true, title: { display: true, text: 'Values',color: 'white' },grid: {
                                color: '#2B2B2B', // Change this to your desired color for y-axis grid lines
                                borderColor: '#2B2B2B', // Change this to your desired border color
                            },ticks: {
                                color: '#DDE6ED' // Change Y-axis labels to white
                            }  },
                            x: { title: { display: true, text: 'Test Dates',color: 'white' },grid: {
                                color: '#2B2B2B', // Change this to your desired color for y-axis grid lines
                                borderColor: '#2B2B2B', // Change this to your desired border color
                            },ticks: {
                                color: '#DDE6ED' // Change Y-axis labels to white
                            }  },
                        },
                    }}
                />
                 <div className="mt-4 p-4 bg-[#6C5BD4] text-white rounded-lg">
                    {generatePrecautionText(graphData[graphData.length - 1]?.wbc_count || 0, normalRanges.wbc_count?.min, normalRanges.wbc_count?.max, 'WBC Count')}
                </div>
            </div>

            {/* Blood Sugar Chart */}
            <div className="mb-8 bg-black p-6 rounded-lg shadow-2xl r border-[#FF6000] border-4 max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-white ">Total Cholesterol</h3>
                <Bar
                    data={prepareBarChartData()}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Total Cholesterol Over Time',color: 'white' },
                        },
                        scales: {
                            y: { beginAtZero: true, title: { display: true, text: 'Values',color: 'white' }, grid: {
                                color: '#2B2B2B', // Change this to your desired color for y-axis grid lines
                                borderColor: '#2B2B2B', // Change this to your desired border color
                            },ticks: {
                                color: '#DDE6ED' // Change Y-axis labels to white
                            }  },
                            x: { title: { display: true, text: 'Test Dates' ,color: 'white'},grid: {
                                color: '#2B2B2B', // Change this to your desired color for y-axis grid lines
                                borderColor: '#2B2B2B', // Change this to your desired border color
                            },ticks: {
                                color: '#DDE6ED' // Change Y-axis labels to white
                            }  },
                        },
                    }}
                />
                 <div className="mt-4 p-4 bg-[#6C5BD4] text-white  rounded-lg">
                    {generatePrecautionText(bloodSugarData[bloodSugarData.length - 1]?.totalCholesterol || 0, normalCholesterolRanges.min, normalCholesterolRanges.max, 'Total Cholesterol')}
                </div>
            </div>
        </div>
    );
};

export default HemogramChart;
