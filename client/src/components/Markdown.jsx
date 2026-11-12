import ReactMarkdown from "react-markdown";
import remarkgfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Markdown = ({ content = "" }) => {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkgfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            return match ? (
              <SyntaxHighlighter language={match[1]} style={oneDark}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code {...props}>{children}</code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
