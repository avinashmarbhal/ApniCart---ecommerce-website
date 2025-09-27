const SubCategory = require("../../models/subcategory.models.js");

const addSubCategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    if (!name || !parentCategory) {
      return res.status(400).json({ error: "Subcategory name and parent category are required" });
    }

    // Optional: Check if subcategory already exists under the same parent
    const existing = await SubCategory.findOne({
      name: name.trim().toLowerCase(),
      parentCategory,
    });

    if (existing) {
      return res.status(409).json({ error: "Subcategory already exists under this category" });
    }

    const subCategory = new SubCategory({
      name: name.trim().toLowerCase(),
      parentCategory,
    });

    await subCategory.save();

    const allSubCategory = await SubCategory.find();

    res.status(201).json({
      message: "Subcategory created successfully",
      allSubCategory,
    });
  } catch (error) {
    console.error("Error adding subcategory:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = addSubCategory;
