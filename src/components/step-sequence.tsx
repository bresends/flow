import { Check, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type FlowStep } from "@/types/flow";

interface StepSequenceProps {
	steps: FlowStep[];
	currentStepId: string;
	completedSteps: Set<string>;
	selectedContext?: string | null;
}

interface SequenceStep {
	id: string;
	title: string;
	status: "completed" | "current" | "pending";
}

export default function StepSequence({
	steps,
	currentStepId,
	completedSteps,
	selectedContext,
}: StepSequenceProps) {
	// Create a logical sequence of steps for the checklist based on workflow structure
	const getSequenceSteps = (): SequenceStep[] => {
		const sequenceSteps: SequenceStep[] = [];

		// Filter steps that should appear in the checklist based on context
		const checklistSteps = steps.filter((step) => {
			// Always include decisions and end steps
			if (step.type === "decision" || step.type === "end") return true;

			// For regular steps, check if they should be included based on context
			if (step.type === "step") {
				// Skip provider-specific steps if not matching context
				if (step.id.startsWith("oracle_") && selectedContext !== "oracle") {
					return false;
				}
				if (step.id.startsWith("aws_") && selectedContext !== "aws") {
					return false;
				}
				if (step.id.startsWith("hetzner_") && selectedContext !== "hetzner") {
					return false;
				}
				return true;
			}

			return false;
		});

		// Add each step from the workflow
		checklistSteps.forEach((step) => {
			let status: "completed" | "current" | "pending" = "pending";

			if (completedSteps.has(step.id)) {
				status = "completed";
			} else if (step.id === currentStepId) {
				status = "current";
			}

			sequenceSteps.push({
				id: step.id,
				title: step.title,
				status,
			});
		});

		return sequenceSteps;
	};

	const sequenceSteps = getSequenceSteps();

	return (
		<Card className="h-fit">
			<CardHeader>
				<CardTitle className="text-lg">Checklist</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{sequenceSteps.map((step) => (
					<div key={step.id} className="flex items-center space-x-3">
						<div className="flex-shrink-0">
							{step.status === "completed" ? (
								<div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
									<Check className="w-4 h-4 text-white" />
								</div>
							) : step.status === "current" ? (
								<div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
									<div className="w-2 h-2 bg-white rounded-full" />
								</div>
							) : (
								<Circle className="w-5 h-5 text-accent" />
							)}
						</div>
						<span
							className={`text-sm font-medium ${
								step.status === "completed"
									? "text-foreground"
									: step.status === "current"
										? "text-accent"
										: "text-muted-foreground"
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

