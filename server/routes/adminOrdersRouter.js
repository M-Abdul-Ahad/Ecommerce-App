// routes/adminRoutes.js
import express from 'express';
import { getAllOrders,updateOrderStatus } from '../controllers/adminOrdersController.js';

const adminOrderRouter = express.Router();

// GET /api/admin/orders
adminOrderRouter.get('/get', getAllOrders);
adminOrderRouter.put('/update-status/:orderId',updateOrderStatus);

export default adminOrderRouter;
