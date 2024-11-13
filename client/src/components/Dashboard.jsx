import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa";

export default function Dashboard() {
  const [success, setSuccess] = useState("");
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:4000/dashboard")
      .then((res) => {
        if (res.data === "Success") {
          setSuccess("Successfully Verified Admin");
          setUserName(res.data.userName); // Assuming the response includes userName
        } else {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  const handleLogout = () => {
    axios
      .post("http://localhost:4000/logout")
      .then((res) => {
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

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
        <header className="flex items-center justify-between p-4 bg-[#6C5BD4] text-white">
          <FaBars
            className="lg:hidden cursor-pointer text-2xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
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
        <main className="flex-grow p-4 bg-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Welcome to My Lab Verse - Admin Panel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dynamic Cards */}
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Tests</h3>
                <p className="text-gray-600">8</p>
              </div>
              <FaFileAlt className="text-gray-400 text-4xl" />
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Booked Appointment</h3>
                <p className="text-gray-600">8</p>
              </div>
              <FaCalendarCheck className="text-gray-400 text-4xl" />
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Pending Appointment</h3>
                <p className="text-gray-600">2</p>
              </div>
              <FaHourglassHalf className="text-gray-400 text-4xl" />
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Approved Appointment</h3>
                <p className="text-gray-600">2</p>
              </div>
              <FaThumbsUp className="text-gray-400 text-4xl" />
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Finished Test</h3>
                <p className="text-gray-600">3</p>
              </div>
              <FaFlask className="text-gray-400 text-4xl" />
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Registered Users</h3>
                <p className="text-gray-600">10</p>
              </div>
              <FaUsers className="text-gray-400 text-4xl" />
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Reports Generated</h3>
                <p className="text-gray-600">15</p>
              </div>
              <FaClipboardList className="text-gray-400 text-4xl" />
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Support Tickets</h3>
                <p className="text-gray-600">5</p>
              </div>
              <FaEnvelopeOpenText className="text-gray-400 text-4xl" />
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Analytics</h3>
                <p className="text-gray-600">View</p>
              </div>
              <FaChartPie className="text-gray-400 text-4xl" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
