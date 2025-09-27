const Product = require("../../models/product.models.js");
const { deleteFromCloudinary } = require("../../utils/cloudinary.js");

const removeProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ err: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ err: "Product not found with the ID!" });
    }

    if (String(product.productOwner).trim() !== String(req.user._id).trim()) {
      return res.status(403).json({ err: "Unauthorized Access!" });
    }

    // ✅ Delete image from Cloudinary
    if (product.productImage?.id) {
      await deleteFromCloudinary(product.productImage.id);
    }

    // ✅ Delete product from DB
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(400).json({ err: "Error while deleting product" });
    }

    return res.status(200).json({ msg: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error during deletion:", error);
    return res.status(500).json({
      msg: "Error while deleting product!",
      error: error.message,
    });
  }
};

module.exports = removeProduct;
