import { SearchResult, Streamable } from "@/types";
import OpenAI from "openai";

// ** import config
import { groq_config } from "@/config";

let openai: OpenAI;
openai = new OpenAI({
  baseURL: groq_config.groqOpenAiBaseURL,
  apiKey: groq_config.inferenceAPIKey,
});

// Generate follow-up questions using OpenAI API
export const relevantQuestions = async (
  sources: SearchResult[]
): Promise<any> => {
  console.log("Generate follow-up questions runs...🚀");
  try {
    return await openai.chat.completions.create({
      messages: [
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
      ],
      model: groq_config.inferenceModel,
      response_format: { type: "json_object" },
    });
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    throw error;
  }
};

// OpenAI chat completion function with streaming
export async function chatCompletion(
  userMessage: string,
  vectorResults: any[],
  streamable: Streamable
): Promise<void> {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
          - Here is my query "${userMessage}", respond back with an answer that is as long as possible. If you can't find any relevant results, respond with "No relevant results found." `,
        },
        {
          role: "user",
          content: ` - Here are the top results from a similarity search: ${JSON.stringify(
            vectorResults
          )}. `,
        },
      ],
      stream: true,
      model: groq_config.inferenceModel,
    });

    for await (const chunk of chatCompletion) {
      if (chunk.choices[0].delta && chunk.choices[0].finish_reason !== "stop") {
        streamable.update({ llmResponse: chunk.choices[0].delta.content });
      } else if (chunk.choices[0].finish_reason === "stop") {
        streamable.update({ llmResponseEnd: true });
      }
    }
  } catch (error) {
    console.error("Error in chatCompletion:", error);
    streamable.update({ llmError: "Error obtaining chat completion." });
  }
}
