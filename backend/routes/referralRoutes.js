const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createReferral,
  getPatientReferrals,
  getAllReferrals,
  updateReferralStatus,
} = require("../controllers/referralController");

router.post("/", authMiddleware, createReferral);

router.get("/", authMiddleware, getAllReferrals);

router.get("/:patient_id", authMiddleware, getPatientReferrals);

router.put("/:id", authMiddleware, updateReferralStatus);

module.exports = router;
