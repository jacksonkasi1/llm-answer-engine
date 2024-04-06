import { env } from "@/env.mjs";

export const config = {
  inferenceModel: "mixtral-8x7b-32768", // Groq: 'mixtral-8x7b-32768', 'gemma-7b-it' // OpenAI: 'gpt-3.5-turbo', 'gpt-4'
  inferenceAPIKey: env.GROQ_API_KEY, // Groq: process.env.GROQ_API_KEY // OpenAI: process.env.OPENAI_API_KEY
  embeddingsModel: "text-embedding-3-small", // OpenAI 'text-embedding-3-small', 'text-embedding-3-large'
  textChunkSize: 1000,
  textChunkOverlap: 400,
  numberOfSimilarityResults: 4, // Numbher of similarity results to return per page
  numberOfPagesToScan: 10,
  groqOpenAiBaseURL: "https://api.groq.com/openai/v1", //Groq: https://api.groq.com/openai/v1 // OpenAI: https://api.openai.com/v1
};
