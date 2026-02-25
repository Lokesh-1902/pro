import { useState } from 'react';
import { Header } from '@/components/Header';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { CaseInputForm } from '@/components/CaseInputForm';
import { AnalysisProgress } from '@/components/AnalysisProgress';
import { AnalysisResults } from '@/components/AnalysisResults';
import { HistoryPanel } from '@/components/HistoryPanel';
import { useAnalysis } from '@/hooks/useAnalysis';
import { getAnalysisById } from '@/lib/storage';

type View = 'input' | 'analyzing' | 'results' | 'history';

const Index = () => {
  const [view, setView] = useState<View>('input');
  const { analyzeCase, isAnalyzing, progress, analysis, setAnalysis } = useAnalysis();

  const handleSubmit = async (caseText: string, documentText?: string) => {
    setView('analyzing');
    const result = await analyzeCase(caseText, documentText);
    setView(result ? 'results' : 'input');
  };

  const handleNewAnalysis = () => {
    setAnalysis(null);
    setView('input');
  };

  const handleViewHistory = () => {
    setView('history');
  };

  const handleSelectFromHistory = (id: string) => {
    const savedAnalysis = getAnalysisById(id);
    if (savedAnalysis) {
      setAnalysis(savedAnalysis);
      setView('results');
    }
  };

  const handleCloseHistory = () => {
    if (analysis) {
      setView('results');
    } else {
      setView('input');
    }
  };

  // Handle the analyzing state
  if (isAnalyzing && view === 'analyzing') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <DisclaimerBanner />
        <main className="container mx-auto max-w-4xl px-4 py-12">
          <AnalysisProgress progress={progress} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DisclaimerBanner />
      
      <main className="container mx-auto max-w-4xl px-4 py-8">
        {view === 'history' && (
          <HistoryPanel
            onSelectAnalysis={handleSelectFromHistory}
            onClose={handleCloseHistory}
          />
        )}

        {view === 'results' && analysis && (
          <AnalysisResults
            analysis={analysis}
            onNewAnalysis={handleNewAnalysis}
            onViewHistory={handleViewHistory}
          />
        )}

        {view === 'input' && (
          <div className="animate-fade-in">
            <div className="mb-8 text-center">
              <h2 className="mb-2 font-serif text-3xl font-bold text-foreground">
                Analyze Your Legal Case
              </h2>
              <p className="text-lg text-muted-foreground">
                Get comprehensive AI-powered analysis of your legal situation under Indian law
              </p>
            </div>
            <CaseInputForm onSubmit={handleSubmit} isAnalyzing={isAnalyzing} />
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-muted/30 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            This tool is for educational and research purposes only. 
            Always consult a qualified legal professional for actual legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
