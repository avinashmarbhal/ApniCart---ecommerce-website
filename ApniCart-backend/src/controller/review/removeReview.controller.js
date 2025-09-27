const Review = require("../../models/review.models");
const Product = require("../../models/product.models");

const removeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    if (!reviewId) {
      return res.status(400).json({ err: "reviewId is required!" });
    }

    const oldReview = await Review.findById(reviewId);
    if (!oldReview) {
      return res.status(404).json({ err: "Review not found!" });
    }

    // Ensure user is the one who created the review
    if (oldReview.user.toString() !== userId.toString()) {
      return res.status(403).json({ err: "Unauthorized access!" });
    }

    const productId = oldReview.product;

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    // Recalculate ratings
    const remainingReviews = await Review.find({ product: productId });
    const reviewCount = remainingReviews.length;

    let productRating = 0;
    if (reviewCount > 0) {
      const totalRatings = remainingReviews.reduce((sum, r) => sum + r.rating, 0);
      productRating = parseFloat((totalRatings / reviewCount).toFixed(1));
    }

    // Update product with new rating and review count
    await Product.findByIdAndUpdate(productId, {
      productRating,
      productReviewCount:reviewCount,
    });

    return res.status(200).json({
      msg: "Review deleted successfully!",
      updatedRating: productRating,
      reviewCount,
    });
  } catch (error) {
    return res.status(500).json({
      err: "Error while deleting review: " + error.message,
    });
  }
};

module.exports = removeReview;
