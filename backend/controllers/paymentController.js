import asyncHandler from "../utils/asyncHandler";
import stripe from "../utils/stripe.js";
import AppError from "../utils/AppError.js";
import Product from "../models/ProductModel.js";
import Coupon from "../models/CouponModel.js";

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
        line_items: await Promise.all(lineItems),
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
            products: JSON.stringify(products.map(item => ({
                // userId: req.user._id.toString(),
                ProductId: item._id,
                quantity: item.quantity,
                price: item.price,
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
