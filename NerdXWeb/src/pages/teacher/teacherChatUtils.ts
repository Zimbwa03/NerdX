import type { TeacherChatSelectedImage } from './teacherChatTypes';

export const TEACHER_CHAT_MAX_IMAGES = 10;
export const TEACHER_CHAT_MAX_INPUT_LENGTH = 1200;

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64 || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function createSelectedImage(file: File): TeacherChatSelectedImage {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    file,
    previewUrl: URL.createObjectURL(file),
  };
}

export function revokeSelectedImages(images: TeacherChatSelectedImage[]) {
  images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object') {
    const maybeAxiosError = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };
    return maybeAxiosError.response?.data?.message || maybeAxiosError.message || fallback;
  }

  if (typeof error === 'string' && error.trim()) return error;
  return fallback;
}

export function isPaymentRequired(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const maybeAxiosError = error as { response?: { status?: number } };
  return maybeAxiosError.response?.status === 402;
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text.trim()) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
