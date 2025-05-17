import Cart from '../models/Cart.js';
import mongoose from 'mongoose';

export const clearUserCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.deleteMany({ userId });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('[Clear Cart Error]', error);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};

export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (cart) {
            const existingItemIndex = cart.items.findIndex(item => item.productId.equals(productId));

            if (existingItemIndex > -1) {
                cart.items[existingItemIndex].quantity += quantity || 1;
            } else {
                cart.items.push({ productId, quantity: quantity || 1 });
            }

            await cart.save();
        } else {
            cart = new Cart({
                userId,
                items: [{ productId, quantity: quantity || 1 }]
            });
            await cart.save();
        }

        res.status(200).json({ success: true, cart });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


export const deleteFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        const updatedItems = cart.items.filter(item => !item.productId.equals(productId));

        if (updatedItems.length === cart.items.length) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        cart.items = updatedItems;
        await cart.save();

        res.status(200).json({ success: true, cart: { items: cart.items }, message:'Item removed from Cart' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


export const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.find(i => i.productId._id.equals(productId));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    res.status(200).json({ success: true, cart: { items: updatedCart.items } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const fetchCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ userId }).populate('items.productId');

        res.status(200).json({ success: true, cartItems: cart?.items || [] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


