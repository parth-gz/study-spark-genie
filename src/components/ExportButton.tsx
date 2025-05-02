
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Download } from 'lucide-react';
import { Message } from '@/lib/types';

// API URL for the Flask backend
const API_URL = 'http://localhost:5000';

interface ExportButtonProps {
  messages: Message[];
  isDisabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ messages, isDisabled = false }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (messages.length === 0) {
      toast.error("No conversations to export.");
      return;
    }

    setIsExporting(true);

    try {
      const response = await fetch(`${API_URL}/api/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const result = await response.json();
      
      if (result.success) {
        toast.success("Conversation exported successfully!");
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export conversation. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1"
      onClick={handleExport}
      disabled={isDisabled || messages.length === 0 || isExporting}
    >
      <Download className="h-4 w-4" />
      <span>{isExporting ? 'Exporting...' : 'Export'}</span>
    </Button>
  );
};

export default ExportButton;
