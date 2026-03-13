const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { analyzePatient } = require("../controllers/aiController");

router.post("/analyze", authMiddleware, analyzePatient);

module.exports = router;
