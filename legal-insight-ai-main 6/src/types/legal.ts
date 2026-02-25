export interface CaseAnalysis {
  id: string;
  timestamp: Date;
  inputSummary: string;
  classification: {
    primaryDomain: string;
    secondaryDomains: string[];
    proceduralStage: string;
    complexityScore: number;
    confidenceScore: number;
  };
  legalProvisions: {
    coreSection: string;
    applicableSections: string[];
    misusedSections: string[];
    constitutionalAngles: string[];
  };
  factEvidence: {
    keyFacts: string[];
    evidenceStrength: 'Weak' | 'Moderate' | 'Strong';
    courtRequirements: string[];
    gaps: string[];
  };
  jurisdiction: {
    correctForum: string;
    alternativeForums: string[];
    limitationStatus: 'Safe' | 'Borderline' | 'Time-barred';
    limitationDetails: string;
  };
  proceduralPath: {
    steps: { step: string; timeline: string; notes: string }[];
    totalTimeline: string;
    urgentActions: string[];
  };
  riskOutcome: {
    successProbability: 'LOW' | 'MEDIUM' | 'HIGH';
    riskFactors: string[];
    tacticalConsiderations: string[];
    strengthFactors: string[];
  };
  precedents: {
    settledPrinciples: string[];
    relevantCases: { name: string; citation: string; relevance: string }[];
    judicialAttitude: string;
  };
  winningStrategy: {
    overview: string;
    keyArguments: { argument: string; howToPresent: string; whyItWorks: string }[];
    exactWordsToUse: string[];
    thingsToAvoidSaying: string[];
    courtBehaviorTips: string[];
    documentsToPrepare: string[];
    questionsToPrepareFor: { question: string; suggestedAnswer: string }[];
    openingStatement: string;
    closingStatement: string;
  };
  rawAnalysis: string;
}

export interface HistoryItem {
  id: string;
  timestamp: Date;
  inputSummary: string;
  primaryDomain: string;
  successProbability: 'LOW' | 'MEDIUM' | 'HIGH';
  analysis: CaseAnalysis;
}
