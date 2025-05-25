import express from 'express';
const router = express.Router();
import { protect , restrictTo} from '../middleware/authMiddleware.js';
import { getAllProducts } from '../controllers/productController.js';


router.get('/products', protect, restrictTo('admin'), getAllProducts);


export default router;
