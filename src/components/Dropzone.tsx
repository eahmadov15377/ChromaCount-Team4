import React, { useRef, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface DropzoneProps {
  onImageSelected: (file: File) => void;
  isProcessing: boolean;
}

const Dropzone: React.FC<DropzoneProps> = ({ onImageSelected, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const validateAndUpload = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please upload JPG or PNG.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Max size is 5MB.");
      return;
    }
    setError(null);
    onImageSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-80 border-3 border-dashed rounded-2xl transition-all duration-300 ease-in-out cursor-pointer
          ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" className="hidden" accept="image/jpeg, image/png" onChange={handleChange} />
        <div className="flex flex-col items-center text-center p-6 space-y-4">
          <div className={`p-4 rounded-full ${dragActive ? 'bg-indigo-100' : 'bg-slate-100'}`}>
            {isProcessing ? (
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            ) : (
              <Upload className={`w-10 h-10 ${dragActive ? 'text-indigo-600' : 'text-slate-400'}`} />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-800">{isProcessing ? 'Analyzing Image...' : 'Upload an image to start'}</h3>
            <p className="text-slate-500 max-w-sm">Drag & drop or click to select. JPG/PNG under 5MB.</p>
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2" /> <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Dropzone;