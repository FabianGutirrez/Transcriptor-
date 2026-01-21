
import React from 'react';
import { WaveformInHeadIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-5 flex items-center justify-center gap-3">
         <div className="p-2 bg-teal-100 rounded-full">
            <WaveformInHeadIcon className="h-8 w-8 text-teal-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          Transcriptor Fonoaudiológico AI
        </h1>
      </div>
    </header>
  );
};
