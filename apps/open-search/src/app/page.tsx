"use client";
import { ChatInputForm } from "@/components/ChatInputForm";
import MessagesList from "@/components/MessagesList";
import { useKeyboardShortcut, useMessageSubmission } from "@/lib/hooks";
import { ChatScrollAnchor } from "@/lib/hooks/chat-scroll-anchor";
import { currentLlmResponseAtom, messagesAtom } from "@/store";
import { useAtom } from "jotai";
import { useRef } from "react";

export default function Page() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [messages] = useAtom(messagesAtom);
  const [currentLlmResponse] = useAtom(currentLlmResponseAtom);

  const { handleUserMessageSubmission } = useMessageSubmission();

  useKeyboardShortcut(inputRef);

  return (
    <div>
      <MessagesList
        messages={messages}
        currentLlmResponse={currentLlmResponse}
        handleFollowUpClick={handleUserMessageSubmission}
      />
      <div className="pb-[80px] pt-4 md:pt-10">
        <ChatScrollAnchor trackVisibility={true} />
      </div>
      <ChatInputForm onMessageSubmit={handleUserMessageSubmission} />
    </div>
  );
}
