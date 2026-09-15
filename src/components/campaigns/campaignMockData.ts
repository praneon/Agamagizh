import { 
  CanonicalPreflightResult, 
  PreflightCandidateRecord, 
  CampaignRecipientRecord, 
  CsvParsedData 
} from './types';

export const AVAILABLE_CRM_LABELS = [
  { id: 'lbl-1', name: 'Follow-up', count: 184 },
  { id: 'lbl-2', name: 'Adyar Branch', count: 210 },
  { id: 'lbl-3', name: 'Anna Nagar Hub', count: 145 },
  { id: 'lbl-4', name: 'VIP Client', count: 68 },
  { id: 'lbl-5', name: 'Weekend Sessions', count: 92 },
  { id: 'lbl-6', name: 'Enquiry', count: 124 },
  { id: 'lbl-7', name: 'Consultation Completed', count: 176 },
  { id: 'lbl-8', name: 'Regular Client', count: 230 },
  { id: 'lbl-9', name: 'Tele-Consultation', count: 54 }
];

export const SAVED_CONTACT_FILTERS = [
  {
    id: 'flt-1',
    name: 'Active Patients with Weekend Bookings',
    description: 'Labels: Weekend Sessions • Inbox: Agamagizh WhatsApp Main • Status: Active',
    candidateCount: 210,
    tags: ['Weekend Sessions', 'Active']
  },
  {
    id: 'flt-2',
    name: 'Follow-up Contacts (Adyar & Anna Nagar)',
    description: 'Labels: Follow-up, Adyar Branch • Last Activity < 7 days',
    candidateCount: 184,
    tags: ['Follow-up', 'Adyar']
  },
  {
    id: 'flt-3',
    name: 'New Enquiries Awaiting First Session',
    description: 'Labels: Enquiry • Inbox: Adyar Reception Desk • No appointment yet',
    candidateCount: 124,
    tags: ['Enquiry', 'Lead']
  },
  {
    id: 'flt-4',
    name: 'VIP Annual Care Members',
    description: 'Labels: VIP Client • Annual Plan Registered • High Response Rate',
    candidateCount: 68,
    tags: ['VIP Client', 'Priority']
  }
];

export const MOCK_DEFAULT_CSV: CsvParsedData = {
  fileName: 'follow_up_contacts_sept2026.csv',
  fileSize: '48.2 KB',
  rowsParsed: 250,
  validRows: 228,
  invalidRows: 8,
  duplicateRows: 14,
  sampleRows: [
    { name: 'Meera Sundaram', phone: '+91 98401 22345', customVal: '14 Sep, 10:30 AM' },
    { name: 'Dr. Anand Raman', phone: '+91 97910 88721', customVal: '15 Sep, 04:00 PM' },
    { name: 'Priya Krishnan', phone: '+91 98842 66512', customVal: '16 Sep, 11:15 AM' },
    { name: 'Sanjay Varma', phone: '+91 94440 99128', customVal: '16 Sep, 02:30 PM' },
    { name: 'Radhika Swaminathan', phone: '+91 98200 44109', customVal: '17 Sep, 09:30 AM' }
  ],
  issues: [
    { rowNumber: 14, phone: '+91 98401 22345', issue: 'Duplicate CSV row' },
    { rowNumber: 29, phone: '044 2445 0099', issue: 'Invalid destination format' },
    { rowNumber: 52, phone: '', issue: 'Missing phone number' },
    { rowNumber: 77, phone: '+91 97910 88721', issue: 'Duplicate CSV row' },
    { rowNumber: 104, phone: '984000000', issue: 'Invalid destination format' },
    { rowNumber: 161, phone: '', issue: 'Missing phone number' },
    { rowNumber: 198, phone: '+91 98401 92831', issue: 'Duplicate CSV row' },
    { rowNumber: 233, phone: '+1 415 555', issue: 'Invalid destination format' }
  ]
};

