const express = require("express");
const router = express.Router();
const { chat, clearSession } = require("../controllers/chatController");

// No auth required — doctors access via already-authenticated session
router.post("/", chat);
router.delete("/:sessionId", clearSession);

module.exports = router;
