import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCxV_v0EbrPu978KUe1esAbfEyyQZ17Q0E",
  authDomain: "mylabverse-b1b06.firebaseapp.com",
  projectId: "mylabverse-b1b06",
  storageBucket: "mylabverse-b1b06.firebasestorage.app",
  messagingSenderId: "190498287539",
  appId: "1:190498287539:web:0ca84d0ec1598e675125c6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistent auth state
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

// If in development mode and using localhost, you can optionally use the Firebase auth emulator
if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
  // Uncomment the line below to connect to a local Firebase Auth emulator if you're using one
  // connectAuthEmulator(auth, 'http://localhost:9099');
  console.log('Running in development mode - consider using Firebase Auth Emulator for local testing');
}

// Export a helper function to check if the current domain is authorized
export const isAuthorizedDomain = () => {
  const currentDomain = window.location.hostname;
  // Add your authorized domains here
  const authorizedDomains = ['localhost', '127.0.0.1', 'mylabverse-b1b06.firebaseapp.com', 'mylabverse.vercel.app'];
  
  return authorizedDomains.includes(currentDomain);
};

export { auth };
export default app;
