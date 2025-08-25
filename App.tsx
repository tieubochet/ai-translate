
import React, { useState } from 'react';
import { TranslationMode } from './types';
import ImageTranslator from './components/ImageTranslator';
import TextTranslator from './components/TextTranslator';

const SelectionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center w-full md:w-80 h-80 flex flex-col items-center justify-center transform transition-all duration-300 hover:scale-105 hover:bg-slate-700/50 hover:shadow-2xl hover:shadow-cyan-500/10 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
  >
    <div className="mb-4 text-cyan-400">{icon}</div>
    <h3 className="text-2xl font-bold text-slate-100 mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </button>
);

const SelectionScreen: React.FC<{ onSelect: (mode: TranslationMode) => void }> = ({ onSelect }) => {
  const ImageIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const TextIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
      <SelectionCard
        title="Dịch từ ảnh"
        description="Tải ảnh lên để trích xuất và dịch văn bản."
        icon={ImageIcon}
        onClick={() => onSelect(TranslationMode.IMAGE)}
      />
      <SelectionCard
        title="Dịch văn bản"
        description="Nhập hoặc dán văn bản để dịch trực tiếp."
        icon={TextIcon}
        onClick={() => onSelect(TranslationMode.TEXT)}
      />
    </div>
  );
};

const App: React.FC = () => {
  const [mode, setMode] = useState<TranslationMode>(TranslationMode.SELECT);

  const handleSelectMode = (newMode: TranslationMode) => {
    setMode(newMode);
  };

  const handleGoBack = () => {
    setMode(TranslationMode.SELECT);
  };

  const renderContent = () => {
    switch (mode) {
      case TranslationMode.IMAGE:
        return <ImageTranslator onBack={handleGoBack} />;
      case TranslationMode.TEXT:
        return <TextTranslator onBack={handleGoBack} />;
      case TranslationMode.SELECT:
      default:
        return <SelectionScreen onSelect={handleSelectMode} />;
    }
  };

  return (
    <main className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(29,78,216,0.15)_0,_transparent_40%)]"></div>
      <div className="z-10 flex flex-col items-center w-full max-w-5xl">
        {mode === TranslationMode.SELECT && (
          <header className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Web App Dịch Nội Dung Sang Tiếng Việt
            </h1>
            <p className="mt-4 text-lg text-slate-400">Chọn phương thức dịch của bạn</p>
          </header>
        )}
        <div className="w-full">
            {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default App;
