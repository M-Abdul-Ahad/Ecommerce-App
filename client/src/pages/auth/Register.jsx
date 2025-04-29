// src/pages/auth/Register.jsx

import { registerUser } from '@/store/authSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast'

const Register = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)).then((data)=>{
      if(data?.payload?.success){
        toast.success(data?.payload?.message)
        navigate('/auth/login')
      }else{
        toast.error(data?.payload?.message || 'error while registering user')
      }
     
    })
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white shadow-2xl rounded-xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Create your account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-semibold text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-md focus:ring-2 focus:ring-purple-500 focus:outline-none focus:border-purple-500 transition-all duration-300 hover:shadow-lg"
            placeholder="John Doe"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold text-gray-700">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-md focus:ring-2 focus:ring-purple-500 focus:outline-none focus:border-purple-500 transition-all duration-300 hover:shadow-lg"
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-md focus:ring-2 focus:ring-purple-500 focus:outline-none focus:border-purple-500 transition-all duration-300 hover:shadow-lg"
            placeholder="••••••••"
          />
        </div>

       
        <button
          type="submit"
          className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          Register
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600 text-center">
        Already have an account?{' '}
        <a href="/auth/login" className="text-purple-600 hover:underline font-medium">
          Sign in
        </a>
      </p>
    </div>
  );
};

export default Register;
