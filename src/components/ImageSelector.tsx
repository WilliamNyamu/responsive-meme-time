
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";
import { Image, Upload } from 'lucide-react';

// Sample template images for memes
const TEMPLATE_IMAGES = [
  { 
    id: '1', 
    src: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    alt: 'Programming laptop' 
  },
  { 
    id: '2', 
    src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    alt: 'Code monitor' 
  },
  { 
    id: '3', 
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    alt: 'Matrix code' 
  },
  { 
    id: '4', 
    src: 'https://images.unsplash.com/photo-1501286353178-1ec871214838',
    alt: 'Surprised monkey' 
  },
];

interface ImageSelectorProps {
  onSelectImage: (imageUrl: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onSelectImage }) => {
  const [activeTab, setActiveTab] = useState('upload');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    onSelectImage(imageUrl);
    toast.success('Image uploaded successfully!');
  };

  const handleTemplateSelect = (src: string) => {
    onSelectImage(src);
    toast.success('Template selected!');
  };

  return (
    <Card className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Templates
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-0">
          <div className="flex flex-col items-center justify-center py-4">
            <label 
              htmlFor="image-upload" 
              className="cursor-pointer flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:bg-secondary transition-colors"
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Click to upload an image</p>
              <p className="text-xs text-muted-foreground/70 mt-1">PNG, JPG, GIF up to 5MB</p>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-0">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TEMPLATE_IMAGES.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square overflow-hidden rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleTemplateSelect(image.src)}
              >
                <img
                  src={`${image.src}?auto=format&fit=crop&w=300&h=300`}
                  alt={image.alt}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ImageSelector;
