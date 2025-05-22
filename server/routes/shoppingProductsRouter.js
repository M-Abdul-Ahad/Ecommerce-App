import express from 'express'

import { fetchAllShoppingProducts,updateStock,getProductReviews,addReview,deleteReviewByName } from '../controllers/shoppingProductsController.js'

const shoppingProductsRouter =express.Router()

shoppingProductsRouter.get('/fetch-all',fetchAllShoppingProducts)
shoppingProductsRouter.post('/update-stock',updateStock)
shoppingProductsRouter.get('/:productId/reviews',getProductReviews)
shoppingProductsRouter.post('/:productId/add-review',addReview)
shoppingProductsRouter.delete('/delete-review',deleteReviewByName)

export default shoppingProductsRouter