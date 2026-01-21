
import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon, SpeechBubbleTextIcon, ClipboardCheckIcon } from './Icons';

interface TranscriptionResultProps {
  transcription: string | null;
  notes: string | null;
}

const ResultCard: React.FC<{ title: string; content: string; icon: React.ReactNode }> = ({ title, content, icon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/70">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors"
        >
          {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <ClipboardIcon className="h-4 w-4" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-slate-600 whitespace-pre-wrap font-mono">{content}</p>
      </div>
    </div>
  );
};


export const TranscriptionResult: React.FC<TranscriptionResultProps> = ({ transcription, notes }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-slate-800">Resultados del Análisis</h2>
        {transcription && (
            <ResultCard 
                title="Transcripción Fiel" 
                content={transcription}
                icon={<SpeechBubbleTextIcon className="h-6 w-6 text-teal-600" />}
            />
        )}
        {notes && (
            <ResultCard 
                title="Notas de Observación" 
                content={notes}
                icon={<ClipboardCheckIcon className="h-6 w-6 text-amber-600" />}
            />
        )}
    </div>
  );
};

// Add fade-in animation to tailwind config or a style tag if needed.
// For simplicity, let's add it here.
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
`;
document.head.appendChild(style);
