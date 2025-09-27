const User = require("../../models/user.models");

const requestSeller = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "verifyUser") {
      return res.status(400).json({ msg: "You cannot request to become a seller." });
    }

    if (user.sellerRequest) {
      return res.status(400).json({ msg: "You have already requested to become a seller." });
    }

    user.sellerRequest = true;
    user.sellerRequestStatus = "pending";
    await user.save();

    res.status(200).json({ msg: "Seller request submitted successfully.",user });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", err: err.message });
  }
};

module.exports = requestSeller;
