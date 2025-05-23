import User from "../model/UserModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import appError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { redis } from "../utils/redis.js";

dotenv.config() ;
// Function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
const storeRefreshToken = async (userId, refreshToken) => {
    // Store the refresh token in Redis or your preferred storage
    // For example, using Redis:
    await redis.set(userId, refreshToken);
}
export const signup = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ username, email, password });
    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;
    // authenticate

    // Generate token
    const { accessToken, refreshToken } = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    // Set the refresh token in the response cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'strict', // CSRF protection
    });
    res.status(201).json({ message: "User created successfully", user: userObj });
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError('Please provide email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new appError('Incorrect email or password', 401));
    }
    // If the password is correct, generate a token
    // const token = user.createToken();
    res.status(200).json({
        status: 'success',
        // token,
        data: {
            user
        }
    });

})
