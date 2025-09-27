const Address = require("../../models/address.models");

const getAddressById = async (req, res) => {
  try {
    const { addressId } = req.params;

    if (!addressId) {
      return res.status(400).json({ err: "Address ID is required!" });
    }

    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(404).json({ err: "Address not found!" });
    }

    // Check if the address belongs to the logged-in user
    if (!address.user.equals(req.user._id)) {
      return res.status(403).json({ err: "Unauthorized access!" });
    }

    return res.status(200).json({
      message: "Address fetched successfully",
      address,
    });
  } catch (error) {
    return res.status(500).json({
      err: "Error while fetching address: " + error.message,
    });
  }
};

module.exports = getAddressById;
