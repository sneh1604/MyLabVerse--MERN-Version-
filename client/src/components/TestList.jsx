import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaBars, FaTachometerAlt, FaUsers, FaFileAlt, FaUserCircle, FaFlask, FaSearch, FaThList, FaTh, FaSort, FaFilter, FaToggleOn, FaToggleOff , FaArrowRight , FaCalendar , FaCogs, FaPlus } from 'react-icons/fa';

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
    const [viewMode, setViewMode] = useState('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [confirmModal, setConfirmModal] = useState({ show: false, testId: null, action: '' });
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

    const handleToggleStatus = (id, currentStatus) => {
        axios.patch(`http://localhost:4000/test-list/${id}`, {
            status: !currentStatus
        })
        .then(res => {
            setTests(tests.map(test => 
                test._id === id ? { ...test, status: !currentStatus } : test
            ));
            setConfirmModal({ show: false, testId: null, action: '' });
        })
        .catch(err => console.error('Failed to toggle test status:', err));
    };

    // Calculate statistics
    const stats = {
        total: tests.length,
        active: tests.filter(t => t.status).length,
        inactive: tests.filter(t => !t.status).length,
        avgCost: tests.reduce((acc, curr) => acc + Number(curr.cost), 0) / tests.length || 0
    };

    const filteredTests = tests
        .filter(test => 
            test.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterStatus === 'all' || 
            (filterStatus === 'active' && test.status) ||
            (filterStatus === 'inactive' && !test.status))
        )
        .sort((a, b) => {
            const modifier = sortDirection === 'asc' ? 1 : -1;
            return a[sortField] > b[sortField] ? modifier : -modifier;
        });

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
                <main className="flex-1 p-6">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-gray-500">Total Tests</h3>
                            <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-gray-500">Active Tests</h3>
                            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-gray-500">Inactive Tests</h3>
                            <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-gray-500">Average Cost</h3>
                            <p className="text-2xl font-bold text-blue-600">₹{stats.avgCost.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tests..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 rounded-lg border border-gray-300"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            {showForm ? 'Hide Form' : 'Add New Test'}
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                            >
                                <FaThList />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                            >
                                <FaTh />
                            </button>
                        </div>
                    </div>

                    {/* Add Test Form */}
                    {showForm && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    placeholder="Test Name"
                                    value={newTest.name}
                                    onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={newTest.description}
                                    onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400"
                                />
                                <input
                                    type="number"
                                    placeholder="Cost"
                                    value={newTest.cost}
                                    onChange={(e) => setNewTest({ ...newTest, cost: e.target.value })}
                                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400"
                                />
                            </div>
                            <button
                                onClick={handleAddTest}
                                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                Add Test
                            </button>
                        </div>
                    )}

                    {/* Test List */}
                    {viewMode === 'table' ? (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-800 text-white">
                                        <th className="px-6 py-3 text-left cursor-pointer" onClick={() => setSortField('name')}>
                                            Name {sortField === 'name' && <FaSort className="inline ml-1" />}
                                        </th>
                                        <th className="px-6 py-3 text-left">Description</th>
                                        <th className="px-6 py-3 text-left cursor-pointer" onClick={() => setSortField('cost')}>
                                            Cost {sortField === 'cost' && <FaSort className="inline ml-1" />}
                                        </th>
                                        <th className="px-6 py-3 text-left">Status</th>
                                        <th className="px-6 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTests.map(test => (
                                        <tr key={test._id} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">{test.name}</td>
                                            <td className="px-6 py-4">{test.description}</td>
                                            <td className="px-6 py-4">₹{test.cost}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                                        test.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {test.status ? 'Active' : 'Inactive'}
                                                    </span>
                                                    <button
                                                        onClick={() => setConfirmModal({ 
                                                            show: true, 
                                                            testId: test._id, 
                                                            action: test.status ? 'deactivate' : 'activate',
                                                            name: test.name,
                                                            currentStatus: test.status
                                                        })}
                                                        className="text-purple-600 hover:text-purple-800"
                                                    >
                                                        {test.status ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <FaTrash
                                                    className="text-red-500 hover:text-red-700 cursor-pointer transition-colors"
                                                    onClick={() => handleDeleteTest(test._id)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTests.map(test => (
                                <div key={test._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-semibold text-gray-800">{test.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setConfirmModal({ 
                                                    show: true, 
                                                    testId: test._id, 
                                                    action: test.status ? 'deactivate' : 'activate',
                                                    name: test.name,
                                                    currentStatus: test.status
                                                })}
                                                className="text-purple-600 hover:text-purple-800"
                                            >
                                                {test.status ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                                            </button>
                                            <FaTrash
                                                className="text-red-500 hover:text-red-700 cursor-pointer transition-colors"
                                                onClick={() => handleDeleteTest(test._id)}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mt-2">{test.description}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold text-purple-600">₹{test.cost}</span>
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            test.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {test.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
                {confirmModal.show && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">Confirm Status Change</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to {confirmModal.action} the test "{confirmModal.name}"?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    onClick={() => setConfirmModal({ show: false, testId: null, action: '' })}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    onClick={() => handleToggleStatus(confirmModal.testId, confirmModal.currentStatus)}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
