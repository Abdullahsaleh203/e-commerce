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
            totalAmount -= Math.round(coupon.discountAmount * 100); // Convert to cents
        }
    }
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: await Promise.all(lineItems),
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/success`,
        cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
        discounts: coupon ? [
            {
            coupon: await createStripeCoupon(couponCode, coupon.discountAmount)
            }
        ] : [],
        metadata: {
            userId: req.user._id.toString(),
            products: JSON.stringify(products.map(item => ({
                ProductId: item.ProductId,
                quantity: item.quantity
            }))),
        },
    });
    if (!session) {
        return next(new AppError('Failed to create Stripe session', 500));
    } 
    res.json({ id: session.id });
});
async function createStripeCoupon(couponCode, discountPercentage) {
    try {
        const coupon = await stripe.coupons.create({
            name: couponCode,
            percent_off: discountPercentage, // Convert to cents
            currency: 'usd',
            duration: 'once',
        });
        return coupon;
    } catch (error) {
        throw new AppError('Failed to create Stripe coupon', 500);
    }
}
async function createNewCoupon(couponCode, discountAmount) {
     const coupon = await Coupon.create({
        code: "GIFT" +Math.random().toString(36).substring(2, 15).toUpperCase(),
         discountPercentage: 10,
         expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        user: req.user._id,
    });
    await coupon.save();
    return coupon;
}
