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
