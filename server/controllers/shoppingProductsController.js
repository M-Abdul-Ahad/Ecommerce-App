import Product from "../models/Product.js";
export const fetchAllShoppingProducts=async (req,res)=>{
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

export const updateStock = async (req, res) => {
  const { updates } = req.body; // [{ productId, quantity }]

  try {
    for (const { productId, quantity } of updates) {
      const product = await Product.findById(productId);
      if (!product) continue;

      product.totalStock = Math.max(0, product.totalStock - quantity); // prevent negative stock
      await product.save();
    }

    res.status(200).json({ message: 'Stock updated successfully' });
  } catch (err) {
    console.error('Stock update failed:', err);
    res.status(500).json({ error: 'Failed to update stock' });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).select('reviews');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product.reviews);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching reviews' });
  }
};

export const addReview = async (req, res) => {
  const { productId } = req.params;
  const { userId, name, rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newReview = {
      userId,
      name,
      rating,
      comment,
      createdAt: new Date(),
    };

    product.reviews.push(newReview);
    await product.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add review', error: error.message });
  }
};

