import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';

const AdminAccessButton = () => {
  return (
    <Link to="/administrator-login" className="fixed bottom-4 right-4 bg-indigo-800 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-110">
      <div className="flex items-center space-x-2">
        <FaUserShield size={20} />
      </div>
      <span className="sr-only">Administrator Access</span>
    </Link>
  );
};

export default AdminAccessButton;
