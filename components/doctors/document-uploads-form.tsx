'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, X, File, CheckCircle } from 'lucide-react';

interface DocumentUpload {
  name: string;
  type: string;
  file: File;
}

interface DocumentUploadsData {
  documents: DocumentUpload[];
}

interface DocumentUploadsFormProps {
  data: DocumentUploadsData;
  onUpdate: (data: Partial<DocumentUploadsData>) => void;
}

const REQUIRED_DOCUMENT_TYPES = [
  { type: 'prc_license', label: 'PRC License', required: true },
  { type: 'medical_diploma', label: 'Medical Diploma', required: true },
  { type: 'board_certificate', label: 'Board Certificate', required: false },
  { type: 'residency_certificate', label: 'Residency Certificate', required: false },
  { type: 'fellowship_certificate', label: 'Fellowship Certificate', required: false }
];

export function DocumentUploadsForm({ data, onUpdate }: DocumentUploadsFormProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const newDocuments = files.map(file => ({
      name: file.name,
      type: 'general', // Default type, user can change this
      file: file
    }));

    onUpdate({
      documents: [...data.documents, ...newDocuments]
    });
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = data.documents.filter((_, i) => i !== index);
    onUpdate({ documents: updatedDocuments });
  };

  const updateDocumentType = (index: number, type: string) => {
    const updatedDocuments = data.documents.map((doc, i) => 
      i === index ? { ...doc, type } : doc
    );
    onUpdate({ documents: updatedDocuments });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'prc_license':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400';
      case 'medical_diploma':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400';
      case 'board_certificate':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-400';
      case 'residency_certificate':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400';
      case 'fellowship_certificate':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400';
    }
  };

  const hasRequiredDocuments = () => {
    const requiredTypes = REQUIRED_DOCUMENT_TYPES.filter(doc => doc.required).map(doc => doc.type);
    const uploadedTypes = data.documents.map(doc => doc.type);
    return requiredTypes.every(type => uploadedTypes.includes(type));
  };

  return (
    <div className="space-y-6">
      {/* Required Documents Info */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Document Requirements
          </CardTitle>
          <CardDescription>
            Upload the following documents for doctor verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {REQUIRED_DOCUMENT_TYPES.map((docType) => {
              const isUploaded = data.documents.some(doc => doc.type === docType.type);
              return (
                <div
                  key={docType.type}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isUploaded ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 'bg-muted/30'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {isUploaded ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <File className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">{docType.label}</span>
                  </div>
                  <Badge variant={docType.required ? 'destructive' : 'secondary'} className="text-xs">
                    {docType.required ? 'Required' : 'Optional'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Drag and drop files or click to browse. Supported formats: PDF, JPG, PNG (Max 10MB each)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your files here, or click to browse
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('document-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
            <input
              id="document-upload"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      {data.documents.length > 0 && (
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Uploaded Documents ({data.documents.length})</CardTitle>
            <CardDescription>
              Review and categorize uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.documents.map((document, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{document.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(document.file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <select
                      value={document.type || undefined}
                      onChange={(e) => updateDocumentType(index, e.target.value)}
                      className="text-xs border rounded px-2 py-1 bg-background"
                    >
                      <option value="general">General Document</option>
                      {REQUIRED_DOCUMENT_TYPES.map((docType) => (
                        <option key={docType.type} value={docType.type || undefined}>
                          {docType.label}
                        </option>
                      ))}
                    </select>
                    
                    <Badge className={getDocumentTypeColor(document.type)} variant="outline">
                      {REQUIRED_DOCUMENT_TYPES.find(dt => dt.type === document.type)?.label || 'General'}
                    </Badge>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDocument(index)}
                      className="text-destructive hover:text-destructive h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {!hasRequiredDocuments() && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> Please ensure you have uploaded all required documents (PRC License and Medical Diploma) 
                  before submitting the doctor registration.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}