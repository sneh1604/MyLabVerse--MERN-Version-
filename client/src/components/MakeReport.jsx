import React from "react";
import { FaBars, FaUserCircle, FaFileAlt, FaFlask, FaMicroscope, FaHeartbeat, FaXRay, FaClipboard, FaTint, FaVial, FaDna, FaTooth, FaProcedures, FaSun,FaTachometerAlt ,FaUsers} from "react-icons/fa";
import { GiLiver, GiKidneys } from "react-icons/gi";
import { BsDropletHalf } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

export default function MakeReport() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const navigate = useNavigate();

  const tests = [
    { name: "CT Scan", icon: <FaProcedures className="text-blue-600 text-4xl" />, route: "/ct-scan" },
    { name: "Electrocardiogram (ECG)", icon: <FaHeartbeat className="text-red-600 text-4xl" />, route: "/ecg" },
    { name: "Magnetic Resonance Imaging (MRI) Scan", icon: <FaFileAlt className="text-green-600 text-4xl" />, route: "/mri-scan" },
    { name: "X-Rays", icon: <FaXRay className="text-gray-600 text-4xl" />, route: "/x-rays" },
    { name: "Ultrasound", icon: <FaTint className="text-pink-600 text-4xl" />, route: "/ultrasound" }, // Changed the icon here
    { name: "Full Body Checkup", icon: <FaClipboard className="text-purple-600 text-4xl" />, route: "/full-body-checkup" },
    { name: "Haemogram Report", icon: <FaFlask className="text-yellow-600 text-4xl" />, route: "/hemogram-report" },
    { name: "Lipid Profile", icon: <FaVial className="text-orange-600 text-4xl" />, route: "/lipid-profile" },
    { name: "Blood Sugar Test", icon: <BsDropletHalf className="text-blue-600 text-4xl" />, route: "/blood-sugar-report" },
    { name: "Thyroid Function Test", icon: <FaDna className="text-teal-600 text-4xl" />, route: "/thyroid-function-test" },
    { name: "Vitamin D Test", icon: <FaSun className="text-yellow-500 text-4xl" />, route: "/vitamin-d-test" },
    { name: "Kidney Function Test", icon: <GiKidneys className="text-blue-800 text-4xl" />, route: "/kidney-function-test" },
    { name: "Liver Function Test", icon: <GiLiver className="text-red-700 text-4xl" />, route: "/liver-function-test" },
    { name: "Urine Analysis", icon: <FaMicroscope className="text-green-600 text-4xl" />, route: "/urine-analysis" },
    { name: "Pap Smear", icon: <FaTooth className="text-pink-400 text-4xl" />, route: "/pap-smear" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100" style={{ fontFamily: 'Satoshi' }}>
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
            <li className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/dashboard")}>
              <FaTachometerAlt className="mr-3" /> Dashboard
            </li>
            <li className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/registered-users")}>
              <FaUsers className="mr-3" /> Registered Users
            </li>
            <li className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/test-list")}>
              <FaFileAlt className="mr-3" /> TestLists
            </li>
            <li
              className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate("/make-report")}
            >
              <FaFlask className="mr-3" /> Make Report
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col" style={{ fontFamily: 'Satoshi' }}>
        <header className="flex items-center justify-between p-4 bg-[#6C5BD4] text-white">
          <FaBars
            className="lg:hidden cursor-pointer text-2xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <h2 className="text-lg font-semibold">Make Report</h2>
          <div className="relative">
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaUserCircle className="text-2xl" />
              <span>Admin</span>
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
                  onClick={() => navigate("/login")}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </header>
        <main className="flex-grow p-4 bg-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Available Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test, index) => (
              <div
                key={index}
                onClick={() => navigate(test.route)}
                className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition duration-200 ease-in-out"
              >
                {test.icon}
                <h3 className="text-lg font-semibold mt-4">{test.name}</h3>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
