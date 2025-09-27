const Review = require("../../models/review.models");

const getAllReviewsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ err: "Product ID is required!" });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name avatar") // optional: show user info
      .sort({ createdAt: -1 });

    return res.status(200).json({ reviews });
  } catch (error) {
    return res.status(500).json({
      err: "Error while fetching reviews: " + error.message,
    });
  }
};

module.exports = getAllReviewsByProductId;
