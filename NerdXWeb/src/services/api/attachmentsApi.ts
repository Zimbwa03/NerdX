// Attachments API for Teacher Mode (image context) - NerdX Web
import api from './config';

export interface ContextPackImage {
  image_id: string;
  storage_url: string;
  mime_type: string;
  size_bytes: number;
  per_image_summary?: string;
  extracted_text?: string;
  key_concepts?: string[];
  subject_guess?: string;
  confidence_notes?: string;
}

export interface ContextPack {
  id: string;
  chat_id?: string | null;
  images: ContextPackImage[];
  combined_summary: string;
  suggested_next_actions: string[];
}

export const attachmentsApi = {
  analyzeImages: async (params: {
    images: File[];
    prompt?: string;
    chatId?: string;
  }): Promise<ContextPack | null> => {
    const formData = new FormData();
    for (let i = 0; i < params.images.length; i++) {
      const file = params.images[i];
      formData.append('images', file, file.name || `image_${i + 1}.jpg`);
    }
    if (params.prompt) formData.append('prompt', params.prompt);
    if (params.chatId) formData.append('chat_id', params.chatId);

    const response = await api.post('/api/mobile/attachments/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return (response.data?.data ?? null) as ContextPack | null;
  },
};
