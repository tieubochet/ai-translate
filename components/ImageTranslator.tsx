
import React, { useState, useCallback, useRef } from 'react';
import { translateImage } from '../services/geminiService';

const Spinner: React.FC = () => (
  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="absolute top-4 left-4 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Quay lại
    </button>
);

const ImageTranslator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const [meta, base64] = result.split(',');
        const mimeType = meta.split(':')[1].split(';')[0];
        if (base64 && mimeType) {
            resolve({ base64, mimeType });
        } else {
            reject(new Error("Failed to parse file data."));
        }
      };
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setTranslation('');
      setError('');
    }
  };

  const handleTranslate = useCallback(async () => {
    if (!imageFile) {
      setError('Vui lòng chọn một ảnh để dịch.');
      return;
    }
    setIsLoading(true);
    setError('');
    setTranslation('');
    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const result = await translateImage(base64, mimeType);
      setTranslation(result);
    } catch (err) {
      setError('Đã xảy ra lỗi khi dịch ảnh. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <BackButton onClick={onBack} />
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 mt-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Ảnh gốc</h2>
            <div
              onClick={triggerFileSelect}
              className="flex-grow flex items-center justify-center border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-cyan-500 hover:bg-slate-800 transition-all duration-300 min-h-[250px] p-4"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
              ) : (
                <div className="text-center text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2">Nhấn để tải ảnh lên</p>
                  <p className="text-sm">PNG, JPG, WEBP</p>
                </div>
              )}
            </div>
            <button
                onClick={handleTranslate}
                disabled={isLoading || !imageFile}
                className="mt-6 w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
            >
                {isLoading ? <Spinner /> : 'Dịch'}
            </button>
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Bản dịch (Tiếng Việt)</h2>
            <div className="flex-grow bg-slate-900 border border-slate-700 rounded-xl p-4 min-h-[250px]">
                {error && <p className="text-red-400">{error}</p>}
                <p className="text-slate-200 whitespace-pre-wrap">{translation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTranslator;
