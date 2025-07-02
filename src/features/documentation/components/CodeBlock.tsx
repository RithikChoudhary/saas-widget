import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  title,
  showLineNumbers = false,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const lines = code.split('\n');

  return (
    <div className={`bg-gray-900 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg ${className}`}>
      {title && (
        <div className="bg-gray-800 dark:bg-gray-700 px-4 py-2 border-b border-gray-700 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 dark:text-gray-400 text-sm font-medium">{title}</span>
            <span className="text-xs text-gray-500 dark:text-gray-500 uppercase">{language}</span>
          </div>
        </div>
      )}
      
      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors z-10"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-gray-400" />
          )}
        </button>

        <div className="p-4 overflow-x-auto">
          <pre className="text-sm">
            {showLineNumbers ? (
              <div className="flex">
                <div className="select-none text-gray-500 dark:text-gray-600 pr-4 border-r border-gray-700 dark:border-gray-600 mr-4">
                  {lines.map((_, index) => (
                    <div key={index} className="text-right">
                      {index + 1}
                    </div>
                  ))}
                </div>
                <code className="text-green-400 dark:text-green-300 flex-1">
                  {code}
                </code>
              </div>
            ) : (
              <code className="text-green-400 dark:text-green-300">
                {code}
              </code>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
