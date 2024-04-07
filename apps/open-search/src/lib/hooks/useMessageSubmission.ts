import { useCallback } from "react";

import { readStreamableValue, useActions } from "ai/rsc";
import { useAtom } from "jotai";

// ** import store
import { currentLlmResponseAtom, messagesAtom } from "@/store";

// ** import actions
import { AI } from "@/actions";

// ** import types
import { SearchResult, StreamMessage } from "@/types";

export const useMessageSubmission = () => {
  const { myAction } = useActions<typeof AI>();

  const [, setMessages] = useAtom(messagesAtom);
  const [, setCurrentLlmResponse] = useAtom(currentLlmResponseAtom);

  const handleUserMessageSubmission = useCallback(
    async (userMessage: string): Promise<void> => {
      // Clear existing messages and set loading state before new submission
      setCurrentLlmResponse(""); // Clear current LLM response

      const newMessageId = Date.now();

      const newMessage = {
        id: newMessageId,
        type: "userMessage",
        userMessage: userMessage,
        content: "",
        images: [],
        videos: [],
        followUp: null,
        isStreaming: true,
        searchResults: [] as SearchResult[],
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      let lastAppendedResponse = "";

      try {
        const streamableValue = await myAction(userMessage);
        let llmResponseString = "";

        for await (const message of readStreamableValue(streamableValue)) {
          const typedMessage = message as StreamMessage;
          setMessages((prevMessages) => {
            const messagesCopy = [...prevMessages];
            const messageIndex = messagesCopy.findIndex(
              (msg) => msg.id === newMessageId
            );
            if (messageIndex !== -1) {
              const currentMessage = messagesCopy[messageIndex];
              if (
                typedMessage.llmResponse &&
                typedMessage.llmResponse !== lastAppendedResponse
              ) {
                currentMessage.content += typedMessage.llmResponse;
                lastAppendedResponse = typedMessage.llmResponse; // Update last appended response
              }
              if (typedMessage.llmResponseEnd) {
                currentMessage.isStreaming = false;
              }
              if (typedMessage.searchResults) {
                currentMessage.searchResults = typedMessage.searchResults;
              }
              if (typedMessage.images) {
                currentMessage.images = [...typedMessage.images];
              }
              if (typedMessage.videos) {
                currentMessage.videos = [...typedMessage.videos];
              }
              if (typedMessage.followUp) {
                currentMessage.followUp = typedMessage.followUp;
              }
            }
            return messagesCopy;
          });
          if (typedMessage.llmResponse) {
            llmResponseString += typedMessage.llmResponse;
            setCurrentLlmResponse(llmResponseString);
          }
        }
      } catch (error) {
        console.error("🔴 Error streaming data for user message:", error);
      }
    },
    [myAction, setMessages, setCurrentLlmResponse]
  );

  return { handleUserMessageSubmission };
};
