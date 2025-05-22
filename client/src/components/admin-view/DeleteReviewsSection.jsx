import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchReviews,
  deleteReviewByName,
  fetchAllShoppingProducts // <-- new thunk we'll define
} from '../../store/shoppingProductsSlice';

const DeleteReviewsSection = () => {
  const dispatch = useDispatch();
  const { productList, reviewsByProductId, isLoading } = useSelector((state) => state.shoppingProducts);

  const [searchTitle, setSearchTitle] = useState('');
  const [productId, setProductId] = useState(null);
  const [error, setError] = useState(null);
  const [deletingKey, setDeletingKey] = useState(null);

   useEffect(() => {
    dispatch(fetchAllShoppingProducts());
  }, [dispatch]);

  const handleSearch = async () => {
    setError(null);
    setProductId(null);

    const trimmedTitle = searchTitle.trim().toLowerCase();
    if (!trimmedTitle) {
      setError('Please enter a product title');
      return;
    }

    const product = productList.find(
      (p) => p.title.toLowerCase() === trimmedTitle
    );

    if (!product) {
      setError('Product not found');
      return;
    }

    setProductId(product._id);
    dispatch(fetchReviews(product._id));
  };

  const handleDelete = async (review) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    const key = `${review.name}-${review.comment}`;
    setDeletingKey(key);
    await dispatch(
      deleteReviewByName({
        productId,
        name: review.name,
        comment: review.comment,
        createdAt: review.createdAt,
      })
    );
    setDeletingKey(null);
  };

  const reviews = productId ? reviewsByProductId[productId] || [] : [];

  return (
    <div className="bg-white p-6 rounded shadow mt-10 max-w-4xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Manage Reviews</h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter product title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="border px-3 py-2 rounded flex-grow"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Fetch Reviews'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!isLoading && productId && reviews.length === 0 && (
        <p>No reviews found for this product.</p>
      )}

      {reviews.length > 0 && (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">User</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Comment</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => {
              const key = `${review.name}-${review.comment}`;
              return (
                <tr key={index}>
                  <td className="border p-2">{review.name || 'Anonymous'}</td>
                  <td className="border p-2">{review.rating}</td>
                  <td className="border p-2">{review.comment}</td>
                  <td className="border p-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(review)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                      disabled={deletingKey === key}
                    >
                      {deletingKey === key ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeleteReviewsSection;
