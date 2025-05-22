import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const addAddress = createAsyncThunk(
  'address/addAddress',
  async ({ userId, address, city, postalCode, country }) => {
    console.log('sending add request to backend')
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/address/add`, {
      userId,
      address,
      city,
      postalCode,
      country,
    });
    console.log('after server response',response.data)
    return response.data;
  }
);
export const fetchAddress = createAsyncThunk(
  'address/fetchAddress',
  async (userId) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/address/fetch/${userId}`);
    return response.data;
  }
);

export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async ({ userId, address, city, postalCode, country }) => {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/shop/address/update`, {
      userId,
      address,
      city,
      postalCode,
      country,
    });
    return response.data;
  }
);
export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async ({ userId }) => {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/shop/address/delete`, {
      userId
    });
    return response.data;
  }
);

const initialState = {
  address: null,
  loading: false,
  error: null,
  success: false
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    resetAddressState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
        state.success = true;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
        state.success = true;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state) => {
        state.loading = false;
        state.address = null;
        state.success = true;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { resetAddressState } = addressSlice.actions;
export default addressSlice.reducer;
