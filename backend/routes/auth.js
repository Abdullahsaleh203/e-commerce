import express from 'express';
// import { signup, login, logout, protect, restrictTo } from '../controllers/authController.js';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
// router.get('/logout', logout);

// Protected routes
// router.use(protect);

// Admin only routes
// router.use(restrictTo('admin'));

export default router;
