
import { Meme } from '@/components/MemeGrid';

const API_URL = 'https://api.imgflip.com/get_memes';

export const fetchMemes = async (): Promise<Meme[]> => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error_message || 'Failed to fetch memes');
    }
    
    return data.data.memes.map((meme: any) => ({
      id: meme.id,
      name: meme.name,
      url: meme.url,
      width: meme.width,
      height: meme.height
    }));
  } catch (error) {
    console.error('Error fetching memes:', error);
    throw error;
  }
};
