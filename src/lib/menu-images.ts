
'use server';

import fs from 'fs/promises';
import path from 'path';

export async function getMenuImages(): Promise<string[]> {
  try {
    const imageDirectory = path.join(process.cwd(), 'public/menu');
    const filenames = await fs.readdir(imageDirectory);
    
    // Filter for common image extensions
    const imageFiles = filenames.filter(file => 
      /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file)
    );
    
    return imageFiles;
  } catch (error: any) {
    // If the directory doesn't exist, return an empty array.
    if (error.code === 'ENOENT') {
      console.warn("The `public/menu` directory does not exist. Please create it and add images.");
      return [];
    }
    // For other errors, re-throw them.
    console.error("Error reading menu images directory:", error);
    throw error;
  }
}
