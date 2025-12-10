const express = require("express");
const { auth } = require("../middleware/auth");
const { chat } = require("../controllers/chatController");

const router = express.Router();
router.post("/", auth, chat);

module.exports = router;
