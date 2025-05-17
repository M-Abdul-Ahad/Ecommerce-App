import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddressForm from '@/components/shopping-view/AddressForm';
import { fetchAddress } from '@/store/addressSlice';
import { fetchUserOrders } from '@/store/orderSlice';


const Account = () => {
  const [userOrders, setUserOrders] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const address = useSelector((state) => state.address.address);
  const [view, setView] = useState('none');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAddress(user.id));
    }
  }, [dispatch, user?.id]);

  const handleAddressSubmit = (data) => {
    console.log('Submitted address:', data);
    setView('none');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Banner */}
      <div className="mb-8 w-full">
        <img
          src="/banners/account-banner.jpg"
          alt="Account Banner"
          className="w-full h-80 object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Welcome Message */}
      <div className="mb-6">
        <hr className="border-t-2 border-gray-300" />
        <p className="text-xl font-bold text-gray-800 text-center py-4">
          Welcome back, {user ? user.name : 'Guest'}! We’re glad to see you.
        </p>
        <hr className="border-t-2 border-gray-300" />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-6 mb-8">
        <button
          onClick={() => setView('address')}
          className={`px-6 py-3 font-semibold rounded-xl shadow transition duration-300 cursor-pointer
            ${view === 'address'
              ? 'bg-blue-800 text-white ring-2 ring-blue-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          {address ? 'Update Address' : 'Add Address'}
        </button>

        <button
          onClick={async () => {
            setView('orders');
            if (user?.id) {
              try {
                const resultAction = await dispatch(fetchUserOrders(user.id));
                const orders = resultAction.payload;
                setUserOrders(orders);
              } catch (err) {
                console.error('Failed to fetch user orders:', err);
              }
            }
          }}

          className={`px-6 py-3 font-semibold rounded-xl shadow transition duration-300 cursor-pointer
            ${view === 'orders'
              ? 'bg-green-800 text-white ring-2 ring-green-300'
              : 'bg-green-600 text-white hover:bg-green-700'
            }`}
        >
          Orders
        </button>
      </div>

      {/* Address Form */}
      {view === 'address' && (
        <div className="mt-6">
          <AddressForm
            onSubmit={handleAddressSubmit}
            initialData={address || {}}
            isUpdate={!!address}
          />
        </div>
      )}

      {/* Orders Table */}
      {view === 'orders' && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full table-auto border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-6 py-3 border">Order ID</th>
                <th className="px-6 py-3 border">Date</th>
                <th className="px-6 py-3 border">Total</th>
                <th className="px-6 py-3 border">Status</th>
                <th className="px-6 py-3 border">Payment</th>
              </tr>
            </thead>
           <tbody>
            {userOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              userOrders.map((order) => (
                <tr key={order.orderId} className="text-center text-sm">
                  <td className="px-6 py-3 border font-medium">{order.orderId}</td>
                  <td className="px-6 py-3 border">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3 border text-green-700 font-semibold">${order.totalAmount?.toFixed(2) || 0}</td>
                  <td className={`px-6 py-3 border font-semibold ${
                    order.orderStatus === 'Delivered' ? 'text-green-600' :
                    order.orderStatus === 'Cancelled' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {order.orderStatus}
                  </td>
                  <td className="px-6 py-3 border">{order.paymentMethod}</td>
                </tr>
              ))
            )}
          </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default Account;
