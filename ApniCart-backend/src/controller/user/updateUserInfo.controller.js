const User = require("../../models/user.models.js");

const updateUserInfo = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(401).json({ err: "atleast one field is required!" });
    } else {
      const { firstName, lastName, email, phoneNo } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
          $set: {
            firstName: firstName || req.user.firstName,
            lastName: lastName || req.user.lastName,
            email: email || req.user.email,
            phoneNo: phoneNo || req.user.phoneNo,
          },
        },
        { new: true }
      ).select("-password -refreshToken");

      res.status(200).json({ msg: "Acccount updated!!", user });
    }
  } catch (error) {
    res.status(402).json({ err: "error while upadting account info", error });
  }

  // res.status(201).json({user:req.user})
};

module.exports = updateUserInfo;
