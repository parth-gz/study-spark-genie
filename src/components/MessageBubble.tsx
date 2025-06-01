
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Message } from '@/lib/types';
import { Bot, User, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import VoiceOutput from './VoiceOutput';

interface MessageBubbleProps {
  message: Message;
  settings?: {
    voiceEnabled?: boolean;
    language?: string;
    fontSize?: string;
  };
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, settings }) => {
  const isUser = message.type === 'user';
  const getFontSizeClass = () => {
    switch (settings?.fontSize) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-study-primary text-white' : 'bg-muted'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
        
        <Card className={`shadow-sm ${isUser ? 'bg-study-primary text-white' : 'bg-card'}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className={`flex-grow ${getFontSizeClass()}`}>
                {isUser ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <ReactMarkdown 
                    className="prose prose-sm max-w-none dark:prose-invert"
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      code: ({ children }) => (
                        <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-sm font-mono mb-2">
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
              
              {!isUser && settings?.voiceEnabled && (
                <VoiceOutput 
                  text={message.content}
                  isEnabled={settings.voiceEnabled}
                  language={settings.language || 'en-US'}
                  autoPlay={false}
                />
              )}
            </div>
            
            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-sm font-medium mb-2 flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  Sources:
                </p>
                <div className="flex flex-wrap gap-1">
                  {message.sources.map((source, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-2 text-xs opacity-70">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessageBubble;
