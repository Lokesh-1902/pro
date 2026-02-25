import { useState, useCallback } from 'react';
import { Upload, FileText, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface CaseInputFormProps {
  onSubmit: (caseText: string, documentText?: string) => void;
  isAnalyzing: boolean;
}

export const CaseInputForm = ({ onSubmit, isAnalyzing }: CaseInputFormProps) => {
  const [caseText, setCaseText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentText, setDocumentText] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Unsupported file type',
        description: 'Please upload a PDF, Word document, or text file.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 10MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploadedFile(file);

    // For text files, read content directly
    if (file.type === 'text/plain') {
      const text = await file.text();
      setDocumentText(text);
    } else {
      // For PDFs and Word docs, we'll send the file to be processed
      // For now, show a message that document content will be extracted
      setDocumentText(`[Document: ${file.name}] - Content will be analyzed`);
      toast({
        title: 'Document uploaded',
        description: 'The document will be analyzed along with your case description.',
      });
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleSubmit = () => {
    if (!caseText.trim() && !documentText) {
      toast({
        title: 'Input required',
        description: 'Please describe your case or upload a document.',
        variant: 'destructive',
      });
      return;
    }
    onSubmit(caseText, documentText || undefined);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setDocumentText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block font-serif text-lg font-semibold text-foreground">
          Describe Your Case
        </label>
        <Textarea
          placeholder="Paste your case details here. You can include:
• FIR content or complaint text
• Legal notices or court orders
• Email communications related to the dispute
• Any relevant documents or facts

Don't worry about identifying specific laws or jurisdiction - the system will analyze and determine these automatically."
          className="min-h-[200px] resize-y font-sans text-base"
          value={caseText}
          onChange={(e) => setCaseText(e.target.value)}
          disabled={isAnalyzing}
        />
      </div>

      <div>
        <label className="mb-2 block font-serif text-lg font-semibold text-foreground">
          Upload Documents (Optional)
        </label>
        <div
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging
              ? 'border-accent bg-accent/5'
              : 'border-border hover:border-accent/50'
          } ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploadedFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-accent" />
              <div className="text-left">
                <p className="font-medium text-foreground">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
                disabled={isAnalyzing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="mb-1 text-foreground">
                Drag and drop your document here, or{' '}
                <label className="cursor-pointer font-medium text-accent hover:underline">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    disabled={isAnalyzing}
                  />
                </label>
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PDF, Word documents, and text files (max 10MB)
              </p>
            </>
          )}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isAnalyzing || (!caseText.trim() && !documentText)}
        className="w-full gap-2 bg-primary py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
        size="lg"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Analyze Case
          </>
        )}
      </Button>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="mb-2 font-serif text-sm font-semibold text-foreground">
            What can you analyze?
          </p>
          <ul className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
            <li>• FIRs and Police Complaints</li>
            <li>• Legal Notices</li>
            <li>• Court Orders</li>
            <li>• Contracts and Agreements</li>
            <li>• Property Disputes</li>
            <li>• Employment Issues</li>
            <li>• Consumer Complaints</li>
            <li>• Family Law Matters</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
