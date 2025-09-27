const Otp = require("../../models/otp.models");
const User = require("../../models/user.models");
const sendEmail = require("../../utils/sendEmail");

const verifyOtpController = async (req, res) => {
  try {
    let userId = req.user?._id;
    const { otp, type } = req.body;

    if (!userId && req.params.email) {
      const tempUser = await User.findOne({ email: req.params.email }).select(
        "-password -refreshToken"
      );
      if (!tempUser) {
        return res.status(404).json({ msg: "User with this email not found" });
      }
      userId = tempUser._id;
    }

    if (!otp || type !== "email") {
      return res.status(400).json({ msg: "OTP and type 'email' are required" });
    }

    const validOtp = await Otp.findOne({
      user: userId,
      otp,
      type: "email",
      expiresAt: { $gt: new Date() },
    });

    if (!validOtp) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isEmailVerified: true, role: "verifyUser" },
      { new: true }
    ).select("-password -refreshToken");

    await Otp.deleteMany({ user: userId, type: "email" });

    if (!req.params.email) {
      await sendEmail(
        user.email,
        "Your ApniCart Account is Verified",
        `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="text-align: center; color: #4a90e2;">ApniCart</h2>
            <p>Hello <strong>${user.firstName || "User"}</strong>,</p>
            <p style="font-size: 16px;">Your email has been successfully verified and your account is now fully activated!</p>
            <p>Welcome aboard! You can now explore, shop, and even request to become a seller.</p>
            <p style="margin-top: 30px;">Thanks,<br/>The ApniCart Team</p>
          </div>
        </div>
      `
      );
    }

    if (req.params.email) {
      res.status(200).json({ msg: "Email verified successfully", user });
    } else {
      res.status(200).json({ msg: "Email verified successfully", user });
    }
  } catch (error) {
    res
      .status(500)
      .json({ msg: "OTP verification failed", err: error.message });
  }
};

module.exports = verifyOtpController;
