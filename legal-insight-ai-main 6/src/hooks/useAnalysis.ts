import { useState } from 'react';
import { CaseAnalysis } from '@/types/legal';
import { saveToHistory } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-case`;

export const useAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState('');
  const [analysis, setAnalysis] = useState<CaseAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeCase = async (caseText: string, documentText?: string): Promise<CaseAnalysis | null> => {
    setIsAnalyzing(true);
    setProgress('Initializing analysis...');
    setAnalysis(null);

    const fullText = documentText 
      ? `${caseText}\n\n--- Uploaded Document Content ---\n${documentText}`
      : caseText;

    try {
      setProgress('Connecting to AI analysis engine...');

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 120000);
      
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ caseText: fullText }),
        signal: controller.signal,
      });
      window.clearTimeout(timeoutId);

      if (resp.status === 429) {
        toast({
          title: 'Rate limit exceeded',
          description: 'Too many requests. Please wait a moment and try again.',
          variant: 'destructive',
        });
        return null;
      }

      if (resp.status === 402) {
        toast({
          title: 'Service unavailable',
          description: 'AI service quota reached. Please try again later.',
          variant: 'destructive',
        });
        return null;
      }

      if (!resp.ok || !resp.body) {
        throw new Error('Failed to start analysis');
      }

      setProgress('Analyzing legal provisions and jurisdiction...');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let fullContent = '';
      let streamDone = false;

      const progressMessages = [
        'Identifying applicable IPC sections...',
        'Assessing evidence strength...',
        'Determining correct forum...',
        'Calculating success probability...',
        'Compiling precedents...',
        'Generating procedural roadmap...',
      ];
      let progressIndex = 0;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const choice = parsed.choices?.[0];
            const content = choice?.delta?.content as string | undefined;
            if (content) {
              fullContent += content;
              // Update progress periodically
              if (fullContent.length % 500 < 50 && progressIndex < progressMessages.length) {
                setProgress(progressMessages[progressIndex]);
                progressIndex++;
              }
            }

            if (choice?.finish_reason) {
              streamDone = true;
              break;
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Flush remaining buffer
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) fullContent += content;
          } catch { /* ignore */ }
        }
      }

      setProgress('Processing analysis results...');

      // Parse the structured response
      const parsedAnalysis = parseAnalysisResponse(fullContent, caseText);
      setAnalysis(parsedAnalysis);
      saveToHistory(parsedAnalysis);
      
      toast({
        title: 'Analysis Complete',
        description: 'Your legal case analysis is ready.',
      });

      return parsedAnalysis;

    } catch (error) {
      console.error('Analysis error:', error);
      const isTimeout = error instanceof DOMException && error.name === 'AbortError';

      toast({
        title: 'Analysis Failed',
        description: isTimeout
          ? 'The analysis took too long. Please try again with a shorter input or retry.'
          : 'Unable to complete the analysis. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsAnalyzing(false);
      setProgress('');
    }
  };

  return { analyzeCase, isAnalyzing, progress, analysis, setAnalysis };
};

function parseAnalysisResponse(content: string, originalInput: string): CaseAnalysis {
  // Try to extract JSON from the response
  let parsed: any = {};
  
  try {
    // Look for JSON block in the response
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1]);
    } else {
      // Try parsing the entire content as JSON
      parsed = JSON.parse(content);
    }
  } catch {
    // If JSON parsing fails, create a basic structure from the raw text
    parsed = extractFromRawText(content);
  }

  const inputSummary = originalInput.slice(0, 150) + (originalInput.length > 150 ? '...' : '');

  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    inputSummary,
    classification: {
      primaryDomain: parsed.classification?.primaryDomain || 'General Legal Matter',
      secondaryDomains: parsed.classification?.secondaryDomains || [],
      proceduralStage: parsed.classification?.proceduralStage || 'Pre-litigation',
      complexityScore: parsed.classification?.complexityScore || 0.5,
      confidenceScore: parsed.classification?.confidenceScore || 0.7,
    },
    legalProvisions: {
      coreSection: parsed.legalProvisions?.coreSection || 'To be determined based on specific facts',
      applicableSections: parsed.legalProvisions?.applicableSections || [],
      misusedSections: parsed.legalProvisions?.misusedSections || [],
      constitutionalAngles: parsed.legalProvisions?.constitutionalAngles || [],
    },
    factEvidence: {
      keyFacts: parsed.factEvidence?.keyFacts || ['Facts to be analyzed from provided documents'],
      evidenceStrength: parsed.factEvidence?.evidenceStrength || 'Moderate',
      courtRequirements: parsed.factEvidence?.courtRequirements || [],
      gaps: parsed.factEvidence?.gaps || [],
    },
    jurisdiction: {
      correctForum: parsed.jurisdiction?.correctForum || 'To be determined',
      alternativeForums: parsed.jurisdiction?.alternativeForums || [],
      limitationStatus: parsed.jurisdiction?.limitationStatus || 'Safe',
      limitationDetails: parsed.jurisdiction?.limitationDetails || '',
    },
    proceduralPath: {
      steps: parsed.proceduralPath?.steps || [{ step: 'Initial consultation', timeline: '1 week', notes: 'Gather all documents' }],
      totalTimeline: parsed.proceduralPath?.totalTimeline || 'To be determined',
      urgentActions: parsed.proceduralPath?.urgentActions || [],
    },
    riskOutcome: {
      successProbability: parsed.riskOutcome?.successProbability || 'MEDIUM',
      riskFactors: parsed.riskOutcome?.riskFactors || [],
      tacticalConsiderations: parsed.riskOutcome?.tacticalConsiderations || [],
      strengthFactors: parsed.riskOutcome?.strengthFactors || [],
    },
    precedents: {
      settledPrinciples: parsed.precedents?.settledPrinciples || [],
      relevantCases: parsed.precedents?.relevantCases || [],
      judicialAttitude: parsed.precedents?.judicialAttitude || 'Neutral',
    },
    winningStrategy: {
      overview: parsed.winningStrategy?.overview || 'Strategy to be determined based on case details.',
      keyArguments: parsed.winningStrategy?.keyArguments || [],
      exactWordsToUse: parsed.winningStrategy?.exactWordsToUse || [],
      thingsToAvoidSaying: parsed.winningStrategy?.thingsToAvoidSaying || [],
      courtBehaviorTips: parsed.winningStrategy?.courtBehaviorTips || [],
      documentsToPrepare: parsed.winningStrategy?.documentsToPrepare || [],
      questionsToPrepareFor: parsed.winningStrategy?.questionsToPrepareFor || [],
      openingStatement: parsed.winningStrategy?.openingStatement || '',
      closingStatement: parsed.winningStrategy?.closingStatement || '',
    },
    rawAnalysis: content,
  };
}

function extractFromRawText(text: string): any {
  // Basic extraction when JSON parsing fails
  const result: any = {
    classification: {},
    legalProvisions: {},
    factEvidence: {},
    jurisdiction: {},
    proceduralPath: {},
    riskOutcome: {},
    precedents: {},
  };

  // Try to extract key information from text
  const domainMatch = text.match(/primary\s*domain[:\s]+([^\n,]+)/i);
  if (domainMatch) result.classification.primaryDomain = domainMatch[1].trim();

  const probabilityMatch = text.match(/success\s*probability[:\s]+(LOW|MEDIUM|HIGH)/i);
  if (probabilityMatch) result.riskOutcome.successProbability = probabilityMatch[1].toUpperCase();

  return result;
}
