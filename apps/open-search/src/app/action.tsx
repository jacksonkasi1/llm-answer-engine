// 1. Import dependencies
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createAI, createStreamableValue } from "ai/rsc";
import { Document as DocumentInterface } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAI } from "openai";
import "server-only";
// 1.5 Configuration file for inference model, embeddings model, and other parameters
import {
  get10BlueLinksMarkdown,
  getImages,
  getSources,
  getVideos,
} from "@/actions";
import { ContentResult, SearchResult } from "@/types";
import { config } from "./config";

// 2. Determine which embeddings mode and which inference model to use based on the config.tsx. Currently suppport for OpenAI, Groq and partial support for Ollama embeddings and inference
let openai: OpenAI;
if (config.useOllamaInference) {
  openai = new OpenAI({
    baseURL: config.ollamaBaseUrl,
    apiKey: "ollama",
  });
} else {
  openai = new OpenAI({
    baseURL: config.nonOllamaBaseURL,
    apiKey: config.inferenceAPIKey,
  });
}
// 2.5 Set up the embeddings model based on the config.tsx
let embeddings: OllamaEmbeddings | OpenAIEmbeddings;
if (config.useOllamaEmbeddings) {
  embeddings = new OllamaEmbeddings({
    model: config.embeddingsModel,
    baseUrl: "http://localhost:11434",
  });
} else {
  embeddings = new OpenAIEmbeddings({
    modelName: config.embeddingsModel,
  });
}


// 6. Process and vectorize content using LangChain
async function processAndVectorizeContent(
  contents: ContentResult[],
  query: string,
  textChunkSize = config.textChunkSize,
  textChunkOverlap = config.textChunkOverlap,
  numberOfSimilarityResults = config.numberOfSimilarityResults,
): Promise<DocumentInterface[]> {
  console.log("processAndVectorizeContent runs...🚀");
  try {
    for (let i = 0; i < contents.length; i++) {
      const content = contents[i];
      if (content.html.length > 0) {
        try {
          const splitText = await new RecursiveCharacterTextSplitter({
            chunkSize: textChunkSize,
            chunkOverlap: textChunkOverlap,
          }).splitText(content.html);
          const vectorStore = await MemoryVectorStore.fromTexts(
            splitText,
            { title: content.title, link: content.link },
            embeddings,
          );
          return await vectorStore.similaritySearch(
            query,
            numberOfSimilarityResults,
          );
        } catch (error) {
          console.error(`Error processing content for ${content.link}:`, error);
        }
      }
    }
    return [];
  } catch (error) {
    console.error("Error processing and vectorizing content:", error);
    throw error;
  }
}

// 9. Generate follow-up questions using OpenAI API
const relevantQuestions = async (sources: SearchResult[]): Promise<any> => {
  console.log("relevantQuestions runs...🚀");
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
          content: `Generate follow-up questions based on the top results from a similarity search: ${JSON.stringify(sources)}. The original search query is: "The original search query".`,
        },
      ],
      model: config.inferenceModel,
      response_format: { type: "json_object" },
    });
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    throw error;
  }
};

// 10. Main action function that orchestrates the entire process
async function myAction(userMessage: string): Promise<any> {
  "use server";
  try {
    const streamable = createStreamableValue({});
    (async () => {
      const [images, sources, videos] = await Promise.all([
        getImages(userMessage),
        getSources(userMessage),
        getVideos(userMessage),
      ]);
      streamable.update({ searchResults: sources });
      streamable.update({ images: images });
      streamable.update({ videos: videos });
      const websiteContent = await get10BlueLinksMarkdown(sources);

      const vectorResults = await processAndVectorizeContent(
        websiteContent,
        userMessage,
      );
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `
          - Here is my query "${userMessage}", respond back with an answer that is as long as possible. If you can't find any relevant results, respond with "No relevant results found." `,
          },
          {
            role: "user",
            content: ` - Here are the top results from a similarity search: ${JSON.stringify(vectorResults)}. `,
          },
        ],
        stream: true,
        model: config.inferenceModel,
      });
      for await (const chunk of chatCompletion) {
        if (
          chunk.choices[0].delta &&
          chunk.choices[0].finish_reason !== "stop"
        ) {
          streamable.update({ llmResponse: chunk.choices[0].delta.content });
        } else if (chunk.choices[0].finish_reason === "stop") {
          streamable.update({ llmResponseEnd: true });
        }
      }
      if (!config.useOllamaInference) {
        const followUp = await relevantQuestions(sources);
        streamable.update({ followUp: followUp });
      }
      streamable.done({ status: "done" });
    })();
    return streamable.value;
  } catch (error) {
    console.error("Error in myAction:", error);
    throw error;
  }
}

// 11. Define initial AI and UI states
const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];
const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

// 12. Export the AI instance
export const AI = createAI({
  actions: {
    myAction,
  },
  initialUIState,
  initialAIState,
});
