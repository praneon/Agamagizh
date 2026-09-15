export type TopNavSection = 
  | 'my-inbox'
  | 'conversations'
  | 'captain'
  | 'contacts'
  | 'companies'
  | 'reports'
  | 'clinic-pipeline'
  | 'campaigns'
  | 'whatsapp'
  | 'help-center'
  | 'settings';

export type WhatsAppSubSection = 
  | 'overview'
  | 'inbox'
  | 'contacts'
  | 'broadcasts'
  | 'templates'
  | 'pipelines'
  | 'automations'
  | 'chatbots'
  | 'analytics'
  | 'settings';

export interface AgentUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Administrator' | 'Agent';
  status: 'online' | 'busy' | 'offline';
  assignedInboxCount: number;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  company?: string;
  lastActivity: string;
  status: 'active' | 'archived';
  labels: string[];
  conversationsCount: number;
  channel: 'whatsapp' | 'live_chat' | 'email' | 'sms';
  location?: string;
  customAttributes: Record<string, string>;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  phone: string;
  address: string;
  contactsCount: number;
  openConversations: number;
}

export interface MessageAttachment {
  name: string;
  type: 'pdf' | 'image' | 'audio' | 'doc';
  size: string;
  url?: string;
}

export interface Message {
  id: string;
  conversationId?: string;
  sender: 'contact' | 'agent' | 'system';
  senderName?: string;
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  isPrivateNote?: boolean;
  attachments?: MessageAttachment[];
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  channel: 'whatsapp' | 'live_chat' | 'email' | 'sms';
  status: 'open' | 'pending' | 'snoozed' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedAgent: string;
  assignedTeam: string;
  labels: string[];
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  inbox: string;
  messages: Message[];
  customAttributes?: Record<string, string>;
}

// Clinic Pipeline (Operational Kanban board)
export interface ClinicPipelineStage {
  id: string;
  title: string;
  color: string;
  description: string;
}

export interface ClinicPipelineCard {
  id: string;
  stageId: string;
  title: string;
  contactName: string;
  contactPhone: string;
  company?: string;
  value: string;
  assignedAgent: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  labels: string[];
  nextActivity: string;
  lastContacted: string;
  conversationId?: string;
}

// WhatsApp Campaigns / Broadcasts
export type CampaignStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'running' 
  | 'paused' 
  | 'completed' 
  | 'cancelled' 
  | 'failed';

export type AudienceType = 
  | 'labels' 
  | 'csv' 
  | 'saved_filter' 
  | 'manual';

export interface WhatsAppCampaign {
  id: string;
  title: string;
  channelInbox: string;
  status: CampaignStatus;
  audienceType: AudienceType;
  audienceSummary: string;
  templateId: string;
  templateName: string;
  scheduledAt?: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  repliedCount: number;
  failedCount: number;
  excludedCount: number;
  createdAt: string;
}

export interface CampaignRecipient {
  id: string;
  campaignId: string;
  contactName: string;
  phone: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'excluded';
  lifecycleTime: string;
  reason?: string;
}

// WhatsApp Templates
export type TemplateStatus = 
  | 'local_draft' 
  | 'pending' 
  | 'approved' 
  | 'rejected';

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  status: TemplateStatus;
  source?: 'local_draft' | 'provider';
  isCampaignEligible: boolean;
  rejectionReason?: string;
  lastSyncedAt?: string;
  createdAt?: string;
  header?: {
    type: 'none' | 'text' | 'image' | 'document';
    text?: string;
  };
  body: string;
  footer?: string;
  buttons?: {
    type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER' | 'quick_reply';
    text: string;
    value?: string;
  }[];
  variableExamples?: Record<string, string>;
  variableDescriptions?: Record<string, string>;
}

// WhatsApp Automations / Linear Rules (WHEN -> IF ALL/ANY -> THEN)
export type AutomationTrigger = 
  | 'conversation_created'
  | 'message_created'
  | 'conversation_status_changed'
  | 'contact_created';

export interface RuleCondition {
  attribute: string;
  operator: 'equals' | 'contains' | 'not_equals' | 'is_present';
  value: string;
}

export interface RuleAction {
  action: 'assign_agent' | 'assign_team' | 'add_label' | 'send_message' | 'resolve_conversation' | 'snooze_conversation';
  params: Record<string, string>;
}

export interface AutomationRule {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  status: 'draft' | 'published' | 'paused' | 'archived';
  trigger: AutomationTrigger;
  conditionMatch: 'ALL' | 'ANY';
  conditions: RuleCondition[];
  actions: RuleAction[];
  executionCount: number;
  lastTriggered?: string;
}

// WhatsApp Chatbots (Visual Node-Based Flow Builder)
export type ChatbotNodeType = 
  | 'start' 
  | 'message' 
  | 'question' 
  | 'choice' 
  | 'condition' 
  | 'wait' 
  | 'handoff' 
  | 'end';

export interface ChatbotNode {
  id: string;
  type: ChatbotNodeType;
  title: string;
  content: {
    messageText?: string;
    questionText?: string;
    variableName?: string;
    choices?: string[];
    conditionExpression?: string;
    waitDurationSeconds?: number;
    handoffTeam?: string;
  };
  x: number;
  y: number;
}

export interface ChatbotEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface ChatbotFlow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  version: string;
  lastModified: string;
  nodes: ChatbotNode[];
  edges: ChatbotEdge[];
}

export interface WhatsAppRule {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  eventTrigger: string;
  conditions: string[];
  actions: string[];
  channelInbox: string;
  executionCount: number;
}

export interface ChatbotStep {
  id: string;
  stepNumber: number;
  type: 'send_message' | 'branch_choice' | 'collect_input' | 'handoff_agent';
  prompt: string;
  options?: string[];
  targetAction?: string;
}

export interface WhatsAppChatbot {
  id: string;
  name: string;
  channelInbox: string;
  triggerKeyword: string;
  status: 'active' | 'draft';
  description: string;
  steps: ChatbotStep[];
  triggersCount: number;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}
