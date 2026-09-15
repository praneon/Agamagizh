import { LucideIcon } from 'lucide-react';

export type BuilderNodeType = 
  | 'start' 
  | 'message' 
  | 'question' 
  | 'choice' 
  | 'condition' 
  | 'wait' 
  | 'handoff' 
  | 'end';

export interface ChoiceOption {
  id: string;
  label: string;
  targetNodeId?: string;
}

export interface ConditionConfig {
  field: string;
  operator: 'equals' | 'contains' | 'not_equals' | 'is_present';
  value: string;
}

export interface WaitConfig {
  duration: number;
  unit: 'minutes' | 'hours' | 'days';
}

export interface HandoffConfig {
  destinationType: 'team' | 'agent' | 'inbox';
  target: string;
}

export interface NodeData {
  title: string;
  // Specific configurations per node type
  messageText?: string;
  questionText?: string;
  saveResponseAs?: string;
  answerType?: 'text' | 'number' | 'phone' | 'date';
  fallbackPrompt?: string;
  mediaAttachment?: 'none' | 'image' | 'document';
  choices?: ChoiceOption[];
  condition?: ConditionConfig;
  wait?: WaitConfig;
  handoff?: HandoffConfig;
  endSummary?: string;
}

export interface FlowNode {
  id: string;
  type: BuilderNodeType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  data: NodeData;
}

export interface FlowEdge {
  id: string;
  source: string;
  sourceHandle?: string; // e.g. 'choice-opt-1', 'true', 'false', 'default'
  target: string;
  targetHandle?: string;
  label?: string;
}

export interface ValidationIssue {
  id: string;
  nodeId: string;
  severity: 'error' | 'warning';
  message: string;
  field?: string;
}

export interface ChatbotProject {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published';
  version: string;
  lastUpdated: string;
  nodesCount: number;
  triggersCount: number;
  inbox: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface StarterTemplate {
  id: string;
  name: string;
  description: string;
  nodeCount: number;
  category: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}
