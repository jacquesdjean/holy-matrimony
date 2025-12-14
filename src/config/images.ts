// Centralized image path configuration for easy asset swaps
// All wedding images are stored in /public/images/

const IMAGE_BASE_PATH = '/images';

export const weddingImages = {
  // Hero section background
  hero: `${IMAGE_BASE_PATH}/png_1.png`,

  // Town/destination photos
  town: [
    `${IMAGE_BASE_PATH}/png_2.png`,
    `${IMAGE_BASE_PATH}/png_3.png`,
    `${IMAGE_BASE_PATH}/png_4.png`,
  ],

  // Venue photos
  trinityChurch: `${IMAGE_BASE_PATH}/png_5.png`,
  benedictHall: `${IMAGE_BASE_PATH}/png_6.png`,
  gibsonInn: `${IMAGE_BASE_PATH}/png_7.png`,

  // Closing/footer section background
  closing: `${IMAGE_BASE_PATH}/png_8.png`,
};

// Helper to check if an image exists (for development)
export const getImagePath = (key: keyof typeof weddingImages): string => {
  return weddingImages[key] as string;
};
