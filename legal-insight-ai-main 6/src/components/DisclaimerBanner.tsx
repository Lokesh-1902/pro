import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner = () => {
  return (
    <div className="border-b border-warning/30 bg-warning/10 px-4 py-3">
      <div className="container mx-auto flex items-center gap-3 text-sm">
        <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
        <p className="text-warning-foreground">
          <strong>Disclaimer:</strong> This tool provides AI-generated analysis for educational and research purposes only. 
          It does not constitute legal advice. Please consult a qualified legal professional for actual legal matters.
        </p>
      </div>
    </div>
  );
};
