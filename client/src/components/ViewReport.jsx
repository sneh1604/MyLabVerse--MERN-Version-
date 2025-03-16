import React, { useEffect, useState, Fragment } from "react";
import {
  FaDownload,
  FaUser,
  FaChevronDown,
  FaHome,
  FaChartBar,
  FaFileAlt,
  FaSearch,
  FaFilter,
  FaExclamationCircle,
  FaSort,
  FaFilePdf,
  FaEye
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Menu, Transition } from "@headlessui/react";
import { ClipLoader } from "react-spinners";

const ViewReport = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortDirection, setSortDirection] = useState("desc"); // desc = newest first
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
      setUserName(user.name);
    }

    const fetchReports = async () => {
      try {
        const hemogramResponse = await axios.get(
          "http://localhost:4000/hemogram-reports",
          { withCredentials: true }
        );
        const lipidResponse = await axios.get(
          "http://localhost:4000/lipid-report",
          { withCredentials: true }
        );
        const bloodSugarResponse = await axios.get(
          "http://localhost:4000/blood-sugar-report",
          { withCredentials: true }
        );

        let combinedReports = [];

        if (!hemogramResponse.data.message) {
          combinedReports = hemogramResponse.data.map((report) => ({
            ...report,
            type: "Hemogram",
            createdAt: new Date(report.created_at),
          }));
        }

        if (!lipidResponse.data.message) {
          combinedReports = [
            ...combinedReports,
            ...lipidResponse.data.map((report) => ({
              ...report,
              type: "Lipid",
              createdAt: new Date(report.dateCreated),
            })),
          ];
        }

        if (!bloodSugarResponse.data.message) {
          combinedReports = [
            ...combinedReports,
            ...bloodSugarResponse.data.map((report) => ({
              ...report,
              type: "BloodSugar",
              createdAt: new Date(report.dateCreated),
            })),
          ];
        }

        combinedReports.sort((a, b) => b.createdAt - a.createdAt);
        setReports(combinedReports);
      } catch (error) {
        setError("Failed to fetch reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownloadClick = (report) => {
    if (report.type === "Hemogram") {
      navigate("/hemogram-reportpdf", { state: { report } });
    } else if (report.type === "Lipid") {
      navigate("/lipid-report", { state: { report } });
    } else if (report.type === "BloodSugar") {
      navigate("/bloodsugar_reportpdf", { state: { report } });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/login");
  };
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "desc" ? "asc" : "desc");
  };
  
  const filteredReports = reports.filter(report => {
    // First filter by report type if not "All"
    if (filterType !== "All" && report.type !== filterType) {
      return false;
    }
    
    // Then filter by search term (case insensitive)
    const searchLower = searchTerm.toLowerCase();
    return (
      report.type.toLowerCase().includes(searchLower) ||
      report.createdAt.toLocaleDateString().toLowerCase().includes(searchLower)
    );
  });
  
  // Sort the filtered reports
  const sortedReports = [...filteredReports].sort((a, b) => {
    return sortDirection === "desc" 
      ? b.createdAt - a.createdAt 
      : a.createdAt - b.createdAt;
  });
  
  const reportCounts = {
    total: reports.length,
    hemogram: reports.filter(r => r.type === "Hemogram").length,
    lipid: reports.filter(r => r.type === "Lipid").length,
    bloodSugar: reports.filter(r => r.type === "BloodSugar").length
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto text-center">
          <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: "Satoshi" }}>
      {/* Top Navigation Bar */}
      <header className="bg-[#6C5BD4] text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <h1 
              className="text-2xl font-bold cursor-pointer" 
              onClick={() => navigate("/")}
            >
              MyLabVerse
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/userdashboard"
              className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200"
            >
              <FaHome /> <span>Dashboard</span>
            </Link>
            <Link
              to="/viewreport"
              className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200"
            >
              <FaFileAlt /> <span>Reports</span>
            </Link>
            <Link
              to="/graph"
              className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200"
            >
              <FaChartBar /> <span>Analytics</span>
            </Link>
            <Link
              to="/prescriptionocr"
              className="flex items-center space-x-2 hover:text-yellow-300 font-medium transition duration-200"
            >
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

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Lab Reports</h1>
          <p className="text-gray-600">Access and manage all your laboratory test reports</p>
        </div>

        {/* Reports Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-indigo-500">
            <h3 className="text-sm font-medium text-gray-500">All Reports</h3>
            <p className="text-2xl font-bold text-gray-800">{reportCounts.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500">Hemogram</h3>
            <p className="text-2xl font-bold text-gray-800">{reportCounts.hemogram}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-500">Lipid Profile</h3>
            <p className="text-2xl font-bold text-gray-800">{reportCounts.lipid}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500">Blood Sugar</h3>
            <p className="text-2xl font-bold text-gray-800">{reportCounts.bloodSugar}</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">Report History</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="All">All Types</option>
                <option value="Hemogram">Hemogram</option>
                <option value="Lipid">Lipid Profile</option>
                <option value="BloodSugar">Blood Sugar</option>
              </select>
              <button
                onClick={toggleSortDirection}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FaSort />
                <span>{sortDirection === "desc" ? "Newest First" : "Oldest First"}</span>
              </button>
            </div>
          </div>

          {/* Loader or Reports Table */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <ClipLoader color="#6C5BD4" loading={isLoading} size={50} />
            </div>
          ) : sortedReports.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-500 mb-2">No Reports Found</h3>
              <p className="text-gray-400">
                {searchTerm || filterType !== "All" 
                  ? "Try adjusting your search or filter" 
                  : "You don't have any reports yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedReports.map((report, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.createdAt.toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{report.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${report.type === "Hemogram" ? "bg-blue-100 text-blue-800" : 
                            report.type === "Lipid" ? "bg-red-100 text-red-800" : 
                            "bg-green-100 text-green-800"}`}>
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {report.type} Report {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownloadClick(report)}
                            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200 inline-flex items-center transition duration-200"
                            title="View and Download"
                          >
                            <FaEye className="mr-2" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleDownloadClick(report)}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 inline-flex items-center transition duration-200"
                            title="Download PDF"
                          >
                            <FaDownload className="mr-2" />
                            <span>Download</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Information Panel */}
        <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
          <div className="flex items-start">
            <div className="bg-indigo-100 rounded-full p-3 mr-4">
              <FaFilePdf className="text-indigo-700 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900 text-lg mb-1">About Your Health Reports</h3>
              <p className="text-indigo-700 text-sm mb-3">
                All your lab reports are securely stored and accessible anytime. You can view or download your reports for offline reference or to share with your healthcare provider.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link to="/graph" className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200">
                  View Analytics
                </Link>
                <button className="bg-white text-indigo-600 text-sm font-medium px-4 py-2 rounded-md border border-indigo-600 hover:bg-indigo-50 transition duration-200">
                  Health Tips
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewReport;
