import { ChatMessage, Streamable } from "@/types";
import { Ai } from "@cloudflare/ai";
import { getRequestContext } from "@cloudflare/next-on-pages";

interface CloudflareRequestData {
  messages: ChatMessage[];
}

// The streamable interface is already defined, so we use it directly
export async function cloudflareChatCompletion(
  userMessage: string,
  vectorResults: any[],
  streamable: Streamable
): Promise<void> {
  console.log("🚀 Cloudflare chat completion runs...");

  try {
    const requestContext = getRequestContext().env.AI;
    const ai = new Ai(requestContext);

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `Here is the query "${userMessage}". Respond with a detailed answer. If you can't find relevant results, say "No relevant results found."`,
      },
      {
        role: "user",
        content: `Here are the top results from a similarity search: ${JSON.stringify(
          vectorResults
        )}`,
      },
    ];

    const requestData: CloudflareRequestData = { messages };
    const stream = (await ai.run("@cf/meta/llama-2-7b-chat-fp16", {
      ...requestData,
      stream: true,
    })) as ReadableStream;
    const reader = stream.getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        streamable.done({ llmResponseEnd: true });
        break;
      }

      if (value) {
        streamable.update({ llmResponse: value.toString() }); // Make sure value is a string
      }
    }
  } catch (error) {
    console.error("🛑 Error in cloudflareChatCompletion:", error);
    streamable.done({ llmError: "Error obtaining chat completion." });
  }
}
