import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type WorkflowInput } from "@/types/flow";

interface WorkflowInputProps {
  input: WorkflowInput;
  value: string;
  onChange: (value: string) => void;
}

export default function WorkflowInputComponent({ input, value, onChange }: WorkflowInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={input.id} className="text-sm font-medium">
        {input.label}
        {input.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={input.id}
        type={input.type || 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={input.placeholder}
        required={input.required}
      />
    </div>
  );
}