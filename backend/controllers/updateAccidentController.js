const Accident = require("../model/accidentSchema");

/**
 * PATCH /api/v1/admin/accidents/:id/status
 * Update accident status (verified / rejected)
 */
const updateAccidentStatusController = async (req, res, next) => {
  try {
   const { id } = req.params;
    const status = req.body.status || req.query.status;

    // safety check (extra layer)
    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid status value",
        data: null,
      });
    }

    const accident = await Accident.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!accident) {
      return res.status(404).json({
        statusCode: 404,
        message: "Accident report not found",
        data: null,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: `Accident ${status} successfully`,
      data: {
        id: accident._id,
        status: accident.status,
        updatedAt: accident.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateAccidentStatusController
