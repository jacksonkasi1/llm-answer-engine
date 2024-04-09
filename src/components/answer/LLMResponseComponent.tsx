import React from "react";
import Markdown from "react-markdown";

interface LLMResponseComponentProps {
    llmResponse: string;
    currentLlmResponse: string;
}

// Component to display streaming content
const StreamingComponent: React.FC<{ currentLlmResponse: string }> = ({
    currentLlmResponse,
}) => {
    console.log("📡 Streaming response content...");
    return (
        <div className="dark:bg-slate-800 bg-white shadow-lg rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold dark:text-white text-black">
                    Answer
                </h2>
                <img src="./groq.png" alt="groq logo" className="w-6 h-6" />
            </div>
            <div className="dark:text-gray-300 text-gray-800">
                <Markdown>{currentLlmResponse}</Markdown>
            </div>
        </div>
    );
};

// Main LLMResponseComponent
const LLMResponseComponent: React.FC<LLMResponseComponentProps> = ({
    llmResponse,
    currentLlmResponse,
}) => {
    const isLoading = !llmResponse && !currentLlmResponse;
    const hasLlmResponse = llmResponse.trim().length > 0;

    console.log(
        hasLlmResponse
            ? "📄 Displaying LLM response..."
            : "⏳ Loading LLM response...",
    );

    return (
        <>
            {isLoading ? (
                <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            ) : hasLlmResponse ? (
                <div className="dark:bg-slate-800 bg-white shadow-lg rounded-lg p-4 mt-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold dark:text-white text-black">
                            Answer
                        </h2>
                        <img
                            src="./mistral.png"
                            alt="mistral logo"
                            className="w-6 h-6 mr-2"
                        />
                        <img src="./groq.png" alt="groq logo" className="w-6 h-6" />
                    </div>
                    <div className="dark:text-gray-300 text-gray-800">
                        <Markdown>{llmResponse}</Markdown>
                    </div>
                </div>
            ) : (
                <StreamingComponent currentLlmResponse={currentLlmResponse} />
            )}
        </>
    );
};

export default LLMResponseComponent;
