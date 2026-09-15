/**
 * Local CRM Data Provider (Demo / Standalone Mode)
 * Implements the full CrmDataProvider interface using Studio fixtures,
 * in-memory state mutations, and realistic simulation of Chatwoot business logic
 * (such as preflight calculation, graph validation, and optimistic locking).
 */

import { CrmDataProvider } from './CrmDataProvider';
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

import {
  INITIAL_CONVERSATIONS,
  INITIAL_CONTACTS,
  INITIAL_COMPANIES,
  CLINIC_PIPELINE_CARDS,
  INITIAL_CAMPAIGNS,
} from '../../data/mockData';

import { INITIAL_BOT_PROJECTS } from '../../components/chatbots/initialFlows';
import { DETAILED_CAMPAIGN_RECIPIENTS } from '../../components/campaigns/campaignMockData';

export class LocalCrmDataProvider implements CrmDataProvider {
  readonly mode = 'local' as const;

  private conversations: Conversation[] = [...INITIAL_CONVERSATIONS];
  private contacts: Contact[] = [...INITIAL_CONTACTS];
  private companies: Company[] = [...INITIAL_COMPANIES];
  private pipelineCards: ClinicPipelineCard[] = [...CLINIC_PIPELINE_CARDS];
  private campaigns: WhatsAppCampaign[] = [...INITIAL_CAMPAIGNS];
  private flows: ChatbotFlow[] = INITIAL_BOT_PROJECTS.map((bot) => ({
    id: bot.id,
    name: bot.name,
    description: bot.description,
    status: bot.status,
    version: bot.version,
    lastModified: bot.lastUpdated,
    nodes: bot.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.data.title,
      x: n.x,
      y: n.y,
      content: {
        messageText: n.data.messageText,
        questionText: n.data.questionText,
        choices: n.data.choices?.map((c) => c.label),
        waitDurationSeconds: n.data.wait ? n.data.wait.duration * 60 : undefined,
        handoffTeam: n.data.handoff?.target,
      },
    })),
    edges: bot.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
    })),
  }));
  private cardLockVersions: Map<string, number> = new Map();

  private stages: ClinicPipelineStage[] = [
    { id: 'stg_new', title: 'New Inquiries', color: '#0ea5e9', description: 'Fresh inbound WhatsApp leads' },
    { id: 'stg_triage', title: 'Care Triage', color: '#8b5cf6', description: 'Symptom and specialty assessment' },
    { id: 'stg_consult_scheduled', title: 'Consult Scheduled', color: '#f59e0b', description: 'Confirmed appointment slot' },
    { id: 'stg_treatment_active', title: 'Treatment Active', color: '#10b981', description: 'In-clinic or ongoing care regimen' },
    { id: 'stg_followup', title: 'Care Follow-up', color: '#06b6d4', description: 'Post-consult check-in and reviews' },
  ];

  constructor() {
    this.pipelineCards.forEach((c) => this.cardLockVersions.set(c.id, 1));
  }

  // ==========================================
  // Context & Identity
  // ==========================================

  async getAccount(): Promise<CrmAccount> {
    return {
      id: 1,
      name: 'Agamagizh Integrative Health',
      locale: 'en',
      domain: 'agamagizh.org',
      settings: {
        whatsapp_safety_ceiling: 5000,
        business_hours_enabled: true,
        timezone: 'Asia/Kolkata',
      },
    };
  }

  async getCurrentUser(): Promise<CrmUser> {
    return {
      id: 1,
      name: 'Kavitha Sundaram',
      email: 'kavitha@agamagizh.org',
      role: 'administrator',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      availability_status: 'online',
      account_id: 1,
    };
  }

  async getInboxes(): Promise<CrmInbox[]> {
    return [
      {
        id: 1,
        name: 'Agamagizh WhatsApp Main',
        channel_type: 'Channel::Whatsapp',
        phone_number: '+91 98400 12345',
        provider: 'whatsapp_cloud',
        account_id: 1,
      },
      {
        id: 2,
        name: 'Adyar Clinic Reception',
        channel_type: 'Channel::Whatsapp',
        phone_number: '+91 98400 54321',
        provider: 'whatsapp_cloud',
        account_id: 1,
      },
    ];
  }

  async getTeams(): Promise<CrmTeam[]> {
    return [
      { id: 1, name: 'Adyar Care Desk', description: 'Frontline patient support', account_id: 1 },
      { id: 2, name: 'Clinical Intake Team', description: 'Intake and doctor scheduling', account_id: 1 },
      { id: 3, name: 'Outreach & Campaigns', description: 'Preventive health education', account_id: 1 },
    ];
  }

  // ==========================================
  // Conversations & Messages
  // ==========================================

  async getConversations(): Promise<Conversation[]> {
    return [...this.conversations];
  }

  async getConversation(id: string): Promise<Conversation | null> {
    return this.conversations.find((c) => c.id === id) || null;
  }

  async sendMessage(conversationId: string, content: string, isPrivate: boolean = false): Promise<Message> {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      sender: 'agent',
      senderName: 'Kavitha Sundaram',
      text: content,
      timestamp: timeNow,
      status: 'delivered',
      isPrivateNote: isPrivate,
    };

    this.conversations = this.conversations.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: isPrivate ? c.lastMessage : content,
          lastTimestamp: timeNow,
          status: c.status === 'resolved' ? 'open' : c.status,
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    return newMsg;
  }

  async updateConversationStatus(conversationId: string, status: Conversation['status']): Promise<void> {
    this.conversations = this.conversations.map((c) =>
      c.id === conversationId ? { ...c, status } : c
    );
  }

  async updateConversationAssignee(conversationId: string, agentName: string): Promise<void> {
    this.conversations = this.conversations.map((c) =>
      c.id === conversationId ? { ...c, assignedAgent: agentName } : c
    );
  }

  async addConversationLabel(conversationId: string, label: string): Promise<void> {
    this.conversations = this.conversations.map((c) => {
      if (c.id === conversationId && !c.labels.includes(label)) {
        return { ...c, labels: [...c.labels, label] };
      }
      return c;
    });
  }

  async createConversationWithContact(contact: Contact, initialMessage?: string): Promise<Conversation> {
    const existing = this.conversations.find((c) => c.contactPhone === contact.phone);
    if (existing) {
      return existing;
    }

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newConvoId = `convo-${Date.now()}`;
    const newConvo: Conversation = {
      id: newConvoId,
      contactId: contact.id,
      contactName: contact.name,
      contactPhone: contact.phone,
      contactEmail: contact.email,
      inbox: 'Agamagizh WhatsApp Main',
      channel: 'whatsapp',
      status: 'open',
      priority: 'medium',
      assignedAgent: 'Kavitha Sundaram',
      assignedTeam: 'Adyar Care Desk',
      labels: contact.labels || [],
      lastMessage: initialMessage || 'Conversation opened via Agamagizh Console.',
      lastTimestamp: timeNow,
      unreadCount: 0,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'system',
          text: `Conversation initialized with ${contact.name} via WhatsApp.`,
          timestamp: timeNow,
          status: 'read',
        },
      ],
    };

    this.conversations = [newConvo, ...this.conversations];
    return newConvo;
  }

  // ==========================================
  // Contacts & Companies
  // ==========================================

  async getContacts(query?: string): Promise<Contact[]> {
    if (!query) return [...this.contacts];
    const q = query.toLowerCase();
    return this.contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.labels.some((l) => l.toLowerCase().includes(q))
    );
  }

  async getContact(id: string): Promise<Contact | null> {
    return this.contacts.find((c) => c.id === id) || null;
  }

  async createContact(contactData: Omit<Contact, 'id' | 'conversationsCount' | 'lastActivity'>): Promise<Contact> {
    const newContact: Contact = {
      ...contactData,
      id: `cnt-${Date.now()}`,
      conversationsCount: 0,
      lastActivity: 'Just now',
    };
    this.contacts = [newContact, ...this.contacts];
    return newContact;
  }

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    let updated: Contact | null = null;
    this.contacts = this.contacts.map((c) => {
      if (c.id === id) {
        updated = { ...c, ...updates };
        return updated;
      }
      return c;
    });
    if (!updated) throw new Error(`Contact ${id} not found`);
    return updated;
  }

  async getCompanies(): Promise<Company[]> {
    return [...this.companies];
  }

  // ==========================================
  // Clinic Pipeline (Kanban Intake)
  // ==========================================

  async getPipelineStages(): Promise<ClinicPipelineStage[]> {
    return [...this.stages];
  }

  async getPipelineCards(): Promise<ClinicPipelineCard[]> {
    return [...this.pipelineCards];
  }

  async movePipelineCard(
    cardId: string,
    newStageId: string,
    expectedLockVersion?: number
  ): Promise<{ success: boolean; card: ClinicPipelineCard }> {
    const currentLock = this.cardLockVersions.get(cardId) || 1;
    if (expectedLockVersion !== undefined && expectedLockVersion !== currentLock) {
      throw new Error(`Conflict detected: Pipeline card was modified by another agent. Please refresh.`);
    }

    let targetCard: ClinicPipelineCard | null = null;
    this.pipelineCards = this.pipelineCards.map((c) => {
      if (c.id === cardId) {
        targetCard = { ...c, stageId: newStageId, lastContacted: 'Today' };
        return targetCard;
      }
      return c;
    });

    if (!targetCard) throw new Error(`Card ${cardId} not found`);
    this.cardLockVersions.set(cardId, currentLock + 1);

    return { success: true, card: targetCard };
  }

  async createPipelineCard(
    cardData: Omit<ClinicPipelineCard, 'id' | 'lastContacted'>
  ): Promise<ClinicPipelineCard> {
    const newCard: ClinicPipelineCard = {
      ...cardData,
      id: `pipe-${Date.now()}`,
      lastContacted: 'Today',
    };
    this.pipelineCards = [newCard, ...this.pipelineCards];
    this.cardLockVersions.set(newCard.id, 1);
    return newCard;
  }

  // ==========================================
  // Broadcast Campaigns & 6-Step Engine
  // ==========================================

  async getCampaigns(): Promise<WhatsAppCampaign[]> {
    return [...this.campaigns];
  }

  async createCampaign(campaignData: any): Promise<WhatsAppCampaign> {
    const isRunning = campaignData.status === 'running';
    const total = campaignData.totalRecipients || 100;
    const newCmp: WhatsAppCampaign = {
      ...campaignData,
      id: `cmp-${Date.now()}`,
      createdAt: 'Just now',
      totalRecipients: total,
      sentCount: isRunning ? total : 0,
      deliveredCount: isRunning ? Math.floor(total * 0.96) : 0,
      readCount: isRunning ? Math.floor(total * 0.84) : 0,
      repliedCount: isRunning ? Math.floor(total * 0.18) : 0,
      failedCount: 0,
      excludedCount: campaignData.excludedCount || 6,
    };
    this.campaigns = [newCmp, ...this.campaigns];
    return newCmp;
  }

  async preflightPreview(campaignDraft: any): Promise<CrmCampaignPreflight> {
    // Mimics Chatwoot Whatsapp::CampaignPreflightService behavior
    const baseCandidateCount = campaignDraft.totalRecipients || 120;
    const missingConsent = Math.max(2, Math.floor(baseCandidateCount * 0.04));
    const suppressed = Math.max(1, Math.floor(baseCandidateCount * 0.02));
    const duplicates = Math.max(1, Math.floor(baseCandidateCount * 0.015));
    const invalidDestination = Math.max(1, Math.floor(baseCandidateCount * 0.01));
    const totalExcluded = missingConsent + suppressed + duplicates + invalidDestination;
    const eligibleCount = Math.max(0, baseCandidateCount - totalExcluded);

    return {
      total_candidates: baseCandidateCount,
      eligible_count: eligibleCount,
      excluded_count: totalExcluded,
      exclusions_by_reason: {
        missing_consent: missingConsent,
        suppressed,
        duplicates,
        invalid_destination: invalidDestination,
      },
      sample_exclusions: [
        {
          phone_number: '+91 98400 99112',
          name: 'Priya Narayanan',
          reason: 'missing_consent',
          detail: 'No active WhatsApp opt-in recorded in ChannelConsents registry.',
        },
        {
          phone_number: '+91 98400 33441',
          name: 'Karthik Raja',
          reason: 'suppressed',
          detail: 'Contact opted-out via inbound STOP command.',
        },
        {
          phone_number: '+91 98400 88224',
          name: 'Vijay Anand',
          reason: 'duplicates',
          detail: 'Duplicate phone number found in campaign audience selection.',
        },
        {
          phone_number: '+91 98400 00000',
          name: 'Invalid Test Number',
          reason: 'invalid_destination',
          detail: 'E.164 number format validation failed.',
        },
      ],
      safety_ceiling: 5000,
      within_safety_limits: eligibleCount <= 5000,
    };
  }

  async getCampaignRecipients(campaignId: string, filter?: { status?: string }): Promise<CampaignRecipient[]> {
    const list: CampaignRecipient[] = DETAILED_CAMPAIGN_RECIPIENTS.map((r) => ({
      id: r.id,
      campaignId,
      contactName: r.contactName,
      phone: r.destination,
      status: (r.status === 'replied' ? 'read' : r.status) as CampaignRecipient['status'],
      lifecycleTime: r.lifecycleTime,
      reason: r.reason,
    }));
    if (!filter?.status || filter.status === 'all') return list;
    return list.filter((r) => r.status === filter.status);
  }

  async previewCsvAudience(file: File | Blob, mapping?: Record<string, string>): Promise<CrmCsvAudiencePreview> {
    return {
      total_rows: 154,
      valid_rows: 146,
      invalid_rows: 8,
      headers: ['patient_name', 'phone_number', 'email', 'clinic_unit', 'consent_source'],
      sample_records: [
        {
          patient_name: 'Ananya Raman',
          phone_number: '+91 98401 22334',
          email: 'ananya.r@example.com',
          clinic_unit: 'Adyar Outpatient',
          consent_source: 'In-clinic Registration Tablet',
        },
        {
          patient_name: 'Murugan Selvam',
          phone_number: '+91 94441 55667',
          email: 'murugan.s@example.com',
          clinic_unit: 'Integrative Wellness',
          consent_source: 'Web Intake Form',
        },
        {
          patient_name: 'Deepa Krishnan',
          phone_number: '+91 98840 99881',
          email: 'deepa.k@example.com',
          clinic_unit: 'Adyar Outpatient',
          consent_source: 'WhatsApp Inbound Message',
        },
      ],
      detected_mapping: {
        phone: 'phone_number',
        name: 'patient_name',
        email: 'email',
        consent_source: 'consent_source',
        consent_captured_at: 'consent_captured_at',
      },
    };
  }

  // ==========================================
  // WhatsApp Templates
  // ==========================================

  async getTemplates(): Promise<WhatsAppTemplate[]> {
    return [
      {
        id: 'tpl_appointment_reminder',
        name: 'appointment_reminder_v2',
        category: 'UTILITY',
        language: 'en_US',
        status: 'approved',
        source: 'provider',
        isCampaignEligible: true,
        header: { type: 'text', text: 'Agamagizh Clinic Appointment Confirmation' },
        body: 'Hello {{1}}, this is a reminder for your upcoming consultation with {{2}} at Agamagizh Adyar on {{3}} at {{4}}.\n\nPlease reply CONFIRM or RESCHEDULE if you need to adjust your timing.',
        footer: 'Agamagizh Integrative Health • Adyar, Chennai',
        buttons: [
          { type: 'QUICK_REPLY', text: 'Confirm Appointment' },
          { type: 'QUICK_REPLY', text: 'Reschedule' },
        ],
      },
      {
        id: 'tpl_health_broadcast',
        name: 'seasonal_wellness_advisory',
        category: 'MARKETING',
        language: 'en_US',
        status: 'approved',
        source: 'provider',
        isCampaignEligible: true,
        header: { type: 'text', text: 'Preventive Health Bulletin' },
        body: 'Dear {{1}},\n\nWith changing weather conditions, our integrative care physicians have compiled essential guidance for respiratory vitality and immune resilience.\n\nRead our care guide or schedule your seasonal checkup.',
        footer: 'Agamagizh Health Care Registry',
        buttons: [
          { type: 'URL', text: 'Read Care Guide', value: 'https://agamagizh.org/wellness' },
          { type: 'QUICK_REPLY', text: 'Book Checkup' },
        ],
      },
      {
        id: 'tpl_post_visit_feedback',
        name: 'care_experience_survey',
        category: 'UTILITY',
        language: 'en_US',
        status: 'approved',
        source: 'provider',
        isCampaignEligible: true,
        body: 'Namaste {{1}},\n\nThank you for visiting Agamagizh Clinic today. How satisfied were you with the guidance provided by {{2}}?\n\nYour feedback helps us refine our integrative patient care.',
        buttons: [
          { type: 'QUICK_REPLY', text: '⭐⭐⭐⭐⭐ Excellent' },
          { type: 'QUICK_REPLY', text: '⭐⭐⭐⭐ Good' },
          { type: 'QUICK_REPLY', text: '💬 Share Feedback' },
        ],
      },
    ];
  }

  async saveTemplateDraft(draft: Partial<WhatsAppTemplate>): Promise<WhatsAppTemplate> {
    return {
      id: draft.id || `tpl_draft_${Date.now()}`,
      name: draft.name || 'untitled_template_draft',
      category: draft.category || 'UTILITY',
      language: draft.language || 'en',
      status: 'local_draft',
      source: 'local_draft',
      isCampaignEligible: false,
      body: draft.body || '',
      header: draft.header,
      footer: draft.footer,
      buttons: draft.buttons,
    };
  }

  // ==========================================
  // Chatbots & Automation Flows
  // ==========================================

  async getFlows(): Promise<ChatbotFlow[]> {
    return [...this.flows];
  }

  async saveFlow(flow: ChatbotFlow): Promise<ChatbotFlow> {
    const updated = { ...flow, lastSaved: 'Just now' };
    this.flows = this.flows.map((f) => (f.id === flow.id ? updated : f));
    return updated;
  }

  async validateFlow(flow: ChatbotFlow): Promise<CrmGraphValidationResult> {
    // Aligns with Chatwoot AutomationFlows::ChatbotGraphValidationService
    const startNode = flow.nodes.find((n) => n.type === 'start');
    const errors: any[] = [];
    
    if (!startNode) {
      errors.push({
        type: 'missing_start',
        message: 'Flow is missing a Start entry point node.',
        severity: 'error',
      });
    }

    const reachable = new Set<string>();
    if (startNode) {
      const queue = [startNode.id];
      reachable.add(startNode.id);
      while (queue.length > 0) {
        const curr = queue.shift()!;
        const outEdges = flow.edges.filter((e) => e.source === curr);
        for (const edge of outEdges) {
          if (!reachable.has(edge.target)) {
            reachable.add(edge.target);
            queue.push(edge.target);
          }
        }
      }
    }

    const unreachable = flow.nodes.filter((n) => !reachable.has(n.id)).map((n) => n.id);
    if (unreachable.length > 0) {
      errors.push({
        type: 'unreachable_nodes',
        message: `${unreachable.length} disconnected node(s) detected in the graph canvas.`,
        severity: 'warning',
      });
    }

    const hasHandoff = flow.nodes.some((n) => n.type === 'handoff' || n.type === 'end');

    return {
      valid: errors.filter((e) => e.severity === 'error').length === 0,
      errors,
      unreachable_nodes: unreachable,
      has_cycle: false,
      has_handoff: hasHandoff,
    };
  }

  async previewFlow(flow: ChatbotFlow): Promise<CrmFlowPreviewResult> {
    const startNode = flow.nodes.find((n) => n.type === 'start');
    if (!startNode) {
      return { success: false, steps: [], error: 'No start node configured.' };
    }

    const steps = flow.nodes.slice(0, 4).map((n) => ({
      node_id: n.id,
      node_type: n.type,
      output_message: n.content?.messageText || n.content?.questionText || `Step: ${n.title}`,
      prompt_options: n.content?.choices || [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    return { success: true, steps };
  }

  async publishFlow(flowId: string): Promise<{ success: boolean; version: number }> {
    let nextVersionNum = 1;
    this.flows = this.flows.map((f) => {
      if (f.id === flowId) {
        const currentNum = parseInt(f.version.replace(/[^0-9]/g, ''), 10) || 1;
        nextVersionNum = currentNum + 1;
        return {
          ...f,
          status: 'published' as const,
          version: `v${nextVersionNum}.0`,
          lastModified: 'Just now',
        };
      }
      return f;
    });
    return { success: true, version: nextVersionNum };
  }

  // ==========================================
  // Operational Analytics
  // ==========================================

  async getOperationalAnalytics(): Promise<CrmOperationalAnalytics> {
    return {
      conversations_count: 1420,
      incoming_messages_count: 5820,
      outgoing_messages_count: 7340,
      avg_first_response_time_seconds: 145,
      avg_resolution_time_seconds: 1840,
      csat_survey_responses_count: 412,
      csat_positive_percentage: 94.8,
      delivery_rate: 98.4,
      read_rate: 86.2,
      response_rate: 34.5,
      active_agents_count: 8,
    };
  }
}
