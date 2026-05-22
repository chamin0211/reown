import { API_BASE_URL } from './client';

export interface ImageUploadResponse {
  url: string;
  path: string;
  originalFilename: string;
  storedFilename: string;
  contentType: string;
  size: number;
}

async function readErrorMessage(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) return `이미지 업로드 실패: ${response.status}`;

  try {
    const parsed = JSON.parse(text) as { message?: string };
    return parsed.message || text;
  } catch {
    return text;
  }
}

export async function uploadImage(file: File): Promise<ImageUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/uploads/images`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}
