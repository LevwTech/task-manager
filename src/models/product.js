const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    available: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
