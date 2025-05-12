import React from 'react';

const ProductDetailsDialog = ({ isOpen, onClose, product, onAddToCart }) => {
  if (!isOpen || !product) return null;

  // Dummy reviews
  const reviews = [
    { name: 'Abdul Ahad', rating: 5, comment: 'Amazing product! Highly recommend.' },
    { name: 'Basit Ali', rating: 4, comment: 'Very good quality, but a little expensive.' },
    { name: 'Alice Johnson', rating: 4.5, comment: 'Great value for the price. Would buy again!' },
  ];

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {'★'.repeat(fullStars)}
        {halfStar === 1 ? '½' : ''}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-[90vw] max-w-4xl relative p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left - Product Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src={product.image || 'https://via.placeholder.com/300'}
              alt={product.title}
              className="w-full max-w-md object-contain rounded-lg border shadow-md"
            />
          </div>

          {/* Right - Product Info */}
          <div className="md:w-1/2 text-gray-800 space-y-4">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <span>{product.title}</span>
              <span className="text-yellow-500">{renderStars(4)}</span> {/* Rating stars */}
            </h2>
            <p className="text-sm text-gray-600">{product.description}</p>

            <div className="space-y-2">
              {/* Category */}
              <div className="flex items-center space-x-2">
                <p className="font-semibold">Category:</p>
                <p>{product.category}</p>
              </div>

              {/* Brand */}
              <div className="flex items-center space-x-2">
                <p className="font-semibold">Brand:</p>
                <p>{product.brand}</p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-2">
                <p className="font-semibold">Price:</p>
                <p className="text-blue-600 font-semibold">${product.price}</p>
              </div>

              {/* Stock */}
              <div className="flex items-center space-x-2">
                <p className="font-semibold">Stock:</p>
                <p>{product.totalStock}</p>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
               onClick={() => onAddToCart(product)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>

            {/* Reviews Section */}
            <div className="mt-6 space-y-4 text-sm text-gray-600">
              <h3 className="font-semibold text-lg">Customer Reviews:</h3>
              {reviews.map((review, index) => (
                <div key={index} className="border-t pt-2">
                  <p className="font-semibold">{review.name}</p>
                  <div className="flex items-center text-yellow-500">
                    {renderStars(review.rating)}
                  </div>
                  <p className="mt-1">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsDialog;
