const Product = require("../../models/product.models");

const getProductsBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    

    const [products, total] = await Promise.all([
      Product.find({ productSubCategory: subCategoryId }).skip(skip).limit(limit),
      Product.countDocuments({ productSubCategory: subCategoryId })
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

module.exports = getProductsBySubCategory;
