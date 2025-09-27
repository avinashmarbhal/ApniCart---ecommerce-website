const Address = require("../../models/address.models");

const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user._id;

    if (!addressId) {
      return res.status(400).json({ err: "Address ID is required!" });
    }

    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(404).json({ err: "Address not found!" });
    }

    if (!address.user.equals(userId)) {
      return res.status(403).json({ err: "Unauthorized access!" });
    }

    // Step 1: Unset all other addresses
    await Address.updateMany({ user: userId }, { isDefault: false });

    // Step 2: Set this one as default
    address.isDefault = true;
    await address.save();

    return res.status(200).json({
      message: "Default address updated successfully",
      defaultAddress: address,
    });
  } catch (error) {
    return res.status(500).json({
      err: "Error while setting default address: " + error.message,
    });
  }
};

module.exports = setDefaultAddress;
