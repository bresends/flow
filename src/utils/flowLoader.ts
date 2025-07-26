import type { FlowFile, Flow, FlowMetadata } from '@/types/flow';

// Static flow imports - we'll need to manually import each flow file
// This is necessary because Vite doesn't support dynamic imports of unknown files at build time
import vpsFlow from '../../flows/vps.json';

// Registry of available flows
const flowRegistry: Record<string, FlowFile> = {
  'vps-setup': vpsFlow as FlowFile,
};

/**
 * Get all available flows with their metadata
 */
export function getAvailableFlows(): FlowMetadata[] {
  return Object.values(flowRegistry).map(flow => ({
    id: flow.id,
    title: flow.title,
    description: flow.description,
    category: flow.category,
    version: flow.version,
    author: flow.author,
    tags: flow.tags,
  }));
}

/**
 * Get a specific flow by ID
 */
export function getFlowById(flowId: string): Flow | null {
  const flowFile = flowRegistry[flowId];
  if (!flowFile) {
    return null;
  }

  return {
    metadata: {
      id: flowFile.id,
      title: flowFile.title,
      description: flowFile.description,
      category: flowFile.category,
      version: flowFile.version,
      author: flowFile.author,
      tags: flowFile.tags,
    },
    steps: flowFile.steps,
  };
}

/**
 * Get all flows grouped by category
 */
export function getFlowsByCategory(): Record<string, FlowMetadata[]> {
  const flows = getAvailableFlows();
  const grouped: Record<string, FlowMetadata[]> = {};

  flows.forEach(flow => {
    const category = flow.category || 'Other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(flow);
  });

  return grouped;
}

/**
 * Search flows by title, description, or tags
 */
export function searchFlows(query: string): FlowMetadata[] {
  const flows = getAvailableFlows();
  const lowercaseQuery = query.toLowerCase();

  return flows.filter(flow =>
    flow.title.toLowerCase().includes(lowercaseQuery) ||
    flow.description.toLowerCase().includes(lowercaseQuery) ||
    flow.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}