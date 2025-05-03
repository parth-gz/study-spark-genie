
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Message, PDFDocument, SettingsState } from '@/lib/types';
import MessageBubble from './MessageBubble';
import PDFUploader from './PDFUploader';
import VoiceInput from './VoiceInput';
import { Send, Book, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  settings: SettingsState;
  onPDFsUploaded: (pdfs: PDFDocument[]) => void;
  uploadedPDFs: PDFDocument[];
  isWaitingForResponse?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  settings,
  onPDFsUploaded,
  uploadedPDFs,
  isWaitingForResponse = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<string>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleVoiceInput = (text: string) => {
    setInputValue(text);
    toast.info('Voice input captured! Send your message or continue editing.');
  };

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs
        defaultValue="chat"
        className="flex-grow flex flex-col"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="px-4 pt-2 border-b sticky top-0 bg-background z-10">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="resources">Upload Resources</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-grow flex flex-col mt-0 p-0 overflow-hidden">
          <div
            className={`flex-grow overflow-y-auto px-4 py-2 ${getFontSizeClass()}`}
            style={{ maxHeight: 'calc(100vh - 230px)' }}
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="max-w-md">
                  <Book className="w-12 h-12 text-study-primary mx-auto mb-4 animate-bounce-subtle" />
                  <h3 className="text-xl font-semibold mb-2">Welcome to Study Spark Genie!</h3>
                  <p className={`text-gray-500 mb-6 ${getFontSizeClass()}`}>
                    Ask any academic question and get step-by-step answers with sources. Upload study materials for
                    more personalized responses.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-left dark:bg-gray-800">
                      <p className="font-medium text-study-primary">Try asking:</p>
                      <ul className={`mt-2 space-y-1 ${getFontSizeClass()}`}>
                        <li>"Explain photosynthesis in simple terms"</li>
                        <li>"How do I solve quadratic equations?"</li>
                        <li>"What caused the French Revolution?"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                
                {/* Loading indicator for AI response */}
                {isWaitingForResponse && (
                  <div className="self-start max-w-[85%] mb-4 animate-fade-in">
                    <Card className="bg-card border shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="h-5 w-5 animate-spin text-study-primary" />
                          <span>Thinking...</span>
                        </div>
                        <div className="mt-3 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <Card className="m-4 mt-0 border-t">
            <CardContent className="p-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                  placeholder="Ask any academic question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-grow"
                  disabled={isWaitingForResponse}
                />
                <VoiceInput onVoiceInput={handleVoiceInput} isEnabled={settings.voiceEnabled} />
                <Button type="submit" size="icon" disabled={isWaitingForResponse}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="flex-grow mt-0 p-4">
          <Card>
            <CardContent className="pt-6">
              <PDFUploader onPDFsUploaded={onPDFsUploaded} uploadedPDFs={uploadedPDFs} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatInterface;
