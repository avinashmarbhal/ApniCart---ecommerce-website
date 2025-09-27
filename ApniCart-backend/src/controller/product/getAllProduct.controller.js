const Product = require("../../models/product.models.js");

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 products per page
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    const allProducts = await Product.find()
      .skip(skip)
      .limit(limit);

    if (!allProducts || allProducts.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalProducts,
      products: allProducts,
    });
  } catch (error) {
    return res.status(500).json({ err: "Error while fetching products", error });
  }
};

module.exports = getAllProducts;
