
import React, { useState } from 'react';
import StudyHeader from '@/components/StudyHeader';
import ChatInterface from '@/components/ChatInterface';
import { Message, PDFDocument, SettingsState } from '@/lib/types';
import { toast } from '@/components/ui/sonner';

// Mock function to simulate AI responses
const getMockResponse = (question: string, settings: SettingsState): Promise<Message> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Example responses based on common academic questions
      let response: Partial<Message> = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        timestamp: new Date()
      };

      if (question.toLowerCase().includes('photosynthesis')) {
        response.content = "Photosynthesis is the process where plants convert sunlight into energy. They use carbon dioxide and water to create glucose (sugar) and oxygen.";
        response.steps = [
          "Light is absorbed by chlorophyll in the chloroplasts",
          "Water molecules are split, releasing oxygen",
          "Carbon dioxide is converted into glucose using the captured light energy",
          "Oxygen is released as a byproduct"
        ];
        response.sources = [
          { title: "Biology Online Textbook", url: "#", description: "Chapter 4: Plant Processes" },
          { title: "National Geographic: Photosynthesis", url: "#" }
        ];
      } else if (question.toLowerCase().includes('quadratic')) {
        response.content = "Quadratic equations are in the form ax² + bx + c = 0. You can solve them using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a";
        response.steps = [
          "Ensure your equation is in the standard form: ax² + bx + c = 0",
          "Identify the values of a, b, and c",
          "Substitute these values into the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a",
          "Calculate the discriminant (b² - 4ac)",
          "Find both solutions by using the + and - versions of the formula"
        ];
        response.sources = [
          { title: "Khan Academy: Quadratic Formula", url: "#" },
          { title: "Mathematics Textbook", url: "#", description: "Chapter 7: Quadratic Equations" }
        ];
      } else if (question.toLowerCase().includes('french revolution')) {
        response.content = "The French Revolution (1789-1799) was a period of radical social and political upheaval in France that had a lasting impact on French history and more broadly on European history.";
        response.steps = [
          "Social inequality and economic problems created tension in French society",
          "The Enlightenment ideas challenged traditional authority",
          "Financial crisis in France due to involvement in the American Revolution",
          "The storming of the Bastille on July 14, 1789 marked the beginning of the revolution",
          "The monarchy was overthrown and a republic was established"
        ];
        response.sources = [
          { title: "History.com: French Revolution", url: "#" },
          { title: "Liberty, Equality, and Fraternity: Exploring the French Revolution", url: "#", description: "Digital archive of primary sources" }
        ];
      } else {
        response.content = "I understand your question about '" + question + "'. Let me provide a structured explanation.";
        response.steps = [
          "First, let's understand the basic concept",
          "Next, let's look at the key principles",
          "Finally, let's examine practical applications"
        ];
        response.sources = [
          { title: "Academic Resource 1", url: "#" },
          { title: "Educational Journal", url: "#", description: "Volume 34, Issue 2" }
        ];
      }

      // Apply settings
      if (!settings.stepByStepSolutions) {
        delete response.steps;
      }

      if (!settings.showSources) {
        delete response.sources;
      }

      if (settings.simplifiedAnswers) {
        // Make response more simplified if that setting is on
        response.content = response.content?.split('.').slice(0, 2).join('.') + '.';
      }

      resolve(response as Message);
    }, 1500); // Simulate network delay
  });
};

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
      // In a real implementation, this would be an API call to the backend
      const response = await getMockResponse(content, settings);
      setMessages((prev) => [...prev, response]);
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
          onPDFsUploaded={setUploadedPDFs}
          uploadedPDFs={uploadedPDFs}
        />
      </div>
    </div>
  );
};

export default Index;
