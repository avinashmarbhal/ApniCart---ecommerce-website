const mongoose = require("mongoose");
const Product = require("../../models/product.models.js");

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ err: "Invalid Product ID format!" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ err: "Product not found with the given ID!" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ err: "Error while fetching product!", details: error.message });
  }
};

module.exports = getProductById;
