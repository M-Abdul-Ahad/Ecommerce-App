import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const ShoppingLayout = () => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-white">
      <Header />
      <main className="flex-1 bg-gray-50 p-4 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default ShoppingLayout;
