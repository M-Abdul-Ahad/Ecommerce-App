import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './authSlice'
import ProductSlice from './ProductSlice'
import ShoppingProductSlice from './shoppingProductsSlice'
import cartReducer from './cartSlice'

const store =configureStore({
    reducer:{
        auth:AuthReducer,
        adminProducts:ProductSlice,
        shoppingProducts:ShoppingProductSlice,
        cart:cartReducer
    }
})

export default store