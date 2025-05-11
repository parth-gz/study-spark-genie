
export type MessageType = 'user' | 'ai';

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  steps?: string[];
  sources?: Source[];
  timestamp: Date;
  relatedPdfIds?: string[]; // Add this to track which PDFs a message is related to
}

export interface Source {
  title: string;
  url?: string;
  description?: string;
}

export interface PDFDocument {
  id: string;
  name: string;
  size: number;
  lastModified: number;
}

export interface SettingsState {
  language: string;
  voiceEnabled: boolean;
  simplifiedAnswers: boolean;
  stepByStepSolutions: boolean;
  showSources: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export type SupportedLanguages = 
  | 'English'
  | 'Spanish'
  | 'French'
  | 'German'
  | 'Chinese'
  | 'Hindi'
  | 'Arabic'
  | 'Portuguese'
  | 'Russian'
  | 'Japanese';

export const SUPPORTED_LANGUAGES: SupportedLanguages[] = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Hindi',
  'Arabic',
  'Portuguese',
  'Russian',
  'Japanese'
];
