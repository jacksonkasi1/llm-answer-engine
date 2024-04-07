"use client";

// 1. Import Dependencies
import { type AI } from "@/actions";
import { ChatScrollAnchor } from "@/lib/hooks/chat-scroll-anchor";
import { readStreamableValue, useActions } from "ai/rsc";
import { useCallback, useEffect, useRef, useState } from "react";

// ** import types
import { ChatInputForm } from "@/components/ChatInputForm";
import MessagesList from "@/components/MessagesList";
import { Message, SearchResult, StreamMessage } from "@/types";

export default function Page() {
  // 3. Set up action that will be used to stream all the messages
  const { myAction } = useActions<typeof AI>();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 5. Set up state for the messages
  const [messages, setMessages] = useState<Message[]>([]);
  // 6. Set up state for the CURRENT LLM response (for displaying in the UI while streaming)
  const [currentLlmResponse, setCurrentLlmResponse] = useState("");

  // 7. Set up handler for when the user clicks on the follow up button
  const handleFollowUpClick = useCallback(async (question: string) => {
    setCurrentLlmResponse("");
    await handleUserMessageSubmission(question);
  }, []);

  // 8. For the form submission, we need to set up a handler that will be called when the user submits the form
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        if (
          e.target &&
          ["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).nodeName)
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (inputRef?.current) {
          inputRef.current.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);


  const handleUserMessageSubmission = async (
    userMessage: string,
  ): Promise<void> => {
    console.log("handleUserMessageSubmission", userMessage);
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
            (msg) => msg.id === newMessageId,
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
      console.error("Error streaming data for user message:", error);
    }
  };

  return (
    <div>
      <MessagesList
        messages={messages}
        currentLlmResponse={currentLlmResponse}
        handleFollowUpClick={handleFollowUpClick}
      />

      <div className="pb-[80px] pt-4 md:pt-10">
        <ChatScrollAnchor trackVisibility={true} />
      </div>

      <ChatInputForm onMessageSubmit={handleUserMessageSubmission} />
    </div>
  );
}
