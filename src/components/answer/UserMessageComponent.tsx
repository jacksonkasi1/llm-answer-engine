// 1. Interface defining the props for UserMessageComponent, expecting a 'message' of type string.
interface UserMessageComponentProps {
    message: string;
}

// 2. UserMessageComponent functional component that renders a message within styled div elements.
const UserMessageComponent: React.FC<UserMessageComponentProps> = ({
    message,
}) => {
    return (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-xl overflow-hidden my-4">
            <div className="p-4 text-white">
                <h2 className="text-lg md:text-xl font-semibold">{message}</h2>
                <p className="text-sm md:text-base mt-1">Search Query</p>
            </div>
        </div>
    );
};

export default UserMessageComponent;
