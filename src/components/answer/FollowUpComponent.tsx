import React from 'react';

interface FollowUpGroq {
    choices: {
        message: {
            content: string; // JSON string for Groq
        };
    }[];
}

interface FollowUpComponentProps {
    followUp: FollowUpGroq | string; // Direct string from Cloudflare AI or object from Groq
    handleFollowUpClick: (question: string) => void;
}

const FollowUpComponent: React.FC<FollowUpComponentProps> = ({
    followUp,
    handleFollowUpClick,
}) => {
    const handleQuestionClick = (question: string) => {
        handleFollowUpClick(question);
    };

    // Function to parse follow-up questions from both models
    const parseFollowUpQuestions = (input: FollowUpGroq | string): string[] => {
        if (typeof input === 'string') {
            // Direct string from Cloudflare AI
            return input
                .split("\n")
                .slice(1)
                .map(line => line.trim().substring(3).trim());
        } else {
            // Groq model follow-up questions stored in JSON format
            try {
                const parsed = JSON.parse(input.choices[0].message.content);
                if (parsed.followUp) {
                    return parsed.followUp;
                }
            } catch (error) {
                console.error("Error parsing Groq follow-up questions:", error);
            }
        }
        return [];
    };

    const followUpQuestions = parseFollowUpQuestions(followUp);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden mt-4">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
                <h2 className="text-lg font-semibold text-white">
                    Relevant Questions
                </h2>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {followUpQuestions.map((question, index) => (
                    <li
                        key={index}
                        className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-150"
                        onClick={() => handleQuestionClick(question)}
                    >
                        <span role="img" aria-label="link" className="mr-2 text-cyan-500 dark:text-cyan-400">
                            🔗
                        </span>
                        <p className="flex-1 text-gray-900 dark:text-white">
                            {question}
                        </p>
                    </li>
                ))}
            </ul>
        </div>

    );
};

export default FollowUpComponent;
