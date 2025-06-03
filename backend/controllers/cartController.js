import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import Product from '../models/productModel.js';

export const addToCart = asyncHandler(async (req, res, next) => {
    const { ProductId } = req.body;
    const user = req.user;
    const existingItem = user.cart.find(item => item.ProductId.toString() === ProductId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        user.cart.push({ ProductId, quantity: 1 });
    }
    await user.save();
    res.status(201).json(user.cart);
})
export const removeAllFromCart = asyncHandler(async (req, res, next) => {
    const { ProductId } = req.body;
    const user = req.user;
    if (!ProductId) { 
        user.cart = [];
    } else {
        user.cart = user.cart.filter(item => item.ProductId.toString() !== ProductId);
    }
    await user.save();
    res.status(204).json(user.cart);
})
export const updateQuantity = asyncHandler(async (req, res, next) => {
    const { ProductId, quantity } = req.body;
    const user = req.user;
    const existingItem = user.cart.find(item => item.ProductId.toString() === ProductId);
    if (!existingItem) {
        return next(new AppError('Product not found in cart', 404));
    }
    existingItem.quantity = quantity;
    await user.save();
    res.status(200).json(user.cart);
})
export const getCartProducts = asyncHandler(async (req, res, next) => {
    const user = req.user;
    res.status(200).json(user.cart);
})











// const { productId, quantity } = req.body;

// // Validate required fields
// if (!productId || !quantity) {
//     return next(new AppError('Product ID and quantity are required', 400));
// }

// // Find the product by ID
// const product = await Product.findById(productId);
// if (!product) {
//     return next(new AppError('Product not found', 404));
// }

// // Add to cart logic (this could be a session, database, etc.)
// // For simplicity, we'll just return the product and quantity
// res.status(201).json({
//     status: 'success',
//     data: {
//         product,
//         quantity
//     }
// });
