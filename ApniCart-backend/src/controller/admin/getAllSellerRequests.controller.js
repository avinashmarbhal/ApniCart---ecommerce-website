const User = require("../../models/user.models");

const getAllSellerRequests = async (req, res) => {
  try {
    // You can also add filtering by sellerRequestStatus === "pending" if needed
    const sellerRequests = await User.find({ sellerRequest: true, sellerRequestStatus: "pending" })
      .select("-password -refreshToken");

    if (sellerRequests.length === 0) {
      return res.status(200).json({ msg: "No seller requests found." });
    }

    res.status(200).json({ users: sellerRequests });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", err: err.message });
  }
};

module.exports = getAllSellerRequests;
