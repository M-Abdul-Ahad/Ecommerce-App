import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const initialState={
    isLoading:false,
    cartItems:[]
}

export const clearCartFromDB = createAsyncThunk(
  'cart/clearCartFromDB',
  async (userId) => {
    await axios.delete(`http://localhost:5000/api/shop/cart/clear/${userId}`);
    return userId;
  }
);


export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, productId, quantity }) => {
      const response = await axios.post('http://localhost:5000/api/shop/cart/add', {
        userId,
        productId,
        quantity,
      });
      return response.data;
    } 
);

export const fetchCartItmes= createAsyncThunk(
  'cart/fetchCartItems',
  async ({ userId }) => {
      const response = await axios.get(`http://localhost:5000/api/shop/cart/fetch/${userId}`);
      return response.data;
    } 
);

export const deleteFromCart= createAsyncThunk(
  'cart/deleteCartItem',
  async ({ userId,productId }) => {
      const response = await axios.delete(`http://localhost:5000/api/shop/cart/delete/${userId}/${productId}`)
      return response.data;
    } 
);


export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ userId, productId, quantity }) => {
    const response = await axios.put(`http://localhost:5000/api/shop/cart/update/${productId}`, {
      userId,
      productId,
      quantity
    });

    return response.data.cart.items;
  }
);


const cartSlice=createSlice({
    name:'cart',
    initialState,
    reducers:{
      clearCart: (state) => {
      state.cartItems = [];
    }
    },
    extraReducers: (builder) => {
  builder

    // Add to cart
    .addCase(addToCart.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(addToCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload.cart.items;
    })
    .addCase(addToCart.rejected, (state) => {
      state.isLoading = false;
    })

    // Fetch cart items
    .addCase(fetchCartItmes.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchCartItmes.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload.cartItems;
    })
    .addCase(fetchCartItmes.rejected, (state) => {
      state.isLoading = false;
    })

    // Delete from cart
    .addCase(deleteFromCart.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(deleteFromCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload.cart.items;
      
    })
    .addCase(deleteFromCart.rejected, (state) => {
      state.isLoading = false;
    })

    // Update cart item
    .addCase(updateCartItem.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(updateCartItem.fulfilled, (state, action) => {
      state.isLoading = false;

      state.cartItems = action.payload;
    })

    .addCase(updateCartItem.rejected, (state) => {
      state.isLoading = false;
    });
}

})

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer