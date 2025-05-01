import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

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

export { auth };
export default app;
