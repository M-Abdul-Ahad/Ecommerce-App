import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { fetchCartItmes, deleteFromCart, updateCartItem } from '../../store/cartSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';



const CartDrawer = ({ isOpen, onClose, userId }) => {
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const { cartItems, isLoading } = useSelector((state) => state.cart);
 
  useEffect(() => {
    if (isOpen && userId) {
      dispatch(fetchCartItmes({ userId }));
    }
  }, [isOpen, userId, dispatch]);

  const handleRemoveItem = (productId) => {
    try{
        dispatch(deleteFromCart({ userId, productId }));
        toast.success('Item removed')
    }catch(e){
        console.log(e)
        toast.error('Item not removed')
    }
  };

  const handleUpdateQuantity = async (productId, newQty) => {
  const quantity = Math.max(1, newQty);

  const item = cartItems.find((item) => item.productId?._id === productId);
  const totalStock = item?.productId?.totalStock ?? 0;

  if (quantity > totalStock) {
    toast.error(`Cannot add more than ${totalStock} items.`);
    return;
  }

  try {
    await dispatch(updateCartItem({ userId, productId, quantity })).unwrap();
  } catch (err) {
    console.error('[UI] Quantity update failed:', err);
    toast.error('Failed to update quantity');
  }
};



 const totalPrice = cartItems.reduce((total, item) => {
  const price = item.productId?.price || 0;
  const salePrice = item.productId?.salePrice || 0;
  const finalPrice = salePrice > 0 && salePrice < price ? salePrice : price;
  const quantity = item.quantity || 0;
  return total + finalPrice * quantity;
}, 0);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-40 cursor-pointer"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-lg z-50 flex flex-col">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-gray-600 cursor-pointer" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center mt-10">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>

          ) : cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-10">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
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
                      const finalPrice = salePrice > 0 && salePrice < price ? salePrice : price;
                      return `$${finalPrice} × ${item.quantity} = $${(finalPrice * item.quantity).toFixed(2)}`;
                    })()}
                  </p>
                </div>

                
                    <div className="flex items-center space-x-3">
                {/* Decrease Quantity Button (-1, Red) */}
                <button
                  onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
                  className="w-7 h-7 bg-red-600 text-white text-sm font-bold rounded hover:bg-red-700 transition flex items-center justify-center cursor-pointer"
                >
                  -1
                </button>

                <button
                  onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
                  className="w-7 h-7 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition flex items-center justify-center cursor-pointer"
                >
                  +1
                </button>

                <button
                    onClick={() => handleRemoveItem(item.productId._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium transition duration-200 ease-in-out cursor-pointer"
                >
                    Remove
                </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex justify-between mb-3 text-sm font-medium text-gray-700">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
          <button
            onClick={() => {
              onClose(); 
              navigate('/shop/checkout'); 
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition cursor-pointer"
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
