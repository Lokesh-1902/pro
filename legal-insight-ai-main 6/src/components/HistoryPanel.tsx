import { HistoryItem } from '@/types/legal';
import { getHistory, clearHistory } from '@/lib/storage';
import { exportToPDF } from '@/lib/pdf-export';
import { Clock, FileText, Trash2, Download, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

interface HistoryPanelProps {
  onSelectAnalysis: (id: string) => void;
  onClose: () => void;
}

export const HistoryPanel = ({ onSelectAnalysis, onClose }: HistoryPanelProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleExport = (item: HistoryItem) => {
    exportToPDF(item.analysis);
  };

  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case 'HIGH': return 'bg-success text-success-foreground';
      case 'MEDIUM': return 'bg-warning text-warning-foreground';
      case 'LOW': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Session History</h2>
            <p className="text-sm text-muted-foreground">
              {history.length} {history.length === 1 ? 'analysis' : 'analyses'} in this session
            </p>
          </div>
        </div>
        {history.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear} className="gap-2 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex items-center gap-3 p-4 text-sm text-warning-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <p>
            History is stored in your browser session only. It will be cleared when you close this tab. 
            Use the export button to save analyses as PDF for permanent records.
          </p>
        </CardContent>
      </Card>

      {history.length === 0 ? (
        <Card className="legal-shadow">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">No Analyses Yet</h3>
            <p className="text-muted-foreground">
              Your analyzed cases will appear here during this session.
            </p>
            <Button onClick={onClose} className="mt-4">
              Analyze a Case
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card 
              key={item.id} 
              className="legal-shadow cursor-pointer transition-all hover:border-accent/50"
              onClick={() => onSelectAnalysis(item.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline" className="shrink-0">
                        {item.primaryDomain}
                      </Badge>
                      <Badge className={`shrink-0 ${getProbabilityColor(item.successProbability)}`}>
                        {item.successProbability}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {item.inputSummary}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      <Clock className="mr-1 inline h-3 w-3" />
                      {formatTime(item.timestamp)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(item);
                    }}
                    title="Export as PDF"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
