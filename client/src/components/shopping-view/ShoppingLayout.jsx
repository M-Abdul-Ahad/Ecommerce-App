// src/components/Shopping/ShoppingLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';  // Import Header component

const ShoppingLayout = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Main content area where child components will render */}
      <main className="mt-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ShoppingLayout;
