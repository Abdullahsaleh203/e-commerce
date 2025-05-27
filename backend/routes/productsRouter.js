import express from 'express';
const router = express.Router();
import { protect , restrictTo} from '../middleware/authMiddleware.js';
import { getAllProducts, getFeaturedProducts } from '../controllers/productController.js';


router.get('/products', protect, restrictTo('admin'), getAllProducts);
router.get('/featured-products', getFeaturedProducts);

export default router;
