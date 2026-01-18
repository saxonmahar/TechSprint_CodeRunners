const express = require("express");
const accidentValidation = require("../middlewares/accidentValidation");
const { createAccidentController } = require("../controllers/accidentController");
const adminAccidentController = require("../controllers/adminAccidentController");
const updateAccidentStatusController = require("../controllers/updateAccidentController");
const authOptional = require("../middlewares/authOptional");
const { getMyAccidentReports } = require("../controllers/fetchReportByUsers");

const accidentRouter = express.Router();

accidentRouter.post("/report",authOptional, accidentValidation, createAccidentController);
accidentRouter.get("/accidents", adminAccidentController);
accidentRouter.patch("/accidents/:id/status", updateAccidentStatusController);
accidentRouter.get("/my-reports", authOptional, getMyAccidentReports);


module.exports = accidentRouter;