import express from 'express'
import { upload } from '../helpers/cloudinary.js'
import { addProduct, deleteProduct, editProduct, fetchAllProducts, handleImageUpload,  } from '../controllers/productsController.js'

const productsRouter =express.Router()
productsRouter.post('/upload-image',upload.single("my_file"),handleImageUpload)
productsRouter.get('/fetch-all',fetchAllProducts)
productsRouter.post('/add',addProduct)
productsRouter.put('/edit/:id',editProduct)
productsRouter.delete('/delete/:id',deleteProduct)
export default productsRouter