/**
 * Agamagizh CRM Data Provider Contract
 * Abstract interface implemented by both:
 * - LocalCrmDataProvider (Demo mode with realistic mock fixtures)
 * - HttpCrmDataProvider (Live Chatwoot Rails API integration)
 */

import {
  CrmAccount,
  CrmUser,
  CrmInbox,
  CrmTeam,
  CrmCampaignPreflight,
  CrmCsvAudiencePreview,
  CrmGraphValidationResult,
  CrmFlowPreviewResult,
  CrmOperationalAnalytics,
} from '../../types/crm';

import {
  Conversation,
  Message,
  Contact,
  Company,
  ClinicPipelineCard,
  ClinicPipelineStage,
  WhatsAppCampaign,
  CampaignRecipient,
  WhatsAppTemplate,
  ChatbotFlow,
} from '../../types';

export interface CrmDataProvider {
  readonly mode: 'local' | 'real';

  // Identity & Context
  getAccount(): Promise<CrmAccount>;
  getCurrentUser(): Promise<CrmUser>;
  getInboxes(): Promise<CrmInbox[]>;
  getTeams(): Promise<CrmTeam[]>;

  // Conversations & Messages
  getConversations(filter?: { status?: string; assignee?: string; page?: number }): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | null>;
  sendMessage(conversationId: string, content: string, isPrivate?: boolean): Promise<Message>;
  updateConversationStatus(conversationId: string, status: Conversation['status']): Promise<void>;
  updateConversationAssignee(conversationId: string, agentName: string): Promise<void>;
  addConversationLabel(conversationId: string, label: string): Promise<void>;
  createConversationWithContact(contact: Contact, initialMessage?: string): Promise<Conversation>;

  // Contacts & Companies
  getContacts(query?: string): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | null>;
  createContact(contact: Omit<Contact, 'id' | 'conversationsCount' | 'lastActivity'>): Promise<Contact>;
  updateContact(id: string, updates: Partial<Contact>): Promise<Contact>;
  getCompanies(): Promise<Company[]>;

  // Clinic Pipeline (Kanban Intake)
  getPipelineStages(): Promise<ClinicPipelineStage[]>;
  getPipelineCards(): Promise<ClinicPipelineCard[]>;
  movePipelineCard(cardId: string, newStageId: string, lockVersion?: number): Promise<{ success: boolean; card: ClinicPipelineCard }>;
  createPipelineCard(card: Omit<ClinicPipelineCard, 'id' | 'lastContacted'>): Promise<ClinicPipelineCard>;

  // Broadcast Campaigns & 6-Step Engine
  getCampaigns(): Promise<WhatsAppCampaign[]>;
  createCampaign(campaignData: any): Promise<WhatsAppCampaign>;
  preflightPreview(campaignDraft: any): Promise<CrmCampaignPreflight>;
  getCampaignRecipients(campaignId: string, filter?: { status?: string }): Promise<CampaignRecipient[]>;
  previewCsvAudience(file: File | Blob, mapping?: Record<string, string>): Promise<CrmCsvAudiencePreview>;

  // WhatsApp Templates
  getTemplates(): Promise<WhatsAppTemplate[]>;
  saveTemplateDraft(draft: Partial<WhatsAppTemplate>): Promise<WhatsAppTemplate>;

  // Chatbots & Automation Flows
  getFlows(): Promise<ChatbotFlow[]>;
  saveFlow(flow: ChatbotFlow): Promise<ChatbotFlow>;
  validateFlow(flow: ChatbotFlow): Promise<CrmGraphValidationResult>;
  previewFlow(flow: ChatbotFlow, variables?: Record<string, any>): Promise<CrmFlowPreviewResult>;
  publishFlow(flowId: string): Promise<{ success: boolean; version: number }>;

  // Operational Analytics
  getOperationalAnalytics(timeframe?: string): Promise<CrmOperationalAnalytics>;
}
