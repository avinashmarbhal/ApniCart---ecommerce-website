const Otp = require("../../models/otp.models");
const User = require("../../models/user.models");
const sendEmail = require("../../utils/sendEmail");

const sendOtpController = async (req, res) => {
  try {
    let userId = req.user?._id;
    console.log(userId);
    
    // If no logged-in user, fallback to email in query
    if (!userId && req.params.email) {
      const tempUser = await User.findOne({ email: req.params.email });
      if (!tempUser) {
        return res.status(404).json({ msg: "User with this email not found" });
      }
      userId = tempUser._id;
    }

    console.log(userId);
    
    if (!userId) {
      return res.status(400).json({ msg: "User ID or email is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Generate 6-digit OTP
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Remove any existing OTPs of type "email" for this user
    await Otp.deleteMany({ user: userId, type: "email" });

    // Save new OTP
    await Otp.create({ user: userId, otp: emailOtp, type: "email", expiresAt });

  

    // Send email
    await sendEmail(
      req.query.email2 || user.email,
      "Verification Code from ApniCart",
      `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="text-align: center; color: #4a90e2;">ApniCart</h2>
            <p>Hello <strong>${user.firstName || "User"}</strong>,</p>
            <p style="font-size: 16px;">Use the following One Time Password (OTP) to verify your email address:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #333;">${emailOtp}</span>
            </div>
            <p>This OTP is valid for 5 minutes.</p>
            <p style="font-size: 14px; color: #777;">If you didn’t request this, you can safely ignore this email.</p>
            <p style="margin-top: 30px;">Thanks,<br/>The ApniCart Team</p>
          </div>
        </div>
      `
    );

    res.status(200).json({ msg: "OTP sent to email" });
  } catch (error) {
    console.error("Send OTP Error:", error.message);
    res.status(500).json({ msg: "Failed to send OTP", err: error.message });
  }
};

module.exports = sendOtpController;
