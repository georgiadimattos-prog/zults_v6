// components/activities/RezyAIHandler.js
import { OPENAI_API_KEY } from "@env";
import rezyKnowledge from "../../assets/data/rezy_knowledge.json";

export async function handleRezyAI(userMessage) {
  try {
    // 🧠 1️⃣ First: check local knowledge base
    const lowerMsg = userMessage.toLowerCase();
    for (const key in rezyKnowledge) {
      if (lowerMsg.includes(key.replace(/_/g, " "))) {
        return rezyKnowledge[key];
      }
    }

    // 💜 2️⃣ If no match found, ask OpenAI
    const systemPrompt = `
You are Rezy — Zults' friendly sexual health companion.
Speak warmly, clearly, and without judgement. 
Never diagnose, only educate using verified sources like the NHS.
Keep tone Apple-like: calm, minimal, confident, and kind.
Use Zults language (Rezults, Get Tested, Share Rezults).
Avoid emojis unless the user uses one first.
If unsure, gently guide the user to test or learn more through Zults.
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
          { role: "user", content: userMessage },
        ],
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    return (
      reply ||
      "I’m here to help you understand sexual health and Rezults better — can you tell me what you’d like to know?"
    );
  } catch (error) {
    console.error("RezyAI error:", error);
    return "Hmm, I couldn’t process that just now. Try asking again in a moment.";
  }
}