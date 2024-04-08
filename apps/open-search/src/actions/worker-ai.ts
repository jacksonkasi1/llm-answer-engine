import { ChatMessage, Streamable } from "@/types";
import { Ai } from "@cloudflare/ai";
import { getRequestContext } from "@cloudflare/next-on-pages";

export async function cloudflareChatCompletion(
  userMessage: string,
  vectorResults: any[],
  streamable: Streamable
): Promise<void> {
  console.log("🚀 Starting Cloudflare AI chat completion...");

  try {
    const ai = new Ai(getRequestContext().env.AI);

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `Here is the query "${userMessage}". Respond with a detailed answer. If you can't find relevant results, say "No relevant results found."`,
      },
      {
        role: "user",
        content: `Top results from a similarity search: ${JSON.stringify(
          vectorResults
        )}`,
      },
    ];

    const stream = (await ai.run("@cf/meta/llama-2-7b-chat-fp16", {
      messages,
      stream: true,
    })) as ReadableStream<Uint8Array>;

    const reader = stream.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("✅ Stream ended");
          streamable.done({ llmResponseEnd: true });
          break;
        }

        // Decode the stream chunk to text
        const chunkText = new TextDecoder("utf-8").decode(value);
        // Process each line in case the chunk contains multiple SSE messages
        const lines = chunkText.split("\n");
        for (const line of lines) {
          if (line.startsWith("data:")) {
            try {
              const data = JSON.parse(line.substring(5)); // Remove 'data: ' prefix and parse JSON
              if (data.response) {
                // Send each piece of response data as soon as it's received
                streamable.update({ llmResponse: data.response });
              }
            } catch (parseError) {
              console.error("🛑 Error parsing stream data:", parseError);
            }
          }
        }
      }
    } catch (readError) {
      console.error("🛑 Error reading stream:", readError);
      streamable.done({ llmError: "Error reading chat completion stream." });
    }
  } catch (error) {
    console.error("🛑 Error in Cloudflare AI chat completion:", error);
    streamable.done({ llmError: "Error obtaining chat completion." });
  }
}
