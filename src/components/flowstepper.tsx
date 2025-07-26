import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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



  const currentStep = flow.find((step) => step.id === currentId);

  const relevantSteps = flow.filter(step => step.type === 'step' || step.type === 'decision');
  const totalSteps = relevantSteps.length;
  const currentStepIndex = relevantSteps.findIndex(step => step.id === currentId);

  function navigateTo(nextId: string) {
    setHistory([...history, currentId]);
    setCurrentId(nextId);
  }

  function goBack() {
    if (history.length > 0) {
      const previousId = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentId(previousId);
    }
  }

  if (!currentStep) {
    return <div>Error: Step not found!</div>;
  }

  const isFirstStep = history.length === 0;
  const isEndState = currentStep.type === 'end';

  return (
    <Card className="w-full max-w-2xl mx-auto rounded-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{currentStep.title}</CardTitle>
            {!isEndState && (
              <CardDescription className="mt-2">
                Step {currentStepIndex + 1} of {totalSteps}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-h-[200px]">
        {currentStep.type === 'decision' && (
          <div className="space-y-4">
            <Label>{currentStep.question}</Label>
            <div className="space-y-2">
              {currentStep.options?.map((option) => (
                <Button
                  key={option.label}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigateTo(option.next)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}
        {currentStep.type === 'step' && (
          <div className="space-y-4">
            <p>{currentStep.description}</p>
            {currentStep.commands && currentStep.commands.length > 0 && (
              <pre className="bg-muted text-muted-foreground p-4 rounded-md text-sm font-mono overflow-x-auto">
                <code>
                  {currentStep.commands.join('\n')}
                </code>
              </pre>
            )}
          </div>
        )}
        {isEndState && (
          <div className="text-center py-8">
            <p className="text-2xl font-semibold text-green-500">✅ {currentStep.title}</p>
            <p className="text-muted-foreground mt-2">{currentStep.description}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={goBack} disabled={isFirstStep}>
          Back
        </Button>
        {currentStep.type === 'step' && (
          <Button onClick={() => currentStep.next && navigateTo(currentStep.next)}>
            Next
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}