import rangeParser from 'parse-numeric-range';
import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';

// Define the TypeScript interface for Markdown props
interface MarkdownProps {
    markdown: string;
}

// Register languages if using PrismLight
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('markdown', markdown);

const Markdown: FC<MarkdownProps> = ({ markdown }) => {
    const components = {
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match && match[1] ? match[1] : '';
            const lineNumbers = node?.data?.meta;

            let lineProps = {};
            if (lineNumbers) {
                const highlightLines = rangeParser(lineNumbers);
                lineProps = (lineNumber: number) => ({
                    style: highlightLines.includes(lineNumber) ? { backgroundColor: '#ff0', display: 'block' } : {},
                });
            }

            return !inline && match ? (
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    showLineNumbers={true}
                    wrapLines={true}
                    lineProps={lineProps}
                    {...props}
                >
                    {String(children)}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
    };

    return <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} children={markdown} />;
};

export default Markdown;
