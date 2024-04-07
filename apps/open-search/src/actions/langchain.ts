// ** import dependencies
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document as DocumentInterface } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// ** import types
import { ContentResult } from "@/types";

// ** import config
import { groq_config } from "@/config";

let embeddings: OpenAIEmbeddings;
embeddings = new OpenAIEmbeddings({
  modelName: groq_config.embeddingsModel,
});

//  Process and vectorize content using LangChain
export async function processAndVectorizeContent(
  contents: ContentResult[],
  query: string,
  textChunkSize = groq_config.textChunkSize,
  textChunkOverlap = groq_config.textChunkOverlap,
  numberOfSimilarityResults = groq_config.numberOfSimilarityResults
): Promise<DocumentInterface[]> {
  console.log("Process and vectorize content runs...🚀");
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
            embeddings
          );

          return await vectorStore.similaritySearch(
            query,
            numberOfSimilarityResults
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
