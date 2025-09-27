const Product = require("../../models/product.models.js");

const getAllProductBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.body;
    if(!subCategoryId)
    {
        return res.status(402).json({err:"Id is required!!"})
    }
    
    const productsBySubCategory = await Product.find({productSubCategory:subCategoryId})

    if (!productsBySubCategory) {
      return res
        .status(404)
        .json({ err: "Products Not found by SubCategory!" });
    }
    res.status(200).json({ productsBySubCategory });
  } catch (error) {
    return res
      .status(400)
      .json({ err: "Error while fetching Product by SubCategory!", error });
  }
};

module.exports = getAllProductBySubCategory;




