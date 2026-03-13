const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
  getFullPatientProfile,
} = require("../controllers/patientController");

router.post("/", authMiddleware, createPatient);

router.get("/", authMiddleware, getPatients);

router.get("/:id", authMiddleware, getPatient);

router.put("/:id", authMiddleware, updatePatient);

router.delete("/:id", authMiddleware, deletePatient);

router.get("/full/:id", getFullPatientProfile);

module.exports = router;
