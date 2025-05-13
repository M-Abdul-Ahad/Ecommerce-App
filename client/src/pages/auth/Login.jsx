// src/pages/auth/Login.jsx

import { loginUser } from '@/store/authSlice';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const Login = () => {
  const dispatch=useDispatch()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((data)=>{
      if(data?.payload?.success){
        toast.success(data?.payload?.message)
      }else{
        toast.error(data?.payload?.message)
      }
    })
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white shadow-2xl rounded-xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Sign in to your account</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email address</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition-all duration-300 hover:shadow-lg"
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition-all duration-300 hover:shadow-lg"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          Sign In
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600 text-center">
        Don't have an account?{' '}
        <a href="/auth/register" className="text-blue-600 hover:underline font-medium">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
