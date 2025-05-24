const express = require('express');
const router = express.Router();

// router.post('/add', authMiddleware, async (req, res) => {
//     const { productId, quantity } = req.body;
//     const user = await User.findById(req.userId);
//     user.cart.push({ product: productId, quantity });
//     await user.save();
//     res.json(user.cart);
//   });
