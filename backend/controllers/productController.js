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
    // If found in cache, return the cached data
    if (FeaturedProducts) {
        res.json(JSON.parse(FeaturedProducts));
    }
    // if not in redis, fetch from mongodb
    // .lean() is used to return plain JavaScript objects instead of Mongoose documents
    // which is more efficient for read operations for performance
    FeaturedProducts = await Product.find({ featured: true }).lean().sort({ createdAt: -1 });
    
    // If not found in cache, fetch from database
    if (!FeaturedProducts) {
        return next(new AppError("No featured products found", 404));
    }
    // Store in Redis cache for future access
    await redis.set("featured_products", JSON.stringify(FeaturedProducts));
    res.json(FeaturedProducts );
})