export const MOCK_PREFLIGHT_EXCLUSIONS: PreflightCandidateRecord[] = [
  // Missing Consent
  {
    id: 'exc-1',
    contactName: 'Ramesh Balasubramanian',
    destination: '+91 98400 11223',
    category: 'missing_consent',
    reason: 'Missing consent: Explicit opt-in record for WhatsApp broadcast not registered.',
    sourceContext: 'CRM Contact • Adyar Branch'
  },
  {
    id: 'exc-2',
    contactName: 'Sunita Chidambaram',
    destination: '+91 97909 33441',
    category: 'missing_consent',
    reason: 'Missing consent: User previously unsubscribed via keyword STOP.',
    sourceContext: 'CRM Contact • Follow-up'
  },
  {
    id: 'exc-3',
    contactName: 'Naveen Rajagopal',
    destination: '+91 98840 55662',
    category: 'missing_consent',
    reason: 'Missing consent: Outbound commercial consent expired (> 180 days).',
    sourceContext: 'Manual Contact'
  },
  {
    id: 'exc-4',
    contactName: 'Geetha Natarajan',
    destination: '+91 94441 77883',
    category: 'missing_consent',
    reason: 'Missing consent: Explicit opt-in record for WhatsApp broadcast not registered.',
    sourceContext: 'Saved Filter: Weekend Sessions'
  },

  // Suppressed
  {
    id: 'exc-5',
    contactName: 'Devi Saravanan',
    destination: '+91 94441 55667',
    category: 'suppressed',
    reason: 'Suppressed contact: Added to organizational do-not-disturb list.',
    sourceContext: 'Global Suppression Ledger'
  },
  {
    id: 'exc-6',
    contactName: 'Farhan Akhtar',
    destination: '+91 98201 99002',
    category: 'suppressed',
    reason: 'Suppressed contact: Temporary communication cooldown active for this profile.',
    sourceContext: 'Safety Policy Throttle'
  },
  {
    id: 'exc-7',
    contactName: 'Malini Sridhar',
    destination: '+91 98403 44556',
    category: 'suppressed',
    reason: 'Suppressed contact: Added to organizational do-not-disturb list.',
    sourceContext: 'Global Suppression Ledger'
  },

  // Duplicates
  {
    id: 'exc-8',
    contactName: 'Suresh Ramanathan (Duplicate #2)',
    destination: '+91 98401 92831',
    category: 'duplicates',
    reason: 'Duplicate recipient: Same phone number matched under multiple labels.',
    sourceContext: 'Matched in [VIP Client] and [Adyar Branch]'
  },
  {
    id: 'exc-9',
    contactName: 'Meera Sundaram (Duplicate #2)',
    destination: '+91 98401 22345',
    category: 'duplicates',
    reason: 'Duplicate recipient: Phone number already queued in this campaign batch.',
    sourceContext: 'CSV Row #14'
  },
  {
    id: 'exc-10',
    contactName: 'Dr. Anand Raman (Duplicate #2)',
    destination: '+91 97910 88721',
    category: 'duplicates',
    reason: 'Duplicate recipient: Phone number already queued in this campaign batch.',
    sourceContext: 'CSV Row #77'
  },

  // Invalid Destination
  {
    id: 'exc-11',
    contactName: 'Manojbhai Shah',
    destination: '+91 044 2445 0099',
    category: 'invalid_destination',
    reason: 'Invalid destination: Fixed landline number cannot receive WhatsApp messages.',
    sourceContext: 'CRM Contact • Velachery'
  },
  {
    id: 'exc-12',
    contactName: 'Kishore Kumar',
    destination: '+91 984000',
    category: 'invalid_destination',
    reason: 'Invalid destination: Incomplete E.164 phone number digits.',
    sourceContext: 'Manual Contact'
  },
  {
    id: 'exc-13',
    contactName: 'Unassigned Inquiry #82',
    destination: 'Unknown',
    category: 'invalid_destination',
    reason: 'Invalid destination: Missing primary phone field.',
    sourceContext: 'CSV Row #52'
  }
];

export function getMockPreflight(
  totalCandidates: number,
  audienceType: string,
  isBlocked: boolean = false
): CanonicalPreflightResult {
  if (isBlocked || totalCandidates === 0) {
    return {
      totalCandidates: totalCandidates,
      eligible: 0,
      missingConsent: Math.min(12, totalCandidates),
      suppressed: 5,
      duplicates: 14,
      invalidDestination: 7,
      exclusionRecords: MOCK_PREFLIGHT_EXCLUSIONS
    };
  }

  // Realistic proportional calculation
  const missingConsent = Math.max(1, Math.round(totalCandidates * 0.05));
  const suppressed = Math.max(1, Math.round(totalCandidates * 0.02));
  const duplicates = Math.max(2, Math.round(totalCandidates * 0.055));
  const invalidDestination = Math.max(1, Math.round(totalCandidates * 0.025));
  const totalExclusions = missingConsent + suppressed + duplicates + invalidDestination;
  const eligible = Math.max(0, totalCandidates - totalExclusions);

  return {
    totalCandidates,
    eligible,
    missingConsent,
    suppressed,
    duplicates,
    invalidDestination,
    exclusionRecords: MOCK_PREFLIGHT_EXCLUSIONS
  };
}

