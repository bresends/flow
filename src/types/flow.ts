// Workflow input types
interface WorkflowInput {
  id: string;
  type: 'text' | 'select' | 'number' | 'email';
  label: string;
  placeholder?: string;
  required?: boolean;
  default?: string;
  options?: string[]; // for select type
  validation?: string; // regex pattern
}

// Flow step types
interface FlowOption {
  label: string;
  next: string;
  context?: string;
}

interface FlowStepVariant {
  description?: string;
  commands?: string[];
  next?: string;
  inputs?: WorkflowInput[];
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
  variants?: Record<string, FlowStepVariant>;
  inputs?: WorkflowInput[];
}

// Flow metadata
interface FlowMetadata {
  id: string;
  title: string;
  description: string;
  category?: string;
  version?: string;
  author?: string;
  tags?: string[];
}

// Complete flow structure
interface Flow {
  metadata: FlowMetadata;
  steps: FlowStep[];
}

// Flow file structure (for JSON files)
interface FlowFile extends FlowMetadata {
  steps: FlowStep[];
}

// Export all types
export type { Flow, FlowStep, FlowOption, FlowMetadata, FlowFile, WorkflowInput, FlowStepVariant };