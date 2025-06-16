import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Coupon from "../model/CouponModel.js"; 

export const getCoupons = asyncHandler(async (req, res) => {
    // Assuming you have a Coupon model to fetch coupons from the database
    const coupons = await Coupon.findOne({ userId: req.user._id, isActive: true }); 
    res.status(200).json(coupons || null);
});

// Validate coupon code
export const validateCoupon = asyncHandler(async (req, res, next) => {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code, userId: req.user._id, isActive: true });
    if (coupon.expirationDate < new Date()) {
        coupon.isActive = false;
        await coupon.save();
        return next(new AppError('Invalid coupon code', 404));
    }
    res.json({
        massage: "Coupon is valid",
        code:coupon.code,
        discountPercentage:coupon.discountPercentage
    });
    next();
});


