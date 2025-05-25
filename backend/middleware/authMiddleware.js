import asyncHandler from "../utils/asyncHandler.js";
import appError from "../utils/appError.js";
// import { promisify } from 'util';
import User from "../model/UserModel.js"

// Middleware to protect routes that require authentication
export const protect = asyncHandler(async (req, res, next) => {
    let token;
    const accessToken = req.cookies.accessToken
    if (!accessToken) {
        return next(new appError('You are not logged in! Please log in to get access.', 401));
    }
    const decoded = await promisify(jwt.verify)(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
        return next(new appError('The user belonging to this token does not exist.', 401));
    }
    req.user = user 
    next();
});

// Middleware for restricting access based on user roles
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new appError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
