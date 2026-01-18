const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const authOptional = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIX HERE
    const user = await User.findById(decoded.userId).select("_id email role");

    req.user = user || null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = authOptional;
