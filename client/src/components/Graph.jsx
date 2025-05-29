import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import { API_BASE_URL } from '../config/api-config'; // Import API base URL
import {
  FaDownload,
  FaUser,
  FaChevronDown,
  FaHome,
  FaChartBar,
  FaFileAlt,
} from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const HemogramChart = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [normalRanges, setNormalRanges] = useState({});
  const [bloodSugarData, setBloodSugarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Normal ranges for cholesterol
  const normalCholesterolRanges = {
    min: 0,
    max: 200, // Example normal range for total cholesterol
  };

  // Fetch hemogram and blood sugar data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const hemogramResponse = await axios.get(
          `${API_BASE_URL}/hemogram-graph`,
          { withCredentials: true }
        );
        setGraphData(hemogramResponse.data.graphData);
        setNormalRanges(hemogramResponse.data.normalRanges);

        const bloodSugarResponse = await axios.get(
          `${API_BASE_URL}/blood-sugar-graph`,
          { withCredentials: true }
        );
        setBloodSugarData(bloodSugarResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();

    // Check user login status
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
      setUserName(user.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/login");
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
      labels: graphData.map((report) => report.date),
      datasets: [
        {
          label,
          data,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Normal Range Min",
          data: new Array(graphData.length).fill(minRange || 0),
          backgroundColor: "rgba(0, 255, 0, 0.3)",
          borderColor: "rgba(0, 255, 0, 0.8)",
          borderWidth: 2,
          type: "line",
          fill: false,
        },
        {
          label: "Normal Range Max",
          data: new Array(graphData.length).fill(maxRange || 0),
          backgroundColor: "rgba(255, 0, 0, 0.3)",
          borderColor: "rgba(255, 0, 0, 0.8)",
          borderWidth: 2,
          type: "line",
          fill: false,
        },
      ],
    };
  };

  // Prepare data for Bar Charts (Blood Sugar - Total Cholesterol)
  const prepareBarChartData = () => {
    return {
      labels: bloodSugarData.map((report) => report.dateCreated),
      datasets: [
        {
          label: "Total Cholesterol",
          data: bloodSugarData.map((report) => report.totalCholesterol),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Normal Range Min",
          data: new Array(bloodSugarData.length).fill(
            normalCholesterolRanges.min
          ),
          backgroundColor: "rgba(0, 255, 0, 0.3)",
          borderColor: "rgba(0, 255, 0, 1)",
          borderWidth: 1,
          type: "line",
        },
        {
          label: "Normal Range Max",
          data: new Array(bloodSugarData.length).fill(
            normalCholesterolRanges.max
          ),
          backgroundColor: "rgba(255, 0, 0, 0.3)",
          borderColor: "rgba(255, 0, 0, 1)",
          borderWidth: 1,
          type: "line",
        },
      ],
    };
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: "Satoshi" }}>
      {/* Header */}
      <header className="bg-[#6C5BD4] text-white shadow-lg">
              <div className="container mx-auto flex justify-between items-center py-4 px-6">
                {/* Logo and Brand */}
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>MyLabVerse</h1>
                </div>
      
                {/* Navigation Links */}
                <nav className="hidden md:flex items-center space-x-6">
                  <Link to="/userdashboard" className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200">
                    <FaHome /> <span>Dashboard</span>
                  </Link>
                  <Link to="/viewreport" className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200">
                    <FaFileAlt /> <span>Reports</span>
                  </Link>
                  <Link to="/graph" className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200">
                    <FaChartBar /> <span>Analytics</span>
                  </Link>
                  <Link to="/prescriptionocr" className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200">
                    <FaFileAlt /> <span>OCR</span>
                  </Link>
                </nav>
      
                {/* User Menu */}
                {isLoggedIn && (
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-2 bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md transition duration-200">
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
                              to="/profile"
                              className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-gray-700`}
                            >
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-gray-700 w-full text-left`}
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

      <h2 className="text-4xl font-bold text-center mb-12 mt-8 text-[#6C5BD4]">
        Graph Analysis of Your Report
      </h2>

      {/* Chart Section */}
      <div className="space-y-12 max-w-6xl mx-auto">
        {/* Hemoglobin Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#FF6000]">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Hemoglobin</h3>
          <Line
            data={prepareLineChartData(
              "Hemoglobin",
              graphData.map((report) => report.hemoglobin),
              normalRanges.hemoglobin?.min,
              normalRanges.hemoglobin?.max
            )}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Hemoglobin Levels Over Time",
                  color: "#333",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Values", color: "#333" },
                  grid: { color: "#E5E7EB", borderColor: "#E5E7EB" },
                  ticks: { color: "#6B7280" },
                },
                x: {
                  title: { display: true, text: "Test Dates", color: "#333" },
                  grid: { color: "#E5E7EB", borderColor: "#E5E7EB" },
                  ticks: { color: "#6B7280" },
                },
              },
            }}
          />
          <div className="mt-4 p-4 bg-[#6C5BD4] text-white rounded-lg">
            {generatePrecautionText(
              graphData[graphData.length - 1]?.hemoglobin || 0,
              normalRanges.hemoglobin?.min,
              normalRanges.hemoglobin?.max,
              "Hemoglobin"
            )}
          </div>
        </div>

        {/* RBC Count Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#FF6000]">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">RBC Count</h3>
          <Line
            data={prepareLineChartData(
              "RBC Count",
              graphData.map((report) => report.rbc_count),
              normalRanges.rbc_count?.min,
              normalRanges.rbc_count?.max
            )}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "RBC Count Over Time",
                  color: "#333",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Values", color: "#333" },
                  grid: { color: "#E5E7EB", borderColor: "#E5E7EB" },
                  ticks: { color: "#6B7280" },
                },
                x: {
                  title: { display: true, text: "Test Dates", color: "#333" },
                  grid: { color: "#E5E7EB", borderColor: "#E5E7EB" },
                  ticks: { color: "#6B7280" },
                },
              },
            }}
          />
          <div className="mt-4 p-4 bg-[#6C5BD4] text-white rounded-lg">
            {generatePrecautionText(
              graphData[graphData.length - 1]?.rbc_count || 0,
              normalRanges.rbc_count?.min,
              normalRanges.rbc_count?.max,
              "RBC Count"
            )}
          </div>
        </div>

        {/* WBC Count Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#FF6000]">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">WBC Count</h3>
          <Line
            data={prepareLineChartData(
              "WBC Count",
              graphData.map((report) => report.wbc_count),
              normalRanges.wbc_count?.min,
              normalRanges.wbc_count?.max
            )}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "WBC Count Over Time",
                  color: "#333",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Values", color: "#333" },
                  grid: { color: "#E5E7EB", borderColor: "#E5E7EB" },
                  ticks: { color: "#6B7280" },
                },
                x: {
                  title: { display: true, text: "Test Dates", color: "#333" },
                  grid: { color: "#E5E7EB", borderColor: "#E5E7EB" },
                  ticks: { color: "#6B7280" },
                },
              },
            }}
          />
          <div className="mt-4 p-4 bg-[#6C5BD4] text-white rounded-lg">
            {generatePrecautionText(
              graphData[graphData.length - 1]?.wbc_count || 0,
              normalRanges.wbc_count?.min,
              normalRanges.wbc_count?.max,
              "WBC Count"
            )}
          </div>
        </div>

        {/* Blood Sugar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#FF6000]">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 ">
            Total Cholesterol
          </h3>
          <Bar
            data={prepareBarChartData()}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Total Cholesterol Over Time",
                  color: "#333",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Values", color: "#333" },
                  grid: { color: "#E5E7EB", borderColor: "#E5E7EB" },
                  ticks: { color: "#6B7280" },
                },
                x: {
                  title: { display: true, text: "Test Dates", color: "#333" },
                  grid: { color: "#E5E7EB", borderColor: "#E5E7EB" },
                  ticks: { color: "#6B7280" },
                },
              },
            }}
          />
          <div className="mt-4 p-4 bg-[#6C5BD4] text-white  rounded-lg">
            {generatePrecautionText(
              bloodSugarData[bloodSugarData.length - 1]?.totalCholesterol || 0,
              normalCholesterolRanges.min,
              normalCholesterolRanges.max,
              "Total Cholesterol"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HemogramChart;
