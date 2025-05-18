import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from "axios";

const initialState={
    isLoading:false,
    productList:[]
}

export const addProduct=createAsyncThunk('products/addProduct',async (formdata)=>{
    const result=await axios.post('http://localhost:5000/api/admin/products/add',formdata,
        {headers:{'Content-Type':'application/json'}})
    return result?.data
})

export const fetchAllProducts=createAsyncThunk('products/fetchAllProducts',async ()=>{
    const result=await axios.get('http://localhost:5000/api/admin/products/fetch-all')
    return result?.data
})

export const editProduct=createAsyncThunk('products/editProduct',async ({id,formdata})=>{
    const result=await axios.put(`http://localhost:5000/api/admin/products/edit/${id}`,formdata,
        {headers:{'Content-Type':'application/json'}})
    return result?.data
})



export const deleteProduct=createAsyncThunk('products/deleteProduct',async (id)=>{
    const result=await axios.delete(`http://localhost:5000/api/admin/products/delete/${id}`)
    return result?.data
})

const ProductSlice=createSlice({
    name:'adminProducts',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchAllProducts.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(fetchAllProducts.fulfilled,(state,action)=>{
            
            state.isLoading=false
            state.productList = action.payload?.products ?? []; 
        })
        .addCase(fetchAllProducts.rejected,(state)=>{
            state.isLoading=false
            state.productList=[]
        })
        .addCase(editProduct.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(editProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            
        })
        .addCase(editProduct.rejected, (state) => {
            state.isLoading = false;
        })
        .addCase(deleteProduct.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deleteProduct.fulfilled, (state, action) => {
            state.isLoading = false;
           
        })
        .addCase(deleteProduct.rejected, (state) => {
            state.isLoading = false;
        })
        

        
    }
})

export default ProductSlice.reducer