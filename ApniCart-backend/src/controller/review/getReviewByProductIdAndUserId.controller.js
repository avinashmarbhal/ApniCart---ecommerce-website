const Review = require("../../models/review.models");

const getReviewByProductIdAndUserId = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ err: "Product ID is required!" });
    }

    const review = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (!review) {
      return res.status(404).json({ msg: "Review not found for this user and product." });
    }

    return res.status(200).json({ review });
  } catch (error) {
    return res.status(500).json({
      err: "Error while fetching review: " + error.message,
    });
  }
};

module.exports = getReviewByProductIdAndUserId;
