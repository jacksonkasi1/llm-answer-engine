// LLMResponseComponent.tsx
import { ClipboardCopyIcon } from "@radix-ui/react-icons";
import React, { useCallback } from "react";
import Markdown from "./Markdown";

import { toast } from "sonner";

interface LLMResponseComponentProps {
    llmResponse: string;
    currentLlmResponse: string;
}

const LLMResponseComponent: React.FC<LLMResponseComponentProps> = ({
    llmResponse,
    currentLlmResponse,
}) => {
    const isLoading = !llmResponse && !currentLlmResponse;
    const contentToShow = llmResponse || currentLlmResponse;

    const copyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(contentToShow);

        toast("Copied to clipboard", {
            description: "The LLM response has been copied to your clipboard",
        });
    }, [contentToShow]);

    return (
        <div className="bg-white dark:bg-slate-800  shadow-lg rounded-lg p-4 mt-4 relative">
            {isLoading ? (
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded-md dark:bg-gray-700 mb-4 w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded-md dark:bg-gray-700 mb-4 w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded-md dark:bg-gray-700 w-3/4"></div>
                </div>
            ) : (
                <>
                    <div className="prose dark:prose-dark dark:text-white max-w-none w-full pt-3 pb-6">
                        <Markdown markdown={contentToShow} />
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="absolute bottom-3 right-3 bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 dark:text-white p-2 rounded-full"
                    >
                        <ClipboardCopyIcon />
                    </button>
                </>
            )}
        </div>
    );
};

export default LLMResponseComponent;
