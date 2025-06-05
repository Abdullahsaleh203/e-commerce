import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";

export const getCoupons = asyncHandler(async (req, res) => {
    // Assuming you have a Coupon model to fetch coupons from the database
    const coupons = await Coupon.findOne({ userId: req.user._id, isActive: true }); // Replace with your actual model and query
    res.status(200).json(coupons);
});
