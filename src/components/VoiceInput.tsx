
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { toast } from "@/components/ui/sonner";

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
  isEnabled: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput, isEnabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onVoiceInput(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast.error("Failed to recognize speech. Please try again.");
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [onVoiceInput]);

  const toggleListening = () => {
    if (!recognition) {
      toast.error("Speech recognition is not supported by your browser.");
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      setIsListening(true);
      try {
        recognition.start();
      } catch (error) {
        console.error('Speech recognition start error:', error);
      }
    }
  };

  if (!isEnabled) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full transition-all ${isListening ? 'bg-study-primary text-white' : ''}`}
      onClick={toggleListening}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? (
        <MicOff className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
};

export default VoiceInput;
