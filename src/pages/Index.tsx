
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import TrollFaceIcon from '@/components/TrollFaceIcon';

const Index = () => {
  const [topText, setTopText] = useState('SHUT UP');
  const [bottomText, setBottomText] = useState('AND TAKE MY MONEY');
  const [memeImage, setMemeImage] = useState('public/lovable-uploads/b9f7e7d3-00e1-4c07-8a6c-f5997d0e781c.png');
  
  // Placeholder function for the "Get a new meme image" button
  const handleGetNewImage = () => {
    // This would be connected to an API but we're just focusing on the design for now
    console.log('Getting new meme image...');
  };
  
  return (
    <div className="min-h-screen bg-white py-4">
      <div className="meme-container mx-auto px-4">
        {/* Header Section */}
        <header className="bg-meme-purple text-white p-3 flex items-center rounded-t-lg">
          <TrollFaceIcon className="w-6 h-6 mr-2" />
          <h1 className="text-xl font-bold">Meme Generator</h1>
        </header>
        
        {/* Input Section */}
        <div className="p-4 space-y-4">
          {/* Top Text Input */}
          <div>
            <label htmlFor="top-text" className="block text-sm font-medium text-gray-700 mb-1">
              Top text
            </label>
            <Input
              id="top-text"
              type="text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              className="w-full border-gray-300"
            />
          </div>
          
          {/* Bottom Text Input */}
          <div>
            <label htmlFor="bottom-text" className="block text-sm font-medium text-gray-700 mb-1">
              Bottom text
            </label>
            <Input
              id="bottom-text"
              type="text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              className="w-full border-gray-300"
            />
          </div>
          
          {/* Get New Meme Button */}
          <Button 
            onClick={handleGetNewImage}
            className="w-full bg-meme-purple hover:bg-meme-purple-light text-white flex items-center justify-center py-3"
          >
            Get a new meme image
            <RefreshCw className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {/* Meme Display Section */}
        <div className="relative p-4">
          <div className="relative">
            <img 
              src={memeImage} 
              alt="Meme" 
              className="w-full h-auto border border-gray-200"
            />
            <div className="absolute top-4 left-0 right-0">
              <h2 className="meme-text text-3xl md:text-4xl">{topText}</h2>
            </div>
            <div className="absolute bottom-4 left-0 right-0">
              <h2 className="meme-text text-3xl md:text-4xl">{bottomText}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
