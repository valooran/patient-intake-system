const Feedback = require("../models/Feedback");
const Joi = require("joi");

const feedbackSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().optional(),
});

async function submitFeedback(req, res) {
  const { error } = feedbackSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const feedback = new Feedback({ userId: req.user.id, ...req.body });
  await feedback.save();
  res.json(feedback);
}

async function getFeedbacks(req, res) {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  res.json(feedbacks);
}

module.exports = { submitFeedback, getFeedbacks };
