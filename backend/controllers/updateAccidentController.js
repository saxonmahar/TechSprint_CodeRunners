const Accident = require("../model/accidentSchema");
const { handleAccidentAccepted } = require("../services/accident-accept.service");

/**
 * PATCH /api/v1/admin/accidents/:id/status
 */
const updateAccidentStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const status = req.body.status || req.query.status;

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

    // 🔔 Trigger WhatsApp only when verified
    if (status === "verified") {
      handleAccidentAccepted(accident).catch(console.error);

      // 🚨 Emit to connected ambulances via Socket.IO
      if (global.io) {
        // Optionally, you can send to a specific zone: io.to(`zone-${accident.zoneId}`).emit(...)
        global.io.emit("new-emergency", {
          accidentId: accident._id,
          location: accident.location,
          description: accident.description,
          time: accident.createdAt,
        });
      }
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

module.exports = updateAccidentStatusController;
