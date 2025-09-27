const User = require("../../models/user.models.js");

const changePassword = async (req, res) => {
  try {
    const { newpassword, email } = req.body;

    if (!newpassword || !email) {
      return res.status(400).json({ err: "All fields are required!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ err: "User not found with this email." });
    }

    user.password = newpassword;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({ msg: "Password changed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: "Something went wrong while updating password", error: error.message });
  }
};

module.exports = changePassword;
