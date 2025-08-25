
import React, { useState, useCallback } from 'react';
import { translateText } from '../services/geminiService';

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

const TextTranslator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Vui lòng nhập văn bản cần dịch.');
      return;
    }
    setIsLoading(true);
    setError('');
    setTranslation('');
    try {
      const result = await translateText(inputText);
      setTranslation(result);
    } catch (err) {
      setError('Đã xảy ra lỗi khi dịch văn bản. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  return (
    <div className="w-full max-w-4xl mx-auto relative">
        <BackButton onClick={onBack} />
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 mt-12">
            <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col">
                <label htmlFor="input-text" className="text-2xl font-bold text-slate-100 mb-4">Văn bản gốc</label>
                <textarea
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập văn bản của bạn ở đây..."
                className="flex-grow w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow min-h-[300px]"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="output-text" className="text-2xl font-bold text-slate-100 mb-4">Bản dịch (Tiếng Việt)</label>
                <div id="output-text" className="flex-grow w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 min-h-[300px]">
                    {error && <p className="text-red-400">{error}</p>}
                    <p className="whitespace-pre-wrap">{translation}</p>
                </div>
            </div>
            </div>
            <div className="mt-6">
                <button
                    onClick={handleTranslate}
                    disabled={isLoading || !inputText.trim()}
                    className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
                >
                    {isLoading ? <Spinner /> : 'Dịch'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default TextTranslator;
