
import React, { useEffect, useRef } from 'react';

interface MemeCanvasProps {
  imageUrl: string | null;
  topText: string;
  bottomText: string;
}

const MemeCanvas: React.FC<MemeCanvasProps> = ({ imageUrl, topText, bottomText }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw the meme on the canvas whenever props change
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || !imageUrl) return;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Set canvas dimensions based on image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Configure text style
      ctx.textAlign = 'center';
      ctx.font = 'bold 36px Impact, sans-serif';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      
      // Draw top text
      if (topText) {
        ctx.fillText(topText.toUpperCase(), canvas.width / 2, 50);
        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 50);
      }
      
      // Draw bottom text
      if (bottomText) {
        ctx.fillText(
          bottomText.toUpperCase(),
          canvas.width / 2,
          canvas.height - 30
        );
        ctx.strokeText(
          bottomText.toUpperCase(),
          canvas.width / 2,
          canvas.height - 30
        );
      }
    };
    
    img.src = imageUrl;
  }, [imageUrl, topText, bottomText]);
  
  return (
    <div className="relative w-full overflow-hidden">
      {!imageUrl ? (
        <div className="flex items-center justify-center h-60 bg-gray-100 text-gray-500">
          Select an image to create a meme
        </div>
      ) : (
        <canvas 
          ref={canvasRef}
          className="max-w-full h-auto"
        />
      )}
    </div>
  );
};

export default MemeCanvas;
