const jwt = require("jsonwebtoken");
const User = require("../models/user.models.js");

const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized! Token missing" });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded._id).select("-password -refreshToken");

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      // Attach user to request
      req.user = user;

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: "Forbidden! Access denied" });
      }

      next();
    } catch (err) {
      console.error("Authorization error:", err.message);
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
};

module.exports = authorize;
