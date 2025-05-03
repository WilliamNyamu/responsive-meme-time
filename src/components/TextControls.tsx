
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface TextSettings {
  topText: string;
  bottomText: string;
  fontSize: number;
  textColor: string;
}

interface TextControlsProps {
  settings: TextSettings;
  onSettingsChange: (settings: TextSettings) => void;
}

const TEXT_COLORS = [
  { value: 'white', label: 'White' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'pink', label: 'Pink' },
];

const TextControls: React.FC<TextControlsProps> = ({ settings, onSettingsChange }) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>, position: 'topText' | 'bottomText') => {
    onSettingsChange({
      ...settings,
      [position]: e.target.value,
    });
  };

  const handleFontSizeChange = (value: number[]) => {
    onSettingsChange({
      ...settings,
      fontSize: value[0],
    });
  };

  const handleColorChange = (value: string) => {
    onSettingsChange({
      ...settings,
      textColor: value,
    });
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topText">Top Text</Label>
            <Input
              id="topText"
              placeholder="Top text"
              value={settings.topText}
              onChange={(e) => handleTextChange(e, 'topText')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bottomText">Bottom Text</Label>
            <Input
              id="bottomText"
              placeholder="Bottom text"
              value={settings.bottomText}
              onChange={(e) => handleTextChange(e, 'bottomText')}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fontSize">Font Size: {settings.fontSize}px</Label>
            <Slider
              id="fontSize"
              min={20}
              max={60}
              step={2}
              value={[settings.fontSize]}
              onValueChange={handleFontSizeChange}
              className="my-4"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="textColor">Text Color</Label>
            <Select value={settings.textColor} onValueChange={handleColorChange}>
              <SelectTrigger id="textColor">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {TEXT_COLORS.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: color.value }}
                      ></div>
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TextControls;
