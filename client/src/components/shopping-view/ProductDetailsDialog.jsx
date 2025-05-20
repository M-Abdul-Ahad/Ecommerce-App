import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, addReview } from '../../store/shoppingProductsSlice';

const ProductDetailsDialog = ({ isOpen, onClose, product, onAddToCart }) => {
  if (!isOpen || !product) return null;

  const dispatch = useDispatch();
  const reviews = useSelector(
    (state) => state.shoppingProducts.reviewsByProductId[product?._id] || []
  );

  const [reviewData, setReviewData] = useState({
    name: '',
    rating: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && product?._id) {
      dispatch(fetchReviews(product._id));
    }
  }, [isOpen, product?._id, dispatch]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return (
      <>
        {'★'.repeat(fullStars)}
        {halfStar ? '½' : ''}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

 const userAlreadyReviewed = reviewData.name && reviews.some(r => r.name.toLowerCase() === reviewData.name.toLowerCase());

  const handleSubmitReview = async () => {
    const { name, rating, comment } = reviewData;
    if (!name || !rating || !comment) return;

    // Prevent duplicate review by same user name
    if (userAlreadyReviewed) {
      alert("You have already submitted a review for this product.");
      setReviewData({ name: '', rating: '', comment: '' });
      return;
    }

    try {
      setSubmitting(true);
      await dispatch(addReview({
        productId: product._id,
        review: {
          name,
          rating: Number(rating),
          comment
        }
      }));
      await dispatch(fetchReviews(product._id));
      setReviewData({ name: '', rating: '', comment: '' });
    } catch (error) {
      console.error('Review submission failed:', error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-[90vw] max-w-4xl relative p-6 flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-1 right-1 text-gray-500 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>

        <div className="md:w-1/2 flex justify-center">
          <img
            src={product.image || 'https://via.placeholder.com/300'}
            alt={product.title}
            className="w-full max-w-md object-contain rounded-lg border shadow-md max-h-[75vh]"
          />
        </div>

        <div className="md:w-1/2 overflow-y-auto pr-2 text-gray-800 space-y-4 max-h-[75vh]">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <span>{product.title}</span>
            <span className="text-yellow-500">{renderStars(4)}</span>
          </h2>
          <p className="text-sm text-gray-600">{product.description}</p>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <p className="font-semibold">Category:</p>
              <p>{product.category}</p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="font-semibold">Brand:</p>
              <p>{product.brand}</p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="font-semibold">Price:</p>
              <p className="text-blue-600 font-semibold">${product.price}</p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="font-semibold">Stock:</p>
              <p>{product.totalStock}</p>
            </div>
          </div>

          {product.totalStock === 0 ? (
            <button
              disabled
              className="w-full text-center bg-red-100 text-red-500 py-1 rounded cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              className="w-full text-center bg-gray-200 hover:bg-gray-300 py-1 rounded transition cursor-pointer"
            >
              Add to Cart
            </button>
          )}

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

            <hr className="my-4 border-gray-300" />

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Write a Review:</h3>
              <div>
                <label className="block text-sm font-medium">Your Name</label>
                <input
                  type="text"
                  value={reviewData.name}
                  onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:border-blue-400"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Rating</label>
                <select
                  value={reviewData.rating}
                  onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:border-blue-400"
                >
                  <option value="">Select rating</option>
                  <option value="5">★★★★★</option>
                  <option value="4">★★★★☆</option>
                  <option value="3">★★★☆☆</option>
                  <option value="2">★★☆☆☆</option>
                  <option value="1">★☆☆☆☆</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Comment</label>
                <textarea
                  rows="3"
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:border-blue-400"
                  placeholder="Write your review here..."
                ></textarea>
              </div>
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsDialog;
