import Order from '../models/Order.js'; 

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      addressInfo,
      items,
      totalAmount,
      orderStatus,
      orderId,
      paymentMethod,
      paymentStatus,
    } = req.body;

    // Basic validation
    if (!userId || !addressInfo || !items?.length || !orderId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newOrder = new Order({
      userId,
      addressInfo:addressInfo.address,
      items,
      totalAmount,
      orderStatus,
      orderId,
      paymentMethod,
      paymentStatus,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder,
    });
  } catch (error) {
    console.error('[Order Creation Error]:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('[Get User Orders Error]:', error);
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
};
