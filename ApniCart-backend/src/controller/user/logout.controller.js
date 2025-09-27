const User = require("../../models/user.models.js");

const logoutUser = async (req, res) => {
try {

      await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            refreshToken: "",
          },
        },
        { new: true }
      );
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/', 
      };
      
      res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({msg:"User Logged out successfully!"})
} catch (err) {
    console.log("Logout: ",err);
    res.status(400).json({err:err.message})
}
};


module.exports = logoutUser
