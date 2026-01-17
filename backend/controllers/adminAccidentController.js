const Accident = require("../model/accidentSchema");

const getAllAccidentsController = async (req, res, next) => {
  try {
    const accidents = await Accident.find()
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      statusCode: 200,
      message: "Accident reports fetched successfully",
      data: accidents,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllAccidentsController ;
