const User = require("../../models/user.models");

const cancelSellerRequest = async (req, res) => {
  try {
    const user = req.user;

    if (!user.sellerRequest || user.sellerRequestStatus !== "pending") {
      return res.status(400).json({ msg: "No pending seller request to cancel." });
    }

    user.sellerRequest = false;
    user.sellerRequestStatus = "";
    await user.save();

    res.status(200).json({ msg: "Seller request has been cancelled.", user });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", err: err.message });
  }
};

module.exports = cancelSellerRequest;
