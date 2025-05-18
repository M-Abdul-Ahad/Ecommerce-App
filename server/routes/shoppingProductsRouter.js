import express from 'express'

import { fetchAllShoppingProducts,updateStock } from '../controllers/shoppingProductsController.js'

const shoppingProductsRouter =express.Router()

shoppingProductsRouter.get('/fetch-all',fetchAllShoppingProducts)
shoppingProductsRouter.post('/update-stock',updateStock)

export default shoppingProductsRouter