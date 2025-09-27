const Address = require("../../models/address.models");

const getDefaultAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const defaultAddress = await Address.findOne({
      user: userId,
      isDefault: true,
    });

    return res.status(200).json({
      message: defaultAddress
        ? "Default address fetched successfully"
        : "No default address found",
      defaultAddress,
    });
  } catch (error) {
    return res.status(500).json({
      err: "Error while fetching default address: " + error.message,
    });
  }
};

module.exports = getDefaultAddress;
