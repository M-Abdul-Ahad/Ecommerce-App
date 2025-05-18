import mongoose from "mongoose";
import { imageUploadUtil } from "../helpers/cloudinary.js";
import Product from "../models/Product.js";

export const handleImageUpload=async (req,res)=>{
    try{
        const b64=Buffer.from(req.file.buffer).toString('base64')
        const url="data:"+req.file.mimetype+";base64,"+b64
        const result=await imageUploadUtil(url)
        res.json({
            success:true,
            result
        })
    }catch(e){
        console.log('Error in uploading Image:',e)
        res.json({
            success:false
        })
    }
}

export const addProduct=async (req,res)=>{
    const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;
    try{
        const newProduct=new Product({
            image, title, description, category, brand, price, salePrice, totalStock
        })
        await newProduct.save()

        res.status(200).json({
            success: true,
            message: 'Product added Successfully!',
        });
    }catch(e){
        console.log('error in adding Product:',e)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;  
    console.log('Deleting product with id:', id);  // Log the id to check it
  
    try {
      
      const product = await Product.findByIdAndDelete(id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
  
      // If product is deleted successfully
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (e) {
      console.log('Error in deleting Product:', e); // Log the error
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  };
  

export const editProduct=async (req,res)=>{
    const {id}=req.params
    const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;
    try{ 
        const product = await Product.findById(id);
    
        // If product is not found, send an error response
        if (!product) {
          return res.status(404).json({
            success: false,
            message: 'Product not found',
          });
        }
    
        // Update the product fields with the new values
        product.image = image || product.image; // Update only if new value is provided
        product.title = title || product.title;
        product.description = description || product.description;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.price = price || product.price;
        product.salePrice = salePrice || product.salePrice;
        product.totalStock = totalStock || product.totalStock;
    
        // Save the updated product
        await product.save();
    
        // Send the updated product in the response
        res.status(200).json({
          success: true,
          message: 'Product updated successfully',
          product,
        });

    }catch(e){
        console.log('error in updating Product:',e)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const fetchAllProducts=async (req,res)=>{
    try{
        const products = await Product.find();  
        res.status(200).json({ success: true, products }); 
    }catch(e){
        console.log('error in fetching Products:',e)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

