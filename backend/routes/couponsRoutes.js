import express from "express";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get('/', protect, (req, res) => {
    res.send("Get all coupons");
});

export default router;
