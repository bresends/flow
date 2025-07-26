import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import FlowStepper from "./components/flowstepper";
import { getFlowById, getAvailableFlows } from "@/utils/flowLoader";
import { type Flow } from "@/types/flow";

export function App() {
  const [selectedFlowId, setSelectedFlowId] = useState<string>('vps-setup');
  const [currentFlow, setCurrentFlow] = useState<Flow | null>(null);

  useEffect(() => {
    const flow = getFlowById(selectedFlowId);
    setCurrentFlow(flow);
  }, [selectedFlowId]);

  const handleFlowSelection = (flowId: string) => {
    setSelectedFlowId(flowId);
  };

  return (
    <SidebarProvider>
      <AppSidebar
        selectedFlowId={selectedFlowId}
        onFlowSelect={handleFlowSelection}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Workflows
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {currentFlow?.metadata.title || 'Loading...'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {currentFlow ? (
            <FlowStepper flow={currentFlow.steps} />
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading flow...</p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
