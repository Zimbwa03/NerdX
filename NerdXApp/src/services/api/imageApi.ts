import apiClient from './config';

export const imageApi = {
  // Upload image for OCR solving
  uploadImage: async (imageUri: string): Promise<{
    image_id: string;
    processed_text: string;
    solution?: string;
  }> => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    } as any);

    const response = await apiClient.post('/image/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};

