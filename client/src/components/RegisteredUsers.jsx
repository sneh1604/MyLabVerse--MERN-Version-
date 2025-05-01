import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTachometerAlt, FaUsers, FaFileAlt, FaUserCircle, FaFlask, FaSearch, FaThList, FaTh , FaSort, FaFilter, FaToggleOn, FaToggleOff , FaArrowRight , FaCalendar , FaCogs } from "react-icons/fa";

export default function RegisteredUsers() {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table"); // table or grid
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://localhost:4000/registered-users").then((res) => {
      if (res.data) {
        setUsers(res.data);
      } else {
        navigate("/login");
      }
    }).catch(err => console.log(err));
  }, [navigate]);

  const handleLogout = () => {
    axios.post("http://localhost:4000/logout").then((res) => {
      navigate("/login");
    }).catch(err => console.log(err));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
                    onClick={() => navigate("/staff-appointments")}
                  >
                    <FaCalendar className="mr-3" /> Appointments
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
        <header className="flex items-center justify-between p-4 bg-gradient-to-r from-[#6C5BD4] to-[#8677E9] text-white shadow-lg">
          <FaBars className="lg:hidden cursor-pointer text-2xl hover:text-purple-200 transition-colors" onClick={() => setSidebarOpen(!sidebarOpen)} />
          <h2 className="text-lg font-semibold">Registered Users</h2>
          <div className="relative">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <FaUserCircle className="text-2xl" />
              <span>{userName}</span>
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <div className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/profile")}>Profile</div>
                <div className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-grow p-6 bg-transparent">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Registered Users List</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg ${viewMode === "table" ? "bg-purple-500 text-white" : "bg-gray-200"}`}
                >
                  <FaThList />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-purple-500 text-white" : "bg-gray-200"}`}
                >
                  <FaTh />
                </button>
              </div>
            </div>
          </div>

          {viewMode === "table" ? (
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-6 border-b">{user.name}</td>
                      <td className="py-3 px-6 border-b">{user.email}</td>
                      <td className="py-3 px-6 border-b">
                        <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div key={user._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FaUserCircle className="text-2xl text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
