import asyncHandler from "../utils/asyncHandler";
import stripe from "../utils/stripe.js";
import AppError from "../utils/AppError.js";
import Product from "../models/ProductModel.js";

export const createCheckoutSession = asyncHandler(async (req, res, next) => {
    
    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "No products provided" });
    }
    let totalAmount = 0;
    const lineItems = products.map(async product => {
        const amount = Math.round(product.price * 100); // stripe expects amounts in cents
        totalAmount += amount * product.quantity;
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.name,
                    images: [product.image],
                },
                unit_amount: amount,
            },
            quantity: product.quantity,
        };
    });
    let coupon = null;
    if (couponCode) {
        coupon = await Coupon.findOne({
            code: couponCode, user: req.user._id, isActive: true
        });
        if(coupon) {
            totalAmount -= coupon.discountAmount * 100; // Convert to cents
        }

        

    }

    // create checkout session
    // const { cartItems } = req.user;
    // if (!cartItems || cartItems.length === 0) {
    //     return res.status(400).json({ message: "Cart is empty" });
    // }
    // const lineItems = cartItems.map(item => ({
    //     price_data: {
    //         currency: 'usd',
    //         product_data: {
    //             name: item.name,
    //             images: [item.image],
    //         },
    //         unit_amount: item.price * 100, // Convert to cents
    //     },
    //     quantity: item.quantity,
    // }));

    // const session = await stripe.checkout.sessions.create({
    //     payment_method_types: ['card'],
    //     line_items: lineItems,
    //     mode: 'payment',
    //     success_url: `${req.protocol}://${req.get('host')}/success`,
    //     cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
    //     discounts: req.user.coupon ? [{
    //         coupon: req.user.coupon,
    //     }] : [],
    //     metadata: {
    //         userId: req.user._id.toString(),
    //         cartItems: JSON.stringify(cartItems.map(item => ({
    //             ProductId: item.ProductId,
    //             quantity: item.quantity
    //         }))),
    //     },



    res.json({ id: session.id });
});
