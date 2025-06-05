import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getCoupons, validateCoupon } from "../controllers/copoutController.js";

const router = express.Router();

router.get('/', protect, getCoupons);
router.post('/validate', protect, validateCoupon);

export default router;
