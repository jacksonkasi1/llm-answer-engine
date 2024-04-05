import { env } from "@/env.mjs";

export const apiConfig = {
  googleCustomSearch: {
    baseURL: "https://www.googleapis.com/customsearch/v1",
    favBaseURL: "https://www.google.com/s2/favicons",
    apiKey: env.GOOGLE_SEARCH_API_KEY,
    searchEngineId: env.GOOGLE_SEARCH_ENGINE_ID,
  },
  scraper: {
    baseURL: "https://google.serper.dev",
    apiKey: env.SERPER_API,
  },
};
