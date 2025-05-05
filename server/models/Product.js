import mongoose from 'mongoose';

// Define the schema for the Product model
const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description:String,
    category: String,
    brand:String,
    price: Number,
    salePrice: Number,
    totalStock:Number
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Create the Product model based on the schema
const Product = mongoose.model('Product', ProductSchema);

// Export the Product model
export default Product;
