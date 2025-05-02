
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Upload, File, X } from 'lucide-react';
import { PDFDocument } from '@/lib/types';

// API URL for the Flask backend
const API_URL = 'http://localhost:5000';

interface PDFUploaderProps {
  onPDFsUploaded: (pdfs: PDFDocument[]) => void;
  uploadedPDFs: PDFDocument[];
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onPDFsUploaded, uploadedPDFs }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    }
  };

  const processFiles = async (files: File[]) => {
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      toast.error("Please upload PDF files only.");
      return;
    }

    setIsUploading(true);
    
    try {
      const newPDFs: PDFDocument[] = [];
      
      // Upload each PDF file to the backend
      for (const file of pdfFiles) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
        
        const result = await response.json();
        newPDFs.push(result);
      }
      
      onPDFsUploaded([...uploadedPDFs, ...newPDFs]);
      toast.success(`${pdfFiles.length} PDF${pdfFiles.length !== 1 ? 's' : ''} uploaded successfully.`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload one or more PDFs. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePDF = (id: string) => {
    const updatedPDFs = uploadedPDFs.filter(pdf => pdf.id !== id);
    onPDFsUploaded(updatedPDFs);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? 'border-study-primary bg-study-light/10' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="w-8 h-8 text-study-primary mb-2" />
          <h3 className="text-lg font-medium">Upload PDF files</h3>
          <p className="text-sm text-gray-500 mb-2">
            Drag and drop your PDFs here, or click to browse
          </p>
          <Input
            type="file"
            accept=".pdf"
            multiple
            id="pdf-upload"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('pdf-upload')?.click()}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Browse Files'}
          </Button>
        </div>
      </div>

      {uploadedPDFs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded PDFs:</h4>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {uploadedPDFs.map((pdf) => (
              <div
                key={pdf.id}
                className="bg-gray-50 rounded-lg p-3 flex items-center justify-between text-sm"
              >
                <div className="flex items-center space-x-3">
                  <File className="w-4 h-4 text-study-primary" />
                  <div>
                    <p className="font-medium truncate max-w-[12rem]">{pdf.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(pdf.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6"
                  onClick={() => handleRemovePDF(pdf.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;
