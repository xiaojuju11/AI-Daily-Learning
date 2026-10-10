import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

export function createModel({temperature = 0.5, maxTokens = 1024}) {
  return new ChatOpenAI({
    model: process.env.AI_MODEL,
    apiKey: process.env.AI_API_KEY,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    temperature,
    maxTokens,
  });
}