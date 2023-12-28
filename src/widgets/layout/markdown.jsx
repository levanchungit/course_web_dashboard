import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeSanitize from "rehype-sanitize";

const removeParagraphTags = () => (tree) => {
  tree.children.forEach((node) => {
    if (
      node.tagName === "p" &&
      node.children.length === 1 &&
      node.children[0].tagName === "img"
    ) {
      tree.children.splice(tree.children.indexOf(node), 1, node.children[0]);
    }
  });
};

const fixImages = () => (tree) => {
  tree.children.forEach((node) => {
    if (node.tagName === "img" || node.tagName === "pre") {
      node.properties = node.properties || {};
      node.properties.style = "max-width: 100%; height: auto; border-radius: 20px";
    }
  });
};

const rehypePlugins = [rehypeSanitize, removeParagraphTags, fixImages];

export default function MarkDown({ markdown }) {
  return (
      <Markdown
        className="prose h-[416px] overflow-y-auto rounded-lg pr-4"
        remarkPlugins={[remarkGfm]}
        rehypePlugins={rehypePlugins}
        components={{
          h1: ({ node, children, ...props }) => (
            <h1 className="text-4xl mb-4" {...props}>
              {children}
            </h1>
          ),
          h2: ({ node, children, ...props }) => (
            <h2 className="text-3xl mb-4" {...props}>
              {children}
            </h2>
          ),
          h3: ({ node, children, ...props }) => (
            <h3 className="text-2xl mb-4" {...props}>
              {children}
            </h3>
          ),
          h4: ({ node, children, ...props }) => (
            <h4 className="text-xl mb-4" {...props}>
              {children}
            </h4>
          ),
          h5: ({ node, children, ...props }) => (
            <h5 className="text-lg mb-4" {...props}>
              {children}
            </h5>
          ),
          h6: ({ node, children, ...props }) => (
            <h6 className="text-base mb-4" {...props}>
              {children}
            </h6>
          ),
          p: ({ node, children, ...props }) => (
            <p className="mb-4" {...props}>
              {children}
            </p>
          ),
          strong: ({ node, children, ...props }) => (
            <strong className="font-bold" {...props}>
              {children}
            </strong>
          ),
          em: ({ node, children, ...props }) => (
            <em className="italic" {...props}>
              {children}
            </em>
          ),
          blockquote: ({ node, children, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 pl-4 italic"
              {...props}
            >
              {children}
            </blockquote>
          ),
          ul: ({ node, children, ...props }) => (
            <ul className="list-disc list-inside" {...props}>
              {children}
            </ul>
          ),
          ol: ({ node, children, ...props }) => (
            <ol className="list-decimal list-inside" {...props}>
              {children}
            </ol>
          ),
          li: ({ node, children, ...props }) => (
            <li className="mb-2" {...props}>
              {children}
            </li>
          ),
          a: ({ node, children, ...props }) => (
            <a
              className="text-blue-500 underline"
              target="_blank"
              rel="noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          img: ({ node, ...props }) => {
            if (props.src.includes('youtube.com')) {
              return (
                <div className="youtube-video-container mb-4 rounded-none ">
                  <iframe
                    className="youtube-video"
                    style={{padding: "10px"}}
                    width="560"
                    height="315"
                    src={props.src.replace('watch?v=', 'embed/')}
                    frameBorder="0"
                    allowFullScreen
                    title="YouTube Video"
                  />
                </div>
              );
            }
            // Xử lý các hình ảnh khác nếu cần
            return <img className="rounded-lg" {...props} />;
          },
          pre: function Pre
          ({ node, children, ...props }) {
            const match = /language-(\w+)/.exec(props.className || "");

            return match ? (
              <SyntaxHighlighter
                style={dracula}
                PreTag="div"
                language={match[1]}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <pre className="mb-4" {...props}>
                {children}
              </pre>
            );
          },
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
  
            return !inline && match ? (
              <SyntaxHighlighter
                style={dracula}
                PreTag="div"
                language={match[1]}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {markdown}
      </Markdown>
  );
}
