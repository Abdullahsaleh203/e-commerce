import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import Product from "../model/productModel.js";
// 
export const getAllProducts = asyncHandler(async (req, res, next) => { 
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json({ products }) 
})
 

export const getFeaturedProducts =  asyncHandler(async (req, res, next) => { 
    let FeaturedProducts = await redis.get("featured_products");
    if (!FeaturedProducts){
        return res.status(404).json({massage:"No featured products found"})
    }
    
})
