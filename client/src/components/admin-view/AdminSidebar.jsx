import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardDocumentListIcon, ShoppingBagIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button 
        className="lg:hidden p-4 text-white bg-gray-900" 
        onClick={toggleSidebar}
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 w-64 bg-gray-900 text-white p-6 min-h-screen transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:translate-x-0 lg:static lg:block`}>
        <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>
        <div className="space-y-8">
          <Link to="/admin/dashboard" className="flex items-center text-lg font-semibold hover:text-blue-400">
            <ClipboardDocumentListIcon className="h-6 w-6 mr-3" />
            Dashboard
          </Link>
          <Link to="/admin/products" className="flex items-center text-lg font-semibold hover:text-blue-400">
            <ShoppingBagIcon className="h-6 w-6 mr-3" />
            Products
          </Link>
          <Link to="/admin/orders" className="flex items-center text-lg font-semibold hover:text-blue-400">
            <UsersIcon className="h-6 w-6 mr-3" />
            Orders
          </Link>
        </div>
      </aside>

      {/* Overlay (optional for mobile to close when clicked outside) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default AdminSidebar;
