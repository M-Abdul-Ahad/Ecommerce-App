// src/components/Shopping/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          ShopEase
        </Link>

        <nav className="space-x-6">
          <Link to="/" className="hover:text-gray-400">Home</Link>
          <Link to="/products" className="hover:text-gray-400">Products</Link>
          <Link to="/cart" className="hover:text-gray-400">Cart</Link>
          <Link to="/profile" className="hover:text-gray-400">Profile</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
