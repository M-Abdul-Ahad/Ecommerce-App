// src/pages/PageNotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
        <h2 className="text-3xl font-semibold text-gray-600">Page Not Found</h2>
        <p className="mt-4 text-lg text-gray-500">Sorry, the page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-300">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
