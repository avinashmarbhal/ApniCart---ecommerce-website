const Product = require("../../models/product.models.js");

const getAllProductByCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    if(!categoryId)
    {
        return res.status(402).json({err:"Id is required!!"})
    }
    
    const productsByCategory = await Product.find({productCategory:categoryId})

    if (!productsByCategory) {
      return res
        .status(404)
        .json({ err: "Products Not found by category!" });
    }
    res.status(200).json({ productsByCategory });
  } catch (error) {
    return res
      .status(400)
      .json({ err: "Error while fetching Product by category!", error });
  }
};

module.exports = getAllProductByCategory;




