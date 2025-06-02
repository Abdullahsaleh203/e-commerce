const express = require('express');
import { protect } from '../middleware/authMiddleware.js';
import { addToCart, removeAllFromCart, updateQuantity, getCartProducts } from '../controllers/cartController.js';

const router = express.Router();

router.route('/')
    .get(protect, getCartProducts) 
    .post(protect, addToCart)
    .delete(protect, removeAllFromCart);

router.put('/:id', protect, updateQuantity);

export default router;


