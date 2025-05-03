
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Download, RefreshCw } from 'lucide-react';
import TextControls, { TextSettings } from '@/components/TextControls';
import MemeCanvas from '@/components/MemeCanvas';
import MemeGrid, { Meme } from '@/components/MemeGrid';
import { useQuery } from '@tanstack/react-query';
import { fetchMemes } from '@/services/memeService';

const Index = () => {
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [textSettings, setTextSettings] = useState<TextSettings>({
    topText: 'TOP TEXT',
    bottomText: 'BOTTOM TEXT',
    fontSize: 36,
    textColor: 'white',
  });
  
  const { data: memes, isLoading, refetch } = useQuery({
    queryKey: ['memes'],
    queryFn: fetchMemes,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
  
  const handleMemeSelect = (meme: Meme) => {
    setSelectedMeme(meme);
    toast.success(`"${meme.name}" template selected!`);
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
  
  const handleRefresh = () => {
    refetch();
    toast.success('Refreshing meme templates...');
  }
  
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
        
        {selectedMeme ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <MemeCanvas 
                imageUrl={selectedMeme.url} 
                textSettings={textSettings} 
              />
              
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => setSelectedMeme(null)}
                >
                  Choose Another Template
                </Button>
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
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2 animate-fade-in">
                <h2 className="text-xl font-semibold">Text Options</h2>
                <TextControls 
                  settings={textSettings} 
                  onSettingsChange={handleTextSettingsChange}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Choose a Meme Template</h2>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
            <MemeGrid 
              memes={memes || []}
              isLoading={isLoading}
              onMemeSelect={handleMemeSelect}
            />
          </div>
        )}
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Create and share memes with friends!</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
