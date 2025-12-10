const express = require("express");
const { auth, adminOnly } = require("../middleware/auth");
const {
  bookAppointment,
  getUserAppointments,
  getAllAppointments,
  updateStatus,
} = require("../controllers/appointmentController");

const router = express.Router();
router.post("/", auth, bookAppointment);
router.get("/user", auth, getUserAppointments);
router.get("/", auth, adminOnly, getAllAppointments);
router.patch("/:id", auth, adminOnly, updateStatus);

module.exports = router;
