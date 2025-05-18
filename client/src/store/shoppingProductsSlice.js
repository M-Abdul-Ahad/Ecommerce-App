import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from "axios";

const initialState={
    isLoading:false,
    productList:[]
}

export const fetchAllShoppingProducts=createAsyncThunk('products/fetchAllShoppingProducts',async ()=>{
    const result=await axios.get('http://localhost:5000/api/shop/products/fetch-all')
    return result?.data
})

export const updateProductStock = createAsyncThunk(
  'products/updateProductStock',
  async (updates) => {
    const result = await axios.post('http://localhost:5000/api/shop/products/update-stock', { updates });
    return result.data;
  }
);


const ShoppingProductSlice=createSlice({
    name:'shoppingProducts',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchAllShoppingProducts.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(fetchAllShoppingProducts.fulfilled,(state,action)=>{
            state.isLoading=false
            state.productList = action.payload?.products ?? []; 
        })
        .addCase(fetchAllShoppingProducts.rejected,(state)=>{
            state.isLoading=false
            state.productList=[]
        })

        .addCase(updateProductStock.pending, (state) => {
  state.isLoading = true;
})
.addCase(updateProductStock.fulfilled, (state, action) => {
  state.isLoading = false;

  // Simplified stock update
  const updates = action.meta.arg;
  for (const { productId, quantity } of updates) {
    const product = state.productList.find(p => p._id === productId);
    if (product) {
      product.totalStock -= quantity;
    }
  }
})
.addCase(updateProductStock.rejected, (state) => {
  state.isLoading = false;
});
        
    }
})

export default ShoppingProductSlice.reducer