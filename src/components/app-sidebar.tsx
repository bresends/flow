import * as React from "react";
import { useState } from "react";
import { Minus, Plus, Workflow } from "lucide-react";

import { SearchForm } from "@/components/search-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getFlowsByCategory, searchFlows } from "@/utils/flowLoader";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  selectedFlowId?: string;
  onFlowSelect?: (flowId: string) => void;
}

export function AppSidebar({
  selectedFlowId,
  onFlowSelect,
  ...props
}: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const flowsByCategory = getFlowsByCategory();
  const searchResults = searchQuery ? searchFlows(searchQuery) : [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Workflow className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Flow</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm onSearch={handleSearch} onClear={handleClearSearch} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {searchQuery ? (
              // Show search results
              <>
                {searchResults.length > 0 ? (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton disabled className="mb-2">
                        Search Results ({searchResults.length})
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {searchResults.map((flow) => (
                      <SidebarMenuItem key={flow.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={selectedFlowId === flow.id}
                        >
                          <button
                            onClick={() => onFlowSelect?.(flow.id)}
                            className="w-full text-left justify-between"
                            title={flow.description}
                          >
                            <span>{flow.title}</span>
                            {flow.category && (
                              <span className="text-xs text-muted-foreground">
                                {flow.category}
                              </span>
                            )}
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </>
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton disabled>
                      No workflows found for "{searchQuery}"
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </>
            ) : (
              // Show categories
              Object.entries(flowsByCategory).map(([category, flows]) => (
                <Collapsible
                  key={category}
                  defaultOpen={true}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        {category}{" "}
                        <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                        <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {flows.map((flow) => (
                          <SidebarMenuSubItem key={flow.id}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={selectedFlowId === flow.id}
                            >
                              <button
                                onClick={() => onFlowSelect?.(flow.id)}
                                className="w-full text-left"
                                title={flow.description}
                              >
                                {flow.title}
                              </button>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
