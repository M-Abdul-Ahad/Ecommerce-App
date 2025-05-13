import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress,updateAddress } from '../../store/addressSlice'; 
import toast from 'react-hot-toast';

const AddressForm = ({ onSubmit, initialData = {} }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);

  const [form, setForm] = useState({
    address: initialData.address.address || '',
    city: initialData.address.city || '',
    postalCode: initialData.address.postalCode || '',
    country: initialData.address.country || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (initialData.address) {
      // Dispatch the updateAddress action if the address already exists
      await dispatch(updateAddress({ userId, ...form })).then((data) => {
        if (data?.payload?.success) {
          toast.success('Address Updated Successfully');
        } else {
          toast.error(data?.payload?.message);
        }
      });
    } else {
      // Dispatch the addAddress action if no address exists
      await dispatch(addAddress({ userId, ...form })).then((data) => {
        if (data?.payload?.success) {
          toast.success('Address Added Successfully');
        } else {
          toast.error(data?.payload?.message);
        }
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-6"
    >
      {/* Form Heading */}
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
        {initialData.address ? 'Update Your Address' : 'Enter Your Address'}
      </h2>

      {/* Address Form Fields */}
      {['address', 'city', 'postalCode', 'country'].map((field) => (
        <div key={field}>
          <label
            htmlFor={field}
            className="block text-gray-700 font-medium mb-1 capitalize"
          >
            {field === 'postalCode' ? 'Postal Code' : field}
          </label>
          <input
            type="text"
            name={field}
            id={field}
            value={form[field]}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder={`Enter ${field === 'postalCode' ? 'postal code' : field}`}
            required
          />
        </div>
      ))}

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          {initialData.address ? 'Update Address' : 'Save Address'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
