const Category = require("../../models/category.models.js");

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    // Optional: Check if category already exists
    const existing = await Category.findOne({ name: name.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Category already exists" });
    }

    const category = new Category({
      name: name.trim().toLowerCase()
    });

    await category.save();

    const allCategory = await Category.find()

    res.status(201).json({
      message: "Category created successfully",
      allCategory,
    });
  } catch (error) {
    console.error("Error adding category:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = addCategory;
