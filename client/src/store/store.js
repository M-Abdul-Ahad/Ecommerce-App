import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './authSlice'
import ProductSlice from './ProductSlice'
import ShoppingProductSlice from './shoppingProductsSlice'
import cartReducer from './cartSlice'
import addressReducer from './addressSlice'
import orderReducer from './orderSlice'

const store =configureStore({
    reducer:{
        auth:AuthReducer,
        adminProducts:ProductSlice,
        shoppingProducts:ShoppingProductSlice,
        cart:cartReducer,
        address:addressReducer,
        order:orderReducer
    }
})

export default store