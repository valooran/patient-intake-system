const { handleChat } = require("../utils/aiChatbot");

async function chat(req, res) {
  const { message } = req.body;
  if (!message) return res.status(400).json({ msg: "Message required" });

  try {
    const response = await handleChat(req.user.id, message);
    res.json(response);
  } catch (err) {
    res.status(500).json({ msg: "AI error" });
  }
}

module.exports = { chat };
