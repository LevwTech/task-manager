const express = require("express");
const Product = require("../models/product");
const router = new express.Router();

// creating a new product
router.post("/product", async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    res.status(201).send(product);
  } catch (e) {
    res.status(500).send();
  }
});
router.get("/products", async (res, req) => {
  const products = await Product.find({});
  res.send(products);
});

module.exports = router;
