import { 
  CampaignOption, 
  RecipientLedgerItem, 
  CampaignBreakdownRow,
  DailyOutcomeDataPoint,
  CanonicalMetrics
} from './types';

export const MOCK_CAMPAIGNS: CampaignOption[] = [
  {
    id: 'cmp-sep-followup',
    name: 'September Follow-up',
    inbox: 'Agamagizh WhatsApp Main',
    createdAt: '2026-09-12',
    status: 'completed'
  },
  {
    id: 'cmp-appt-reminder',
    name: 'Appointment Reminder',
    inbox: 'Adyar Reception Desk',
    createdAt: '2026-09-14',
    status: 'running'
  },
  {
    id: 'cmp-feedback-request',
    name: 'Feedback Request',
    inbox: 'Agamagizh WhatsApp Main',
    createdAt: '2026-09-10',
    status: 'completed'
  },
  {
    id: 'cmp-q4-holiday',
    name: 'Q4 Center Operational Timings',
    inbox: 'Agamagizh WhatsApp Main',
    createdAt: '2026-09-08',
    status: 'completed'
  },
  {
    id: 'cmp-oct-wellness',
    name: 'October Wellness Workshop',
    inbox: 'Anna Nagar Support',
    createdAt: '2026-09-13',
    status: 'running'
  }
];

export const MOCK_INBOXES: string[] = [
  'Agamagizh WhatsApp Main',
  'Adyar Reception Desk',
  'Anna Nagar Support'
];

export const MOCK_GLOBAL_METRICS: CanonicalMetrics = {
  sent: 1248,
  delivered: 1192,
  read: 1037,
  replied: 284,
  failed: 56,
  excluded: 87
};

export const MOCK_CAMPAIGN_BREAKDOWNS: CampaignBreakdownRow[] = [
  {
    campaignId: 'cmp-sep-followup',
    campaignName: 'September Follow-up',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'completed',
    scheduledAt: '12 Sep 2026, 09:30 AM',
    metrics: {
      sent: 450,
      delivered: 432,
      read: 380,
      replied: 112,
      failed: 18,
      excluded: 32
    }
  },
  {
    campaignId: 'cmp-appt-reminder',
    campaignName: 'Appointment Reminder',
    inbox: 'Adyar Reception Desk',
    status: 'running',
    scheduledAt: '14 Sep 2026, 08:00 AM',
    metrics: {
      sent: 320,
      delivered: 308,
      read: 275,
      replied: 94,
      failed: 12,
      excluded: 14
    }
  },
  {
    campaignId: 'cmp-feedback-request',
    campaignName: 'Feedback Request',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'completed',
    scheduledAt: '10 Sep 2026, 02:00 PM',
    metrics: {
      sent: 210,
      delivered: 198,
      read: 172,
      replied: 46,
      failed: 12,
      excluded: 18
    }
  },
  {
    campaignId: 'cmp-q4-holiday',
    campaignName: 'Q4 Center Operational Timings',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'completed',
    scheduledAt: '08 Sep 2026, 10:00 AM',
    metrics: {
      sent: 180,
      delivered: 174,
      read: 148,
      replied: 22,
      failed: 6,
      excluded: 15
    }
  },
  {
    campaignId: 'cmp-oct-wellness',
    campaignName: 'October Wellness Workshop',
    inbox: 'Anna Nagar Support',
    status: 'running',
    scheduledAt: '13 Sep 2026, 11:30 AM',
    metrics: {
      sent: 88,
      delivered: 80,
      read: 62,
      replied: 10,
      failed: 8,
      excluded: 8
    }
  }
];

export const MOCK_DAILY_OUTCOMES: DailyOutcomeDataPoint[] = [
  { date: '2026-09-08', displayDate: '08 Sep', sent: 180, delivered: 174, read: 148, replied: 22, failed: 6 },
  { date: '2026-09-09', displayDate: '09 Sep', sent: 42, delivered: 40, read: 36, replied: 9, failed: 2 },
  { date: '2026-09-10', displayDate: '10 Sep', sent: 210, delivered: 198, read: 172, replied: 46, failed: 12 },
  { date: '2026-09-11', displayDate: '11 Sep', sent: 58, delivered: 55, read: 48, replied: 14, failed: 3 },
  { date: '2026-09-12', displayDate: '12 Sep', sent: 450, delivered: 432, read: 380, replied: 112, failed: 18 },
  { date: '2026-09-13', displayDate: '13 Sep', sent: 128, delivered: 117, read: 94, replied: 28, failed: 11 },
  { date: '2026-09-14', displayDate: '14 Sep', sent: 180, delivered: 176, read: 159, replied: 53, failed: 4 }
];

