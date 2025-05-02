
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Message, PDFDocument, SettingsState } from '@/lib/types';
import MessageBubble from './MessageBubble';
import PDFUploader from './PDFUploader';
import VoiceInput from './VoiceInput';
import { Send, Book } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  settings: SettingsState;
  onPDFsUploaded: (pdfs: PDFDocument[]) => void;
  uploadedPDFs: PDFDocument[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  settings, 
  onPDFsUploaded, 
  uploadedPDFs 
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
    toast.info("Voice input captured! Send your message or continue editing.");
  };

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
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
        <div className="px-4 pt-2 border-b">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="resources">Upload Resources</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-grow flex flex-col mt-0 p-0">
          <div className={`flex-grow overflow-y-auto p-4 chat-container ${getFontSizeClass()}`}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="max-w-md">
                  <Book className="w-12 h-12 text-study-primary mx-auto mb-4 animate-bounce-subtle" />
                  <h3 className="text-xl font-semibold mb-2">Welcome to Study Spark Genie!</h3>
                  <p className="text-gray-500 mb-6">
                    Ask any academic question and get step-by-step answers with 
                    sources. Upload study materials for more personalized responses.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-left">
                      <p className="font-medium text-study-primary">Try asking:</p>
                      <ul className="mt-2 space-y-1 text-sm">
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
                />
                <VoiceInput onVoiceInput={handleVoiceInput} isEnabled={settings.voiceEnabled} />
                <Button type="submit" size="icon">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="flex-grow mt-0 p-4">
          <Card>
            <CardContent className="pt-6">
              <PDFUploader
                onPDFsUploaded={onPDFsUploaded}
                uploadedPDFs={uploadedPDFs}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatInterface;
