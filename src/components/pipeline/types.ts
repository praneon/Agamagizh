export interface PipelineStage {
  id: string;
  title: string;
  color: string;
  description: string;
  order: number;
}

export interface PipelineItem {
  id: string;
  stageId: string;
  title: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  assignedAgent: string;
  assignedTeam?: string;
  labels: string[];
  lastActivity: string;
  channel: 'whatsapp' | 'live_chat' | 'phone';
  inbox: string;
  recentNote?: string;
  recentMessageSnippet?: string;
  conversationId?: string;
  contactId?: string;
}

export interface PipelineDefinition {
  id: string;
  name: string;
  description: string;
  stages: PipelineStage[];
}

export interface PipelineFilters {
  search: string;
  assignee: string;
  label: string;
  channel: string;
  stage: string;
}

export type MoveStatus = 'idle' | 'saving' | 'saved' | 'failed';

export interface MoveFailureInfo {
  itemId: string;
  itemTitle: string;
  fromStageId: string;
  fromStageTitle: string;
  toStageId: string;
  errorMessage: string;
}