export const DETAILED_CAMPAIGN_RECIPIENTS: CampaignRecipientRecord[] = [
  {
    id: 'cr-1',
    campaignId: 'cmp-1',
    contactName: 'Meera Sundaram',
    destination: '+91 98401 22345',
    status: 'replied',
    lifecycleTime: 'Today 10:48 AM',
    attempts: 1,
    kind: 'successful'
  },
  {
    id: 'cr-2',
    campaignId: 'cmp-1',
    contactName: 'Suresh Ramanathan',
    destination: '+91 98401 92831',
    status: 'read',
    lifecycleTime: 'Today 10:42 AM',
    attempts: 1,
    kind: 'successful'
  },
  {
    id: 'cr-3',
    campaignId: 'cmp-1',
    contactName: 'Ananya Venkatesh',
    destination: '+91 97910 55432',
    status: 'delivered',
    lifecycleTime: 'Today 10:35 AM',
    attempts: 1,
    kind: 'successful'
  },
  {
    id: 'cr-4',
    campaignId: 'cmp-1',
    contactName: 'Venkatesh Balaji',
    destination: '+91 94440 33819',
    status: 'sent',
    lifecycleTime: 'Today 10:31 AM',
    attempts: 1,
    kind: 'successful'
  },
  {
    id: 'cr-5',
    campaignId: 'cmp-1',
    contactName: 'Kavita Menon',
    destination: '+91 98200 84912',
    status: 'queued',
    lifecycleTime: 'Today 10:30 AM',
    attempts: 0,
    kind: 'successful'
  },
  {
    id: 'cr-6',
    campaignId: 'cmp-1',
    contactName: 'Raghavan Pillai',
    destination: '+91 98400 99881',
    status: 'failed',
    lifecycleTime: 'Today 10:32 AM',
    attempts: 2,
    reason: 'Delivery failed: Recipient phone number not registered on WhatsApp network.',
    kind: 'delivery_failure'
  },
  {
    id: 'cr-7',
    campaignId: 'cmp-1',
    contactName: 'Manojbhai Shah',
    destination: '+91 044 2441 8800',
    status: 'failed',
    lifecycleTime: 'Today 10:31 AM',
    attempts: 1,
    reason: 'Meta Cloud API Error: Recipient phone number is a fixed landline number.',
    kind: 'delivery_failure'
  },
  {
    id: 'cr-8',
    campaignId: 'cmp-1',
    contactName: 'Devi Saravanan',
    destination: '+91 94441 55667',
    status: 'excluded',
    lifecycleTime: 'Preflight Check',
    attempts: 0,
    reason: 'Preflight exclusion: Contact suppressed via organizational do-not-disturb list.',
    kind: 'preflight_exclusion'
  },
  {
    id: 'cr-9',
    campaignId: 'cmp-1',
    contactName: 'Ramesh Balasubramanian',
    destination: '+91 98400 11223',
    status: 'excluded',
    lifecycleTime: 'Preflight Check',
    attempts: 0,
    reason: 'Preflight exclusion: Explicit opt-in consent record for broadcast messaging is missing.',
    kind: 'preflight_exclusion'
  },
  {
    id: 'cr-10',
    campaignId: 'cmp-1',
    contactName: 'Karthika Selvam',
    destination: '+91 98403 66778',
    status: 'replied',
    lifecycleTime: 'Today 11:05 AM',
    attempts: 1,
    kind: 'successful'
  },
  {
    id: 'cr-11',
    campaignId: 'cmp-1',
    contactName: 'Dr. Anand Raman',
    destination: '+91 97910 88721',
    status: 'read',
    lifecycleTime: 'Today 10:52 AM',
    attempts: 1,
    kind: 'successful'
  },
  {
    id: 'cr-12',
    campaignId: 'cmp-1',
    contactName: 'Farhan Akhtar',
    destination: '+91 98201 99002',
    status: 'excluded',
    lifecycleTime: 'Preflight Check',
    attempts: 0,
    reason: 'Preflight exclusion: Contact is under a 48-hour communication cooldown throttle.',
    kind: 'preflight_exclusion'
  }
];
