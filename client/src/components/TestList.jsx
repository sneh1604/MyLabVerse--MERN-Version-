import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaBars, FaTachometerAlt, FaUsers, FaFileAlt, FaUserCircle ,FaFlask} from 'react-icons/fa';

export default function TestList() {
    const [tests, setTests] = useState([]);
    const [newTest, setNewTest] = useState({
        name: '',
        description: '',
        cost: '',
        status: true,
        delete_flag: false
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:4000/test-list')
            .then(res => setTests(res.data))
            .catch(err => console.error('Failed to fetch test list:', err));
    }, []);

    const handleAddTest = () => {
        axios.post('http://localhost:4000/test-list', newTest)
            .then(res => {
                setTests([...tests, res.data]);
                setNewTest({ name: '', description: '', cost: '', status: true, delete_flag: false });
            })
            .catch(err => console.error('Failed to add test:', err));
    };

    const handleDeleteTest = (id) => {
        axios.delete(`http://localhost:4000/test-list/${id}`)
            .then(() => setTests(tests.filter(test => test._id !== id)))
            .catch(err => console.error('Failed to delete test:', err));
    };

    const handleLogout = () => {
        axios.post("http://localhost:4000/logout").then(() => {
            navigate("/login");
        }).catch(err => console.log(err));
    };

    return (
        <div className="flex min-h-screen bg-gray-100" style={{ fontFamily: 'Satoshi' }}>
            {/* Sidebar */}
            <aside className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
                <div className="flex items-center justify-between px-4">
                    <h1 className="text-2xl font-bold">MyLabVerse</h1>
                    <FaBars className="lg:hidden cursor-pointer text-2xl" onClick={() => setSidebarOpen(!sidebarOpen)} />
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
            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between p-4 bg-[#6C5BD4] text-white">
                    <div className="flex items-center space-x-4">
                        <FaBars className="lg:hidden cursor-pointer text-2xl" onClick={() => setSidebarOpen(!sidebarOpen)} />
                        <h2 className="text-lg font-semibold">TestLists</h2>
                    </div>
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
                <main className="flex-1 p-4">
                    <div className="mb-4 flex items-center space-x-4">
                        <input type="text" placeholder="Name" value={newTest.name} onChange={(e) => setNewTest({ ...newTest, name: e.target.value })} className="border p-2 rounded" />
                        <input type="text" placeholder="Description" value={newTest.description} onChange={(e) => setNewTest({ ...newTest, description: e.target.value })} className="border p-2 rounded" />
                        <input type="number" placeholder="Cost" value={newTest.cost} onChange={(e) => setNewTest({ ...newTest, cost: e.target.value })} className="border p-2 rounded" />
                        <button onClick={handleAddTest} className="bg-[#6C5BD4] text-white px-4 py-2 rounded">Add Test</button>
                    </div>

                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Description</th>
                                <th className="px-4 py-2 text-left">Cost</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tests.map(test => (
                                <tr key={test._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{test.name}</td>
                                    <td className="px-4 py-2">{test.description}</td>
                                    <td className="px-4 py-2">{test.cost}</td>
                                    <td className="px-4 py-2">{test.status ? 'Active' : 'Inactive'}</td>
                                    <td className="px-4 py-2">
                                        <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteTest(test._id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </div>
        </div>
    );
}
