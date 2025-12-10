const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string().valid("user", "admin").default("user"),
});

async function register(req, res) {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { email, password, firstName, lastName, role } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: "User exists" });

  user = new User({ email, password, firstName, lastName, role });
  await user.save();

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({
    token,
    user: {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
}

async function getProfile(req, res) {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ msg: "User not found" });

  res.json({
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    createdAt: user.createdAt,
  });
}

module.exports = { register, login, getProfile };
