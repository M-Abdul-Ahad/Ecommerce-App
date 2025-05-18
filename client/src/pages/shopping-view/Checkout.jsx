import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddressForm from '@/components/shopping-view/AddressForm';
import toast from 'react-hot-toast';
import { fetchAddress } from '../../store/addressSlice';
import { fetchCartItmes, deleteFromCart, updateCartItem } from '../../store/cartSlice';
import { createOrder } from '../../store/orderSlice'; // ✅ Import thunk
import { clearCart,clearCartFromDB } from '../../store/cartSlice';
import { updateProductStock } from '../../store/shoppingProductsSlice';


const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  const address = useSelector((state) => state.address.address);
  const { cartItems, isLoading } = useSelector((state) => state.cart);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItmes({ userId }));
      dispatch(fetchAddress(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (address) {
      setShowAddressForm(true);
    }
  }, [address]);

  const handleRemoveItem = (productId) => {
    try {
      dispatch(deleteFromCart({ userId, productId }));
      toast.success('Item removed');
    } catch (e) {
      console.log(e);
      toast.error('Item not removed');
    }
  };

  const handleUpdateQuantity = async (productId, newQty) => {
    const quantity = Math.max(1, newQty);
    try {
      await dispatch(updateCartItem({ userId, productId, quantity })).unwrap();
    } catch (err) {
      console.error('[UI] Quantity update failed:', err);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.productId?.price || 0;
    const salePrice = item.productId?.salePrice || 0;
    const finalPrice = salePrice > 0 && salePrice < price ? salePrice : price;
    const quantity = item.quantity || 0;
    return total + finalPrice * quantity;
  }, 0);

  const handleAddressSubmit = (data) => {
    console.log('Submitted address:', data);
    setShowAddressForm(false);
  };

  // ✅ Handle create order
 const handleCreateOrder = async () => {
  if (!address || cartItems.length === 0) {
    toast.error('Address and cart must be present');
    return;
  }

  const orderPayload = {
    userId,
    addressInfo: { address: address.address },
    items: cartItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    })),
    totalAmount: totalPrice,
    orderStatus: 'Pending',
    orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    paymentMethod: 'COD',
    paymentStatus: 'Paid',
  };

  try {
    await dispatch(createOrder(orderPayload)).unwrap();

    // ✅ Reduce stock
    const stockUpdates = cartItems.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));
    await dispatch(updateProductStock(stockUpdates)).unwrap();

    await dispatch(clearCartFromDB(userId)).unwrap();
    dispatch(clearCart());

    toast.success('Order created!');
  } catch (err) {
    console.error(err);
    toast.error('Failed to create order');
  }
};


  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
     <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6">

        {/* Left: Address Form */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Shipping Address</h2>
          {showAddressForm && (
            <AddressForm
              onSubmit={handleAddressSubmit}
              initialData={address || {}}
              isUpdate={!!address}
            />
          )}
        </div>

        {/* Middle: Vertical Separator */}
        <div className="hidden md:flex justify-center">
          <div className="w-px bg-gray-300 h-full" />
        </div>

        {/* Right: Cart Items */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Cart Items</h2>
          {isLoading ? (
            <div className="flex justify-center items-center mt-10">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-10">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex space-x-4 border-b pb-4">
                  <img
                    src={item.productId?.image}
                    alt={item.productId?.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.productId?.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-gray-700">
                      {(() => {
                        const price = item.productId?.price || 0;
                        const salePrice = item.productId?.salePrice || 0;
                        const finalPrice =
                          salePrice > 0 && salePrice < price ? salePrice : price;
                        return `$${finalPrice} × ${item.quantity} = $${(
                          finalPrice * item.quantity
                        ).toFixed(2)}`;
                      })()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.productId._id, item.quantity - 1)
                      }
                      className="w-7 h-7 bg-red-600 text-white text-sm font-bold rounded hover:bg-red-700 transition"
                    >
                      -1
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.productId._id, item.quantity + 1)
                      }
                      className="w-7 h-7 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.productId._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-4 text-sm font-medium text-gray-700 border-t">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCreateOrder} // ✅ Hooked to thunk dispatch
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition cursor-pointer"
              >
                Create Order
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
