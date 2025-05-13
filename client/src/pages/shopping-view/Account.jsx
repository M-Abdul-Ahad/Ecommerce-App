// src/pages/Account.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import AddressForm from '@/components/shopping-view/AddressForm';
import { fetchAddress } from '@/store/addressSlice';

const Account = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const address = useSelector((state) => state.address.address);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAddress(user.id));
    }
  }, [dispatch, user?.id]);

  const handleAddressSubmit = (data) => {
    console.log('Submitted address:', data);
    setShowAddressForm(false);
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
          onClick={() => setShowAddressForm(true)}
          className={`px-6 py-3 font-semibold rounded-xl shadow transition duration-300 
            ${showAddressForm
              ? 'bg-blue-800 text-white ring-2 ring-blue-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          {address ? 'Update Address' : 'Add Address'}
        </button>

        <Link
          to="/account/orders"
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow hover:bg-green-700 transition duration-300"
        >
          Orders
        </Link>
      </div>

      {/* Address Form */}
      {showAddressForm && (
        <div className="mt-6">
          <AddressForm
            onSubmit={handleAddressSubmit}
            initialData={address || {}}
            isUpdate={!!address}
          />
        </div>
      )}
    </div>
  );
};

export default Account;
