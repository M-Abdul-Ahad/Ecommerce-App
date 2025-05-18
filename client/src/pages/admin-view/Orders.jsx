import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../store/adminOrdersSlice.js';
import { fetchAllProducts } from '../../store/ProductSlice.js';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.adminOrders);
  const products = useSelector(state => state.adminProducts.productList);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editedStatuses, setEditedStatuses] = useState({});

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const getProductName = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? product.title : 'Unknown Product';
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const handleStatusChange = (orderId, value) => {
    setEditedStatuses(prev => ({ ...prev, [orderId]: value }));
  };

  const handleSave = (orderId) => {
    const newStatus = editedStatuses[orderId];
    if (newStatus) {
      dispatch(updateOrderStatus({ orderId, status: newStatus }))
        .then(() => {
          dispatch(fetchAllOrders());
          setEditedStatuses(prev => {
            const newState = { ...prev };
            delete newState[orderId];
            return newState;
          });
        })
        .catch(err => {
          console.error('Failed to update status', err);
        });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Orders</h2>

      {isLoading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : error ? (
        <p className="text-center text-red-600">Error: {error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 border">Order ID</th>
                <th className="px-4 py-3 border">Customer</th>
                <th className="px-4 py-3 border">Date</th>
                <th className="px-4 py-3 border">Total</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Payment</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const currentStatus = editedStatuses[order._id] ?? order.orderStatus;
                const statusChanged = currentStatus !== order.orderStatus;

                return (
                  <tr key={order._id} className="text-center text-sm">
                    <td className="px-4 py-2 border font-medium">{order.orderId}</td>
                    <td className="px-4 py-2 border">{order.userId?.name || 'N/A'}</td>
                    <td className="px-4 py-2 border">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border text-green-700 font-semibold">
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border">{order.paymentMethod}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition text-xs"
                      >
                        Details
                      </button>
                      <button
                        disabled={!statusChanged}
                        onClick={() => handleSave(order._id)}
                        className={`px-2 py-1 rounded text-xs transition ${
                          statusChanged
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Order Details</h3>
            <hr className="my-2" />

            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
              <p><strong>Customer:</strong> {selectedOrder.userId?.name || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              <p><strong>Total:</strong> ${selectedOrder.totalAmount?.toFixed(2)}</p>
              <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
              <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
            </div>

            <hr className="my-4" />

            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Shipping Address</h4>
              <div className="ml-2 text-sm text-gray-700 space-y-1">
                <p><strong>Address:</strong> {selectedOrder.addressInfo?.address}</p>
                <p><strong>City:</strong> {selectedOrder.addressInfo?.city}</p>
                <p><strong>Postal Code:</strong> {selectedOrder.addressInfo?.postalCode}</p>
                <p><strong>Country:</strong> {selectedOrder.addressInfo?.country}</p>
              </div>
            </div>

            <hr className="my-4" />

            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Ordered Items</h4>
              <div className="mt-4">
                <div className="flex font-semibold text-sm text-gray-800 border-b border-gray-300 pb-1 mb-2">
                  <div className="w-3/4">Title</div>
                  <div className="w-1/4 text-right">Quantity</div>
                </div>
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex text-sm text-gray-700 py-1 border-b border-gray-200">
                    <div className="w-3/4">{getProductName(item.productId)}</div>
                    <div className="w-1/4 text-right">{item.quantity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
