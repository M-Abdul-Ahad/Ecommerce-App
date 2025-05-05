import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './authSlice'
import ProductSlice from './ProductSlice'

const store =configureStore({
    reducer:{
        auth:AuthReducer,
        adminProducts:ProductSlice
    }
})

export default store