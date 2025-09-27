const User = require("../../models/user.models.js");

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    //user existance
    if (!user) return flase;

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generaRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(`RT,AT: ${error}`);
    return false;
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ err: "Invalid email or password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ err: "Invalid credentials!" });
    }

    const tokens = await generateAccessAndRefreshToken(user._id);
    if (!tokens) {
      return res.status(500).json({ error: "Token generation failed" });
    }

    const { accessToken, refreshToken } = tokens;

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    if (!loggedInUser) {
      return res.status(404).json({ err: "User not logged in!" });
    }

    const options = {
      httpOnly: true,
      secure: true, // use true in production only (with HTTPS)
      sameSite: "none", // or "none" with Secure for full cross-site support
      maxAge: 7 * 24 * 60 * 60 * 1000, // 🟢 7 days
    };
    
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ msg: "User logged in successfully!", loggedInUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = login;
