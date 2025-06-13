import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import Product from '../model/ProductModel.js';

export const getCartProducts = asyncHandler(async (req, res) => {
    if (!req.user.cartItems || req.user.cartItems.length === 0) {
        return res.json([]);
    }
    const productIds = req.user.cartItems.map(item => item.ProductId);
    const products = await Product.find({ _id: { $in: productIds } });
    // add quantity for each product
    const cartItems = products.map(product => {
        const item = req.user.cartItems.find(cartItem => cartItem.ProductId.toString() === product._id.toString());
        return { ...product.toJSON(), quantity: item.quantity }
    });
    res.json(cartItems);

})

export const addToCart = asyncHandler(async (req, res) => {
    const { ProductId } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find(item => item.ProductId.toString() === ProductId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        user.cartItems.push({ ProductId, quantity: 1 });
    }
    await user.save();
    res.status(201).json(user.cartItems);
})

export const removeAllFromCart = asyncHandler(async (req, res) => {
    const { ProductId } = req.body;
    const user = req.user;
    if (!ProductId) {
        user.cartItems = [];
    } else {
        user.cartItems = user.cartItems.filter(item => item.ProductId.toString() !== ProductId.toString());
    }
    await user.save();
    res.status(204).json(user.cartItems);
})

export const updateQuantity = asyncHandler(async (req, res, next) => {
    const { id: ProductId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find(item => item.ProductId.toString() === ProductId.toString());
    if (existingItem) {
        if (quantity === 0) {
            user.cartItems = user.cartItems.filter(item => item.ProductId.toString() !== ProductId.toString());
            await user.save();
            return res.json(user.cartItems);
        }
        existingItem.quantity = quantity;
        await user.save();
        res.json(user.cartItems);
    } else {
        return next(new AppError('Item not found in cart', 404));
    }
})


