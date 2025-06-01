import express from 'express';
const router = express.Router();
import { protect , restrictTo} from '../middleware/authMiddleware.js';
import { getAllProducts, getFeaturedProducts ,createProduct, deleteProduct} from '../controllers/productController.js';


router.get('/', protect, restrictTo('admin'), getAllProducts);
router.get('/featured-products', getFeaturedProducts);
router.post('/', protect, restrictTo('admin'), createProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

export default router;
