const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: String, required: true },
  time: { type: Date, required: true },
  hospital: { type: String, required: true },
  diseaseConclusion: { type: String },
  severity: { type: String },
  medications: [String],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now, index:true },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
