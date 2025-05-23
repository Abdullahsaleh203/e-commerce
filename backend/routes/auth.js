import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';
import { protect, restrictTo, refreshToken } from '../controllers/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get('/logout', logout);

// Protected routes
router.use(protect);

// Admin only routes
router.use('/admin', restrictTo('admin'));

export default router;
