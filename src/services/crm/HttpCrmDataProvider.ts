/**
 * Http CRM Data Provider (Real Chatwoot Mode)
 * Implements the CrmDataProvider interface by interacting with the real
 * Chatwoot Rails API routes under /api/v1/accounts/:accountId/
 * Translates requests and responses through src/adapters/crmAdapter.ts
 */

import { CrmDataProvider } from './CrmDataProvider';
import {
  CrmAccount,
  CrmUser,
  CrmInbox,
  CrmTeam,
  CrmConversation,
  CrmMessage,
  CrmContact,
  CrmCompany,
  CrmClinicPipelineCard,
  CrmClinicPipelineStage,
  CrmCampaign,
  CrmCampaignPreflight,
  CrmCsvAudiencePreview,
  CrmAutomationFlow,
  CrmGraphValidationResult,
  CrmFlowPreviewResult,
  CrmOperationalAnalytics,
  CrmWhatsAppTemplate,
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

import {
  chatwootToStudioConversation,
  chatwootToStudioMessage,
  chatwootToStudioContact,
  studioToChatwootContact,
  chatwootToStudioCompany,
  chatwootToStudioPipelineStage,
  chatwootToStudioPipelineCard,
  chatwootToStudioCampaign,
  chatwootToStudioTemplate,
  chatwootToStudioFlow,
  studioToChatwootFlow,
} from '../../adapters/crmAdapter';

export class HttpCrmDataProvider implements CrmDataProvider {
  readonly mode = 'real' as const;

  private accountId: number;
  private baseUrl: string;

  constructor(accountId: number = 1, baseUrl: string = '/api/v1') {
    this.accountId = accountId;
    this.baseUrl = baseUrl;
  }

  private get accountUrl(): string {
    return `${this.baseUrl}/accounts/${this.accountId}`;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') || endpoint.startsWith('/api')
      ? endpoint
      : `${this.accountUrl}/${endpoint.replace(/^\//, '')}`;

    const headers = new Headers(options.headers || {});
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }
    if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorDetail = response.statusText;
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.message || errorJson.error || JSON.stringify(errorJson);
      } catch {
        // fallback to status text
      }
      throw new Error(`Chatwoot API Error [${response.status}] at ${url}: ${errorDetail}`);
    }

    return response.json() as Promise<T>;
  }

  // ==========================================
  // Identity & Context
  // ==========================================

  async getAccount(): Promise<CrmAccount> {
    const data = await this.request<any>(`${this.baseUrl}/accounts/${this.accountId}`);
    return data.account || data;
  }

  async getCurrentUser(): Promise<CrmUser> {
    const data = await this.request<any>(`${this.baseUrl}/profile`);
    return data.user || data;
  }

  async getInboxes(): Promise<CrmInbox[]> {
    const data = await this.request<any>('inboxes');
    return data.payload || data || [];
  }

  async getTeams(): Promise<CrmTeam[]> {
    const data = await this.request<any>('teams');
    return data || [];
  }

  // ==========================================
  // Conversations & Messages
  // ==========================================

  async getConversations(filter?: { status?: string; assignee?: string; page?: number }): Promise<Conversation[]> {
    const query = new URLSearchParams();
    if (filter?.status) query.set('status', filter.status);
    if (filter?.assignee) query.set('assignee_type', filter.assignee);
    if (filter?.page) query.set('page', String(filter.page));

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await this.request<any>(`conversations${qs}`);
    const list: CrmConversation[] = res.data?.payload || res.payload || (Array.isArray(res) ? res : []);
    return list.map(chatwootToStudioConversation);
  }

  async getConversation(id: string): Promise<Conversation | null> {
    const res = await this.request<any>(`conversations/${id}`);
    const data: CrmConversation = res.data || res;
    return data ? chatwootToStudioConversation(data) : null;
  }

  async sendMessage(conversationId: string, content: string, isPrivate: boolean = false): Promise<Message> {
    const res = await this.request<any>(`conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        private: isPrivate,
        message_type: 'outgoing',
      }),
    });
    const crmMsg: CrmMessage = res.data || res;
    return chatwootToStudioMessage(crmMsg);
  }

  async updateConversationStatus(conversationId: string, status: Conversation['status']): Promise<void> {
    await this.request(`conversations/${conversationId}/toggle_status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  async updateConversationAssignee(conversationId: string, agentName: string): Promise<void> {
    await this.request(`conversations/${conversationId}/assignments`, {
      method: 'POST',
      body: JSON.stringify({ assignee_name: agentName }),
    });
  }

  async addConversationLabel(conversationId: string, label: string): Promise<void> {
    await this.request(`conversations/${conversationId}/labels`, {
      method: 'POST',
      body: JSON.stringify({ labels: [label] }),
    });
  }

  async createConversationWithContact(contact: Contact, initialMessage?: string): Promise<Conversation> {
    const res = await this.request<any>('conversations', {
      method: 'POST',
      body: JSON.stringify({
        contact_id: Number(contact.id) || undefined,
        message: { content: initialMessage || 'Conversation opened.' },
      }),
    });
    const crmConvo: CrmConversation = res.data || res;
    return chatwootToStudioConversation(crmConvo);
  }

  // ==========================================
  // Contacts & Companies
  // ==========================================

  async getContacts(query?: string): Promise<Contact[]> {
    const qs = query ? `?q=${encodeURIComponent(query)}` : '';
    const res = await this.request<any>(`contacts${qs}`);
    const payload: CrmContact[] = res.payload || (Array.isArray(res) ? res : []);
    return payload.map(chatwootToStudioContact);
  }

  async getContact(id: string): Promise<Contact | null> {
    const res = await this.request<any>(`contacts/${id}`);
    const data: CrmContact = res.payload || res;
    return data ? chatwootToStudioContact(data) : null;
  }

  async createContact(contactData: Omit<Contact, 'id' | 'conversationsCount' | 'lastActivity'>): Promise<Contact> {
    const payload = studioToChatwootContact(contactData);
    const res = await this.request<any>('contacts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const crmContact: CrmContact = res.payload?.contact || res.payload || res;
    return chatwootToStudioContact(crmContact);
  }

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    const payload = studioToChatwootContact(updates);
    const res = await this.request<any>(`contacts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    const crmContact: CrmContact = res.payload?.contact || res.payload || res;
    return chatwootToStudioContact(crmContact);
  }

  async getCompanies(): Promise<Company[]> {
    const res = await this.request<any>('companies');
    const payload: CrmCompany[] = res.payload || (Array.isArray(res) ? res : []);
    return payload.map(chatwootToStudioCompany);
  }

  // ==========================================
  // Clinic Pipeline (Kanban Intake)
  // ==========================================

  async getPipelineStages(): Promise<ClinicPipelineStage[]> {
    const res = await this.request<any>('clinic_pipelines');
    const pipelines = res.payload || (Array.isArray(res) ? res : []);
    const defaultPipeline = pipelines[0] || { stages: [] };
    return (defaultPipeline.stages || []).map(chatwootToStudioPipelineStage);
  }

  async getPipelineCards(): Promise<ClinicPipelineCard[]> {
    const res = await this.request<any>('clinic_pipeline_cards');
    const payload: CrmClinicPipelineCard[] = res.payload || (Array.isArray(res) ? res : []);
    return payload.map(chatwootToStudioPipelineCard);
  }

  async movePipelineCard(
    cardId: string,
    newStageId: string,
    expectedLockVersion?: number
  ): Promise<{ success: boolean; card: ClinicPipelineCard }> {
    const res = await this.request<any>(`clinic_pipeline_cards/${cardId}/move`, {
      method: 'PATCH',
      body: JSON.stringify({
        stage_id: Number(newStageId) || newStageId,
        lock_version: expectedLockVersion,
      }),
    });
    const card = chatwootToStudioPipelineCard(res.payload || res);
    return { success: true, card };
  }

  async createPipelineCard(cardData: Omit<ClinicPipelineCard, 'id' | 'lastContacted'>): Promise<ClinicPipelineCard> {
    const res = await this.request<any>('clinic_pipeline_cards', {
      method: 'POST',
      body: JSON.stringify({
        clinic_pipeline_card: {
          title: cardData.title,
          clinic_pipeline_stage_id: Number(cardData.stageId) || 1,
          value: parseFloat(cardData.value.replace(/[^0-9.]/g, '')) || 0,
          priority: cardData.priority,
          labels: cardData.labels,
        },
      }),
    });
    return chatwootToStudioPipelineCard(res.payload || res);
  }

  // ==========================================
  // Broadcast Campaigns & 6-Step Engine
  // ==========================================

  async getCampaigns(): Promise<WhatsAppCampaign[]> {
    const res = await this.request<any>('campaigns');
    const payload: CrmCampaign[] = res.payload || (Array.isArray(res) ? res : []);
    return payload.map(chatwootToStudioCampaign);
  }

  async createCampaign(campaignData: any): Promise<WhatsAppCampaign> {
    const res = await this.request<any>('campaigns', {
      method: 'POST',
      body: JSON.stringify({
        campaign: {
          title: campaignData.title,
          campaign_type: 'one_off',
          audience_type: campaignData.audienceType,
          audience_metadata: {
            labels: campaignData.audienceLabels,
            csv_file_name: campaignData.csvFileName,
          },
          template_params: {
            template_id: campaignData.templateId,
            template_name: campaignData.templateName,
          },
          scheduled_at: campaignData.scheduledAt,
        },
      }),
    });
    return chatwootToStudioCampaign(res.payload || res);
  }

  async preflightPreview(campaignDraft: any): Promise<CrmCampaignPreflight> {
    const res = await this.request<any>('campaigns/preflight_preview', {
      method: 'POST',
      body: JSON.stringify({ campaign: campaignDraft }),
    });
    return res.preflight || res;
  }

  async getCampaignRecipients(campaignId: string, filter?: { status?: string }): Promise<CampaignRecipient[]> {
    const qs = filter?.status ? `?status=${filter.status}` : '';
    const res = await this.request<any>(`campaigns/${campaignId}/recipients${qs}`);
    return res.payload || (Array.isArray(res) ? res : []);
  }

  async previewCsvAudience(file: File | Blob, mapping?: Record<string, string>): Promise<CrmCsvAudiencePreview> {
    const formData = new FormData();
    formData.append('file', file);
    if (mapping) {
      Object.entries(mapping).forEach(([k, v]) => formData.append(`mapping[${k}]`, v));
    }
    const res = await this.request<any>('campaigns/csv_preview', {
      method: 'POST',
      body: formData,
    });
    return res.data || res;
  }

  // ==========================================
  // WhatsApp Templates
  // ==========================================

  async getTemplates(): Promise<WhatsAppTemplate[]> {
    const res = await this.request<any>('whatsapp_templates');
    const payload: CrmWhatsAppTemplate[] = res.payload || (Array.isArray(res) ? res : []);
    return payload.map(chatwootToStudioTemplate);
  }

  async saveTemplateDraft(draft: Partial<WhatsAppTemplate>): Promise<WhatsAppTemplate> {
    const res = await this.request<any>('whatsapp_template_drafts', {
      method: 'POST',
      body: JSON.stringify({
        whatsapp_template_draft: {
          name: draft.name,
          category: draft.category,
          language: draft.language,
          body: draft.body,
        },
      }),
    });
    return chatwootToStudioTemplate(res.payload || res);
  }

  // ==========================================
  // Chatbots & Automation Flows
  // ==========================================

  async getFlows(): Promise<ChatbotFlow[]> {
    const res = await this.request<any>('automation_flows');
    const payload: CrmAutomationFlow[] = res.payload || (Array.isArray(res) ? res : []);
    return payload.map(chatwootToStudioFlow);
  }

  async saveFlow(flow: ChatbotFlow): Promise<ChatbotFlow> {
    const payload = studioToChatwootFlow(flow);
    const res = await this.request<any>(`automation_flows/${flow.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ automation_flow: payload }),
    });
    return chatwootToStudioFlow(res.payload || res);
  }

  async validateFlow(flow: ChatbotFlow): Promise<CrmGraphValidationResult> {
    const payload = studioToChatwootFlow(flow);
    const res = await this.request<any>(`automation_flows/${flow.id}/validate_graph`, {
      method: 'POST',
      body: JSON.stringify({ graph: payload.definition }),
    });
    return res.data || res;
  }

  async previewFlow(flow: ChatbotFlow, variables?: Record<string, any>): Promise<CrmFlowPreviewResult> {
    const payload = studioToChatwootFlow(flow);
    const res = await this.request<any>(`automation_flows/${flow.id}/preview`, {
      method: 'POST',
      body: JSON.stringify({ graph: payload.definition, variables }),
    });
    return res.data || res;
  }

  async publishFlow(flowId: string): Promise<{ success: boolean; version: number }> {
    const res = await this.request<any>(`automation_flows/${flowId}/publish`, {
      method: 'POST',
    });
    return { success: true, version: res.version || 1 };
  }

  // ==========================================
  // Operational Analytics
  // ==========================================

  async getOperationalAnalytics(timeframe?: string): Promise<CrmOperationalAnalytics> {
    const qs = timeframe ? `?timeframe=${timeframe}` : '';
    const res = await this.request<any>(`operational_analytics${qs}`);
    return res.data || res;
  }
}
