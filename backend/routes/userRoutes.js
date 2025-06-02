import express from 'express';
import { signup, login, logout ,getProfile ,refreshToken} from '../controllers/authController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get('/logout', logout);

// Protected routes
router.use(protect);
router.get('/profile', protect, getProfile)
// Admin only routes
router.use('/admin', restrictTo('admin'));

export default router;
