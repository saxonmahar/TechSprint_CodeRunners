const Accident = require("../model/accidentSchema");

const createAccidentController = async (req, res, next) => {
  try {
    const { phoneNumber, description, location, images } = req.validatedBody;

    const accident = await Accident.create({
      phoneNumber,
      description,
      location,
      images: images ?? [],
    });

    return res.status(201).json({
      statusCode: 201,
      message: "Accident reported successfully",
      data: {
        id: accident._id,
        status: accident.status,
        createdAt: accident.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createAccidentController };

