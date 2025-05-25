import React from 'react';
import { ShieldCheckIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { logoutUser,resetTokenAndCredentials } from '@/store/authSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  function logout(){
     // dispatch(logoutUser());
        dispatch(resetTokenAndCredentials())
        sessionStorage.clear()
        navigate('/auth/login')
  }
  return (
    <header className="w-full bg-gray-900 shadow-lg p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center space-x-3 text-white">
        <ShoppingBagIcon className="h-8 w-8 text-blue-400" />
        <h1 className="text-2xl font-bold">
          SHOPEASE
          <span className="text-sm font-semibold bg-blue-600 text-white py-1 px-2 ml-2 rounded-full">Admin</span>
        </h1>
      </div>

      <button onClick={logout} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center cursor-pointer">
        <ShieldCheckIcon className="h-5 w-5 mr-2" />
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;
