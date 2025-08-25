import React, { useState, useCallback, useRef } from 'react';
import { translateImage } from '../services/geminiService';

const Spinner: React.FC = () => (
  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const ImageTranslator: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
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
  
  const handleCopy = () => {
    if (translation) {
        navigator.clipboard.writeText(translation);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-slate-800/50 border border-slate-700 border-t-0 rounded-b-2xl p-6 md:p-8">
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
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-100">Bản dịch (Tiếng Việt)</h2>
                {translation && (
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-cyan-300 transition-all disabled:opacity-50 disabled:cursor-default"
                        disabled={isCopied}
                    >
                    {isCopied ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            <span>Đã chép!</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            <span>Chép</span>
                        </>
                    )}
                    </button>
                )}
            </div>
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