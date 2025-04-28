// src/components/admin/AdminLayout.jsx
import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader />

        {/* Content Section (will be populated with the page components) */}
        <div className="flex-1 p-6 bg-gray-100">
          {/* This is where the pages will be rendered */}
          <Outlet></Outlet>
          {/* The children will render here */}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
