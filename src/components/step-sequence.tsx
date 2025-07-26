import { Check, Circle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { type FlowStep } from "@/types/flow";

interface StepSequenceProps {
  steps: FlowStep[];
  currentStepId: string;
  completedSteps: Set<string>;
}

interface SequenceStep {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'pending';
}

export default function StepSequence({ steps, currentStepId, completedSteps }: StepSequenceProps) {
  // Create a logical sequence of steps for the checklist
  const getSequenceSteps = (): SequenceStep[] => {
    const sequenceSteps: SequenceStep[] = [];
    
    // Find decision steps and major action steps
    const decisionSteps = steps.filter(step => step.type === 'decision');
    const actionSteps = steps.filter(step => step.type === 'step');
    
    // Add decision steps first (these are choice points)
    decisionSteps.forEach(step => {
      let status: 'completed' | 'current' | 'pending' = 'pending';
      if (completedSteps.has(step.id)) {
        status = 'completed';
      } else if (step.id === currentStepId) {
        status = 'current';
      }
      
      sequenceSteps.push({
        id: step.id,
        title: step.title,
        status
      });
    });
    
    // Add a generic "Configure Server" step representing all action steps
    const hasConfigSteps = actionSteps.some(step => step.id !== 'end');
    if (hasConfigSteps) {
      const currentIsActionStep = actionSteps.some(step => step.id === currentStepId);
      const hasCompletedActionSteps = actionSteps.some(step => completedSteps.has(step.id));
      
      let status: 'completed' | 'current' | 'pending' = 'pending';
      if (currentStepId === 'end') {
        status = 'completed';
      } else if (currentIsActionStep) {
        status = 'current';
      } else if (hasCompletedActionSteps) {
        status = 'current';
      }
      
      sequenceSteps.push({
        id: 'configure-server',
        title: 'Configure Server',
        status
      });
    }
    
    // Add final completion step
    const endStep = steps.find(step => step.type === 'end');
    if (endStep) {
      let status: 'completed' | 'current' | 'pending' = 'pending';
      if (currentStepId === endStep.id) {
        status = 'completed';
      }
      
      sequenceSteps.push({
        id: endStep.id,
        title: 'Review & Create',
        status
      });
    }
    
    return sequenceSteps;
  };

  const sequenceSteps = getSequenceSteps();

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sequenceSteps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {step.status === 'completed' ? (
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              ) : step.status === 'current' ? (
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
            </div>
            <span 
              className={`text-sm font-medium ${
                step.status === 'completed' 
                  ? 'text-foreground' 
                  : step.status === 'current'
                  ? 'text-blue-600'
                  : 'text-muted-foreground'
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}