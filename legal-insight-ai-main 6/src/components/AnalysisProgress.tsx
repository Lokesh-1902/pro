import { Loader2, Scale } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

interface AnalysisProgressProps {
  progress: string;
}

export const AnalysisProgress = ({ progress }: AnalysisProgressProps) => {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    // Simulate progress based on the progress message
    const progressMap: { [key: string]: number } = {
      'Initializing analysis...': 10,
      'Connecting to AI analysis engine...': 20,
      'Analyzing legal provisions and jurisdiction...': 30,
      'Identifying applicable IPC sections...': 40,
      'Assessing evidence strength...': 50,
      'Determining correct forum...': 60,
      'Calculating success probability...': 70,
      'Compiling precedents...': 80,
      'Generating procedural roadmap...': 90,
      'Processing analysis results...': 95,
    };

    const value = progressMap[progress] || progressValue;
    setProgressValue(value);
  }, [progress, progressValue]);

  return (
    <Card className="legal-shadow animate-fade-in">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-pulse rounded-full bg-accent/20" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary">
            <Scale className="h-10 w-10 text-primary-foreground" />
          </div>
          <Loader2 className="absolute -right-2 -top-2 h-8 w-8 animate-spin text-accent" />
        </div>
        
        <h3 className="mb-2 font-serif text-xl font-bold text-foreground">
          Analyzing Your Case
        </h3>
        <p className="mb-6 text-muted-foreground">
          {progress || 'Processing...'}
        </p>
        
        <div className="w-full max-w-md">
          <Progress value={progressValue} className="h-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            {progressValue}% complete
          </p>
        </div>

        <div className="mt-8 rounded-lg bg-muted/50 p-4 text-left text-sm">
          <p className="font-medium text-foreground">Our AI is:</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>✓ Identifying applicable legal provisions</li>
            <li>✓ Analyzing jurisdiction and forum</li>
            <li>✓ Evaluating evidence strength</li>
            <li>✓ Calculating success probability</li>
            <li>✓ Finding relevant precedents</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
