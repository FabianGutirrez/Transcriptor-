
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { AudioUploader } from './components/AudioUploader';
import { TranscriptionResult } from './components/TranscriptionResult';
import { LoadingSpinner, AlertTriangleIcon } from './components/Icons';
import { transcribeMedia } from './services/geminiService';

const App: React.FC = () => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setMediaFile(file);
    setTranscription(null);
    setNotes(null);
    setError(null);
  };
  
  const handleTranscription = useCallback(async () => {
    if (!mediaFile) return;

    setIsLoading(true);
    setError(null);
    setTranscription(null);
    setNotes(null);

    try {
      const result = await transcribeMedia(mediaFile);
      setTranscription(result.transcription);
      setNotes(result.notes);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido durante la transcripción.');
    } finally {
      setIsLoading(false);
    }
  }, [mediaFile]);

  return (
    <div className="min-h-screen text-slate-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
          <p className="text-slate-600 mb-6 text-center">
            Sube un archivo de audio o video para obtener una transcripción de "Fidelidad Radical", diseñada para el análisis clínico lingüístico.
          </p>

          <AudioUploader onFileChange={handleFileChange} disabled={isLoading} />
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleTranscription}
              disabled={!mediaFile || isLoading}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Transcribiendo...
                </>
              ) : (
                'Transcribir Archivo'
              )}
            </button>
          </div>
        </div>

        {error && (
           <div className="mt-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center gap-3" role="alert">
              <AlertTriangleIcon className="h-6 w-6 text-red-600" />
              <div>
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
          </div>
        )}
        
        {(transcription || notes) && !isLoading && (
          <div className="mt-8">
            <TranscriptionResult transcription={transcription} notes={notes} />
          </div>
        )}

      </main>
       <footer className="text-center py-6 text-slate-500 text-sm">
          <p>Potenciado por Gemini API. Creado para análisis fonoaudiológico.</p>
        </footer>
    </div>
  );
};

export default App;
