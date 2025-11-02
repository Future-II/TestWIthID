import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
  icon?: React.ComponentType<any>;
  description?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  onFileChange,
  file,
  icon: Icon = FileText,
  description,
  className = "border-blue-400 hover:border-blue-400"
}) => {
  return (
    <div className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:${className} transition-colors`}>
      <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="font-semibold text-gray-700 mb-2">{label}</h3>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      <input
        type="file"
        accept={accept}
        onChange={onFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {file && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-500 inline mr-2" />
          <span className="text-green-700 text-sm">{file.name}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;