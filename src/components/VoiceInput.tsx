
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { toast } from "@/components/ui/sonner";

// Add proper TypeScript interface for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionError extends Event {
  error: string;
}

// Properly type the SpeechRecognition class for TypeScript
interface SpeechRecognitionType extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
  onend: () => void;
}

// Define global window interface with the speech recognition properties
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionType;
    webkitSpeechRecognition?: new () => SpeechRecognitionType;
  }
}

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
  isEnabled: boolean;
  language?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput, isEnabled, language = 'en-US' }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionType | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use the correct way to access the SpeechRecognition API
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        const recognitionInstance = new SpeechRecognitionAPI();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = language;
        
        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          onVoiceInput(transcript);
          setIsListening(false);
          toast.success("Voice input captured!");
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
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [onVoiceInput, language]);

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
        toast.info("Listening... Speak your question now.");
      } catch (error) {
        console.error('Speech recognition start error:', error);
        setIsListening(false);
      }
    }
  };

  if (!isEnabled) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full transition-all ${isListening ? 'bg-study-primary text-white animate-pulse' : ''}`}
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
