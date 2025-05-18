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

