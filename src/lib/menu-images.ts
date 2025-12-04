
'use server';

import imageData from './placeholder-images.json';

export async function getMenuImages(): Promise<string[]> {
  // In a real application, this could fetch from a CMS or a dynamic source.
  // For this project, we read from a static JSON file.
  return Promise.resolve(imageData.images);
}
