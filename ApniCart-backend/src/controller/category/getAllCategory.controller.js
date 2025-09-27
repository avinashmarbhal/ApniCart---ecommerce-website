const Category = require("../../models/category.models.js");

const getAllCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;         // Default to page 1
    const limit = parseInt(req.query.limit) || 10;       // Default to 10 items per page
    const skip = (page - 1) * limit;

    const [allCategory, total] = await Promise.all([
      Category.find().skip(skip).limit(limit),
      Category.countDocuments()
    ]);

    res.status(200).json({
      allCategory,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
};

module.exports = getAllCategory;
