import { CaseAnalysis } from '@/types/legal';
import { 
  FileText, 
  Scale, 
  MapPin, 
  Route, 
  AlertTriangle, 
  BookOpen,
  Download,
  RefreshCw,
  History,
  ChevronRight,
  Trophy,
  MessageSquare,
  ShieldCheck,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { exportToPDF } from '@/lib/pdf-export';


interface AnalysisResultsProps {
  analysis: CaseAnalysis;
  onNewAnalysis: () => void;
  onViewHistory: () => void;
}

export const AnalysisResults = ({ 
  analysis, 
  onNewAnalysis, 
  onViewHistory 
}: AnalysisResultsProps) => {
  const handleExport = () => {
    exportToPDF(analysis);
  };

  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case 'HIGH': return 'bg-success text-success-foreground';
      case 'MEDIUM': return 'bg-warning text-warning-foreground';
      case 'LOW': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getLimitationColor = (status: string) => {
    switch (status) {
      case 'Safe': return 'text-success';
      case 'Borderline': return 'text-warning';
      case 'Time-barred': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getEvidenceColor = (strength: string) => {
    switch (strength) {
      case 'Strong': return 'bg-success/10 text-success border-success/30';
      case 'Moderate': return 'bg-warning/10 text-warning border-warning/30';
      case 'Weak': return 'bg-destructive/10 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header Card */}
      <Card className="legal-shadow overflow-hidden">
        <div className="bg-primary p-6 text-primary-foreground">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-sm opacity-80">Primary Legal Domain</p>
              <h2 className="font-serif text-2xl font-bold">
                {analysis.classification.primaryDomain}
              </h2>
              {analysis.classification.secondaryDomains.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {analysis.classification.secondaryDomains.map((domain, i) => (
                    <Badge key={i} variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                      {domain}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className={`rounded-lg px-4 py-2 ${getProbabilityColor(analysis.riskOutcome.successProbability)}`}>
              <p className="text-xs font-medium opacity-80">Success Probability</p>
              <p className="text-xl font-bold">{analysis.riskOutcome.successProbability}</p>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">Procedural Stage</p>
              <p className="mt-1 font-medium text-foreground">{analysis.classification.proceduralStage}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">Complexity</p>
              <p className="mt-1 font-medium text-foreground">
                {(analysis.classification.complexityScore * 100).toFixed(0)}%
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">Confidence</p>
              <p className="mt-1 font-medium text-foreground">
                {(analysis.classification.confidenceScore * 100).toFixed(0)}%
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">Limitation</p>
              <p className={`mt-1 font-medium ${getLimitationColor(analysis.jurisdiction.limitationStatus)}`}>
                {analysis.jurisdiction.limitationStatus}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Accordions */}
      <Accordion type="multiple" defaultValue={['winning-strategy', 'provisions', 'risk']} className="space-y-4">
        {/* 🏆 Winning Strategy - How to Win This Case */}
        <AccordionItem value="winning-strategy" className="rounded-lg border-2 border-primary/30 bg-card legal-shadow">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-serif text-lg font-semibold">🏆 How to Win This Case — Complete Strategy</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-primary/20 px-6 py-4">
            <div className="space-y-6">
              {/* Overview */}
              {analysis.winningStrategy.overview && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">📋 Strategy Overview</h4>
                  <p className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-foreground leading-relaxed">
                    {analysis.winningStrategy.overview}
                  </p>
                </div>
              )}

              {/* Key Arguments */}
              {analysis.winningStrategy.keyArguments.length > 0 && (
                <div>
                  <h4 className="mb-3 font-semibold text-foreground">💪 Key Arguments to Make</h4>
                  <div className="space-y-3">
                    {analysis.winningStrategy.keyArguments.map((arg, i) => (
                      <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            {i + 1}
                          </div>
                          <div className="flex-1 space-y-2">
                            <p className="font-medium text-foreground">{arg.argument}</p>
                            <div className="rounded-md bg-accent/10 border border-accent/20 p-3">
                              <p className="text-xs font-semibold uppercase text-accent mb-1">💬 Exact Words to Use:</p>
                              <p className="text-sm text-foreground italic">"{arg.howToPresent}"</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-success">Why it works:</span> {arg.whyItWorks}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exact Words/Phrases to Use */}
              {analysis.winningStrategy.exactWordsToUse.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-success" />
                    Powerful Phrases to Say in Court
                  </h4>
                  <div className="space-y-2">
                    {analysis.winningStrategy.exactWordsToUse.map((phrase, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-md bg-success/5 border border-success/20 p-3">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span className="text-foreground italic">"{phrase}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Things to Avoid Saying */}
              {analysis.winningStrategy.thingsToAvoidSaying.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-destructive flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    🚫 NEVER Say These Things
                  </h4>
                  <div className="space-y-2">
                    {analysis.winningStrategy.thingsToAvoidSaying.map((thing, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-md bg-destructive/5 border border-destructive/20 p-3">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        <span className="text-muted-foreground">{thing}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Court Behavior Tips */}
              {analysis.winningStrategy.courtBehaviorTips.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">👔 How to Behave in Court</h4>
                  <ul className="space-y-1">
                    {analysis.winningStrategy.courtBehaviorTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Documents to Prepare */}
              {analysis.winningStrategy.documentsToPrepare.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">📁 Documents You Must Prepare</h4>
                  <ul className="space-y-1">
                    {analysis.winningStrategy.documentsToPrepare.map((doc, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Questions to Prepare For */}
              {analysis.winningStrategy.questionsToPrepareFor.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">❓ Questions Opponent May Ask & How to Answer</h4>
                  <div className="space-y-3">
                    {analysis.winningStrategy.questionsToPrepareFor.map((qa, i) => (
                      <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
                        <p className="font-medium text-destructive mb-2">
                          Q: "{qa.question}"
                        </p>
                        <div className="rounded-md bg-success/5 border border-success/20 p-3">
                          <p className="text-xs font-semibold uppercase text-success mb-1">Your Answer:</p>
                          <p className="text-sm text-foreground italic">"{qa.suggestedAnswer}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Opening Statement */}
              {analysis.winningStrategy.openingStatement && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">🎤 Opening Statement (Say This First)</h4>
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                    <p className="text-foreground leading-relaxed italic whitespace-pre-line">
                      "{analysis.winningStrategy.openingStatement}"
                    </p>
                  </div>
                </div>
              )}

              {/* Closing Statement */}
              {analysis.winningStrategy.closingStatement && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">🎯 Closing Statement (Say This Last)</h4>
                  <div className="rounded-lg bg-accent/5 border border-accent/20 p-4">
                    <p className="text-foreground leading-relaxed italic whitespace-pre-line">
                      "{analysis.winningStrategy.closingStatement}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Legal Provisions */}
        <AccordionItem value="provisions" className="rounded-lg border border-border bg-card legal-shadow">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-accent" />
              <span className="font-serif text-lg font-semibold">Legal Provisions Involved</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-border px-6 py-4">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold text-foreground">Core Section</h4>
                <p className="rounded-lg bg-muted/50 p-3 text-foreground">
                  {analysis.legalProvisions.coreSection}
                </p>
              </div>
              
              {analysis.legalProvisions.applicableSections.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">Applicable Sections</h4>
                  <ul className="space-y-1">
                    {analysis.legalProvisions.applicableSections.map((section, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{section}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.legalProvisions.misusedSections.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-destructive">⚠️ Potentially Misused Sections</h4>
                  <ul className="space-y-1">
                    {analysis.legalProvisions.misusedSections.map((section, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        <span>{section}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.legalProvisions.constitutionalAngles.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">Constitutional Angles</h4>
                  <ul className="space-y-1">
                    {analysis.legalProvisions.constitutionalAngles.map((angle, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{angle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Facts & Evidence */}
        <AccordionItem value="evidence" className="rounded-lg border border-border bg-card legal-shadow">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-accent" />
              <span className="font-serif text-lg font-semibold">Facts & Evidence Reality Check</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-border px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Evidence Strength:</span>
                <Badge className={getEvidenceColor(analysis.factEvidence.evidenceStrength)}>
                  {analysis.factEvidence.evidenceStrength}
                </Badge>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-foreground">Key Facts</h4>
                <ul className="space-y-1">
                  {analysis.factEvidence.keyFacts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {analysis.factEvidence.courtRequirements.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">What Courts Will Require</h4>
                  <ul className="space-y-1">
                    {analysis.factEvidence.courtRequirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.factEvidence.gaps.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-warning">Evidence Gaps</h4>
                  <ul className="space-y-1">
                    {analysis.factEvidence.gaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Jurisdiction */}
        <AccordionItem value="jurisdiction" className="rounded-lg border border-border bg-card legal-shadow">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-accent" />
              <span className="font-serif text-lg font-semibold">Court & Jurisdiction</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-border px-6 py-4">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold text-foreground">Correct Forum</h4>
                <p className="rounded-lg bg-muted/50 p-3 text-foreground">
                  {analysis.jurisdiction.correctForum}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Limitation Status:</span>
                <Badge className={getLimitationColor(analysis.jurisdiction.limitationStatus).replace('text-', 'bg-') + '/10 ' + getLimitationColor(analysis.jurisdiction.limitationStatus)}>
                  {analysis.jurisdiction.limitationStatus}
                </Badge>
              </div>

              {analysis.jurisdiction.limitationDetails && (
                <p className="text-sm text-muted-foreground">
                  {analysis.jurisdiction.limitationDetails}
                </p>
              )}

              {analysis.jurisdiction.alternativeForums.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">Alternative Forums</h4>
                  <ul className="space-y-1">
                    {analysis.jurisdiction.alternativeForums.map((forum, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{forum}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Procedural Path */}
        <AccordionItem value="procedure" className="rounded-lg border border-border bg-card legal-shadow">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <Route className="h-5 w-5 text-accent" />
              <span className="font-serif text-lg font-semibold">Procedural Path</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-border px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Total Timeline:</span>
                <Badge variant="outline">{analysis.proceduralPath.totalTimeline}</Badge>
              </div>

              <div className="space-y-3">
                {analysis.proceduralPath.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{step.step}</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Timeline:</span> {step.timeline}
                      </p>
                      {step.notes && (
                        <p className="mt-1 text-sm text-muted-foreground">{step.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {analysis.proceduralPath.urgentActions.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-destructive">🚨 Urgent Actions</h4>
                  <ul className="space-y-1">
                    {analysis.proceduralPath.urgentActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Risk & Outcome */}
        <AccordionItem value="risk" className="rounded-lg border border-border bg-card legal-shadow">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-accent" />
              <span className="font-serif text-lg font-semibold">Risk & Outcome Analysis</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-border px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Success Probability:</span>
                <Badge className={getProbabilityColor(analysis.riskOutcome.successProbability)}>
                  {analysis.riskOutcome.successProbability}
                </Badge>
              </div>

              {analysis.riskOutcome.strengthFactors.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-success">✓ Strength Factors</h4>
                  <ul className="space-y-1">
                    {analysis.riskOutcome.strengthFactors.map((factor, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.riskOutcome.riskFactors.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-destructive">⚠️ Risk Factors</h4>
                  <ul className="space-y-1">
                    {analysis.riskOutcome.riskFactors.map((factor, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.riskOutcome.tacticalConsiderations.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">Tactical Considerations</h4>
                  <ul className="space-y-1">
                    {analysis.riskOutcome.tacticalConsiderations.map((tactic, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{tactic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Precedents */}
        <AccordionItem value="precedents" className="rounded-lg border border-border bg-card legal-shadow">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-accent" />
              <span className="font-serif text-lg font-semibold">Precedents & Judicial Position</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-border px-6 py-4">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold text-foreground">Current Judicial Attitude</h4>
                <p className="rounded-lg bg-muted/50 p-3 text-foreground">
                  {analysis.precedents.judicialAttitude}
                </p>
              </div>

              {analysis.precedents.settledPrinciples.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">Settled Principles</h4>
                  <ul className="space-y-1">
                    {analysis.precedents.settledPrinciples.map((principle, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{principle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.precedents.relevantCases.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">Relevant Cases</h4>
                  <div className="space-y-3">
                    {analysis.precedents.relevantCases.map((caseItem, i) => (
                      <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
                        <p className="font-medium text-foreground">{caseItem.name}</p>
                        <p className="text-sm text-accent">{caseItem.citation}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{caseItem.relevance}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export as PDF
        </Button>
        <Button onClick={onNewAnalysis} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Analyze Another Case
        </Button>
        <Button onClick={onViewHistory} variant="ghost" className="gap-2">
          <History className="h-4 w-4" />
          View History
        </Button>
      </div>
    </div>
  );
};
