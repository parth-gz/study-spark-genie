
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Message, PDFDocument, SettingsState } from '@/lib/types';
import MessageBubble from './MessageBubble';
import PDFUploader from './PDFUploader';
import VoiceInput from './VoiceInput';
import { Send, Book, RefreshCw, FileText } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string, pdfIds?: string[]) => void;
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
  const [selectedPDFs, setSelectedPDFs] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-select all uploaded PDFs for context
  useEffect(() => {
    if (uploadedPDFs.length > 0) {
      setSelectedPDFs(uploadedPDFs.map(pdf => pdf.id));
    }
  }, [uploadedPDFs]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    onSendMessage(inputValue.trim(), selectedPDFs);
    setInputValue('');
  };

  const handleVoiceInput = (text: string) => {
    if (text.trim()) {
      // Auto-submit voice input or set it for review
      setInputValue(text);
      // Optionally auto-submit after voice input
      setTimeout(() => {
        if (text.trim()) {
          onSendMessage(text.trim(), selectedPDFs);
          setInputValue('');
        }
      }, 1000);
    }
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

  const togglePdfSelection = (pdfId: string) => {
    setSelectedPDFs(prev => 
      prev.includes(pdfId) 
        ? prev.filter(id => id !== pdfId)
        : [...prev, pdfId]
    );
  };

  // Get language code for voice components
  const getLanguageCode = () => {
    const languageMap: { [key: string]: string } = {
      'English': 'en-US',
      'Spanish': 'es-ES',
      'French': 'fr-FR',
      'German': 'de-DE',
      'Italian': 'it-IT',
      'Portuguese': 'pt-PT',
      'Dutch': 'nl-NL',
      'Russian': 'ru-RU',
      'Chinese': 'zh-CN',
      'Japanese': 'ja-JP',
    };
    return languageMap[settings.language] || 'en-US';
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
            {uploadedPDFs.length > 0 && (
              <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Study Materials</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab('resources')}
                    className="text-xs h-7"
                  >
                    Manage
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uploadedPDFs.map(pdf => (
                    <Badge 
                      key={pdf.id} 
                      variant={selectedPDFs.includes(pdf.id) ? "default" : "outline"} 
                      className="cursor-pointer flex items-center gap-1"
                      onClick={() => togglePdfSelection(pdf.id)}
                    >
                      <FileText className="h-3 w-3" />
                      <span className="truncate max-w-40">{pdf.name}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="max-w-md">
                  <Book className="w-12 h-12 text-study-primary mx-auto mb-4 animate-bounce-subtle" />
                  <h3 className="text-xl font-semibold mb-2">Welcome to Study Spark Genie!</h3>
                  <p className={`text-muted-foreground mb-6 ${getFontSizeClass()}`}>
                    Ask any academic question using text or voice and get step-by-step answers with sources. Upload study materials for
                    more personalized responses.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-muted rounded-lg p-3 text-left dark:bg-muted">
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
                  <MessageBubble 
                    key={message.id} 
                    message={message} 
                    settings={settings}
                  />
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
                  placeholder={uploadedPDFs.length > 0 
                    ? "Ask about your study materials or any academic question..." 
                    : "Ask any academic question or use voice input..."
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-grow"
                  disabled={isWaitingForResponse}
                />
                <VoiceInput 
                  onVoiceInput={handleVoiceInput} 
                  isEnabled={settings.voiceEnabled}
                  language={getLanguageCode()}
                />
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
