import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
  return (
   <div className="flex min-h-screen w-full">
  <AdminSidebar />
  <div className="flex flex-col flex-1 ml-0 overflow-y-auto h-screen">
    <AdminHeader />
    <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
      <Outlet />
    </main>
  </div>
</div>

  );
};

export default AdminLayout;  