import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, isAuthorizedDomain } from '../config/firebase';
import axios from 'axios';
import { FaGoogle } from 'react-icons/fa';

const GoogleLoginButton = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      
      // Check if current domain is authorized
      if (!isAuthorizedDomain()) {
        console.warn('Current domain not authorized in Firebase. Authentication may fail.');
        // We continue anyway as the Firebase console check is more authoritative
      }
      
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
        navigate(response.data.role === 'admin' ? "/dashboard" : "/userdashboard");
      }
    } catch (error) {
      console.error('Google login error:', error);
      
      // Handle specific Firebase authentication errors
      if (error.code === 'auth/unauthorized-domain') {
        setError("This website domain is not authorized for authentication. Please contact the administrator.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError("Login cancelled. Please try again.");
      } else {
        setError(error.response?.data?.error || error.message || "Google login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className={`w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
          loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-50'
        }`}
      >
        <FaGoogle className="text-red-500" />
        <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
      </button>
    </div>
  );
};

export default GoogleLoginButton;
