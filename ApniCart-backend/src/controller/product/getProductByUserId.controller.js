const Product = require("../../models/product.models.js");

const getAllProductByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ err: "Unauthorized Access!!!" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(search, "i");

    const filter = {
      productOwner: userId,
      productName: { $regex: searchRegex }
    };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ err: "Error while fetching Product by UserId!", error });
  }
};

module.exports = getAllProductByUserId;
