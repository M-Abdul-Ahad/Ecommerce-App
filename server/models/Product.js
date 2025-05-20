import mongoose from 'mongoose';

// Define the schema for the Product model
const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    reviews: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          name: String,
          rating: { type: Number, min: 1, max: 5 },
          comment: String,
          createdAt: { type: Date, default: Date.now }
        }
      ],
      default: [
        {
          name: 'Abdul Ahad',
          rating: 5,
          comment: 'Amazing product! Highly recommend.',
          createdAt: new Date()
        },
        {
          name: 'Basit Ali',
          rating: 4,
          comment: 'Very good quality, but a little expensive.',
          createdAt: new Date()
        }
      ]
    }
  },
  { timestamps: true }
);


const Product = mongoose.model('Product', ProductSchema);

export default Product;
