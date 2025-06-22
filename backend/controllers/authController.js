import User from "../model/UserModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { redis } from "../utils/redis.js";
import { promisify } from "util";

dotenv.config();

//  Generate JWT token
const generateTokens = (userId) => {   
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    // Generate refresh token with longer expiry
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
    return { accessToken, refreshToken };
};
// Store refresh token in Redis 
const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refreshToken: ${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
}
// Function to set cookies
const cookieOptions = {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days for access token
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
};
const setCookie = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000 // 15 minutes for refresh token
    });
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
    const { accessToken, refreshToken } = generateTokens(user._id);
    // Store the refresh token in Redis or your preferred storage
    await storeRefreshToken(user._id, refreshToken);
    // Set the refresh token in the response cookie
    setCookie(res, accessToken, refreshToken);

    res.status(201).json({ message: "User created successfully", user: userObj });
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    // Store refresh token
    await storeRefreshToken(user._id, refreshToken);
    // Set cookies
    setCookie(res, accessToken, refreshToken);
    // Remove password from output
    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).json({
        status: 'success',
        data: {
            user: userObj
        }
    });
})


export const logout = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(200).json({ message: "Logged out successfully" });
    }
    // Remove refresh token from Redis
    if (refreshToken) {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        await redis.del(`refreshToken: ${decoded.userId}`);
    }
    // Clear cookies
    res.cookie('accessToken', '', {
        expires: new Date(0),
        httpOnly: true
    });
    res.cookie('refreshToken', '', {
        expires: new Date(0),
        httpOnly: true
    });
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });


    
})
// refreshToken
export const refreshToken = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return next(new AppError('No refresh token found. Please log in again.', 401));
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.userId;
    const storedToken = await redis.get(`refreshToken: ${userId}`);
    if (!storedToken || storedToken !== refreshToken) {
        return next(new AppError('Invalid refresh token. Please log in again.', 401));
    }
    const currentUser = await User.findById(userId);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.cookie('accessToken', accessToken, cookieOptions);
    res.status(200).json({
        message: 'Taken refreshed successfully',
        accessToken,
    });


})



// get profile
export const getProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.json(req.user)
    });



