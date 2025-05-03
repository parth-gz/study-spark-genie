
import React from 'react';
import { Book } from 'lucide-react';
import ExportButton from './ExportButton';
import SettingsDrawer from './SettingsDrawer';
import { Message, SettingsState } from '@/lib/types';

interface StudyHeaderProps {
  messages: Message[];
  settings: SettingsState;
  onSettingsChange: (settings: Partial<SettingsState>) => void;
}

const StudyHeader: React.FC<StudyHeaderProps> = ({ messages, settings, onSettingsChange }) => {
  return (
    <div className="bg-background border-b shadow-sm py-3 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Book className="h-6 w-6 text-study-primary" />
        <h1 className="text-xl font-semibold text-foreground">Study Spark Genie</h1>
      </div>
      <div className="flex items-center gap-2">
        <ExportButton messages={messages} />
        <SettingsDrawer settings={settings} onSettingsChange={onSettingsChange} />
      </div>
    </div>
  );
};

export default StudyHeader;
