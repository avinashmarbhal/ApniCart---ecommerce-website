const Review = require("../../models/review.models");
const Product = require("../../models/product.models");

const addReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const userId = req.user._id;

    // Construct full name
    const userName = `${req.user.firstName} ${req.user.lastName}`.trim();

    if (!product || !rating || !comment) {
      return res.status(400).json({ err: "All fields are mandatory!" });
    }

    // 1. Prevent duplicate review by same user
    const existingReview = await Review.findOne({ product, user: userId });
    if (existingReview) {
      return res
        .status(409)
        .json({ err: "You have already reviewed this product." });
    }

    // 2. Create new review with userName
    const review = await Review.create({
      user: userId,
      userName, // full name
      product,
      rating,
      comment,
    });

    if (!review) {
      return res.status(500).json({ err: "Failed to add review." });
    }

    // 3. Get all reviews for this product
    const allReviews = await Review.find({ product });

    // 4. Calculate average rating
    const totalRatings = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = parseFloat((totalRatings / allReviews.length).toFixed(1));

    // 5. Update product with new average and count
    await Product.findByIdAndUpdate(product, {
      productRating: avgRating,
      productReviewCount: allReviews.length,
    });

    return res.status(201).json({
      message: "Review added successfully",
      review,
      updatedRating: avgRating,
      reviewCount: allReviews.length,
    });
  } catch (error) {
    return res.status(500).json({
      err: "Error while adding review: " + error.message,
    });
  }
};

module.exports = addReview;
