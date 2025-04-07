const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
  });
  
  router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  });
