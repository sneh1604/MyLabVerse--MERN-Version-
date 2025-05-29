/**
 * This file provides the base URL for API calls based on the environment
 */

// Return the appropriate API URL based on the environment
const getApiBaseUrl = () => {
  // If we are in a production environment (Vercel)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://mylabverse-backend.onrender.com';
  }
  
  // Default to localhost for development
  return 'http://localhost:4000';
};

export const API_BASE_URL = getApiBaseUrl();
