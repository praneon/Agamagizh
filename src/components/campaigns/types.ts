import { WhatsAppTemplate, WhatsAppCampaign } from '../../types';

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

export type CampaignAudienceType = 'labels' | 'csv' | 'saved_filter' | 'manual';

export type CampaignScheduleMode = 'send_now' | 'schedule_later';

export type VariableMappingSource = 
  | 'contact_name' 
  | 'phone_number' 
  | 'email' 
  | 'contact_attribute' 
  | 'static_value';

export interface CampaignVariableMapping {
  token: string;
  source: VariableMappingSource;
  attributeName?: string;
  staticValue?: string;
  exampleValue: string;
}

export type CsvState = 
  | 'empty' 
  | 'drag_over' 
  | 'parsing' 
  | 'validated' 
  | 'validated_with_issues' 
  | 'fatal_error';

export interface CsvIssue {
  rowNumber: number;
  phone: string;
  issue: 'Missing phone number' | 'Invalid destination format' | 'Duplicate CSV row';
}

export interface CsvParsedData {
  fileName: string;
  fileSize: string;
  rowsParsed: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  sampleRows: { name: string; phone: string; customVal?: string }[];
  issues: CsvIssue[];
}

export type PreflightExclusionCategory = 
  | 'missing_consent' 
  | 'suppressed' 
  | 'duplicates' 
  | 'invalid_destination';

export interface PreflightCandidateRecord {
  id: string;
  contactName: string;
  destination: string;
  category: PreflightExclusionCategory;
  reason: string; // Human-readable
  sourceContext: string;
}

export interface CanonicalPreflightResult {
  totalCandidates: number;
  eligible: number;
  missingConsent: number;
  suppressed: number;
  duplicates: number;
  invalidDestination: number;
  exclusionRecords: PreflightCandidateRecord[];
}

export type RecipientStatus = 
  | 'queued' 
  | 'sent' 
  | 'delivered' 
  | 'read' 
  | 'replied' 
  | 'failed' 
  | 'excluded';

export interface CampaignRecipientRecord {
  id: string;
  campaignId: string;
  contactName: string;
  destination: string;
  status: RecipientStatus;
  lifecycleTime: string;
  attempts: number;
  reason?: string; // Human readable reason for failed / excluded
  kind: 'successful' | 'delivery_failure' | 'preflight_exclusion';
}

export interface CampaignDraftState {
  id?: string;
  name: string;
  channelInbox: string;
  audienceType: CampaignAudienceType;
  // Labels
  selectedLabels: string[];
  // CSV
  csvData?: CsvParsedData;
  csvMapping: { nameCol: string; phoneCol: string };
  // Saved Filter
  savedFilterId: string;
  // Manual Contacts
  selectedContactIds: string[];
  // Template
  selectedTemplateId: string;
  // Variable Mappings
  mappings: Record<string, CampaignVariableMapping>;
  // Schedule
  scheduleMode: CampaignScheduleMode;
  scheduleDate: string;
  scheduleTime: string;
  scheduleTimezone: string;
}
