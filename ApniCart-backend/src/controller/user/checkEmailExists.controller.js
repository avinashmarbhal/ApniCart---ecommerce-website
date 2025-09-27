const User = require("../../models/user.models");

const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ msg: "Email is required in URL." });
    }

    // Check if a user exists with this email
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (user) {
      return res.status(200).json({ msg: "Account with this email exists." });
    } else {
      return res.status(200).json({ msg: "No account found with this email." });
    }
  } catch (error) {
    console.error("Error checking email:", error.message);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = checkEmailExists;
