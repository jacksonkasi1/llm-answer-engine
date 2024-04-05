//   ** Import Client **
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * ServerSide Environment variables, not available on the client.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    GOOGLE_SEARCH_API_KEY: z.string(),
    GOOGLE_SEARCH_ENGINE_ID: z.string(),
    GROQ_API_KEY: z.string(),
    OPENAI_API_KEY: z.string(),
    SERPER_API: z.string(),
  },
  /*
   * Environment variables available on the client (and server).
   */
  client: {},

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_SEARCH_API_KEY: process.env.GOOGLE_SEARCH_API_KEY,
    GOOGLE_SEARCH_ENGINE_ID: process.env.GOOGLE_SEARCH_ENGINE_ID,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SERPER_API: process.env.SERPER_API,
  },
});
