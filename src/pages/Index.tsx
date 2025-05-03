
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import ImageSelector from '@/components/ImageSelector';
import TextControls, { TextSettings } from '@/components/TextControls';
import MemeCanvas from '@/components/MemeCanvas';
import { ArrowDown, Download } from 'lucide-react';

const Index = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [textSettings, setTextSettings] = useState<TextSettings>({
    topText: 'TOP TEXT',
    bottomText: 'BOTTOM TEXT',
    fontSize: 36,
    textColor: 'white',
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const handleImageSelect = (url: string) => {
    setImageUrl(url);
  };
  
  const handleTextSettingsChange = (newSettings: TextSettings) => {
    setTextSettings(newSettings);
  };
  
  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      toast.error('No meme to download');
      return;
    }
    
    try {
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'my-meme.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Meme downloaded!');
    } catch (error) {
      console.error('Error downloading meme:', error);
      toast.error('Failed to download meme');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 py-6 sm:py-12">
      <div className="container px-4 sm:px-6 animate-fade-in">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-meme-purple to-meme-purple-dark text-transparent bg-clip-text">
            Meme Generator
          </h1>
          <p className="text-muted-foreground mt-2">
            Create, customize, and download hilarious memes
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MemeCanvas 
              imageUrl={imageUrl} 
              textSettings={textSettings} 
            />
            
            {imageUrl && (
              <div className="flex justify-center">
                <Button 
                  variant="default"
                  size="lg"
                  className="text-white gap-2"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  Download Meme
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Choose Image</h2>
              <ImageSelector onSelectImage={handleImageSelect} />
            </div>
            
            {imageUrl && (
              <div className="space-y-2 animate-fade-in">
                <h2 className="text-xl font-semibold">Text Options</h2>
                <TextControls 
                  settings={textSettings} 
                  onSettingsChange={handleTextSettingsChange}
                />
              </div>
            )}
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Create and share memes with friends!</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
