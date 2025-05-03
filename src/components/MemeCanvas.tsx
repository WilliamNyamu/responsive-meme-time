
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TextSettings } from './TextControls';

interface MemeCanvasProps {
  imageUrl: string | null;
  textSettings: TextSettings;
}

const MemeCanvas: React.FC<MemeCanvasProps> = ({ imageUrl, textSettings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Handle responsive canvas sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setDimensions({
          width: containerWidth,
          height: containerWidth * 0.75, // 4:3 aspect ratio
        });
      }
    };
    
    updateDimensions();
    
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Draw the meme on the canvas whenever any props change
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || !imageUrl) return;
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Draw image to fit canvas while maintaining aspect ratio
      const aspectRatio = img.width / img.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.width / aspectRatio;
      
      if (drawHeight > canvas.height) {
        drawHeight = canvas.height;
        drawWidth = canvas.height * aspectRatio;
      }
      
      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2;
      
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      
      // Draw the text
      ctx.textAlign = 'center';
      ctx.font = `bold ${textSettings.fontSize}px Impact, sans-serif`;
      ctx.fillStyle = textSettings.textColor;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = textSettings.fontSize / 15;
      
      // Draw top text
      if (textSettings.topText) {
        ctx.fillText(textSettings.topText, canvas.width / 2, 40);
        ctx.strokeText(textSettings.topText, canvas.width / 2, 40);
      }
      
      // Draw bottom text
      if (textSettings.bottomText) {
        ctx.fillText(
          textSettings.bottomText,
          canvas.width / 2,
          canvas.height - 20
        );
        ctx.strokeText(
          textSettings.bottomText,
          canvas.width / 2,
          canvas.height - 20
        );
      }
      
      setIsImageLoaded(true);
    };
    
    img.src = imageUrl;
  }, [imageUrl, textSettings, dimensions]);
  
  return (
    <Card className="p-0 overflow-hidden">
      <div 
        ref={containerRef} 
        className="relative w-full aspect-[4/3] bg-muted/30 flex items-center justify-center"
      >
        {!imageUrl && !isImageLoaded && (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <p>Select or upload an image to create your meme</p>
          </div>
        )}
        <canvas 
          ref={canvasRef}
          className={`max-w-full max-h-full ${!isImageLoaded ? 'hidden' : ''}`}
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>
    </Card>
  );
};

export default MemeCanvas;
