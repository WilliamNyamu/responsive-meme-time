
import React from 'react';
import { Card } from '@/components/ui/card';
import { Grid3X3 } from 'lucide-react';

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
}

const MemeGrid: React.FC<MemeGridProps> = ({ memes, isLoading, onMemeSelect }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
        <div className="animate-spin mb-2">
          <Grid3X3 className="h-8 w-8" />
        </div>
        <p>Loading meme templates...</p>
      </div>
    );
  }

  if (memes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
        <Grid3X3 className="h-8 w-8 mb-2" />
        <p>No meme templates found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {memes.map((meme) => (
        <Card 
          key={meme.id}
          className="overflow-hidden border cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          onClick={() => onMemeSelect(meme)}
        >
          <div className="aspect-square relative overflow-hidden bg-muted">
            <img
              src={meme.url}
              alt={meme.name}
              className="object-cover w-full h-full"
              loading="lazy"
            />
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
