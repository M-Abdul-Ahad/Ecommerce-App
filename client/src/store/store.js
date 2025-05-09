import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './authSlice'
import ProductSlice from './ProductSlice'
import ShoppingProductSlice from './shoppingProductsSlice'

const store =configureStore({
    reducer:{
        auth:AuthReducer,
        adminProducts:ProductSlice,
        shoppingProducts:ShoppingProductSlice
    }
})

export default store