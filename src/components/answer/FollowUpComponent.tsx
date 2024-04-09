import React from 'react';

// 1. TypeScript Interface for FollowUp
interface FollowUp {
    choices: {
        message: {
            content: string; // Assuming content is a JSON string that can be parsed to an object with a followUp property
        };
    }[];
}

// 2. TypeScript Props Definition
interface FollowUpComponentProps {
    followUp: FollowUp;
    handleFollowUpClick: (question: string) => void;
}

// 3. FollowUpComponent Functional Component
const FollowUpComponent: React.FC<FollowUpComponentProps> = ({ followUp, handleFollowUpClick }) => {
    // Handler when a follow-up question is clicked
    const handleQuestionClick = (question: string) => {
        console.log(`🔍 Selected follow-up question: ${question}`);
        handleFollowUpClick(question);
    };

    // Safely parse JSON content and return null if parsing fails
    const safeParseJSON = (content: string) => {
        try {
            return JSON.parse(content);
        } catch (error) {
            console.error(`🚨 Error parsing JSON content: ${error}`);
            return null;
        }
    };

    const parsedContent = safeParseJSON(followUp.choices[0].message.content);
    const followUpQuestions = parsedContent ? parsedContent.followUp : [];

    return (
        <div className="dark:bg-slate-800 bg-white shadow-lg rounded-lg p-4 mt-4">
            <div className="flex items-center">
                <h2 className="text-lg font-semibold flex-grow dark:text-white text-black">Relevant</h2>
                <img src="./mistral.png" alt="mistral logo" className='w-6 h-6 mr-2' />
                <img src="./groq.png" alt="groq logo" className='w-6 h-6' />
            </div>
            <ul className="mt-2">
                {followUpQuestions.map((question: string, index: number) => (
                    <li
                        key={index}
                        className="flex items-center mt-2 cursor-pointer"
                        onClick={() => handleQuestionClick(question)}
                    >
                        <span role="img" aria-label="link" className="mr-2 dark:text-white text-black">🔗</span>
                        <p className="dark:text-white text-black hover:underline">{question}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FollowUpComponent;
