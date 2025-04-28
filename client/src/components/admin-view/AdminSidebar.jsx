// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <ul>
        <li className="mb-4">
          <Link to="/admin/dashboard" className="text-lg hover:text-gray-400">
            Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/products" className="text-lg hover:text-gray-400">
            Products
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/orders" className="text-lg hover:text-gray-400">
            Orders
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/customers" className="text-lg hover:text-gray-400">
            Customers
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/settings" className="text-lg hover:text-gray-400">
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
