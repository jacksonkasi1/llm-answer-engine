// server-only environment setup
import "server-only";

// ** import dependencies
import { createAI, createStreamableValue } from "ai/rsc";

// ** import action
import {
  chatCompletion,
  cloudflareChatCompletion,
  get10BlueLinksContents,
  getImages,
  getSources,
  getVideos,
  processAndVectorizeContent,
  relevantQuestions,
} from "@/actions";

// ** import types
import { initialAIState, initialUIState } from "@/types";

/**
 * Orchestrates fetching and processing web content based on a user's message.
 * Retrieves images, sources, and videos related to the message, processes the content,
 * performs a chat completion, and gathers relevant follow-up questions.
 *
 * @param {string} userMessage - The user's query or message input.
 * @returns {Promise<any>} - A promise that resolves to the final state of the streamable content.
 */
async function myAction(userMessage: string): Promise<any> {
  "use server";
  // Initialize streamable state for dynamic updates
  const streamable = createStreamableValue({});
  try {
    console.log(`🔍 Processing user message: "${userMessage}"`);

    // Immediately invoked async function to perform parallel data fetching and processing
    (async () => {
      // Parallel fetching of images, sources, and videos related to the user message
      const [sources, images, videos] = await Promise.all([
        getSources(userMessage),
        getImages(userMessage),
        getVideos(userMessage),
      ]);
      console.log("✅ Data fetching complete");

      // Update the streamable state with fetched data
      streamable.update({ searchResults: sources, images, videos });

      // Fetch and process webpage content into markdown
      const websiteContent = await get10BlueLinksContents(sources);
      console.log("📝 Markdown conversion complete");

      // Vectorize the processed content for similarity search
      const vectorResults = await processAndVectorizeContent(
        websiteContent,
        userMessage
      );
      console.log("🔎 Vectorization and similarity search complete");

      // Perform chat completion with vectorized results
      if (false) await chatCompletion(userMessage, vectorResults, streamable);

      await cloudflareChatCompletion(userMessage, vectorResults, streamable);

      console.log("💬 Chat completion processed");

      // Fetch relevant follow-up questions based on the sources
      const followUp = await relevantQuestions(sources);
      streamable.update({ followUp: followUp });
      console.log("❓ Relevant questions updated");

      // Mark the streamable state as done
      streamable.done({ status: "done" });
      console.log("✨ Action complete");
    })();
    return streamable.value;
  } catch (error) {
    // Log errors and throw to indicate failure
    console.error("❌ Error in myAction:", error);

    // Mark the streamable state as failed
    streamable.done({ status: "failed" });

    throw error;
  }
}

// Export the AI instance with the defined actions and initial states
export const AI = createAI({
  actions: { myAction },
  initialUIState,
  initialAIState,
});
