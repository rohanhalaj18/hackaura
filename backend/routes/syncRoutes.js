const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { syncData } = require("../controllers/syncController");

router.post("/", authMiddleware, syncData);

module.exports = router;
