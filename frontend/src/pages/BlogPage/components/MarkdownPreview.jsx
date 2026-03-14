// File: src/components/MarkdownPreview.jsx

import React from 'react';
import ReactMarkdown from 'react-markdown';

// Define the component styles once for reusability
const markdownComponents = {
  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" style={{ color: 'var(--secondary-accent)' }} {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4" style={{ color: 'var(--secondary-accent)' }} {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-3" style={{ color: 'var(--secondary-accent)' }} {...props} />,
  p: ({ node, ...props }) => <p className="mb-6 leading-relaxed" {...props} />,
  ul: ({ node, ...props }) => <ul className="mb-6 pl-6 list-disc" {...props} />,
  ol: ({ node, ...props }) => <ol className="mb-6 pl-6 list-decimal" {...props} />,
  li: ({ node, ...props }) => <li className="mb-2" {...props} />,
  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-6 py-2 mb-6 italic" style={{ color: 'var(--primary-accent)' }} {...props} />,
  a: ({ node, ...props }) => <a className="underline" style={{ color: 'var(--primary-accent)' }} {...props} />,
};

const MarkdownPreview = ({ title, content }) => {
  if (!title && !content) {
    return (
      <div className="flex items-center justify-center h-full min-h-96">
        <p className="text-center text-gray-500">
          Start writing to see your story preview
        </p>
      </div>
    );
  }

  return (
    <article className="prose prose-lg max-w-none font-serif text-lg" style={{ color: 'var(--text-primary)' }}>
      {title && (
        <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: 'serif', color: 'var(--secondary-accent)' }}>
          {title}
        </h1>
      )}
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </article>
  );
};

export default MarkdownPreview;