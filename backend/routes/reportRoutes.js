const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadReport,
  getPatientReports,
} = require("../controllers/reportController");

router.post("/", authMiddleware, upload.single("file"), uploadReport);

router.get("/:patient_id", authMiddleware, getPatientReports);

module.exports = router;
