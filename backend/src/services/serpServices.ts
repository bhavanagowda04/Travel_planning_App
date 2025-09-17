import axios from "axios";
import { SERP_API_KEY } from "../config.js";

const SERP_API_URL = "https://serpapi.com/search";

export async function serpSearch(query: string) {
  if (!SERP_API_KEY) {
    throw new Error("SERP API key not configured");
  }

  const params = {
    q: query,
    api_key: SERP_API_KEY,
    engine: "google"
  };

  try {
    const response = await axios.get(SERP_API_URL, { params });
    
    // Extract relevant information from SERP API response
    const { organic_results, answer_box, knowledge_graph } = response.data;
    
    // Format the response for the frontend
    const formattedResponse = {
      answer: answer_box?.answer || answer_box?.snippet || knowledge_graph?.description || "I couldn't find a specific answer to your question.",
      sources: organic_results?.slice(0, 3).map((result: any) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet
      })) || []
    };
    
    return formattedResponse;
  } catch (error) {
    console.error("SERP API error:", error);
    throw new Error("Failed to get search results");
  }
}