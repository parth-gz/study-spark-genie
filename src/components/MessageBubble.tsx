
import React from 'react';
import { Message, Source } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.type === 'ai';

  return (
    <div 
      className={cn(
        "mb-4 max-w-[85%] animate-fade-in",
        isAI ? "self-start" : "self-end"
      )}
    >
      <Card className={cn(
        "border shadow-sm", 
        isAI ? "bg-card" : "bg-study-primary text-white"
      )}>
        <CardContent className="p-4">
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          {isAI && message.steps && message.steps.length > 0 && (
            <div className="mt-4 step-container">
              <h4 className="text-sm font-semibold mb-2">Step-by-step Solution:</h4>
              <div className="space-y-2 pl-2">
                {message.steps.map((step, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="step-item flex items-center justify-center w-6 h-6 rounded-full bg-study-light text-study-dark text-xs font-medium shrink-0" />
                    <p className="text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isAI && message.sources && message.sources.length > 0 && (
            <div className="mt-4 border-t pt-3 border-gray-100">
              <h4 className="text-sm font-semibold mb-2">Sources:</h4>
              <ul className="space-y-1 text-xs text-gray-600">
                {message.sources.map((source, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="font-semibold">{index + 1}.</span>
                    <span>
                      {source.url ? (
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-study-primary hover:underline"
                        >
                          {source.title}
                        </a>
                      ) : (
                        <span>{source.title}</span>
                      )}
                      {source.description && (
                        <span className="block text-gray-500">{source.description}</span>
                      )}
                    </span>
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
