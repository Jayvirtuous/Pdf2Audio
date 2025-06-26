
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      let errorMessage = "File upload failed";
      
      if (rejection.errors[0]?.code === 'file-too-large') {
        errorMessage = "File is too large. Maximum size is 10MB.";
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        errorMessage = "Invalid file type. Only PDF files are allowed.";
      }
      
      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileSelect(file);
    }
  }, [onFileSelect, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive || dragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        <div className="flex justify-center">
          {isDragActive ? (
            <Upload className="h-12 w-12 text-blue-500" />
          ) : (
            <FileText className="h-12 w-12 text-gray-400" />
          )}
        </div>
        
        <div>
          <p className="text-lg font-medium text-gray-900">
            {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF file'}
          </p>
          <p className="text-gray-600 mt-1">
            or click to browse your files
          </p>
        </div>
        
        <Button variant="outline" className="mt-4">
          Select PDF File
        </Button>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mt-4">
          <div className="flex items-center space-x-1">
            <AlertCircle className="h-4 w-4" />
            <span>Max 10MB</span>
          </div>
          <span>•</span>
          <span>PDF files only</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
