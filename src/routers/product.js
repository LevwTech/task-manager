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

const multer = require("multer");
const upload = multer({ dest: "images" }); // configuration object , destniation is images root folder
router.post("/image", upload.single("upload"), (req, res) => {
  // 'uplpoad' is the name or key
  res.send();
});

module.exports = router;
