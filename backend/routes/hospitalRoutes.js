const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createHospital,
  getHospitals,
  getNearbyHospitals,
} = require("../controllers/hospitalController");

router.post("/", authMiddleware, createHospital);

router.get("/", authMiddleware, getHospitals);

router.get("/nearby", getNearbyHospitals);

module.exports = router;
