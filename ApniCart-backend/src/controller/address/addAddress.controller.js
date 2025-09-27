const Address = require("../../models/address.models");

const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      pinCode,
      houseNumber,
      street,
      landmark,
      city,
      state,
      country,
      addressType,
      isDefault,
    } = req.body;

    if (
      !fullName ||
      !mobileNumber ||
      !pinCode ||
      !houseNumber ||
      !city ||
      !state ||
      !country
    ) {
      return res.status(400).json({ err: "All required fields must be filled." });
    }

    const userId = req.user?._id;

    const existingAddresses = await Address.find({ user: userId });

    let shouldBeDefault = false;

    if (existingAddresses.length === 0) {
      shouldBeDefault = true;
    } else if (isDefault === true || isDefault === "true") {
      await Address.updateMany({ user: userId }, { isDefault: false });
      shouldBeDefault = true;
    }

    await Address.create({
      user: userId,
      fullName,
      mobileNumber,
      pinCode,
      houseNumber,
      street: street || "",
      landmark: landmark || "",
      city,
      state,
      country,
      addressType: addressType || "Home",
      isDefault: shouldBeDefault,
    });

    // ✅ Fetch and return only the current default address
    const defaultAddress = await Address.findOne({ user: userId, isDefault: true });

    return res.status(201).json({
      message: "Address added successfully.",
      defaultAddress,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ err: "Error while adding address: " + error.message });
  }
};

module.exports = addAddress;
