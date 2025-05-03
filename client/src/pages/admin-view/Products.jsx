// Products.jsx or Products.tsx

import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import ImageUpload from '@/components/admin-view/ImageUpload';

const Products = () => {
  const [showSheet, setShowSheet] = useState(false);

  const toggleSheet = () => {
    setShowSheet(!showSheet);
  };

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Products</h2>
        <button
          onClick={toggleSheet}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Product
        </button>
      </div>
      <p className="text-lg text-gray-600">Add, edit, or remove products from your store.</p>

      {showSheet && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40 cursor-pointer"
          onClick={toggleSheet}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 w-full max-w-md bg-white shadow-xl h-full z-50 transform transition-transform duration-300 ${
          showSheet ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Add Product</h2>
          <button
            onClick={toggleSheet}
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <ImageUpload />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition"
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition"
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition"
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="books">Books</option>
              <option value="home">Home</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition"
            >
              <option value="">Select a brand</option>
              <option value="nike">Nike</option>
              <option value="apple">Apple</option>
              <option value="samsung">Samsung</option>
              <option value="sony">Sony</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition"
              placeholder="Enter original price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price ($)</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition"
              placeholder="Enter discounted price"
            />
          </div>

          {/* Total Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Stock</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition"
              placeholder="Enter total stock quantity"
            />
          </div>

          <div className="p-6 border-t bg-white sticky bottom-0 left-0 z-50">
            <button
              onClick={() => alert('Submit logic goes here')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center cursor-pointer transition"
            >
              Submit Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
