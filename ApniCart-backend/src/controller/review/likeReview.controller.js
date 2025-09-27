const Review = require("../../models/review.models");

const likeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    if (!reviewId) {
      return res.status(400).json({ err: "reviewId is required!" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ err: "Review not found!" });
    }

    // Remove user from dislikes if present
    review.dislikes = review.dislikes.filter(id => id.toString() !== userId.toString());

    // Toggle like
    const alreadyLiked = review.likes.some(id => id.toString() === userId.toString());

    if (alreadyLiked) {
      review.likes = review.likes.filter(id => id.toString() !== userId.toString());
    } else {
      review.likes.push(userId);
    }

    await review.save(); // Triggers pre-save hook

    return res.status(200).json({
      msg: "Like toggled successfully",
      likeCount: review.likeCount,
      dislikeCount: review.dislikeCount,
      liked: !alreadyLiked,
      disliked: false,
    });

  } catch (error) {
    return res.status(500).json({
      err: "Error while liking review: " + error.message,
    });
  }
};

module.exports = likeReview;
