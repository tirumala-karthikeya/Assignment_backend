const express = require("express");
const { getUserProfile} = require("../controllers/authController");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.post("/reset-password-request", authController.resetPasswordRequest);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
