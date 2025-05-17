import express from 'express';
import { addToCart, deleteFromCart, updateCartItem, fetchCartItems,clearUserCart } from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.post('/add', addToCart);
cartRouter.put('/update/:productId', updateCartItem);
cartRouter.delete('/delete/:userId/:productId', deleteFromCart);
cartRouter.delete('/clear/:userId', clearUserCart);
cartRouter.get('/fetch/:userId', fetchCartItems);

export default cartRouter;
