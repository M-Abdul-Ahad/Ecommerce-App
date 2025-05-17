import express from 'express';
import { createOrder,getUserOrders } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/create', createOrder);
orderRouter.get('/get/:userId', getUserOrders);

export default orderRouter;
