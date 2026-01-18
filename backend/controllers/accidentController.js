const Accident = require("../model/accidentSchema");

const createAccidentController = async (req, res, next) => {
  const token = req.cookies.token;
  console.log(token)
  try {
    const { phoneNumber, description, location, images } = req.validatedBody;

    const accident = await Accident.create({
      phoneNumber,
      description,
      location,
      images, // already defaulted by Joi
      reportedBy: req.user ? req.user._id : null, // ✅ cookie-based auth
    });

    return res.status(201).json({
      statusCode: 201,
      message: "Accident reported successfully",
      data: {
        id: accident._id,
        status: accident.status,
        reportedBy: accident.reportedBy,
        createdAt: accident.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAccidentController,
};
