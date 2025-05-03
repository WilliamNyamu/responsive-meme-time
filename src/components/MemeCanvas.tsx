
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
      
      // Add a subtle shadow to the image
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      
      // Reset shadow for text
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw the text only if we have text settings
      if (textSettings) {
        ctx.textAlign = 'center';
        ctx.font = `bold ${textSettings.fontSize}px Impact, sans-serif`;
        ctx.fillStyle = textSettings.textColor;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = textSettings.fontSize / 15;
        
        // Draw top text
        if (textSettings.topText) {
          const topY = offsetY + 40;
          ctx.fillText(textSettings.topText, canvas.width / 2, topY);
          ctx.strokeText(textSettings.topText, canvas.width / 2, topY);
        }
        
        // Draw bottom text
        if (textSettings.bottomText) {
          const bottomY = offsetY + drawHeight - 20;
          ctx.fillText(
            textSettings.bottomText,
            canvas.width / 2,
            bottomY
          );
          ctx.strokeText(
            textSettings.bottomText,
            canvas.width / 2,
            bottomY
          );
        }
      }
      
      setIsImageLoaded(true);
    };
    
    img.src = imageUrl;
  }, [imageUrl, textSettings, dimensions]);
  
  return (
    <Card className="p-0 overflow-hidden shadow-lg">
      <div 
        ref={containerRef} 
        className="relative w-full aspect-[4/3] bg-gradient-to-r from-muted/40 to-muted/20 flex items-center justify-center"
      >
        {!imageUrl && !isImageLoaded && (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <p className="font-medium">Select a meme template to continue</p>
            <p className="text-xs opacity-70 mt-1">Choose from the gallery below</p>
          </div>
        )}
        <canvas 
          ref={canvasRef}
          className={`max-w-full max-h-full rounded-sm ${!isImageLoaded ? 'hidden' : ''}`}
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>
    </Card>
  );
};

export default MemeCanvas;
