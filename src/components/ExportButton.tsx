
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Download } from 'lucide-react';
import { Message } from '@/lib/types';

interface ExportButtonProps {
  messages: Message[];
  isDisabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ messages, isDisabled = false }) => {
  const handleExport = async () => {
    if (messages.length === 0) {
      toast.error("No conversations to export.");
      return;
    }

    try {
      // In a real implementation, this would call a backend endpoint to generate a PDF
      // For this mock-up, we'll create a simple text blob
      
      let content = "Study Spark Genie - Conversation Export\n\n";
      content += `Date: ${new Date().toLocaleDateString()}\n\n`;
      
      messages.forEach((message) => {
        const timestamp = new Date(message.timestamp).toLocaleString();
        const sender = message.type === 'user' ? 'You' : 'Study Spark';
        
        content += `[${timestamp}] ${sender}:\n${message.content}\n\n`;
        
        if (message.type === 'ai' && message.steps && message.steps.length > 0) {
          content += "Step-by-step Solution:\n";
          message.steps.forEach((step, index) => {
            content += `${index + 1}. ${step}\n`;
          });
          content += "\n";
        }
        
        if (message.type === 'ai' && message.sources && message.sources.length > 0) {
          content += "Sources:\n";
          message.sources.forEach((source, index) => {
            content += `${index + 1}. ${source.title}${source.url ? ` (${source.url})` : ""}\n`;
            if (source.description) content += `   ${source.description}\n`;
          });
          content += "\n";
        }
        
        content += "-------------------------------------------\n\n";
      });
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `study-spark-conversation-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Conversation exported successfully!");
      
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export conversation. Please try again.");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1"
      onClick={handleExport}
      disabled={isDisabled || messages.length === 0}
    >
      <Download className="h-4 w-4" />
      <span>Export</span>
    </Button>
  );
};

export default ExportButton;
