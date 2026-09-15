export type RuleLifecycleStatus = 'Draft' | 'Enabled' | 'Disabled' | 'Archived';

export type RuleTriggerType = 
  | 'conversation_created'
  | 'message_received'
  | 'conversation_updated'
  | 'contact_updated'
  | 'label_added';

export interface TriggerDefinition {
  type: RuleTriggerType;
  label: string;
  description: string;
  defaultChannel: 'whatsapp';
  configurableFields: ('inbox' | 'messageDirection' | 'targetLabel')[];
}

export interface TriggerConfig {
  channel: 'whatsapp';
  inbox: string;
  messageDirection?: 'incoming' | 'outgoing';
  targetLabel?: string;
}

export type FieldDataType = 'text' | 'selection' | 'label' | 'boolean';

export interface FieldDefinition {
  id: string;
  label: string;
  dataType: FieldDataType;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface OperatorDefinition {
  value: string;
  label: string;
}

export interface RuleConditionItem {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export type RuleActionType = 
  | 'assign_conversation'
  | 'add_label'
  | 'remove_label'
  | 'change_status'
  | 'send_message';

export interface ActionDefinition {
  type: RuleActionType;
  label: string;
  description: string;
  defaultParams: Record<string, string>;
}

export interface RuleActionItem {
  id: string;
  type: RuleActionType;
  params: Record<string, string>;
}

export interface AutomationRuleItem {
  id: string;
  name: string;
  description: string;
  status: RuleLifecycleStatus;
  triggerType: RuleTriggerType;
  triggerConfig: TriggerConfig;
  matchMode: 'ALL' | 'ANY';
  conditions: RuleConditionItem[];
  actions: RuleActionItem[];
  executionCount: number;
  lastUpdated: string;
}

export interface ValidationIssue {
  id: string;
  section: 'name' | 'trigger' | 'conditions' | 'actions';
  targetId?: string;
  message: string;
}

export type SaveState = 'saved' | 'unsaved' | 'saving' | 'error';
