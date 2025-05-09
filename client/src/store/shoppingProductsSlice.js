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
        
    }
})

export default ShoppingProductSlice.reducer