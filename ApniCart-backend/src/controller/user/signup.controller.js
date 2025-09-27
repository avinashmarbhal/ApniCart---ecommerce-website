const User = require("../../models/user.models.js");
const sendEmail = require("../../utils/sendEmail.js");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNo, password } = req.body;

    
    if (!firstName || !lastName || !email || !phoneNo || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

  
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNo }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Account already exists with this email or phoneNo" });
    }

    
    const newUser = new User(req.body);
    await newUser.save();

    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="text-align: center; color: #4a90e2;">Welcome to ApniCart</h2>
          <p style="font-size: 16px;">Hello <strong>${firstName}</strong>,</p>
          <p style="font-size: 15px;">Your account has been successfully created at <strong>ApniCart</strong>! We’re thrilled to have you onboard.</p>
          <p>Here’s what you can do next:</p>
          <ul>
            <li>🛒 Explore our latest products and offers</li>
            <li>🔒 Manage your profile and order history</li>
            <li>📦 Track your orders in real time</li>
          </ul>
          <p>We’re committed to providing the best online shopping experience.</p>
          <p style="margin-top: 30px;">Welcome again, and happy shopping!</p>
          <p style="font-size: 14px; color: #777;">If you didn’t sign up for ApniCart, please ignore this email.</p>
          <p style="margin-top: 20px;">Thanks,<br/>The ApniCart Team</p>
        </div>
      </div>
    `;

    await sendEmail(
      email,
      "Welcome to ApniCart – Account Created Successfully",
      htmlContent
    );

    
    res.status(201).json({
      message: "Account created successfully",
      user: newUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = signup;
