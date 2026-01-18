// controller/accident.controller.js
const Accident = require("../model/accidentSchema");

const getMyAccidentReports = async (req, res, next) => {
  try {
    // 🔐 Must be logged in
    if (!req.user) {
      return res.status(401).json({
        statusCode: 401,
        message: "Authentication required",
      });
    }

    const reports = await Accident.find({
      reportedBy: req.user._id,
    })
      .sort({ createdAt: -1 }) // latest first
      .select("-__v") // optional cleanup
      .lean();

    return res.status(200).json({
      statusCode: 200,
      message: "User accident reports fetched successfully",
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyAccidentReports,
};
