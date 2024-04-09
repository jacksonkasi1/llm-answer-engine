import { z } from "zod";

export const WorkerChatInputSchema = z.object({
  userMessage: z.string().default(""),
  vectorResults: z.array(z.any()).default([]),
});
