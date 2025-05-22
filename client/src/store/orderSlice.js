import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async ({ userId, addressInfo, items,totalAmount, orderStatus, orderId, paymentMethod, paymentStatus }) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/orders/create`, {
      userId,
      addressInfo,
      items,
      totalAmount,
      orderStatus,
      orderId,
      paymentMethod,
      paymentStatus,
    });
    return response.data;
  }
);

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (userId) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/orders/get/${userId}`);
    return response.data; // assuming this is an array of orders
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    currentOrder: null,
    userOrders: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.currentOrder = null;
      state.userOrders = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Order creation failed';
        console.error('Order create error:', action.error);
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Failed to fetch user orders';
        console.error('Fetch user orders error:', action.error);
      })
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
