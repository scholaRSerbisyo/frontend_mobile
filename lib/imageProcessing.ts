import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const processImageForSubmission = async (base64Image: string | undefined): Promise<string> => {
  if (!base64Image) {
    throw new Error('No image data provided');
  }

  try {
    // If it's already a data URI, extract the base64 part
    const base64Data = base64Image.includes('data:image/') 
      ? base64Image.split(',')[1] 
      : base64Image;

    // Convert base64 to URI for manipulation
    const uri = `data:image/jpeg;base64,${base64Data}`;
    
    // Compress and resize the image
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [
        { resize: { width: 800 } }, // Reduce width to 800px max
      ],
      {
        compress: 0.5, // Reduce quality to 50%
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );

    if (!manipulatedImage.base64) {
      throw new Error('Failed to compress image');
    }

    // Return with data URI prefix to match backend expectation
    return `data:image/jpeg;base64,${manipulatedImage.base64}`;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image data');
  }
};

export const validateImageData = (imageData: string): boolean => {
  if (!imageData) return false;

  try {
    // Check if it's a proper data URI
    if (!imageData.startsWith('data:image/')) {
      return false;
    }
    
    // Extract the base64 part
    const base64Data = imageData.split(',')[1];
    if (!base64Data) {
      return false;
    }
    
    // Check if it's a valid base64 string
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data.trim())) {
      return false;
    }

    // Check if the decoded size is reasonable (less than 5MB)
    const decodedLength = atob(base64Data).length;
    if (decodedLength > 5 * 1024 * 1024) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Image validation error:', error);
    return false;
  }
};

// Helper function to check available storage
export const checkStorageSpace = async (): Promise<boolean> => {
  try {
    // Try to write a small test item
    const testKey = `test_${Date.now()}`;
    await AsyncStorage.setItem(testKey, 'test');
    await AsyncStorage.removeItem(testKey);
    return true;
  } catch (error: any) {
    if (error.code === 13 || error.message?.includes('disk is full')) {
      return false;
    }
    throw error;
  }
};