export const MOCK_RECIPIENT_LEDGER: RecipientLedgerItem[] = [
  // FAILED RECIPIENTS (demonstrating distinct failed lifecycle & attempts)
  {
    id: 'rcp-101',
    contactId: 'cnt-meera',
    contactName: 'Meera Sundaram',
    destination: '+91 98410 44321',
    campaignId: 'cmp-sep-followup',
    campaignName: 'September Follow-up',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'failed',
    lifecycleTime: '14 Sep, 10:48 AM',
    timestamp: '2026-09-14T10:48:00',
    attempts: 2,
    reason: 'Delivery failed',
    reasonCategory: 'carrier_rejection',
    conversationId: 'conv-101',
    lifecycleHistory: [
      { stage: 'Queued', timestamp: '14 Sep, 10:42 AM', description: 'Enqueued in campaign delivery queue' },
      { stage: 'Sent (Attempt 1)', timestamp: '14 Sep, 10:43 AM', description: 'Dispatched to WhatsApp Cloud API gateway' },
      { stage: 'Temporary Failure', timestamp: '14 Sep, 10:45 AM', description: 'Carrier reported destination device powered off or out of coverage' },
      { stage: 'Sent (Attempt 2)', timestamp: '14 Sep, 10:47 AM', description: 'Automatic second dispatch attempt executed' },
      { stage: 'Delivery Failed', timestamp: '14 Sep, 10:48 AM', description: 'Delivery window expired without handset acknowledgment', isTerminalError: true }
    ]
  },
  {
    id: 'rcp-102',
    contactId: 'cnt-karthik',
    contactName: 'Karthik Subramanian',
    destination: '+91 97910 88219',
    campaignId: 'cmp-appt-reminder',
    campaignName: 'Appointment Reminder',
    inbox: 'Adyar Reception Desk',
    status: 'failed',
    lifecycleTime: '14 Sep, 09:15 AM',
    timestamp: '2026-09-14T09:15:00',
    attempts: 1,
    reason: 'Provider rejected destination',
    reasonCategory: 'invalid_number',
    conversationId: 'conv-102',
    lifecycleHistory: [
      { stage: 'Queued', timestamp: '14 Sep, 09:12 AM', description: 'Enqueued in Adyar Reception Desk queue' },
      { stage: 'Sent', timestamp: '14 Sep, 09:13 AM', description: 'Dispatched to Meta Cloud API' },
      { stage: 'Provider Rejected', timestamp: '14 Sep, 09:15 AM', description: 'Meta Cloud API rejected: phone number is not registered on WhatsApp', isTerminalError: true }
    ]
  },
  {
    id: 'rcp-103',
    contactId: 'cnt-priya-k',
    contactName: 'Priya Krishnan',
    destination: '+91 98840 55102',
    campaignId: 'cmp-sep-followup',
    campaignName: 'September Follow-up',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'failed',
    lifecycleTime: '13 Sep, 04:22 PM',
    timestamp: '2026-09-13T16:22:00',
    attempts: 2,
    reason: 'Temporary delivery failure',
    reasonCategory: 'network_timeout',
    conversationId: 'conv-103',
    lifecycleHistory: [
      { stage: 'Queued', timestamp: '13 Sep, 04:18 PM', description: 'Enqueued in campaign dispatch' },
      { stage: 'Sent (Attempt 1)', timestamp: '13 Sep, 04:19 PM', description: 'Dispatched via Agamagizh WhatsApp Main' },
      { stage: 'Network Timeout', timestamp: '13 Sep, 04:20 PM', description: 'Carrier infrastructure timeout' },
      { stage: 'Delivery Failed', timestamp: '13 Sep, 04:22 PM', description: 'Final retry aborted after network threshold', isTerminalError: true }
    ]
  },
  {
    id: 'rcp-104',
    contactId: 'cnt-venkat',
    contactName: 'Venkatesh Prasad',
    destination: '+91 94441 33201',
    campaignId: 'cmp-feedback-request',
    campaignName: 'Feedback Request',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'failed',
    lifecycleTime: '12 Sep, 03:40 PM',
    timestamp: '2026-09-12T15:40:00',
    attempts: 1,
    reason: 'Provider rejected destination',
    reasonCategory: 'carrier_rejection',
    lifecycleHistory: [
      { stage: 'Queued', timestamp: '12 Sep, 03:38 PM', description: 'Enqueued in campaign delivery queue' },
      { stage: 'Sent', timestamp: '12 Sep, 03:39 PM', description: 'Dispatched to provider gateway' },
      { stage: 'Rejected', timestamp: '12 Sep, 03:40 PM', description: 'WhatsApp provider rejected destination due to invalid country routing', isTerminalError: true }
    ]
  },

  // EXCLUDED CANDIDATES (demonstrating safety/eligibility exclusion WITHOUT fake sent/delivered events!)
  {
    id: 'rcp-201',
    contactId: 'cnt-radha',
    contactName: 'Radha Nambiar',
    destination: '+91 98402 77114',
    campaignId: 'cmp-sep-followup',
    campaignName: 'September Follow-up',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'excluded',
    lifecycleTime: '12 Sep, 09:28 AM',
    timestamp: '2026-09-12T09:28:00',
    reason: 'Missing consent',
    reasonCategory: 'consent_revoked',
    lifecycleHistory: [
      { stage: 'Audience Candidate Evaluated', timestamp: '12 Sep, 09:27 AM', description: 'Candidate evaluated against campaign audience filters' },
      { stage: 'Excluded by Safety Rules', timestamp: '12 Sep, 09:28 AM', description: 'Contact does not have an active WhatsApp Opt-in consent record', isTerminalError: true }
    ]
  },
  {
    id: 'rcp-202',
    contactId: 'cnt-suresh',
    contactName: 'Suresh Narayanan',
    destination: '+91 97103 44109',
    campaignId: 'cmp-appt-reminder',
    campaignName: 'Appointment Reminder',
    inbox: 'Adyar Reception Desk',
    status: 'excluded',
    lifecycleTime: '14 Sep, 07:55 AM',
    timestamp: '2026-09-14T07:55:00',
    reason: 'Suppressed contact',
    reasonCategory: 'safety_exclusion',
    lifecycleHistory: [
      { stage: 'Audience Candidate Evaluated', timestamp: '14 Sep, 07:54 AM', description: 'Evaluated for scheduled appointment reminders' },
      { stage: 'Excluded by Safety Rules', timestamp: '14 Sep, 07:55 AM', description: 'Contact is in the Global Do-Not-Disturb / Suppressed list', isTerminalError: true }
    ]
  },
  {
    id: 'rcp-203',
    contactId: 'cnt-anand',
    contactName: 'Anand Ranganathan',
    destination: '+91 98841 99022',
    campaignId: 'cmp-feedback-request',
    campaignName: 'Feedback Request',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'excluded',
    lifecycleTime: '10 Sep, 01:52 PM',
    timestamp: '2026-09-10T13:52:00',
    reason: 'Duplicate recipient',
    reasonCategory: 'safety_exclusion',
    lifecycleHistory: [
      { stage: 'Audience Candidate Evaluated', timestamp: '10 Sep, 01:50 PM', description: 'Multi-label segment de-duplication check' },
      { stage: 'Excluded as Duplicate', timestamp: '10 Sep, 01:52 PM', description: 'Destination phone already reached by another campaign in the last 24 hours', isTerminalError: true }
    ]
  },
  {
    id: 'rcp-204',
    contactId: 'cnt-deepa-s',
    contactName: 'Deepa Swaminathan',
    destination: '+91 94440 11984',
    campaignId: 'cmp-q4-holiday',
    campaignName: 'Q4 Center Operational Timings',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'excluded',
    lifecycleTime: '08 Sep, 09:50 AM',
    timestamp: '2026-09-08T09:50:00',
    reason: 'Invalid destination',
    reasonCategory: 'invalid_number',
    lifecycleHistory: [
      { stage: 'Audience Candidate Evaluated', timestamp: '08 Sep, 09:48 AM', description: 'Pre-flight international format and ITU-T E.164 verification' },
      { stage: 'Excluded by Preflight', timestamp: '08 Sep, 09:50 AM', description: 'Destination format lacks mandatory area/mobile prefix', isTerminalError: true }
    ]
  },

  // DELIVERED & READ & REPLIED
  {
    id: 'rcp-301',
    contactId: 'cnt-dr-ragu',
    contactName: 'Dr. Ragunath R',
    destination: '+91 98401 98401',
    campaignId: 'cmp-appt-reminder',
    campaignName: 'Appointment Reminder',
    inbox: 'Adyar Reception Desk',
    status: 'replied',
    lifecycleTime: '14 Sep, 11:05 AM',
    timestamp: '2026-09-14T11:05:00',
    attempts: 1,
    conversationId: 'conv-101',
    lifecycleHistory: [
      { stage: 'Queued', timestamp: '14 Sep, 08:00 AM', description: 'Enqueued in campaign delivery queue' },
      { stage: 'Sent', timestamp: '14 Sep, 08:01 AM', description: 'Dispatched via Adyar Reception Desk' },
      { stage: 'Delivered', timestamp: '14 Sep, 08:02 AM', description: 'Handset received message' },
      { stage: 'Read', timestamp: '14 Sep, 08:15 AM', description: 'Blue tick receipt received' },
      { stage: 'Replied', timestamp: '14 Sep, 11:05 AM', description: 'Inbound response: "Yes, I will arrive at 10:30 AM with reports."' }
    ]
  },
  {
    id: 'rcp-302',
    contactId: 'cnt-lakshmi',
    contactName: 'Lakshmi Narayanan',
    destination: '+91 97909 23812',
    campaignId: 'cmp-sep-followup',
    campaignName: 'September Follow-up',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'replied',
    lifecycleTime: '14 Sep, 10:15 AM',
    timestamp: '2026-09-14T10:15:00',
    attempts: 1,
    conversationId: 'conv-104',
    lifecycleHistory: [
      { stage: 'Queued', timestamp: '14 Sep, 09:30 AM', description: 'Enqueued in campaign batch' },
      { stage: 'Sent', timestamp: '14 Sep, 09:31 AM', description: 'Sent via Agamagizh WhatsApp Main' },
      { stage: 'Delivered', timestamp: '14 Sep, 09:32 AM', description: 'Delivered to phone' },
      { stage: 'Read', timestamp: '14 Sep, 09:40 AM', description: 'Read by recipient' },
      { stage: 'Replied', timestamp: '14 Sep, 10:15 AM', description: 'Inbound message: "Can we reschedule the speech follow-up to Thursday?"' }
    ]
  },
  {
    id: 'rcp-303',
    contactId: 'cnt-aravind',
    contactName: 'Aravind Swamy',
    destination: '+91 98412 34567',
    campaignId: 'cmp-sep-followup',
    campaignName: 'September Follow-up',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'read',
    lifecycleTime: '14 Sep, 10:48 AM',
    timestamp: '2026-09-14T10:48:00',
    attempts: 1,
    conversationId: 'conv-102',
    lifecycleHistory: [
      { stage: 'Queued', timestamp: '14 Sep, 10:42 AM', description: 'Enqueued in campaign delivery queue' },
      { stage: 'Sent', timestamp: '14 Sep, 10:43 AM', description: 'Dispatched from Agamagizh WhatsApp Main' },
      { stage: 'Delivered', timestamp: '14 Sep, 10:44 AM', description: 'Delivered to destination' },
      { stage: 'Read', timestamp: '14 Sep, 10:48 AM', description: 'Blue tick read receipt confirmed' }
    ]
  },
  {
    id: 'rcp-304',
    contactId: 'cnt-ananya',
    contactName: 'Ananya Deshmukh',
    destination: '+91 98842 11904',
    campaignId: 'cmp-oct-wellness',
    campaignName: 'October Wellness Workshop',
    inbox: 'Anna Nagar Support',
    status: 'read',
    lifecycleTime: '13 Sep, 12:20 PM',
    timestamp: '2026-09-13T12:20:00',
    attempts: 1,
    conversationId: 'conv-103',
    lifecycleHistory: [
      { stage: 'Queued', timestamp: '13 Sep, 11:30 AM', description: 'Enqueued in Anna Nagar workshop broadcast' },
      { stage: 'Sent', timestamp: '13 Sep, 11:31 AM', description: 'Dispatched via Anna Nagar Support' },
      { stage: 'Delivered', timestamp: '13 Sep, 11:33 AM', description: 'Device acknowledgment received' },
      { stage: 'Read', timestamp: '13 Sep, 12:20 PM', description: 'Recipient opened message' }
    ]
  },
  {
    id: 'rcp-305',
    contactId: 'cnt-saravanan',
    contactName: 'Saravanan Muthu',
    destination: '+91 98405 88129',
    campaignId: 'cmp-appt-reminder',
    campaignName: 'Appointment Reminder',
    inbox: 'Adyar Reception Desk',
    status: 'delivered',
    lifecycleTime: '14 Sep, 08:04 AM',
    timestamp: '2026-09-14T08:04:00',
    attempts: 1,
    lifecycleHistory: [
      { stage: 'Queued', timestamp: '14 Sep, 08:00 AM', description: 'Enqueued in appointment broadcast' },
      { stage: 'Sent', timestamp: '14 Sep, 08:02 AM', description: 'Sent via Adyar Reception Desk' },
      { stage: 'Delivered', timestamp: '14 Sep, 08:04 AM', description: 'Handset delivery confirmed (Double tick)' }
    ]
  },
  {
    id: 'rcp-306',
    contactId: 'cnt-bhavani',
    contactName: 'Bhavani Shankar',
    destination: '+91 97108 55412',
    campaignId: 'cmp-feedback-request',
    campaignName: 'Feedback Request',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'delivered',
    lifecycleTime: '10 Sep, 02:08 PM',
    timestamp: '2026-09-10T14:08:00',
    attempts: 1,
    lifecycleHistory: [
      { stage: 'Queued', timestamp: '10 Sep, 02:00 PM', description: 'Enqueued in feedback campaign' },
      { stage: 'Sent', timestamp: '10 Sep, 02:04 PM', description: 'Dispatched' },
      { stage: 'Delivered', timestamp: '10 Sep, 02:08 PM', description: 'Delivered to handset' }
    ]
  },
  {
    id: 'rcp-307',
    contactId: 'cnt-rajesh',
    contactName: 'Rajesh Subramanian',
    destination: '+91 98410 77219',
    campaignId: 'cmp-appt-reminder',
    campaignName: 'Appointment Reminder',
    inbox: 'Adyar Reception Desk',
    status: 'sent',
    lifecycleTime: '14 Sep, 08:05 AM',
    timestamp: '2026-09-14T08:05:00',
    attempts: 1,
    lifecycleHistory: [
      { stage: 'Queued', timestamp: '14 Sep, 08:00 AM', description: 'Enqueued in campaign dispatch' },
      { stage: 'Sent', timestamp: '14 Sep, 08:05 AM', description: 'Dispatched to Meta Cloud API (Awaiting carrier delivery receipt)' }
    ]
  },
  {
    id: 'rcp-308',
    contactId: 'cnt-kavitha',
    contactName: 'Kavitha Balasubramanian',
    destination: '+91 98845 22109',
    campaignId: 'cmp-oct-wellness',
    campaignName: 'October Wellness Workshop',
    inbox: 'Anna Nagar Support',
    status: 'queued',
    lifecycleTime: '14 Sep, 11:45 AM',
    timestamp: '2026-09-14T11:45:00',
    attempts: 0,
    lifecycleHistory: [
      { stage: 'Queued', timestamp: '14 Sep, 11:45 AM', description: 'Scheduled in next dispatch rate batch (50 msgs/min)' }
    ]
  }
];
