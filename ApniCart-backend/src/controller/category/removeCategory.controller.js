const Category = require("../../models/category.models");
const SubCategory = require("../../models/subcategory.models.js");

const removeCategory = async (req, res) => {
  try {
    const { id: categoryId } = req.params; // ✅ Take ID from URL

    if (!categoryId) {
      return res.status(400).json({ err: "Category ID is required in URL!" });
    }

    // Delete Category
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ err: "Category not found!" });
    }

    // Delete related Subcategories
    await SubCategory.deleteMany({ parentCategory: categoryId });
    const allCategory = await Category.find();
    return res.status(200).json({
      msg: "Category and its subcategories deleted successfully!",
      allCategory
    });
  } catch (error) {
    return res.status(500).json({
      err: "Error while deleting category: " + error.message,
    });
  }
};

module.exports = removeCategory;
