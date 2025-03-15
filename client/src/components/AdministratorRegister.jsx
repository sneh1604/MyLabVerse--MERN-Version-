import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

const AdministratorRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    position: ""
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Check if the user is logged in as an administrator
    const admin = JSON.parse(localStorage.getItem('administrator'));
    if (!admin) {
      // Instead of redirecting immediately, let's verify if this is the initial setup
      checkInitialSetup();
    } else {
      setLoading(false); // Admin is logged in
    }
  }, [navigate]);
  
  const checkInitialSetup = async () => {
    try {
      // Check if there are any administrators in the system
      const response = await axios.get('http://localhost:4000/check-admin-exists');
      
      if (response.data.exists) {
        // If admins exist, redirect to login since only existing admins can create new ones
        navigate('/administrator-login');
      } else {
        // No admins exist, allow initial setup
        setLoading(false);
      }
    } catch (err) {
      console.error("Error checking admin existence:", err);
      setLoading(false);
      // If there's an error, we'll allow the registration form to be shown
      // but display an error message
      setError("Could not verify administrator status. You may need to login first.");
    }
  };

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset notifications
    setError("");
    setStatus("");
    
    // Validate form
    if (!formData.name || !formData.email || !formData.password || !formData.position) {
      setError("All fields are required");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    try {
      let endpoint = 'http://localhost:4000/administrator/register';
      
      // If no admin exists, use the initial setup endpoint
      if (!(JSON.parse(localStorage.getItem('administrator')))) {
        endpoint = 'http://localhost:4000/initial-administrator-setup';
      }
      
      const response = await axios.post(endpoint, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contactNumber,
        position: formData.position
      });
      
      if (response.data.status === "Success") {
        setStatus("Administrator registered successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          contactNumber: "",
          position: ""
        });
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/administrator-login');
        }, 2000);
      } else {
        setError(response.data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Error during administrator registration:", err);
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12" style={{ fontFamily: 'Satoshi' }}>
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-indigo-900 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Register New Administrator</h2>
          <button 
            className="flex items-center text-white hover:text-indigo-200"
            onClick={() => navigate('/administrator-dashboard')}
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </button>
        </div>
        
        <div className="p-8">
          {status && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{status}</div>}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter password"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Confirm password"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactNumber">
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter contact number"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
                  Position
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter position (e.g., Lab Director)"
                />
              </div>
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Register Administrator
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdministratorRegister;
