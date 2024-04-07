import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import {
    Button,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@repo/ui/components";
import { IconArrowElbow } from "@repo/ui/icons";
import React, { FormEvent, useRef, useState } from "react";
import Textarea from "react-textarea-autosize";

interface ChatInputFormProps {
    onMessageSubmit: (message: string) => Promise<void>;
}

export const ChatInputForm: React.FC<ChatInputFormProps> = ({
    onMessageSubmit,
}) => {
    const { formRef, onKeyDown } = useEnterSubmit();
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [inputValue, setInputValue] = useState("hello world");

    const handleFormSubmit = async (
        e: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        const message = inputValue.trim();
        if (!message) return;
        setInputValue("");
        await onMessageSubmit(message);
    };

    return (
        <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b duration-300 ease-in-out animate-in dark:from-gray-900/10 dark:from-10% peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]] mb-4">
            <div className="mx-auto sm:max-w-2xl sm:px-4">
                <div className="px-4 py-2 space-y-4 border-t shadow-lg dark:bg-slate-800 bg-gray-100 rounded-full sm:border md:py-4">
                    <form ref={formRef} onSubmit={handleFormSubmit}>
                        <div className="relative flex flex-col w-full overflow-hidden max-h-60 grow dark:bg-slate-800 bg-gray-100 rounded-full sm:border sm:px-2">
                            <Textarea
                                ref={inputRef}
                                tabIndex={0}
                                onKeyDown={onKeyDown}
                                placeholder="Send a message."
                                className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm dark:text-white text-black"
                                autoFocus
                                spellCheck={false}
                                autoComplete="off"
                                autoCorrect="off"
                                name="message"
                                rows={1}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <div className="absolute right-0 top-4 sm:right-4">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="submit"
                                            size="icon"
                                            disabled={!inputValue.trim()}
                                        >
                                            <IconArrowElbow />
                                            <span className="sr-only">Send message</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Send message</TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
