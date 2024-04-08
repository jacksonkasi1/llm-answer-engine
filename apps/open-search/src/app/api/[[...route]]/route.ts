import { Hono } from "hono";
import { cors } from "hono/cors";
import { stream } from "hono/streaming";
import { handle } from "hono/vercel";

import { env } from "hono/adapter";

// ** import ai
import { Ai } from "@cloudflare/ai";

// ** import types
import { ChatMessage } from "@/types";

export const runtime = "edge";

type EnvConfig = {
  AI: any;
};

const app = new Hono().basePath("/api");

app.use("/*", cors());

app.get("/", async (c) => {
  return c.json({ message: "Hello Next.js!" });
});

// Endpoint for chat which uses streaming
app.get("/test", async (c) => {
  return stream(c, async (stream) => {
    try {
      // Example: Write a simple text response multiple times
      for (let i = 0; i < 5; i++) {
        await stream.write(`Stream content ${i}\n`);
        // Wait for a second before the next write
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      // When done writing to the stream
      stream.close();
    } catch (err) {
      // Error handling if something goes wrong during the stream
      console.error("Error during streaming:", err);
      stream.close();
    }
  });
});

// Endpoint for chat which uses streaming
app.get(
  "/chat",
  // zValidator("json", WorkerChatInputSchema),
  async (c, req) => {
    return stream(c, async (stream) => {
      const { AI } = env<EnvConfig>(c);
      const ai = new Ai(AI);

      // const { userMessage, vectorResults } = c.req.valid("json");
      try {
        const messages: ChatMessage[] = [
          {
            role: "system",
            content: `Here is the query "${"userMessage"}". Respond with a detailed answer. If you can't find relevant results, say "No relevant results found."`,
          },
          {
            role: "user",
            content: `Here are the top results from a similarity search: ${JSON.stringify(
              "vectorResults"
            )}`,
          },
        ];

        const streamResponse: any = await ai.run(
          "@hf/thebloke/llama-2-13b-chat-awq",
          {
            messages,
            stream: true,
          }
        );

        stream.write(streamResponse);
      } catch (err) {
        // Error handling if something goes wrong during the stream
        console.error("Error during streaming:", err);
        stream.close();
      } finally {
        stream.close();
      }
    });
  }
);

export const GET = handle(app);
export default app as never;
