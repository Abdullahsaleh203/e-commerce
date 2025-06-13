import asyncHandler from "../utils/asyncHandler";
import stripe from "../utils/stripe.js";
import AppError from "../utils/AppError.js";
import Coupon from "../models/CouponModel.js";
import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js";

export const createCheckoutSession = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError('User not authenticated', 401));
    }
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
            totalAmount -= Math.round(coupon.discountAmount * 100); // Convert to cents
        }
    }
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_products: await Promise.all(lineItems),
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
        discounts: coupon ? [
            {
            coupon: await createStripeCoupon(couponCode, coupon.discountAmount)
            }
        ] : [],
        metadata: {
            userId: req.user._id.toString(),
            couponCode: couponCode || "" ,
            products: JSON.stringify(products.map(product => ({
                userId: req.user._id.toString(),
                ProductId: product._id,
                quantity: product.quantity,
                price: product.price,
            }))),
        },
    });
    if (!session) {
        return next(new AppError('Failed to create Stripe session', 500));
    } 
    if (totalAmount <= 2000) {
        await createNewCoupon(req.user._id);
    }
    return res.status(200).json({ id: session.id, totalAmount: totalAmount / 100/100 });
});
async function createStripeCoupon(discountPercentage) {

        const coupon = await stripe.coupons.create({
            name: couponCode,
            percent_off: discountPercentage, 
            duration: 'once',
        });
        return coupon.id;

}
async function createNewCoupon(userId) {
     const newCoupon = await Coupon.create({
        code: "GIFT" + Math.random().toString(36).substring(2, 15).toUpperCase(),
         discountPercentage: 10,
         expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
         user: userId,
     });
    await newCoupon.save();
    return newCoupon;
}


export const checkoutSuccess = asyncHandler(async (req, res) => {
    const {sessionId} = req.body;
    // const sessionId = req.query.session_id;
    if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // Check if the session exists and has a payment status
    if (session.payment_status === 'paid') {
        // If the session has a coupon code, mark it as used
        if (session.metadata.couponCode) {
            await Coupon.findOneAndUpdate({
                code: session.metadata.couponCode,
                user: session.metadata.userId
            }, {
                isActive: false
            });
            // create a new order 
            const products = JSON.parse(session.metadata.products);
            const newOrder = {
                user: session.metadata.userId,
                products: products.map(product => ({
                    ProductId: product.ProductId,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: session.amount_total / 100, // Convert from cents to dollars
                stripeSessionId: sessionId
                // ,paymentStatus: session.payment_status,
                // paymentMethod: session.payment_method_types[0],
                // couponCode: session.metadata.couponCode || null,
            };
            await Order.create(newOrder);  
            res.status(200).json({
                message: "Order created successfully",
                orderId: newOrder._id
            });
        }
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

    }
});

