const express = require("express");
const { auth, adminOnly } = require("../middleware/auth");
const {
  submitFeedback,
  getFeedbacks,
} = require("../controllers/feedbackController");

const router = express.Router();
router.post("/", auth, submitFeedback);
router.get("/", auth, adminOnly, getFeedbacks);

module.exports = router;
