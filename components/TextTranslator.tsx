import React, { useState, useCallback } from 'react';
import { translateText } from '../services/geminiService';

const Spinner: React.FC = () => (
  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const TextTranslator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

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
    } catch (err)
    {
      setError('Đã xảy ra lỗi khi dịch văn bản. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  const handleCopy = () => {
    if (translation) {
        navigator.clipboard.writeText(translation);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
        <div className="bg-slate-800/50 border border-slate-700 border-t-0 rounded-b-2xl p-6 md:p-8">
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