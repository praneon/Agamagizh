export type CanonicalRecipientStatus = 
  | 'queued'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'replied'
  | 'failed'
  | 'excluded';

export type DateRangePreset = 'today' | 'last_7_days' | 'last_30_days' | 'custom';

export interface CampaignOption {
  id: string;
  name: string;
  inbox: string;
  createdAt: string;
  status: 'completed' | 'running' | 'scheduled' | 'draft';
}

export interface RecipientLifecycleEvent {
  stage: string;
  timestamp: string;
  description?: string;
  isTerminalError?: boolean;
}

export interface RecipientLedgerItem {
  id: string;
  contactId: string;
  contactName: string;
  destination: string; // E.g., "+91 98410 44210"
  campaignId: string;
  campaignName: string;
  inbox: string;
  status: CanonicalRecipientStatus;
  lifecycleTime: string; // E.g., "14 Sep, 10:48 AM"
  timestamp: string; // ISO date for filtering
  attempts?: number;
  reason?: string;
  reasonCategory?: 'safety_exclusion' | 'carrier_rejection' | 'network_timeout' | 'consent_revoked' | 'invalid_number';
  conversationId?: string;
  lifecycleHistory: RecipientLifecycleEvent[];
}

export interface CanonicalMetrics {
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  failed: number;
  excluded: number;
}

export interface CampaignBreakdownRow {
  campaignId: string;
  campaignName: string;
  inbox: string;
  status: 'completed' | 'running' | 'scheduled';
  scheduledAt: string;
  metrics: CanonicalMetrics;
}

export interface DailyOutcomeDataPoint {
  date: string;
  displayDate: string;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  failed: number;
}

export interface AnalyticsFilterState {
  campaignId: string; // 'all' or specific campaignId
  inbox: string; // 'all' or specific inbox name
  dateRange: DateRangePreset;
  customStartDate?: string;
  customEndDate?: string;
  selectedStatus?: CanonicalRecipientStatus | 'all';
  searchQuery: string;
}
