const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addSymptoms,
  getPatientSymptoms,
} = require("../controllers/symptomController");

router.post("/", authMiddleware, addSymptoms);

router.get("/:patient_id", authMiddleware, getPatientSymptoms);

module.exports = router;
