import React, { useState } from "react";
import { FaBars, FaUserCircle, FaFileAlt, FaFlask, FaMicroscope, FaHeartbeat, FaXRay, FaClipboard, FaTint, FaVial, FaDna, FaTooth, FaProcedures, FaSun, FaTachometerAlt, FaUsers, FaSearch, FaClock, FaInfoCircle, FaArrowRight } from "react-icons/fa";
import { GiLiver, GiKidneys } from "react-icons/gi";
import { BsDropletHalf } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function MakeReport() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  const categories = [
    { id: "all", name: "All Tests" },
    { id: "blood", name: "Blood Tests", icon: <FaTint /> },
    { id: "diagnostic", name: "Diagnostic", icon: <FaMicroscope /> },
  ];

  const tests = [
    {
      name: "Haemogram Report",
      icon: <FaFlask className="text-yellow-600 text-4xl" />,
      route: "/hemogram-report",
      category: "blood",
      description: "Complete blood count analysis",
      duration: "30-45 mins",
      preparation: "8-12 hours fasting required",
      price: "₹500"
    },
    {
      name: "Lipid Profile",
      icon: <FaVial className="text-orange-600 text-4xl" />,
      route: "/lipid-profile",
      category: "blood",
      description: "Cholesterol and triglycerides test",
      duration: "45-60 mins",
      preparation: "12 hours fasting required",
      price: "₹800"
    },
    {
      name: "Blood Sugar Test",
      icon: <BsDropletHalf className="text-blue-600 text-4xl" />,
      route: "/blood-sugar-report",
      category: "blood",
      description: "Glucose level measurement",
      duration: "15-20 mins",
      preparation: "Fasting/PP as advised",
      price: "₹300"
    }
  ];

  const filteredTests = tests.filter(test => 
    (selectedCategory === "all" || test.category === selectedCategory) &&
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

      <div className="flex-1 flex flex-col">
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
        <main className="flex-grow p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Medical Tests</h2>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative flex-1 max-w-xl">
                <input
                  type="text"
                  placeholder="Search tests..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      selectedCategory === category.id
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category.icon}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        {test.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{test.name}</h3>
                        <p className="text-gray-600 text-sm">{test.description}</p>
                      </div>
                    </div>
                    <span className="text-purple-600 font-semibold">{test.price}</span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaClock className="mr-2" />
                      Duration: {test.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaInfoCircle className="mr-2" />
                      {test.preparation}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(test.route)}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Create Report
                    <FaArrowRight />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
