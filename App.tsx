import React, { useState } from 'react';
import { TranslationMode } from './types';
import ImageTranslator from './components/ImageTranslator';
import TextTranslator from './components/TextTranslator';

const TabButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  const baseClasses = "px-6 py-3 font-semibold text-lg rounded-t-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50";
  const activeClasses = "bg-slate-800/50 text-slate-100 border-b-2 border-cyan-400";
  const inactiveClasses = "text-slate-400 hover:text-slate-100";
  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {label}
    </button>
  );
};


const App: React.FC = () => {
  const [mode, setMode] = useState<TranslationMode>(TranslationMode.TEXT);

  const renderContent = () => {
    switch (mode) {
      case TranslationMode.IMAGE:
        return <ImageTranslator />;
      case TranslationMode.TEXT:
      default:
        return <TextTranslator />;
    }
  };

  return (
    <main className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col items-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(29,78,216,0.15)_0,_transparent_40%)]"></div>
      <div className="z-10 flex flex-col items-center w-full max-w-4xl">
        <div className="w-full">
            <div className="flex border-b border-slate-700">
                <TabButton 
                    label="Dịch văn bản"
                    isActive={mode === TranslationMode.TEXT}
                    onClick={() => setMode(TranslationMode.TEXT)}
                />
                 <TabButton 
                    label="Dịch từ ảnh"
                    isActive={mode === TranslationMode.IMAGE}
                    onClick={() => setMode(TranslationMode.IMAGE)}
                />
            </div>
            <div className="w-full">
                {renderContent()}
            </div>
        </div>
      </div>
    </main>
  );
};

export default App;