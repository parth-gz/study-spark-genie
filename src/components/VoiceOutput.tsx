
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { toast } from "@/components/ui/sonner";

interface VoiceOutputProps {
  text: string;
  isEnabled: boolean;
  language?: string;
  autoPlay?: boolean;
}

const VoiceOutput: React.FC<VoiceOutputProps> = ({ 
  text, 
  isEnabled, 
  language = 'en-US',
  autoPlay = false 
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      
      const newUtterance = new SpeechSynthesisUtterance(text);
      newUtterance.lang = language;
      newUtterance.rate = 0.9;
      newUtterance.pitch = 1;
      newUtterance.volume = 0.8;
      
      newUtterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      
      newUtterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      newUtterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        toast.error("Failed to speak text. Please try again.");
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      setUtterance(newUtterance);
      
      // Auto-play if enabled and voice is enabled
      if (autoPlay && isEnabled && text.trim()) {
        setTimeout(() => {
          synth.speak(newUtterance);
        }, 500); // Small delay to ensure everything is ready
      }
    }
    
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, language, autoPlay, isEnabled]);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      toast.error("Text-to-speech is not supported by your browser.");
      return;
    }
    
    const synth = window.speechSynthesis;
    
    if (isSpeaking && !isPaused) {
      synth.pause();
      setIsPaused(true);
    } else if (isPaused) {
      synth.resume();
      setIsPaused(false);
    } else if (utterance) {
      synth.speak(utterance);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  if (!isEnabled || !text.trim()) return null;

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={handleSpeak}
        title={isSpeaking && !isPaused ? 'Pause speech' : 'Play speech'}
      >
        {isSpeaking && !isPaused ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      
      {isSpeaking && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleStop}
          title="Stop speech"
        >
          <VolumeX className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default VoiceOutput;
