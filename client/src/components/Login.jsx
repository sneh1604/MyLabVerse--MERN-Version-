import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import axios from 'axios';
import loginImage from './../assets/22.png';
import { FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      
      // Input validation
      if (!email || !password) {
        setError("All fields are required");
        return;
      }

      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }

      if (!validatePassword(password)) {
        setError("Password must be at least 6 characters long");
        return;
      }

      setStatus("Logging in...");
      
      const response = await axios.post('http://localhost:4000/login', { 
        email, 
        password 
      });

      if (response.data.Status === "Success") {
        const userData = {
          email: response.data.email,
          name: response.data.name,
          role: response.data.role,
          userTokenID: response.data.userTokenID
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setStatus("Login successful!");
        navigate(response.data.role === 'admin' ? "/dashboard" : "/userdashboard");
      } else {
        setError(response.data.message || "Login failed!");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || "Error in Login!");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setStatus("Logging in with Google...");
      
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      const response = await axios.post(
        'http://localhost:4000/api/auth/google',
        {},
        {
          headers: { 
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.Status === "Success") {
        const userData = {
          email: response.data.email,
          name: response.data.name,
          role: response.data.role,
          userTokenID: response.data.userTokenID
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setStatus("Login successful!");
        navigate(response.data.role === 'admin' ? "/dashboard" : "/userdashboard");
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.response?.data?.error || error.message || "Google login failed");
    }
  };

  // Add this function at the top of your component for testing
  const testAuth = async () => {
    try {
      // Test traditional login
      console.log("Testing traditional login...");
      const traditionalLogin = await axios.post('http://localhost:4000/login', {
        email: "test@test.com",
        password: "test123"
      });
      console.log("Traditional login response:", traditionalLogin.data);

      // Test Google login
      console.log("Testing Google authentication...");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      console.log("Google auth successful, testing backend...");
      const googleLogin = await axios.post('http://localhost:4000/api/auth/google', {}, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      console.log("Google login response:", googleLogin.data);

    } catch (error) {
      console.error("Auth test failed:", error);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-900 to-purple-800' style={{ fontFamily: 'Satoshi' }} >
      <div className='flex w-4/5 max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden'>
        {/* Left Side Image */}
        <div className='hidden lg:flex w-1/2 h-auto justify-center items-center'>
          <img 
            src={loginImage} 
            alt="Login" 
            className='object-cover max-w-[750px] max-h-[750px] p-4'
          />
        </div>

        {/* Right Side Form */}
        <div className='w-full lg:w-1/2 flex justify-center items-center flex-col p-8'>
          <div className="my-5 w-full text-center">
            {status && <div className='text-center text-green-600 py-1 animate-fade-in'>{status}</div>}
            {error && <div className='text-center text-red-600 py-1 animate-fade-in'>{error}</div>}
          </div>
          <h1 className='font-bold text-4xl pb-4 text-blue-900'>Welcome Back</h1>
          <p className='text-gray-600 pb-4'>Please sign in to continue</p>
          
          <form onSubmit={handleSubmit} className='w-full px-8 space-y-6'>
            <div className='relative'>
              <label className='text-sm font-medium text-gray-700 mb-1 block'>Email</label>
              <div className='relative'>
                <FaEnvelope className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type='email'
                  placeholder='Enter your email'
                  className='pl-10 w-full border-2 border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-blue-500 transition-colors'
                />
              </div>
            </div>

            <div className='relative'>
              <label className='text-sm font-medium text-gray-700 mb-1 block'>Password</label>
              <div className='relative'>
                <FaLock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type='password'
                  placeholder='Enter your password'
                  className='pl-10 w-full border-2 border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-blue-500 transition-colors'
                />
              </div>
            </div>

            <button 
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2'
            >
              <span>Sign In</span>
            </button>
          </form>

          <div className="relative w-full px-8 my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="w-full px-8">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FaGoogle className="text-red-500" />
              <span>Sign in with Google</span>
            </button>

            <p className='text-center text-gray-600 mt-6'>Don't have an account?</p>
            <Link to="/register">
              <button className='w-full mt-2 border-2 border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200'>
                Create Account
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
