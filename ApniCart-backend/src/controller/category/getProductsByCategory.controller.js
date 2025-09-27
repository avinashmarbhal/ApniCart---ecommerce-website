const Product = require("../../models/product.models");

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    

    const [products, total] = await Promise.all([
      Product.find({ productCategory: categoryId }).skip(skip).limit(limit),
      Product.countDocuments({ productCategory: categoryId })
    ]);

    res.status(200).json({
      products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = getProductsByCategory;
