
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Download, RefreshCw, Image, ImageIcon, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextControls, { TextSettings } from '@/components/TextControls';
import MemeCanvas from '@/components/MemeCanvas';
import MemeGrid, { Meme } from '@/components/MemeGrid';
import { useQuery } from '@tanstack/react-query';
import { fetchMemes } from '@/services/memeService';

const Index = () => {
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'repository'>('templates');
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
  
  // We would fetch repository memes from Firebase here
  const { data: repositoryMemes, isLoading: isLoadingRepo } = useQuery({
    queryKey: ['repositoryMemes'],
    queryFn: () => {
      // This is a placeholder - no actual Firebase implementation
      return Promise.resolve([
        {
          id: 'repo-1',
          name: 'Funny Cat Meme',
          url: 'https://i.imgflip.com/7amxfd.jpg',
          width: 600,
          height: 400
        },
        {
          id: 'repo-2',
          name: 'Programmer Joke',
          url: 'https://i.imgflip.com/7il5p1.jpg',
          width: 600,
          height: 400
        },
        {
          id: 'repo-3',
          name: 'Monday Blues',
          url: 'https://i.imgflip.com/7xodzo.jpg',
          width: 600,
          height: 400
        },
      ]);
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
  
  const handleMemeSelect = (meme: Meme) => {
    setSelectedMeme(meme);
    if (activeTab === 'templates') {
      toast.success(`"${meme.name}" template selected!`);
    } else {
      toast.success(`"${meme.name}" meme selected!`);
    }
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
      
      toast.success('Meme downloaded successfully!', {
        description: 'Your masterpiece is ready to share.'
      });
    } catch (error) {
      console.error('Error downloading meme:', error);
      toast.error('Failed to download meme');
    }
  };
  
  const handleRefresh = () => {
    if (activeTab === 'templates') {
      refetch();
      toast.success('Refreshing meme templates...');
    } else {
      toast.success('Refreshing meme repository...');
      // Would trigger Firebase refetch here
    }
  }
  
  const handleBackToGrid = () => {
    setSelectedMeme(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 py-6 sm:py-12">
      <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
        <header className="text-center mb-8 animate-fade-in">
          <div className="inline-block mb-2">
            <div className="relative flex items-center justify-center w-16 h-16 mx-auto mb-2 overflow-hidden rounded-full bg-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full"></div>
              <Image className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-meme-purple to-meme-purple-dark text-transparent bg-clip-text">
            Meme Generator
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Create, customize, and download hilarious memes to share with friends and family
          </p>
        </header>
        
        {selectedMeme ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center mb-2">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToGrid}
                  className="gap-1 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to gallery
                </Button>
              </div>
              
              <MemeCanvas 
                imageUrl={selectedMeme.url} 
                textSettings={textSettings} 
              />
              
              <div className="flex justify-center gap-4 mt-6">
                <Button 
                  variant="default"
                  size="lg"
                  className="text-white gap-2 shadow-md hover:shadow-lg transition-all"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  Download Meme
                </Button>
              </div>
            </div>
            
            {activeTab === 'templates' && (
              <div className="space-y-6">
                <div className="space-y-2 animate-fade-in">
                  <h2 className="text-xl font-semibold">Text Options</h2>
                  <p className="text-sm text-muted-foreground">Customize your meme text</p>
                  <TextControls 
                    settings={textSettings} 
                    onSettingsChange={handleTextSettingsChange}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'templates' | 'repository')}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <TabsList className="shadow-sm">
                  <TabsTrigger value="templates" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger value="repository" className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Repository
                  </TabsTrigger>
                </TabsList>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 shadow-sm"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
              
              <TabsContent value="templates" className="mt-0 focus-visible:outline-none">
                <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg border shadow-sm mb-6">
                  <h2 className="text-xl font-semibold mb-2">Create Your Own Meme</h2>
                  <p className="text-muted-foreground">
                    Select a template below, add your custom text, and download your creation!
                  </p>
                </div>
                
                <h3 className="text-lg font-semibold mb-4">Choose a Template</h3>
                <MemeGrid 
                  memes={memes || []}
                  isLoading={isLoading}
                  onMemeSelect={handleMemeSelect}
                  type="template"
                />
              </TabsContent>
              
              <TabsContent value="repository" className="mt-0 focus-visible:outline-none">
                <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg border shadow-sm mb-6">
                  <h2 className="text-xl font-semibold mb-2">Browse Ready-Made Memes</h2>
                  <p className="text-muted-foreground">
                    Find and download pre-made memes from our collection!
                  </p>
                </div>
                
                <h3 className="text-lg font-semibold mb-4">Popular Memes</h3>
                <MemeGrid 
                  memes={repositoryMemes || []}
                  isLoading={isLoadingRepo}
                  onMemeSelect={handleMemeSelect}
                  type="repository"
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        <footer className="mt-12 text-center text-sm text-muted-foreground border-t pt-6">
          <p>Create and share memes with friends!</p>
          <p className="text-xs mt-1 opacity-70">All meme templates are used for entertainment purposes</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
