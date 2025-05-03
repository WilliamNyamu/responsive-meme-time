
import React from 'react';
import { Card } from '@/components/ui/card';
import { Grid3X3, Image } from 'lucide-react';

export interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
}

interface MemeGridProps {
  memes: Meme[];
  isLoading: boolean;
  onMemeSelect: (meme: Meme) => void;
  type: 'template' | 'repository';
}

const MemeGrid: React.FC<MemeGridProps> = ({ memes, isLoading, onMemeSelect, type }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground animate-pulse">
        <div className="animate-spin mb-2">
          <Grid3X3 className="h-8 w-8" />
        </div>
        <p>Loading {type === 'template' ? 'meme templates' : 'meme repository'}...</p>
      </div>
    );
  }

  if (memes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
        {type === 'template' ? (
          <Grid3X3 className="h-8 w-8 mb-2" />
        ) : (
          <Image className="h-8 w-8 mb-2" />
        )}
        <p>No {type === 'template' ? 'meme templates' : 'memes'} found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
      {memes.map((meme) => (
        <Card 
          key={meme.id}
          className="overflow-hidden border cursor-pointer hover:ring-2 hover:ring-primary transition-all hover:shadow-md hover:-translate-y-1"
          onClick={() => onMemeSelect(meme)}
        >
          <div className="aspect-square relative overflow-hidden bg-muted">
            <img
              src={meme.url}
              alt={meme.name}
              className="object-cover w-full h-full transition-transform hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center">
              <p className="text-xs text-white font-medium mb-2">Click to select</p>
            </div>
          </div>
          <div className="p-2 text-sm font-medium truncate text-center">
            {meme.name}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MemeGrid;
