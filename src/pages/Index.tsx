
import React, { useState } from 'react';
import StudyHeader from '@/components/StudyHeader';
import ChatInterface from '@/components/ChatInterface';
import { Message, PDFDocument, SettingsState } from '@/lib/types';
import { toast } from '@/components/ui/sonner';

// API URL for backend - updated to match Flask server port
const API_URL = 'http://localhost:5000/api';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedPDFs, setUploadedPDFs] = useState<PDFDocument[]>([]);
  const [settings, setSettings] = useState<SettingsState>({
    language: 'English',
    voiceEnabled: true,
    simplifiedAnswers: false,
    stepByStepSolutions: true,
    showSources: true,
    fontSize: 'medium'
  });
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const handleSendMessage = async (content: string, pdfIds?: string[]) => {
    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      type: 'user',
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsWaitingForResponse(true);
    
    try {
      console.log("Sending request to:", API_URL + "/chat");
      console.log("With PDFs:", pdfIds);
      
      // Make API call to Flask backend
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          settings: settings,
          pdfIds: pdfIds || []
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const aiResponse = await response.json();
      console.log("Received response:", aiResponse);
      
      // Add timestamp if not provided by backend
      if (!aiResponse.timestamp) {
        aiResponse.timestamp = new Date();
      }
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting response:", error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  const handleSettingsChange = (newSettings: Partial<SettingsState>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handlePDFUpload = async (pdfs: PDFDocument[]) => {
    setUploadedPDFs(pdfs);
    
    if (pdfs.length > 0 && messages.length === 0) {
      // If this is the first PDF upload and no messages yet, show a helpful toast
      toast.success(
        "PDF uploaded successfully! Ask questions about your document for contextualized answers.",
        { duration: 5000 }
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <StudyHeader 
        messages={messages} 
        settings={settings} 
        onSettingsChange={handleSettingsChange} 
      />
      <div className="flex-grow overflow-hidden">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          settings={settings}
          onPDFsUploaded={handlePDFUpload}
          uploadedPDFs={uploadedPDFs}
          isWaitingForResponse={isWaitingForResponse}
        />
      </div>
    </div>
  );
};

export default Index;
