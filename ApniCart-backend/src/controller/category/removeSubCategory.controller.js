const SubCategory = require("../../models/subcategory.models.js");

const removeSubCategory = async (req, res) => {
  try {
    const { id: subCategoryId } = req.params; // ✅ From URL

    if (!subCategoryId) {
      return res.status(400).json({ err: "SubCategory ID is required in URL!" });
    }

    const deletedSubCategory = await SubCategory.findByIdAndDelete(subCategoryId);

    if (!deletedSubCategory) {
      return res.status(404).json({ err: "SubCategory not found!" });
    }

    const allSubCategory = await SubCategory.find();

    return res.status(200).json({
      msg: "SubCategory deleted successfully!",
      allSubCategory,
    });
  } catch (error) {
    return res.status(500).json({
      err: "Error while deleting SubCategory: " + error.message,
    });
  }
};

module.exports = removeSubCategory;
