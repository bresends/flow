import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Cloud, Server, CheckCircle } from "lucide-react";
import StepSequence from "./step-sequence";

// Definindo os tipos para os passos do fluxo
interface FlowOption {
  label: string;
  next: string;
}

interface FlowStep {
  id: string;
  type: 'decision' | 'step' | 'end';
  title: string;
  question?: string;
  description?: string;
  options?: FlowOption[];
  commands?: string[];
  next?: string;
}

interface FlowStepperProps {
  flow: FlowStep[];
}

export default function FlowStepper({ flow }: FlowStepperProps) {
  const [currentId, setCurrentId] = useState("start");
  const [history, setHistory] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());



  const currentStep = flow.find((step) => step.id === currentId);

  const relevantSteps = flow.filter(step => step.type === 'step' || step.type === 'decision');
  const totalSteps = relevantSteps.length;
  const currentStepIndex = relevantSteps.findIndex(step => step.id === currentId);

  function navigateTo(nextId: string) {
    // Mark current step as completed when navigating away (but not for decision steps)
    if (currentStep && currentStep.type === 'step') {
      setCompletedSteps(prev => new Set([...prev, currentId]));
    }

    setHistory([...history, currentId]);
    setCurrentId(nextId);
  }

  function goBack() {
    if (history.length > 0) {
      const previousId = history[history.length - 1];
      // Remove current step from completed when going back
      setCompletedSteps(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentId);
        return newSet;
      });
      setHistory(history.slice(0, -1));
      setCurrentId(previousId);
    }
  }

  if (!currentStep) {
    return <div>Error: Step not found!</div>;
  }

  const isFirstStep = history.length === 0;
  const isEndState = currentStep.type === 'end';

  const getStepIcon = () => {
    if (currentStep.type === 'decision') return <Cloud className="w-8 h-8" />;
    if (currentStep.type === 'step') return <Server className="w-8 h-8" />;
    if (currentStep.type === 'end') return <CheckCircle className="w-8 h-8" />;
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Checklist Sidebar - Top on mobile, Left on desktop */}
        <div className="w-full lg:w-80 lg:flex-shrink-0">
          <StepSequence
            steps={flow}
            currentStepId={currentId}
            completedSteps={completedSteps}
          />
        </div>

        {/* Main Content - Bottom on mobile, Right on desktop */}
        <div className="flex-1 min-w-0">
          <div className="bg-card border rounded-lg">
          {/* Header */}
          <div className="border-b bg-muted/30 px-4 py-6 lg:px-8 lg:py-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getStepIcon()}
                  <h1 className="text-2xl lg:text-4xl font-bold tracking-tight">{currentStep.title}</h1>
                </div>
                {!isEndState && (
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                    <p className="text-muted-foreground text-base lg:text-lg">
                      Step {currentStepIndex + 1} of {totalSteps}
                    </p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalSteps }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i < currentStepIndex
                              ? 'bg-primary'
                              : i === currentStepIndex
                              ? 'bg-primary/60'
                              : 'bg-muted-foreground/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-8 lg:px-8 lg:py-12 min-h-[300px] lg:min-h-[400px] flex flex-col">
            {currentStep.type === 'decision' && (
              <div className="space-y-6 lg:space-y-8 flex-1">
                <div>
                  <h2 className="text-lg lg:text-xl font-semibold mb-6 lg:mb-8 text-foreground">{currentStep.question}</h2>
                  <div className="grid gap-3 lg:gap-4 max-w-full lg:max-w-2xl">
                    {currentStep.options?.map((option, index) => (
                      <Button
                        key={option.label}
                        variant="outline"
                        size="lg"
                        className="w-full justify-between h-14 lg:h-16 text-left font-medium group hover:bg-primary/5 border-2 hover:border-primary/20 transition-all duration-200"
                        onClick={() => navigateTo(option.next)}
                      >
                        <div className="flex items-center gap-2 lg:gap-3">
                          <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-muted flex items-center justify-center text-xs lg:text-sm font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {index + 1}
                          </div>
                          <span className="text-sm lg:text-base">{option.label}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep.type === 'step' && (
              <div className="space-y-8 flex-1">
                {currentStep.description && (
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg leading-relaxed text-foreground">{currentStep.description}</p>
                  </div>
                )}
                {currentStep.commands && currentStep.commands.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm">$</span>
                      Commands to execute
                    </h3>
                    <div className="bg-slate-950 text-slate-50 p-6 rounded-lg border border-slate-700 shadow-lg">
                      <pre className="text-base font-mono overflow-x-auto leading-relaxed">
                        <code>{currentStep.commands.join('\n')}</code>
                      </pre>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs">i</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</h4>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            Copy and paste these commands into your terminal. Make sure you have the necessary permissions to execute them.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isEndState && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">{currentStep.title}</h2>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">{currentStep.description}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-muted/30 px-4 py-4 lg:px-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={isFirstStep}
                size="lg"
                className="gap-2 w-full lg:w-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              {currentStep.type === 'step' && (
                <Button
                  onClick={() => currentStep.next && navigateTo(currentStep.next)}
                  size="lg"
                  className="gap-2 w-full lg:w-auto"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}