import express from 'express';
const router = express.Router();
import { protect , restrictTo} from '../middleware/authMiddleware.js';
import { getAllProducts, getFeaturedProducts, createProduct, deleteProduct, getRecommendedProduct, getProductsByCategory, ToggleFeaturedProduct } from '../controllers/productController.js';


router.get('/', protect, restrictTo('admin'), getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/recommendations', getRecommendedProduct);
router.post('/', protect, restrictTo('admin'), createProduct);
router.patch('/:id', protect, restrictTo('admin'), ToggleFeaturedProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

export default router;
