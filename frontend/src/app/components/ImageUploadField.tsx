import { ChangeEvent, useMemo, useState } from 'react';
import { ImageIcon, UploadCloud, X } from 'lucide-react';
import { uploadImage } from '../api/uploadApi';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  placeholder?: string;
  previewClassName?: string;
}

const DEFAULT_HELPER_TEXT = 'jpg, png, gif, webp 파일을 업로드할 수 있습니다. 업로드 후 이미지 주소가 자동으로 저장됩니다.';

export function ImageUploadField({
  label,
  value,
  onChange,
  helperText = DEFAULT_HELPER_TEXT,
  placeholder = '이미지 URL을 직접 입력하거나 파일을 업로드하세요.',
  previewClassName = 'h-52',
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  const previewUrl = useMemo(() => {
    const trimmed = value.trim();
    if (trimmed.startsWith('http')) return trimmed;
    return '';
  }, [value]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    try {
      setUploading(true);
      const uploaded = await uploadImage(file);
      onChange(uploaded.url);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-4 items-stretch">
        <div className="space-y-3">
          <input
            type="url"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-600 transition hover:border-blue-400 hover:bg-blue-50">
            <UploadCloud className="h-5 w-5" />
            <span>{uploading ? '업로드 중...' : '이미지 파일 선택'}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>

          <p className="text-xs text-gray-500">{helperText}</p>
        </div>

        <div className={`relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 ${previewClassName}`}>
          {previewUrl ? (
            <>
              <img src={previewUrl} alt={`${label} 미리보기`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-gray-600 shadow hover:bg-white"
                aria-label="이미지 제거"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="flex h-full min-h-[160px] flex-col items-center justify-center text-center text-sm text-gray-500">
              <ImageIcon className="mb-2 h-10 w-10 text-gray-400" />
              이미지를 업로드하면<br />미리보기가 표시됩니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
