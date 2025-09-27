const User = require("../../models/user.models");
const sendEmail = require("../../utils/sendEmail");

const disapproveSeller = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user || !user.sellerRequest) {
      return res.status(404).json({ msg: "No seller request found for this user." });
    }

    user.sellerRequest = false;
    user.sellerRequestStatus = "rejected";
    await user.save();

    await sendEmail(
      user.email,
      "Seller Request Disapproved - ApniCart",
      `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="text-align: center; color: #e74c3c;">ApniCart</h2>
            <p>Hello <strong>${user.firstName || "User"}</strong>,</p>
            <p style="font-size: 16px;">We regret to inform you that your request to become a seller on ApniCart has been disapproved.</p>
            <p>This could be due to incomplete information, policy violations, or other internal checks.</p>
            <p>If you believe this was a mistake or need assistance, feel free to contact our support team.</p>
            <p style="margin-top: 30px;">Thanks,<br/>The ApniCart Team</p>
          </div>
        </div>
      `
    );

    res.status(200).json({ msg: "Seller request has been disapproved." });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", err: err.message });
  }
};

module.exports = disapproveSeller;
