import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden group transition-transform duration-300 ease-in-out transform hover:scale-105">
      {/* Image */}
      <div className="relative h-64 w-full bg-gray-100">
      <img
        src={product.image || product.imageUrl}
        alt={product.title}
        className="object-cover w-full h-full"
        />

      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h3>
        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          <div className="flex space-x-2">
            {/* Edit Button */}
            <button
              onClick={() => onEdit(product)}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-200 cursor-pointer"
            >
              <PencilIcon className="h-5 w-5" />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(product._id)}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-200 cursor-pointer"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;
