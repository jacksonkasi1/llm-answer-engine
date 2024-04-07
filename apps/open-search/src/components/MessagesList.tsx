import { Message } from "@/types";
import React from "react";

// Custom components
import FollowUpComponent from "@/components/answer/FollowUpComponent";
import ImagesComponent from "@/components/answer/ImagesComponent";
import LLMResponseComponent from "@/components/answer/LLMResponseComponent";
import SearchResultsComponent from "@/components/answer/SearchResultsComponent";
import UserMessageComponent from "@/components/answer/UserMessageComponent";
import VideosComponent from "@/components/answer/VideosComponent";

interface MessagesListProps {
    messages: Message[];
    currentLlmResponse: string;
    handleFollowUpClick: (question: string) => void;
}

export const MessagesList: React.FC<MessagesListProps> = ({
    messages,
    currentLlmResponse,
    handleFollowUpClick,
}) => (
    <div className="flex flex-col">
        {messages.map((message, index) => (
            <div key={`message-${index}`} className="flex flex-col md:flex-row">
                <div className="w-full md:w-3/4 md:pr-2">
                    {message.searchResults && (
                        <SearchResultsComponent searchResults={message.searchResults} />
                    )}
                    {message.type === "userMessage" && (
                        <UserMessageComponent message={message.userMessage} />
                    )}
                    <LLMResponseComponent
                        index={index}
                        llmResponse={message.content}
                        currentLlmResponse={currentLlmResponse}
                    />
                    {message.followUp && (
                        <div className="flex flex-col">
                            <FollowUpComponent
                                followUp={message.followUp}
                                handleFollowUpClick={handleFollowUpClick}
                            />
                        </div>
                    )}
                </div>
                <div className="w-full md:w-1/4 lg:pl-2">
                    {message.videos && <VideosComponent videos={message.videos} />}
                    {message.images && <ImagesComponent images={message.images} />}
                </div>
            </div>
        ))}
    </div>
);

export default MessagesList;
