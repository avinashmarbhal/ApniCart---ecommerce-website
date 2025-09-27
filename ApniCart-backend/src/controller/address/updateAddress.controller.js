const Address = require("../../models/address.models");

const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updateData = req.body;
    const userId = req.user._id;

    if (!addressId) {
      return res.status(400).json({ err: "Address ID is required!" });
    }

    const existingAddress = await Address.findById(addressId);
    if (!existingAddress) {
      return res.status(404).json({ err: "Address not found!" });
    }

    if (!existingAddress.user.equals(userId)) {
      return res.status(403).json({ err: "Unauthorized access!" });
    }

    const wasDefault = existingAddress.isDefault;
    const updatingToDefault = updateData.isDefault === true || updateData.isDefault === "true";
    const updatingToNotDefault = updateData.isDefault === false || updateData.isDefault === "false";

    // CASE 1: If now set as default, unset all others
    if (updatingToDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
      updateData.isDefault = true;
    }

    // CASE 2: If was default and now set to not default
    else if (wasDefault && updatingToNotDefault) {
      // Check if there's another address to promote
      const otherAddress = await Address.findOne({ user: userId, _id: { $ne: addressId } });
      if (otherAddress) {
        await Address.findByIdAndUpdate(otherAddress._id, { isDefault: true });
      } else {
        // No other address exists — force current one to remain default
        updateData.isDefault = true;
      }
    }

    // Perform the update
    const updatedAddress = await Address.findByIdAndUpdate(addressId, updateData, { new: true });

    // ✅ Fetch the current default address
    const defaultAddress = await Address.findOne({ user: userId, isDefault: true });

    return res.status(200).json({
      message: "Address updated successfully",
      defaultAddress,
    });
  } catch (error) {
    return res.status(500).json({
      err: "Error while updating address: " + error.message,
    });
  }
};

module.exports = updateAddress;
