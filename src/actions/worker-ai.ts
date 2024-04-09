import { ChatMessage, SearchResult, Streamable } from "@/types";
import { Ai } from "@cloudflare/ai";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const relevantQuestionsCloudflare = async (
  sources: SearchResult[]
): Promise<any> => {
  console.log("🚀 Generate follow-up questions with Cloudflare AI...");
  try {
    const ai = new Ai(getRequestContext().env.AI);

    // Define the messages for the chat completion
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `
        You are a Question generator who generates an array of 3 follow-up questions in JSON format.
        The JSON schema should include:
        {
          "original": "The original search query or context",
          "followUp": [
            "Question 1",
            "Question 2", 
            "Question 3"
          ]
        }
        `,
      },
      {
        role: "user",
        content: `Generate follow-up questions based on the top results from a similarity search: ${JSON.stringify(
          sources
        )}. The original search query is: "The original search query".`,
      },
    ];

    // Execute the chat completion with the Cloudflare AI
    const response = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
      messages,
    });

    console.log("✅ Follow-up questions generated successfully.");
    console.log({ response });

    return response;
  } catch (error) {
    console.error(
      "🛑 Error generating follow-up questions with Cloudflare AI:",
      error
    );
    throw error;
  }
};

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

        const chunkText = new TextDecoder("utf-8").decode(value);
        const lines = chunkText.split("\n");
        for (const line of lines) {
          if (line.startsWith("data:")) {
            const dataString = line.substring(5).trim(); // Trim the whitespace
            if (dataString === "[DONE]") {
              // Handle the special "[DONE]" message
              console.log("✅ Stream completion marker received.");
              continue; // Skip the rest of the loop for this line
            }
            try {
              const data = JSON.parse(dataString);
              if (data.response) {
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
