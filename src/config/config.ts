import { env } from "@/env.mjs";

export const groq_config = {
  inferenceModel: "mixtral-8x7b-32768", // Groq: 'mixtral-8x7b-32768', 'gemma-7b-it'
  inferenceAPIKey: env.GROQ_API_KEY, // Groq: process.env.GROQ_API_KEY
  embeddingsModel: "text-embedding-3-small", // OpenAI 'text-embedding-3-small', 'text-embedding-3-large'
  textChunkSize: 1000,
  textChunkOverlap: 400,
  numberOfSimilarityResults: 4, // Number of similarity results to return per page
  numberOfPagesToScan: 4,
  groqOpenAiBaseURL: "https://api.groq.com/openai/v1", //Groq: https://api.groq.com/openai/v1
};

export const openai_config = {
  inferenceModel: "gpt-3.5-turbo", // OpenAI: 'gpt-3.5-turbo', 'gpt-4'
  inferenceAPIKey: env.OPENAI_API_KEY, // OpenAI: process.env.OPENAI_API_KEY
  embeddingsModel: "text-embedding-3-small", // OpenAI 'text-embedding-3-small', 'text-embedding-3-large'
  textChunkSize: 1000,
  textChunkOverlap: 400,
  numberOfSimilarityResults: 4, // Number of similarity results to return per page
  numberOfPagesToScan: 10,
  groqOpenAiBaseURL: "https://api.groq.com/openai/v1", // OpenAI: https://api.openai.com/v1
};

export const worker_config = {
  interfaceModel: "@hf/thebloke/llama-2-13b-chat-awq",
  embeddingsModel: "text-embedding-3-small",
  textChunkSize: 1000,
  textChunkOverlap: 400,
  numberOfSimilarityResults: 4, // Number of similarity results to return per page
  numberOfPagesToScan: 10,
};
