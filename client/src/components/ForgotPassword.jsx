import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    // Email validation
    if (!email) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (!newPassword) {
      setError('New password is required');
      return false;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Password complexity check
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must contain at least one letter and one number');
      return false;
    }

    // Confirm password validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setStatus('');
      setIsSubmitting(true);

      if (!validateInputs()) {
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post('http://localhost:4000/forgot-password', {
        email: email.trim(),
        newPassword
      });

      if (response.data.status === "Success") {
        setStatus('Password reset successful! Redirecting to login...');
        // Clear form
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
        // Redirect after delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(errorMsg);
      console.error('Password reset error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">Enter your email and new password</p>
        </div>

        {status && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg text-center">
            {status}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                className="pl-10 w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <div className="mt-1 relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                required
                className="pl-10 w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Enter new password"
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="mt-1 relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                required
                className="pl-10 w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white p-2 rounded-lg transition-colors ${
              isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2"
          >
            <FaArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
