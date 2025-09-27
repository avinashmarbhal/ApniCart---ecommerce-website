const Address = require("../../models/address.models");

const getAllAddresses = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all addresses for the user, sort so default comes first
    const addresses = await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });

    return res.status(200).json({
      message: "User addresses fetched successfully",
      addresses,
    });
  } catch (error) {
    return res.status(500).json({
      err: "Error while fetching addresses: " + error.message,
    });
  }
};

module.exports = getAllAddresses;
