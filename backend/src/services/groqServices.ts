import Groq from "groq-sdk";
import { GROQ_API_KEY } from "../config.js";

const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

type TravelPayload = {
  country: string;
  state?: string;
  fromDate?: Date;
  toDate?: Date;
  budget?: number;
  currency?: { code: string; symbol: string };
  activities?: string[];
  travelType?: string;
};

export async function generatePlan(data: TravelPayload) {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ API key not configured");
  }

  // Calculate number of days
  let days = 3; // Default
  if (data.fromDate && data.toDate) {
    const fromDate = new Date(data.fromDate);
    const toDate = new Date(data.toDate);
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  }

  // Format destination
  const destination = data.state
    ? `${data.country}, ${data.state}`
    : data.country;

  // Format budget
  const budgetText =
    data.budget && data.currency
      ? `${data.currency.symbol}${data.budget}`
      : "flexible";

  // Format preferences
  const preferences = data.activities?.join(", ") || "sightseeing";

  // Format travel type
  const travelType = data.travelType || "solo";

  // Build user prompt dynamically
  const prompt = `Suggest a ${days}-day ${travelType} trip to ${destination} under a budget of ${budgetText}.
Preferences: ${preferences}.
Return the response in a structured JSON format with overview, itinerary (day-wise), practicalInfo, and budgetBreakdown.`;

  // Call Groq API (streaming response)
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful travel planning assistant.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_completion_tokens: 1024,
    stream: true,
  });

  // Collect the streamed response into a single string
  let fullResponse = "";
  for await (const chunk of chatCompletion) {
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content); // optional: logs streaming chunks
    fullResponse += content;
  }

  // Try to parse JSON safely
  try {
    const jsonMatch =
      fullResponse.match(/```json\n([\s\S]*?)\n```/) ||
      fullResponse.match(/```([\s\S]*?)```/);
    const jsonContent = jsonMatch ? jsonMatch[1] : fullResponse;

    return JSON.parse(jsonContent);
  } catch (err) {
    console.error("Failed to parse JSON from Groq:", err);
    return {
      overview: "Generated travel plan",
      rawContent: fullResponse,
    };
  }
}
