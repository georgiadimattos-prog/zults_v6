// components/screens/activities/RezyAIHandler.js
import { OPENAI_API_KEY } from "@env";
import rezyKnowledge from "../../../assets/data/rezy_knowledge.json";
import rezyPersona from "../../../assets/data/rezy_persona.json";
import nhsData from "../../../assets/data/nhs_data.json";

// 🧠 Simple persistent memory (lives while app is open)
let conversationHistory = [];

export async function handleRezyAI(userMessage) {
  try {
    const lowerMsg = userMessage.toLowerCase();

    // 🧠 Save the user message to memory
    conversationHistory.push({ role: "user", content: userMessage });

    // 🧠 1️⃣ First: check local knowledge base
    for (const key in rezyKnowledge) {
      if (lowerMsg.includes(key.replace(/_/g, " "))) {
        const answer = rezyKnowledge[key];
        conversationHistory.push({ role: "assistant", content: answer });
        return answer;
      }
    }

    // 2️⃣ Check NHS data next
    for (const key in nhsData) {
      if (lowerMsg.includes(key.replace(/_/g, " "))) {
        const answer = nhsData[key];
        conversationHistory.push({ role: "assistant", content: answer });
        return answer;
      }
    }

    // 💜 3️⃣ If no match found, talk to OpenAI with memory
    const systemPrompt = `
You are ${rezyPersona.identity.name} — ${rezyPersona.identity.role}.
Your mission: ${rezyPersona.identity.mission}
Tone: ${rezyPersona.tone.voice}
Style: ${rezyPersona.tone.style}
Values: ${rezyPersona.values.join(", ")}
Guidelines:
${Object.values(rezyPersona.guidelines)
  .flat()
  .map((rule) => "- " + rule)
  .join("\n")}
Fallback behaviours:
- If unsure: ${rezyPersona.fallback_behavior.if_unsure}
- If topic is sensitive: ${rezyPersona.fallback_behavior.if_sensitive}
When you respond, speak as Rezy — warm, concise, and deeply kind.
Do not reintroduce yourself if the user already knows you.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      ...conversationHistory, // 🧠 include memory
    ],
    temperature: 0.8,
    max_tokens: 250,
  }),
});

// ⬇️  all the logs go right here
console.log("🔑 Key loaded:", OPENAI_API_KEY ? "✅" : "❌");
console.log("🧠 Sending to OpenAI. Messages so far:", conversationHistory.length);

// wait for JSON and inspect it
const data = await response.json();
console.log("🩵 Raw OpenAI reply:", JSON.stringify(data, null, 2));

const reply = data?.choices?.[0]?.message?.content?.trim();

// 💾 Save Rezy’s reply in memory
conversationHistory.push({ role: "assistant", content: reply });

return (
  reply ||
  "I’m here with you — can you tell me a bit more about what you’d like to understand?"
);
  } catch (error) {
    console.error("RezyAI error:", error);
    return "Hmm, I couldn’t process that just now. Try asking again in a moment.";
  }
}