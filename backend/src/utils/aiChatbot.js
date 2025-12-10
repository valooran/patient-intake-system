const { OpenAI } = require("openai");
const openai = new OpenAI();

const conversations = new Map();

const MEDICAL_SYSTEM_PROMPT = `You are Dr. Aria, an experienced, empathetic, board-certified physician with 15+ years in internal medicine and emergency care.

RULES (never break them):
1. Ask ONLY ONE focused question at a time.
2. Never jump to diagnosis early.
3. Always consider age, gender, medical history when relevant.
4. Use differentials: list 2–3 possible causes internally, then narrow down.
5. At the end, give:
   - Most likely diagnosis
   - Severity: Low / Moderate / High / Emergency
   - Red flags that require immediate ER visit
   - 3–5 evidence-based medications (generic names only) with disclaimer
   - 3–5 top hospitals in India (or ask country first if unknown)

End the final response EXACTLY with this sentence:
"Final diagnosis based on your symptoms:"

Example flow:
Q1: How old are you and what is your gender?
Q2: When did the symptoms start?
Q3: Describe the pain location and type (sharp, dull, burning?)
...
Final: Final diagnosis based on your symptoms:

Be warm, professional, never alarmist unless truly urgent.`;

async function handleChat(userId, message) {
  if (!conversations.has(userId)) {
    conversations.set(userId, [
      { role: "system", content: MEDICAL_SYSTEM_PROMPT },
    ]);
  }

  const convo = conversations.get(userId);
  convo.push({ role: "user", content: message });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: convo,
      max_tokens: 800,
      temperature: 0.6,
      response_format: { type: "json_schema", json_schema: DIAGNOSIS_SCHEMA },
    });

    let data;
    try {
      data = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError.message);
      console.error("Raw response:", completion.choices[0].message.content);
      const rawContent = completion.choices[0].message.content;
      return {
        reply:
          rawContent.length > 100
            ? rawContent.substring(0, 100) + "..."
            : rawContent,
        isConclusion:
          rawContent.toLowerCase().includes("final diagnosis") ||
          rawContent.toLowerCase().includes("based on your symptoms"),
      };
    }

    convo.push({
      role: "assistant",
      content: data.reply || completion.choices[0].message.content,
    });

    return {
      reply:
        data.reply ||
        "I apologize, but I couldn't process that response properly.",
      isConclusion: data.isConclusion || false,
      disease: data.isConclusion ? data.disease : null,
      severity: data.isConclusion ? data.severity : null,
      redFlags: data.isConclusion ? data.redFlags : [],
      medications: data.isConclusion ? data.medications : [],
      hospitals: data.isConclusion ? data.hospitals : [],
      confidence: data.isConclusion ? data.confidence || "High" : null,
    };
  } catch (error) {
    console.error("OpenAI Medical Error:", error.message);
    return {
      reply:
        "I'm having trouble connecting right now. Please try again in a moment.",
      isConclusion: false,
    };
  }
}

const DIAGNOSIS_SCHEMA = {
  name: "medical_diagnosis",
  strict: true,
  schema: {
    type: "object",
    properties: {
      reply: { type: "string", description: "The message to show the user" },
      isConclusion: { type: "boolean" },
      disease: { type: "string" },
      severity: {
        type: "string",
        enum: ["Low", "Moderate", "High", "Emergency"],
      },
      redFlags: { type: "array", items: { type: "string" } },
      medications: { type: "array", items: { type: "string" } },
      hospitals: { type: "array", items: { type: "string" } },
      confidence: { type: "string" },
    },
    required: [
      "reply",
      "isConclusion",
      "disease",
      "severity",
      "redFlags",
      "medications",
      "hospitals",
      "confidence",
    ],
    additionalProperties: false,
  },
};

module.exports = { handleChat };
