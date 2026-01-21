
import React, { useState, useCallback, useRef } from 'react';
import { UploadCloudIcon, FileAudioIcon, FileVideoIcon } from './Icons';

interface AudioUploaderProps {
  onFileChange: (file: File | null) => void;
  disabled: boolean;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileChange, disabled }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'audio' | 'video' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file && (file.type.startsWith('audio/') || file.type.startsWith('video/'))) {
      setFileName(file.name);
      setFileType(file.type.startsWith('audio/') ? 'audio' : 'video');
      onFileChange(file);
    } else {
      alert('Por favor, selecciona un archivo de audio o video válido.');
      setFileName(null);
      setFileType(null);
      onFileChange(null);
    }
  }, [onFileChange]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label
        htmlFor="audio-upload"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${
          disabled
            ? 'bg-slate-100 border-slate-300 cursor-not-allowed'
            : isDragging
            ? 'bg-teal-50 border-teal-400'
            : 'bg-slate-50 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            {fileName ? (
                <>
                    {fileType === 'audio' && <FileAudioIcon className="w-10 h-10 mb-3 text-green-500" />}
                    {fileType === 'video' && <FileVideoIcon className="w-10 h-10 mb-3 text-green-500" />}
                    <p className="mb-2 text-sm font-semibold text-slate-700">{fileName}</p>
                    <p className="text-xs text-slate-500">Haz clic o arrastra otro archivo para reemplazar</p>
                </>
            ) : (
                <>
                    <UploadCloudIcon className="w-10 h-10 mb-3 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-500">
                    <span className="font-semibold text-teal-600">Haz clic para subir</span> o arrastra y suelta
                    </p>
                    <p className="text-xs text-slate-500">Cualquier formato de audio o video (MP3, MP4, etc.)</p>
                </>
            )}
        </div>
        <input 
          id="audio-upload" 
          type="file" 
          className="hidden" 
          accept="audio/*,video/*" 
          onChange={handleChange}
          disabled={disabled}
          ref={fileInputRef}
        />
      </label>
    </div>
  );
};
