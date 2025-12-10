const Appointment = require("../models/Appointment");
const Joi = require("joi");

const bookingSchema = Joi.object({
  doctor: Joi.string().required(),
  time: Joi.string().required(),
  hospital: Joi.string().required(),
  diseaseConclusion: Joi.string(),
  severity: Joi.string(),
  medications: Joi.array().items(Joi.string()),
});

async function bookAppointment(req, res) {
  const { error } = bookingSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const appointmentData = {
    userId: req.user.id,
    ...req.body,
    time: new Date(req.body.time),
  };

  const appointment = new Appointment(appointmentData);
  await appointment.save();
  res.json(appointment);
}

async function getUserAppointments(req, res) {
  const appointments = await Appointment.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(appointments);
}

async function getAllAppointments(req, res) {
  const appointments = await Appointment.find()
    .populate("userId", "email firstName lastName")
    .sort({ createdAt: -1 });
  res.json(appointments);
}

async function updateStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!appointment) return res.status(404).json({ msg: "Not found" });
  res.json(appointment);
}

module.exports = {
  bookAppointment,
  getUserAppointments,
  getAllAppointments,
  updateStatus,
};
