const express = require("express");
const router = express.Router();
const { sharePatientRecord } = require("../controllers/sharingController");

router.post("/email", sharePatientRecord);

module.exports = router;
