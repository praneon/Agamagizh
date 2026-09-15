/**
 * Agamagizh CRM Contracts
 * Direct TypeScript mapping of Chatwoot Phase 1 Rails Models, Controllers, and API Client shapes.
 * Referenced from:
 * - crm/chatwoot-phase1/app/models/
 * - crm/chatwoot-phase1/app/controllers/api/v1/accounts/
 * - crm/chatwoot-phase1/app/javascript/dashboard/api/
 */

// ==========================================
// 1. Account & Identity Context
// ==========================================

export interface CrmAccount {
  id: number;
  name: string;
  locale?: string;
  domain?: string;
  custom_attributes?: Record<string, any>;
  settings?: {
    whatsapp_safety_ceiling?: number;
    business_hours_enabled?: boolean;
    timezone?: string;
  };
}

export interface CrmUser {
  id: number;
  name: string;
  email: string;
  role: 'administrator' | 'agent' | 'custom_role';
  avatar_url?: string;
  availability_status?: 'online' | 'offline' | 'busy';
  account_id: number;
}

export interface CrmInbox {
  id: number;
  name: string;
  channel_type: 'Channel::Whatsapp' | 'Channel::WebWidget' | 'Channel::Email' | 'Channel::Api';
  phone_number?: string;
  provider?: string;
  account_id: number;
  avatar_url?: string;
}

export interface CrmTeam {
  id: number;
  name: string;
  description?: string;
  account_id: number;
}

// ==========================================
// 2. Conversations & Messages
// ==========================================

export type CrmConversationStatus = 'open' | 'resolved' | 'snoozed' | 'pending';
export type CrmPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface CrmAttachment {
  id: number;
  message_id: number;
  file_type: 'image' | 'audio' | 'video' | 'file';
  account_id: number;
  data_url: string;
  thumb_url?: string;
  file_size?: number;
}

export interface CrmMessage {
  id: number;
  content: string;
  inbox_id: number;
  conversation_id: number;
  message_type: 'incoming' | 'outgoing' | 'activity' | 'template';
  created_at: number;
  private: boolean;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  source_id?: string;
  content_type?: string;
  content_attributes?: Record<string, any>;
  sender?: {
    id: number;
    name: string;
    avatar_url?: string;
    type: 'user' | 'contact' | 'agent_bot';
  };
  attachments?: CrmAttachment[];
}

export interface CrmConversation {
  id: number;
  account_id: number;
  inbox_id: number;
  status: CrmConversationStatus;
  priority?: CrmPriority;
  assignee_id?: number;
  team_id?: number;
  contact_inbox_id?: number;
  unread_count: number;
  labels: string[];
  custom_attributes: Record<string, any>;
  created_at: number;
  timestamp: number;
  last_activity_at: number;
  meta: {
    sender: CrmContact;
    assignee?: CrmUser;
    team?: CrmTeam;
    channel: string;
    hmac_verified?: boolean;
  };
  messages: CrmMessage[];
}

// ==========================================
// 3. Contacts & Companies
// ==========================================

export interface CrmChannelConsent {
  id: number;
  contact_id: number;
  channel: string;
  status: 'opted_in' | 'opted_out' | 'pending';
  source?: string;
  captured_at?: string;
  revoked_at?: string;
}

export interface CrmContact {
  id: number;
  name: string;
  email?: string;
  phone_number: string;
  identifier?: string;
  thumbnail?: string;
  custom_attributes: Record<string, any>;
  additional_attributes?: Record<string, any>;
  created_at: number;
  last_activity_at?: number;
  conversations_count?: number;
  channel_consents?: CrmChannelConsent[];
}

export interface CrmCompany {
  id: number;
  name: string;
  description?: string;
  domain?: string;
  industry?: string;
  address?: string;
  contacts_count: number;
  created_at: number;
}

// ==========================================
// 4. Clinic Pipeline (Kanban Intake)
// ==========================================

export interface CrmClinicPipelineStage {
  id: number;
  clinic_pipeline_id: number;
  name: string;
  position: number;
  color?: string;
  created_at?: string;
}

export interface CrmClinicPipelineCard {
  id: number;
  clinic_pipeline_id: number;
  clinic_pipeline_stage_id: number;
  contact_id: number;
  title: string;
  value?: number;
  position: number;
  priority?: CrmPriority;
  due_date?: string;
  labels: string[];
  custom_attributes: Record<string, any>;
  lock_version: number; // Optimistic locking guard
  contact?: CrmContact;
  created_at: string;
  updated_at: string;
}

export interface CrmClinicPipeline {
  id: number;
  account_id: number;
  name: string;
  is_default: boolean;
  stages: CrmClinicPipelineStage[];
  cards_count?: number;
}

export interface CrmMoveCardPayload {
  stage_id: number;
  position?: number;
  lock_version?: number;
}

// ==========================================
// 5. WhatsApp Templates & Drafts
// ==========================================

