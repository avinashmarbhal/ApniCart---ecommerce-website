const User = require("../../models/user.models");
const sendEmail = require("../../utils/sendEmail");

const approveSeller = async (req, res) => {
  try {
    const { userId } = req.params; // ⬅️ from URL

    const user = await User.findById(userId);
    if (!user || !user.sellerRequest) {
      return res.status(404).json({ msg: "No seller request found for this user." });
    }

    user.role = "seller";
    user.sellerRequest = false;
    user.sellerRequestStatus = "approved";
    await user.save();

    await sendEmail(
      user.email,
      "Seller Request Approved - ApniCart",
      `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="text-align: center; color: #27ae60;">ApniCart</h2>
            <p>Hello <strong>${user.firstName || "User"}</strong>,</p>
            <p style="font-size: 16px;">Congratulations! Your request to become a seller on YourApp has been approved.</p>
            <p>You now have access to seller features like product listings, inventory management, and more.</p>
            <p>We're excited to have you onboard as a seller and look forward to your success!</p>
            <p style="margin-top: 30px;">Thanks,<br/>The ApniCart Team</p>
          </div>
        </div>
      `
    );

    res.status(200).json({ msg: "User promoted to seller." });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", err: err.message });
  }
};

module.exports = approveSeller;
