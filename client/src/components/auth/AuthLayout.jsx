import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex w-full">
      {/* Left Section (Optional illustration or marketing info) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-tr from-blue-500 to-purple-600 justify-center items-center">
        <div className="text-white text-center px-8">
          <h1 className="text-4xl font-extrabold mb-4">Welcome to ShopEase!</h1>
          <p className="text-lg">
            Your one-stop shop for all your needs. Fast, easy, and secure.
          </p>
        </div>
      </div>

      {/* Right Section (Form Area) */}
      <div className="flex-1 flex justify-center items-center bg-gray-50 py-12 lg:py-0">
        <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-xl">
          {/* Outlet will render the login/register pages inside */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
