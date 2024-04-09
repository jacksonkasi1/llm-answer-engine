import { SearchResult } from "@/types";
import { useEffect, useState } from "react";

export interface SearchResultsComponentProps {
    searchResults: SearchResult[];
}

const SearchResultsComponent = ({
    searchResults,
}: SearchResultsComponentProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [loadedFavicons, setLoadedFavicons] = useState<boolean[]>([]);

    useEffect(() => {
        setLoadedFavicons(Array(searchResults.length).fill(false));
    }, [searchResults]);

    const toggleExpansion = () => setIsExpanded(!isExpanded);
    const visibleResults = isExpanded ? searchResults : searchResults.slice(0, 3);

    const handleFaviconLoad = (index: number) => {
        setLoadedFavicons((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden my-4">
            <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Search Results</h2>
                <button
                    onClick={toggleExpansion}
                    className="bg-white dark:bg-gray-700 text-blue-500 dark:text-teal-300 rounded-md px-3 py-1 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    {isExpanded ? "Show Less" : `View More (${searchResults.length - 3})`}
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {visibleResults.map((result, index) => (
                    <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                        <img
                            src={result.favicon}
                            alt="favicon"
                            className="w-6 h-6 rounded-full"
                            onLoad={() => handleFaviconLoad(index)}
                            style={{ display: loadedFavicons[index] ? "block" : "none" }}
                        />
                        {!loadedFavicons[index] && (
                            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-500 rounded-full animate-pulse"></div>
                        )}
                        <div className="flex-grow">
                            <a
                                href={result.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-gray-900 dark:text-white hover:underline"
                            >
                                {result.title}
                            </a>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {result.snippet}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResultsComponent;
