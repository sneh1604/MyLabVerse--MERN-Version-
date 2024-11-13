import React, { useEffect, useState, Fragment } from 'react';
import { FaDownload, FaUser, FaChevronDown, FaHome, FaChartBar, FaFileAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Menu, Transition } from '@headlessui/react';
import { ClipLoader } from 'react-spinners';

const ViewReport = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsLoggedIn(true);
      setUserName(user.name);
    }

    const fetchReports = async () => {
      try {
        const hemogramResponse = await axios.get('http://localhost:4000/hemogram-reports', { withCredentials: true });
        const lipidResponse = await axios.get('http://localhost:4000/lipid-report', { withCredentials: true });
        const bloodSugarResponse = await axios.get('http://localhost:4000/blood-sugar-report', { withCredentials: true });

        let combinedReports = [];

        if (!hemogramResponse.data.message) {
          combinedReports = hemogramResponse.data.map((report) => ({
            ...report,
            type: 'Hemogram',
            createdAt: new Date(report.created_at),
          }));
        }

        if (!lipidResponse.data.message) {
          combinedReports = [
            ...combinedReports,
            ...lipidResponse.data.map((report) => ({
              ...report,
              type: 'Lipid',
              createdAt: new Date(report.dateCreated),
            })),
          ];
        }

        if (!bloodSugarResponse.data.message) {
          combinedReports = [
            ...combinedReports,
            ...bloodSugarResponse.data.map((report) => ({
              ...report,
              type: 'BloodSugar',
              createdAt: new Date(report.dateCreated),
            })),
          ];
        }

        combinedReports.sort((a, b) => b.createdAt - a.createdAt);
        setReports(combinedReports);
      } catch (error) {
        setError('Failed to fetch reports');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownloadClick = (report) => {
    if (report.type === 'Hemogram') {
      navigate('/hemogram-reportpdf', { state: { report } });
    } else if (report.type === 'Lipid') {
      navigate('/lipid-report', { state: { report } });
    } else if (report.type === 'BloodSugar') {
      navigate('/bloodsugar_reportpdf', { state: { report } });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/login');
  };

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black" style={{ fontFamily: 'Satoshi' }}>
      {/* Header Section */}
      <header className="bg-[#6C5BD4] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Satoshi' }}>MyLabVerse</h1>
          <nav className="flex items-center space-x-6" style={{ fontFamily: 'Satoshi' }}>
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

      {/* Main Content */}
      <main className="container mx-auto my-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Your Test Reports</h2>

        {/* Loader or Reports Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color="#6C5BD4" loading={isLoading} size={50} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-lg border border-gray-300">
              <thead>
                <tr className="bg-[#6C5BD4] text-white">
                  <th className="py-3 px-6 border">Date</th>
                  <th className="py-3 px-6 border">Report Type</th>
                  <th className="py-3 px-6 border">File Name</th>
                  <th className="py-3 px-6 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={index} className="border-t hover:bg-gray-100 transition-colors duration-200">
                    <td className="py-3 px-6 border">{report.createdAt.toLocaleDateString()}</td>
                    <td className="py-3 px-6 border">{report.type}</td>
                    <td className="py-3 px-6 border">{report.type} Report {index + 1}</td>
                    <td className="py-3 px-6 border">
                      <button
                        onClick={() => handleDownloadClick(report)}
                        className="bg-[#6C5BD4] text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center transition-transform duration-150 transform hover:scale-105"
                      >
                        <FaDownload className="mr-2" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewReport;
