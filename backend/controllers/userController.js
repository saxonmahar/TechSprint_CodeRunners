const User = require("../model/userModel");

const getMyProfileController = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Fetch full user from DB
    const user = await User.findById(req.user._id).select(
      "_id fullName email phone role createdAt updatedAt"
    );

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "User profile fetched successfully",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyProfileController };
