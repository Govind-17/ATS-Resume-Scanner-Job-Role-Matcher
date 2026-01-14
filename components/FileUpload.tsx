import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle } from 'lucide-react';
import { FileData } from '../types';

interface FileUploadProps {
  onFileSelect: (data: FileData) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setError(null);
    
    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid PDF or Image file (JPEG, PNG).');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      onFileSelect({
        file,
        base64,
        mimeType: file.type,
      });
    };
    reader.onerror = () => {
      setError('Failed to read file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [disabled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center text-center cursor-pointer
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.02]' 
            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-900'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="file"
          accept=".pdf, .jpg, .jpeg, .png"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleInputChange}
          disabled={disabled}
        />
        
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm mb-5 transition-colors duration-300">
          <UploadCloud className={`w-12 h-12 ${isDragging ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`} />
        </div>
        
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2 transition-colors">
          {isDragging ? 'Drop your resume here' : 'Upload your Resume'}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-500 max-w-xs mx-auto mb-4">
          Drag & drop or click to browse. Supports PDF, JPEG, PNG (Max 5MB).
        </p>

        {error && (
          <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center p-3 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/30 animate-fade-in shadow-sm">
             <AlertCircle className="w-4 h-4 mr-2" />
             {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;