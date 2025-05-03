
import React, { useState } from 'react';
import StudyHeader from '@/components/StudyHeader';
import ChatInterface from '@/components/ChatInterface';
import { Message, PDFDocument, SettingsState } from '@/lib/types';
import { toast } from '@/components/ui/sonner';

// Use relative URLs which will work in any environment
const API_URL = '/api'; // This will work both locally and in deployment

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

  const handleSendMessage = async (content: string) => {
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
      // Make API call to Flask backend
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          settings: settings
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
    // In a real implementation, this would upload files to the backend
    // For now, we'll just update the state
    setUploadedPDFs(pdfs);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
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
