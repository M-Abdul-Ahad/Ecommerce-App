import express from 'express'

import { fetchAllShoppingProducts } from '../controllers/shoppingProductsController.js'

const shoppingProductsRouter =express.Router()

shoppingProductsRouter.get('/fetch-all',fetchAllShoppingProducts)

export default shoppingProductsRouter