export interface CrmWhatsAppTemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  example?: {
    header_text?: string[];
    body_text?: string[][];
  };
  buttons?: Array<{
    type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
    text: string;
    url?: string;
    phone_number?: string;
  }>;
}

export interface CrmWhatsAppTemplate {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'PAUSED';
  language: string;
  components: CrmWhatsAppTemplateComponent[];
}

export interface CrmWhatsAppTemplateDraft {
  id: number;
  account_id: number;
  name: string;
  category: string;
  language: string;
  status: 'draft' | 'preparing' | 'submitted' | 'approved' | 'rejected';
  body: string;
  header_type?: string;
  buttons?: any[];
  parameters?: Record<string, any>;
}

// ==========================================
// 6. Broadcast Campaigns & Preflight
// ==========================================

export type CrmCampaignAudienceType = 'labels' | 'csv' | 'saved_filter' | 'manual';
export type CrmCampaignStatus = 'draft' | 'scheduled' | 'running' | 'completed' | 'paused' | 'cancelled' | 'failed';

export interface CrmCampaign {
  id: number;
  account_id: number;
  inbox_id: number;
  title: string;
  message?: string;
  campaign_type: 'one_off' | 'ongoing';
  campaign_status: CrmCampaignStatus;
  scheduled_at?: string;
  audience_type: CrmCampaignAudienceType;
  audience_metadata: {
    labels?: string[];
    filter_id?: string;
    manual_contact_ids?: number[];
    csv_file_name?: string;
    csv_total_rows?: number;
    consent_purpose?: string;
  };
  template_params: {
    template_id?: string;
    template_name?: string;
    variables?: Record<string, string>;
  };
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  read_count: number;
  replied_count: number;
  failed_count: number;
  excluded_count: number;
  created_at: string;
}

export interface CrmCampaignRecipient {
  id: number;
  campaign_id: number;
  contact_id?: number;
  phone_number: string;
  recipient_name?: string;
  delivery_status: 'pending' | 'sent' | 'delivered' | 'read' | 'replied' | 'failed' | 'excluded';
  exclusion_reason?: 'missing_consent' | 'suppressed' | 'duplicates' | 'invalid_destination';
  error_code?: string;
  error_message?: string;
  dispatched_at?: string;
  delivered_at?: string;
  read_at?: string;
}

export interface CrmCampaignPreflight {
  total_candidates: number;
  eligible_count: number;
  excluded_count: number;
  exclusions_by_reason: {
    missing_consent: number;
    suppressed: number;
    duplicates: number;
    invalid_destination: number;
  };
  sample_exclusions: Array<{
    phone_number: string;
    name?: string;
    reason: 'missing_consent' | 'suppressed' | 'duplicates' | 'invalid_destination';
    detail: string;
  }>;
  safety_ceiling: number;
  within_safety_limits: boolean;
}

export interface CrmCsvAudiencePreview {
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  headers: string[];
  sample_records: Array<Record<string, string>>;
  detected_mapping: {
    phone?: string;
    name?: string;
    email?: string;
    consent_source?: string;
    consent_captured_at?: string;
  };
}

// ==========================================
// 7. Automation Flows & Chatbots
// ==========================================

export interface CrmFlowGraphNode {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface CrmFlowGraphEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  label?: string;
}

export interface CrmFlowGraph {
  nodes: CrmFlowGraphNode[];
  edges: CrmFlowGraphEdge[];
  viewport?: { x: number; y: number; zoom: number };
}

export interface CrmAutomationFlow {
  id: number;
  account_id: number;
  title: string;
  description?: string;
  trigger_type: 'conversation_created' | 'message_created' | 'whatsapp_keyword' | 'manual';
  status: 'draft' | 'active' | 'paused' | 'archived';
  version: number;
  active_version_id?: number;
  definition: CrmFlowGraph;
  configuration?: {
    channel_inbox_ids?: number[];
    safety_keywords?: string[];
    timeout_minutes?: number;
  };
  runs_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CrmGraphValidationError {
  node_id?: string;
  type: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface CrmGraphValidationResult {
  valid: boolean;
  errors: CrmGraphValidationError[];
  unreachable_nodes: string[];
  has_cycle: boolean;
  has_handoff: boolean;
}

export interface CrmFlowPreviewStep {
  node_id: string;
  node_type: string;
  output_message?: string;
  prompt_options?: string[];
  timestamp: string;
}

export interface CrmFlowPreviewResult {
  success: boolean;
  steps: CrmFlowPreviewStep[];
  error?: string;
}

// ==========================================
// 8. Operational Analytics
// ==========================================

export interface CrmOperationalAnalytics {
  conversations_count: number;
  incoming_messages_count: number;
  outgoing_messages_count: number;
  avg_first_response_time_seconds: number;
  avg_resolution_time_seconds: number;
  csat_survey_responses_count: number;
  csat_positive_percentage: number;
  delivery_rate: number;
  read_rate: number;
  response_rate: number;
  active_agents_count: number;
}
