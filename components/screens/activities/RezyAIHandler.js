// components/screens/activities/RezyAIHandler.js
import Constants from "expo-constants";
import * as Network from "expo-network";
import rezyKnowledge from "../../../assets/data/rezy_knowledge.json";
import rezyPersona from "../../../assets/data/rezy_persona.json";
import nhsData from "../../../assets/data/nhs_data.json";

// 🧠 Get the OpenAI key (works both locally and in EAS/TestFlight)
const OPENAI_API_KEY =
  Constants.expoConfig?.extra?.OPENAI_API_KEY ||
  Constants.manifest?.extra?.OPENAI_API_KEY ||
  process.env.OPENAI_API_KEY ||
  "";

// 🧠 Simple persistent memory (lives while app is open)
let conversationHistory = [];

// ⚙️ Helper: robust API call with timeout + retry
async function callOpenAI(payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // iOS sometimes fails on res.json() directly, safer to parse manually:
    const text = await res.text();
    const data = JSON.parse(text);
    return data;
  } catch (err) {
    console.warn("⚠️ Rezy network issue, retrying once:", err.message);
    return null; // allow retry
  }
}

export async function handleRezyAI(userMessage) {
  try {
    const lowerMsg = userMessage.toLowerCase();

    // 🧠 Save the user message to memory
    conversationHistory.push({ role: "user", content: userMessage });

    // Optional: log current network state
    try {
      const net = await Network.getNetworkStateAsync();
      console.log("📶 Network:", net.isConnected ? "Connected" : "Offline", net.type);
    } catch {}

    // 🧠 1️⃣ Check local knowledge base
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
When you respond, speak as Rez — warm, concise, and deeply kind.
Do not reintroduce yourself if the user already knows you.
`;

    // 🧠 Log key presence (safe)
    console.log("🔑 OPENAI key (first 10 chars):", OPENAI_API_KEY?.slice(0, 10) || "❌ none");
    console.log("🧠 Sending to OpenAI. Messages so far:", conversationHistory.length);

    const payload = {
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...conversationHistory],
      temperature: 0.8,
      max_tokens: 250,
    };

    // Primary request
    let data = await callOpenAI(payload);
    if (!data) {
      // Retry once if network failed
      await new Promise((r) => setTimeout(r, 1000));
      data = await callOpenAI(payload);
    }

    if (!data || !data.choices) {
      throw new Error("No valid response from OpenAI");
    }

    console.log("🩵 Raw OpenAI reply:", JSON.stringify(data, null, 2));

    const reply = data?.choices?.[0]?.message?.content?.trim();

    // 💾 Save Rez’s reply in memory
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