
import React from 'react';
import { Message, Source } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.type === 'ai';

  // Check if this message is related to a PDF source
  const hasPdfSources = isAI && message.sources?.some(source => 
    source.title === 'Uploaded PDF Documents' || 
    source.title.includes('PDF')
  );

  return (
    <div 
      className={cn(
        "mb-4 max-w-[85%] animate-fade-in",
        isAI ? "self-start" : "self-end"
      )}
    >
      <Card className={cn(
        "border shadow-sm", 
        isAI ? "bg-card" : "bg-study-primary text-white",
        hasPdfSources && "border-study-primary/30"
      )}>
        <CardContent className="p-4 text-left">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Override to maintain proper styling for links
                a: ({ node, ...props }) => (
                  <a 
                    {...props} 
                    className="text-study-primary hover:underline" 
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
                // Override to maintain proper styling for lists
                ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-6 my-2" />,
                ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-6 my-2" />,
                // Style code blocks and inline code - fixed the inline prop issue
                code: ({ node, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match && !className?.includes('block');
                  
                  return (
                    <code 
                      {...props} 
                      className={cn(
                        "text-xs font-mono",
                        isInline ? "bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" : "block bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto my-2"
                      )} 
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          
          {isAI && message.steps && message.steps.length > 0 && (
            <div className="mt-4 step-container">
              <h4 className="text-sm font-semibold mb-2">Step-by-step Solution:</h4>
              <div className="space-y-2 pl-2">
                {message.steps.map((step, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="step-item flex items-center justify-center w-6 h-6 rounded-full bg-study-light text-study-dark text-xs font-medium shrink-0">
                      {index + 1}
                    </div>
                    <div className="text-sm prose prose-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{step}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isAI && message.sources && message.sources.length > 0 && (
            <div className="mt-4 border-t pt-3 border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-semibold mb-2">Sources:</h4>
              <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                {message.sources.map((source, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {source.title.includes('PDF') && <FileText className="h-3.5 w-3.5 text-study-primary flex-shrink-0 mt-0.5" />}
                    <div>
                      <span className="font-semibold">{source.title}</span>
                      {source.url && (
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-study-primary hover:underline block"
                        >
                          {source.url}
                        </a>
                      )}
                      {source.description && (
                        <span className="block text-gray-500 dark:text-gray-400">{source.description}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="text-xs text-gray-500 mt-1 px-1">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default MessageBubble;
