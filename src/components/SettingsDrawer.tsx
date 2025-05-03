
import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Moon, Sun } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUPPORTED_LANGUAGES, SettingsState } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from '@/hooks/use-theme';

interface SettingsDrawerProps {
  settings: SettingsState;
  onSettingsChange: (settings: Partial<SettingsState>) => void;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ settings, onSettingsChange }) => {
  const { theme, setTheme } = useTheme();
  
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Study Settings</DrawerTitle>
            <DrawerDescription>
              Customize your learning experience
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-toggle" className="text-base">Theme</Label>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <Switch
                    id="theme-toggle"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                  <Moon className="h-4 w-4" />
                </div>
              </div>

              <div>
                <Label htmlFor="language" className="text-base">Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => onSettingsChange({ language: value })}
                >
                  <SelectTrigger id="language" className="mt-1.5">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="voice-enabled" className="text-base">Voice Input/Output</Label>
                <Switch
                  id="voice-enabled"
                  checked={settings.voiceEnabled}
                  onCheckedChange={(checked) => onSettingsChange({ voiceEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="simplified-answers" className="text-base">Simplified Answers</Label>
                <Switch
                  id="simplified-answers"
                  checked={settings.simplifiedAnswers}
                  onCheckedChange={(checked) => onSettingsChange({ simplifiedAnswers: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="step-by-step" className="text-base">Step-by-Step Solutions</Label>
                <Switch
                  id="step-by-step"
                  checked={settings.stepByStepSolutions}
                  onCheckedChange={(checked) => onSettingsChange({ stepByStepSolutions: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-sources" className="text-base">Show Sources</Label>
                <Switch
                  id="show-sources"
                  checked={settings.showSources}
                  onCheckedChange={(checked) => onSettingsChange({ showSources: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size" className="text-base">Font Size</Label>
                <RadioGroup
                  id="font-size"
                  value={settings.fontSize}
                  onValueChange={(value) => onSettingsChange({ fontSize: value as 'small' | 'medium' | 'large' })}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="small" id="small" />
                    <Label htmlFor="small">Small</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large">Large</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingsDrawer;
