const Review = require("../../models/review.models");

const dislikeReview = async (req, res) => {
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

    // Remove user from likes if present
    review.likes = review.likes.filter(id => id.toString() !== userId.toString());

    // Toggle dislike
    const alreadyDisliked = review.dislikes.some(id => id.toString() === userId.toString());

    if (alreadyDisliked) {
      review.dislikes = review.dislikes.filter(id => id.toString() !== userId.toString());
    } else {
      review.dislikes.push(userId);
    }

    await review.save(); // Triggers pre-save hook

    return res.status(200).json({
      msg: "Dislike toggled successfully",
      dislikeCount: review.dislikeCount,
      likeCount: review.likeCount,
      liked: false,
      disliked: !alreadyDisliked,
    });

  } catch (error) {
    return res.status(500).json({
      err: "Error while disliking review: " + error.message,
    });
  }
};

module.exports = dislikeReview;
