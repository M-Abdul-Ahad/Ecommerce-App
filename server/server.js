import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import router from './routes/authRouter.js'
import productsRouter from './routes/productsRouter.js'
import shoppingProductsRouter from './routes/shoppingProductsRouter.js'
import cartRouter from './routes/cartRouter.js'

mongoose.connect('mongodb+srv://ecommerce:ecommerce@ecommerce-cluster.lh4q4w9.mongodb.net/')
.then(console.log('MongoDB Connected Successfully'))
.catch((err)=>{console.log('error in connecting Database',err)})
const app=express()
const port=process.env.PORT || 5000;
app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:[
        "Content-Type",
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma'
    ],
    credentials:true
}));
app.use(cookieParser())
app.use(express.json());
app.use('/api/auth',router)
app.use('/api/admin/products',productsRouter)
app.use('/api/shop/products',shoppingProductsRouter)
app.use('/api/shop/cart',cartRouter)
app.listen(port,()=>{
    console.log(`Server is running on port:${port}`)
})
