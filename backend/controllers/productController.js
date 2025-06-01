import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import Product from "../model/productModel.js";
// import { redis } from "../utils/redis.js";
import cloudinary from "../utils/cloudinary.js";
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

export const createProduct = asyncHandler(async (req, res, next) => { 
    const { name, price, description, image , category  } = req.body;
    // Validate required fields
    if (!name || !price || !description || !category) {
        return next(new AppError("Name, price, and description are required", 400));
    }
    let cloudinaryResponse = null;
    // Validate and upload image to Cloudinary if provided
    if (image) {
        try {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {
                folder: "products"
                // ,allowed_formats: ["jpg", "jpeg", "png"],
                // resource_type: "image"
            });
        } catch (error) {
            return next(new AppError("Image upload failed. Please try again.", 500));
        }
    }
    // Create new product
    const product = await Product.create({
        name,
        price,
        description,
        image : cloudinaryResponse ? cloudinaryResponse.secure_url : "",
        category
    });

    res.status(201).json(product);  
})
export const deleteProduct = asyncHandler(async (req, res, next) => { 
   const product = await Product.findById(req.params.id)
   if (!product) {
    return next(new AppError("Product not found", 404));
   }
   if (product.image) {
       const publicId = product.image.split("/").pop().split(".")[0]; // get the public id from the image url 
       await cloudinary.uploader.destroy(`product/${publicId}`); // delete the image from cloudinary
    }
    await product.deleteOne(); // delete the product from the database
    res.status(200).json({ message: "Product deleted successfully" });
})
export const getRecommendedProdouct = asyncHandler(async (req, res, next) => {
    const products = await Product.aggregate([
        {
            $sample: { size: 3 }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                price: 1,
                image: 1
            }
        }
    ])
    res.status(200).json(products);
})
