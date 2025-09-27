const Review = require("../../models/review.models");
const Product = require("../../models/product.models");

const updateReview = async (req, res) => {
  try {
    const { reviewId, product, rating, comment } = req.body;
    const userId = req.user._id;

    if (!reviewId) {
      return res.status(400).json({ err: "Review ID is required!" });
    }

    if (!product && !rating && !comment) {
      return res.status(400).json({ err: "At least one field is required to update!" });
    }

    const oldReview = await Review.findById(reviewId);
    if (!oldReview) {
      return res.status(404).json({ err: "Review not found!" });
    }

    // Ensure the review belongs to the logged-in user
    if (oldReview.user.toString() !== userId.toString()) {
      return res.status(403).json({ err: "Unauthorized access!" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        product: product || oldReview.product,
        rating: rating || oldReview.rating,
        comment: comment || oldReview.comment,
      },
      { new: true }
    );

    // Recalculate average rating only (not reviewCount)
    const allReviews = await Review.find({ product: updatedReview.product });
    const totalRatings = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = parseFloat((totalRatings / allReviews.length).toFixed(1));

    await Product.findByIdAndUpdate(updatedReview.product, {
      productRating: avgRating,
    });

    return res.status(200).json({
      message: "Review updated successfully",
      review: updatedReview,
      updatedRating: avgRating,
    });
  } catch (error) {
    return res.status(500).json({
      err: "Error while updating review: " + error.message,
    });
  }
};

module.exports = updateReview;
