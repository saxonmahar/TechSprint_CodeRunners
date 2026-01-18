const express = require("express");
const { getMyProfileController } = require("../controllers/userController");
const authRequired = require("../middlewares/authOptional");

const router = express.Router();

router.get("/profile", authRequired, getMyProfileController);

module.exports = router;
