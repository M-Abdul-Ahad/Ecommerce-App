import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from "axios";

const initialState={
    isLoading:false,
    productList:[],
    reviewsByProductId: {}
}

export const fetchReviews = createAsyncThunk(
  'products/fetchReviews',
  async (productId) => {
    const res = await axios.get(`http://localhost:5000/api/shop/products/${productId}/reviews`);
    return { productId, reviews: res.data };
  }
);

export const addReview = createAsyncThunk(
  'products/addReview',
  async ({ productId, review }) => {
    const res = await axios.post(`http://localhost:5000/api/shop/products/${productId}/add-review`, review);
    return { productId, review: res.data };
  }
);

export const deleteReviewByName = createAsyncThunk(
  'products/deleteReviewByName',
  async ({ productId, name, comment, createdAt }) => {
    await axios.delete('http://localhost:5000/api/shop/products/delete-review', {
      data: { productId, name, comment, createdAt }
    });
    return { productId, name, comment, createdAt };
  }
);



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
        })

        .addCase(fetchReviews.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(fetchReviews.fulfilled, (state, action) => {
            state.isLoading = false;
            const { productId, reviews } = action.payload;
            state.reviewsByProductId[productId] = reviews;
          })
          .addCase(fetchReviews.rejected, (state) => {
            state.isLoading = false;
          })

          .addCase(addReview.fulfilled, (state, action) => {
          const { productId, review } = action.payload;
          if (!state.reviewsByProductId[productId]) {
            state.reviewsByProductId[productId] = [];
          }
          state.reviewsByProductId[productId].push(review);
        })

        .addCase(deleteReviewByName.fulfilled, (state, action) => {
          const { productId, name, comment, createdAt } = action.payload;
          const list = state.reviewsByProductId[productId] || [];

          state.reviewsByProductId[productId] = list.filter(
            r =>
              !(r.name === name && r.comment === comment && new Date(r.createdAt).getTime() === new Date(createdAt).getTime())
          );
        })
        
    }
})

export default ShoppingProductSlice.reducer