// src/components/admin/AdminHeader.jsx
import React from 'react';

const AdminHeader = () => {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      
      <div className="flex items-center space-x-4">
        <button className="text-white hover:text-gray-400">Profile</button>
        <button className="text-white hover:text-gray-400">Logout</button>
      </div>
    </div>
  );
};

export default AdminHeader;
