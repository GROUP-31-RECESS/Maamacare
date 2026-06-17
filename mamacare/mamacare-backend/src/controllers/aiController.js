import OpenAI from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";

function containsDangerSign(text = "") {
  const lower = text.toLowerCase();

  return [
    "bleeding",
    "blood",
    "baby not moving",
    "no movement",
    "reduced movement",
    "severe headache",
    "blurred vision",
    "convulsion",
    "seizure",
    "fits",
    "faint",
    "unconscious",
    "severe pain",
    "water broke",
    "water breaking",
    "can't breathe",
    "cannot breathe",
    "chest pain",
    "suicide",
    "harm myself",
    "want to die",
  ].some((term) => lower.includes(term));
}

function localSafetyReply(question, context = {}) {
  const urgent = containsDangerSign(question);
  const risk = context?.risk || "normal";

  if (urgent || risk === "urgent") {
    return {
      level: "urgent",
      title: "Possible danger sign",
      message:
        "Your question mentions a possible pregnancy danger sign. MamaCare cannot diagnose, but this should not be delayed.",
      action:
        "Please contact your emergency support person or go to the nearest health facility immediately. Use the Emergency Help page now.",
    };
  }

  return {
    level: risk === "watch" ? "watch" : "normal",
    title: "MamaCare guidance",
    message:
      "I reviewed your question and your saved MamaCare context. Continue monitoring your symptoms, vitals, baby movement, ANC appointments, medication, and wellness. If symptoms worsen or you feel unsafe, seek care.",
    action:
      "Keep logging your health information and contact a health worker if the issue continues, worsens, or feels unusual.",
  };
}

function buildMamaCareContext(context = {}) {
  return {
    mother: context.mother || null,
    currentRisk: context.risk || "normal",
    latestVitals: context.latestVitals || null,
    latestWellness: context.latestWellness || null,
    latestMovement: context.latestMovement || null,
    latestSymptoms: context.latestSymptoms || null,
    healthRecords: context.healthRecords || null,
    emergencyPlan: context.emergencyPlan || null,
    postnatalCare: context.postnatalCare || null,
  };
}

function parseAiReply(rawText, fallback) {
  try {
    const parsed = JSON.parse(rawText);

    return {
      level: ["normal", "watch", "urgent"].includes(parsed.level)
        ? parsed.level
        : fallback.level,
      title: parsed.title || fallback.title,
      message: parsed.message || fallback.message,
      action: parsed.action || fallback.action,
    };
  } catch (error) {
    return {
      ...fallback,
      message: rawText || fallback.message,
    };
  }
}

export const askMamaCareAI = asyncHandler(async (req, res) => {
  const { question, context } = req.body;

  if (!question || !String(question).trim()) {
    res.status(400);
    throw new Error("Question is required.");
  }

  const cleanQuestion = String(question).trim();
  const safeContext = buildMamaCareContext(context);
  const fallback = localSafetyReply(cleanQuestion, safeContext);

  if (!process.env.OPENAI_API_KEY) {
    return res.json({
      reply: fallback,
      source: "local-fallback-no-api-key",
    });
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const systemPrompt = `
You are MamaCare AI, a safety-first pregnancy and postnatal support assistant.

Rules:
- You are not a doctor and must not diagnose.
- Give clear, practical, mother-friendly guidance.
- Always prioritize maternal and newborn safety.
- If the question or context suggests danger signs, set level to "urgent".
- Danger signs include bleeding, severe headache, blurred vision, convulsions, severe abdominal pain, fever, reduced/no baby movement, difficulty breathing, chest pain, fainting, water breaking too early, serious emotional distress, self-harm thoughts, or newborn danger signs.
- Tell the mother to seek urgent care for danger signs.
- Use the saved MamaCare context when relevant.
- Return ONLY valid JSON with this exact shape:
{
  "level": "normal" | "watch" | "urgent",
  "title": "short title",
  "message": "clear explanation in 2-5 sentences",
  "action": "specific next step"
}
`;

  const userPrompt = {
    question: cleanQuestion,
    context: safeContext,
  };

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.5",
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: JSON.stringify(userPrompt),
      },
    ],
  });

  const rawText = response.output_text || "";
  const reply = parseAiReply(rawText, fallback);

  if (fallback.level === "urgent") {
    reply.level = "urgent";
    reply.action =
      "Please contact your emergency support person or go to the nearest health facility immediately. Use the Emergency Help page now.";
  }

  res.json({
    reply,
    source: "openai",
  });
});
