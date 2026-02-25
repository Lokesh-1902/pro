import { HistoryItem, CaseAnalysis } from '@/types/legal';

const STORAGE_KEY = 'legal_case_history';

export const saveToHistory = (analysis: CaseAnalysis): void => {
  const history = getHistory();
  const historyItem: HistoryItem = {
    id: analysis.id,
    timestamp: analysis.timestamp,
    inputSummary: analysis.inputSummary,
    primaryDomain: analysis.classification.primaryDomain,
    successProbability: analysis.riskOutcome.successProbability,
    analysis,
  };
  
  history.unshift(historyItem);
  
  // Keep only last 20 items
  if (history.length > 20) {
    history.pop();
  }
  
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp),
      analysis: {
        ...item.analysis,
        timestamp: new Date(item.analysis.timestamp),
      },
    }));
  } catch {
    return [];
  }
};

export const getAnalysisById = (id: string): CaseAnalysis | null => {
  const history = getHistory();
  const item = history.find(h => h.id === id);
  return item?.analysis || null;
};

export const clearHistory = (): void => {
  sessionStorage.removeItem(STORAGE_KEY);
};
