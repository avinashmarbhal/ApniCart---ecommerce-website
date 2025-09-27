const Address = require("../../models/address.models");

const removeAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    if (!addressId) {
      return res.status(400).json({ err: "Address ID is required!" });
    }

    const oldAddress = await Address.findById(addressId);

    if (!oldAddress) {
      return res.status(404).json({ err: "Address not found!" });
    }

    if (!oldAddress.user.equals(req.user._id)) {
      return res.status(403).json({ err: "Unauthorized access!" });
    }

    const wasDefault = oldAddress.isDefault;

    await Address.findByIdAndDelete(addressId);

    // If deleted address was default, promote another one
    if (wasDefault) {
      const otherAddress = await Address.findOne({ user: req.user._id });
      if (otherAddress) {
        otherAddress.isDefault = true;
        await otherAddress.save();
      }
    }

    // ✅ Fetch the current default address (after deletion)
    const defaultAddress = await Address.findOne({ user: req.user._id, isDefault: true });

    return res.status(200).json({
      msg: "Address deleted successfully!",
      defaultAddress,
    });
  } catch (error) {
    return res.status(500).json({
      err: "Error while deleting address: " + error.message,
    });
  }
};

module.exports = removeAddress;
