import { 
  Contact, 
  Company, 
  Conversation, 
  ClinicPipelineStage, 
  ClinicPipelineCard, 
  WhatsAppCampaign, 
  CampaignRecipient, 
  WhatsAppTemplate, 
  AutomationRule, 
  ChatbotFlow,
  AgentUser,
  WhatsAppChatbot,
  WhatsAppRule
} from '../types';

export const CURRENT_USER: AgentUser = {
  id: 'usr-1',
  name: 'Kavitha Sundaram',
  email: 'kavitha@agamagizh.org',
  avatar: 'KS',
  role: 'Administrator',
  status: 'online',
  assignedInboxCount: 14
};

export const AGENTS_LIST: AgentUser[] = [
  CURRENT_USER,
  { id: 'usr-2', name: 'Arunmozhi Rajan', email: 'arun@agamagizh.org', avatar: 'AR', role: 'Agent', status: 'online', assignedInboxCount: 8 },
  { id: 'usr-3', name: 'Priya Narayanan', email: 'priya@agamagizh.org', avatar: 'PN', role: 'Agent', status: 'busy', assignedInboxCount: 12 },
  { id: 'usr-4', name: 'Karthik Seshadri', email: 'karthik@agamagizh.org', avatar: 'KS', role: 'Agent', status: 'offline', assignedInboxCount: 5 },
  { id: 'usr-5', name: 'Deepa Muthukumar', email: 'deepa@agamagizh.org', avatar: 'DM', role: 'Agent', status: 'online', assignedInboxCount: 9 }
];

export const INBOXES_LIST = [
  { id: 'inbox-1', name: 'Agamagizh WhatsApp Main', channel: 'whatsapp', phone: '+91 98401 23456', email: 'care@agamagizh.org', status: 'connected', openConversationsCount: 14 },
  { id: 'inbox-2', name: 'Adyar Reception Desk', channel: 'whatsapp', phone: '+91 98402 34567', email: 'adyar@agamagizh.org', status: 'connected', openConversationsCount: 8 },
  { id: 'inbox-3', name: 'Website Live Chat', channel: 'live_chat', phone: '+91 98400 00001', email: 'support@agamagizh.org', status: 'connected', openConversationsCount: 6 },
  { id: 'inbox-4', name: 'Support Email', channel: 'email', phone: '+91 98400 00002', email: 'care@agamagizh.org', status: 'connected', openConversationsCount: 11 },
  { id: 'inbox-5', name: 'SMS Notifications', channel: 'sms', phone: '+91 98400 11223', email: 'sms@agamagizh.org', status: 'connected', openConversationsCount: 3 }
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'cnt-1',
    name: 'Meera Sundaram',
    email: 'meera.sundaram@gmail.com',
    phone: '+91 98401 22910',
    company: 'Sundaram & Co',
    lastActivity: '10:48 AM',
    status: 'active',
    labels: ['Timings', 'WhatsApp Main'],
    conversationsCount: 2,
    channel: 'whatsapp',
    location: 'Adyar, Chennai',
    customAttributes: {
      'Preferred Language': 'English / Tamil',
      'Client Tier': 'Standard',
      'Referral Source': 'Inbound WhatsApp'
    }
  },
  {
    id: 'cnt-2',
    name: 'Karthik Ramanathan',
    email: 'karthik.ram@outlook.com',
    phone: '+91 98402 88123',
    company: 'Self-employed',
    lastActivity: '9:15 AM',
    status: 'active',
    labels: ['Live Chat', 'Consultation'],
    conversationsCount: 1,
    channel: 'live_chat',
    location: 'Anna Nagar, Chennai',
    customAttributes: {
      'Preferred Language': 'English',
      'Client Tier': 'Priority Client',
      'Referral Source': 'Website Live Chat'
    }
  },
  {
    id: 'cnt-3',
    name: 'Ananya Venkatesh',
    email: 'ananya.v@techcorp.in',
    phone: '+91 97910 55432',
    company: 'TechCorp India',
    lastActivity: 'Yesterday',
    status: 'active',
    labels: ['Reschedule', 'WhatsApp Main'],
    conversationsCount: 3,
    channel: 'whatsapp',
    location: 'OMR Hub, Chennai',
    customAttributes: {
      'Preferred Language': 'Tamil / English',
      'Client Tier': 'Standard',
      'Referral Source': 'Inbound WhatsApp'
    }
  },
  {
    id: 'cnt-4',
    name: 'Suresh Ramanathan',
    email: 'suresh.ram@gmail.com',
    phone: '+91 98401 92831',
    company: 'Apex Health Network',
    lastActivity: 'Sep 12',
    status: 'active',
    labels: ['VIP Client', 'Adyar Branch'],
    conversationsCount: 4,
    channel: 'whatsapp',
    location: 'Chennai, Tamil Nadu',
    customAttributes: {
      'Preferred Language': 'English / Tamil',
      'Client Tier': 'Enterprise Account',
      'Referral Source': 'Direct Referral'
    }
  },
  {
    id: 'cnt-5',
    name: 'Venkatesh Balaji',
    email: 'venkat.b@yahoo.com',
    phone: '+91 94440 33819',
    company: 'Self-employed',
    lastActivity: '1d ago',
    status: 'active',
    labels: ['Regular Client', 'Feedback Given'],
    conversationsCount: 6,
    channel: 'whatsapp',
    location: 'Velachery, Chennai',
    customAttributes: {
      'Preferred Language': 'English',
      'Client Tier': 'Standard',
      'Referral Source': 'Physician Recommendation'
    }
  },
  {
    id: 'cnt-6',
    name: 'Kavita Menon',
    email: 'kavita.menon@gmail.com',
    phone: '+91 98200 84912',
    company: 'Menon Associates',
    lastActivity: '2d ago',
    status: 'active',
    labels: ['New Inquiry', 'Tele-Consultation'],
    conversationsCount: 1,
    channel: 'live_chat',
    location: 'Coimbatore, TN',
    customAttributes: {
      'Preferred Language': 'English',
      'Client Tier': 'Lead',
      'Referral Source': 'Google Organic Search'
    }
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'Apex Health Network',
    domain: 'apexhealth.in',
    industry: 'Healthcare Services',
    phone: '+91 44 2441 8800',
    address: 'Adyar Canal Bank Rd, Chennai',
    contactsCount: 14,
    openConversations: 2
  },
  {
    id: 'comp-2',
    name: 'Sundaram Wellness',
    domain: 'sundaramwellness.org',
    industry: 'Preventive Care',
    phone: '+91 44 2621 1120',
    address: 'Anna Nagar 2nd Avenue, Chennai',
    contactsCount: 6,
    openConversations: 1
  },
  {
    id: 'comp-3',
    name: 'TechCorp India',
    domain: 'techcorp.in',
    industry: 'Information Technology',
    phone: '+91 44 6677 8899',
    address: 'Tidel Park, OMR, Chennai',
    contactsCount: 22,
    openConversations: 4
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-101',
    contactId: 'cnt-1',
    contactName: 'Meera Sundaram',
    contactPhone: '+91 98401 22910',
    contactEmail: 'meera.sundaram@gmail.com',
    channel: 'whatsapp',
    status: 'open',
    priority: 'high',
    assignedAgent: 'Kavitha Sundaram',
    assignedTeam: 'Customer Care',
    labels: ['Timings', 'WhatsApp Main'],
    lastMessage: 'Could you share the clinic timings for Saturday?',
    lastTimestamp: '10:48 AM',
    unreadCount: 2,
    inbox: 'Agamagizh WhatsApp Main',
    messages: [
      {
        id: 'm1',
        sender: 'contact',
        text: 'Hello, good morning! Hope you are doing well.',
        timestamp: '10:30 AM',
        status: 'read'
      },
      {
        id: 'm2',
        sender: 'system',
        text: 'Conversation assigned to Kavitha Sundaram • Customer Care',
        timestamp: '10:31 AM'
      },
      {
        id: 'm3',
        sender: 'agent',
        senderName: 'Kavitha Sundaram',
        text: 'Good morning Meera! How can we assist you today?',
        timestamp: '10:35 AM',
        status: 'read'
      },
      {
        id: 'm4',
        sender: 'contact',
        text: 'Could you share the clinic timings for Saturday?',
        timestamp: '10:48 AM',
        status: 'delivered'
      },
      {
        id: 'm5',
        sender: 'agent',
        isPrivateNote: true,
        senderName: 'Kavitha Sundaram',
        text: 'Internal Note: Meera usually visits Adyar campus on weekends. Sending the revised weekend schedule sheet.',
        timestamp: '10:49 AM',
        status: 'read'
      },
      {
        id: 'm6',
        sender: 'agent',
        senderName: 'Kavitha Sundaram',
        text: 'Our clinic timings for Saturday are 08:30 AM to 07:30 PM. Attaching the updated weekend schedule below for your reference.',
        timestamp: '10:50 AM',
        status: 'delivered',
        attachments: [
          { name: 'Saturday-Clinic-Timings.pdf', type: 'pdf', size: '185 KB' }
        ]
      }
    ],
    customAttributes: {
      'Preferred Language': 'English / Tamil',
      'Branch Location': 'Adyar Main Campus',
      'Customer Tier': 'Standard',
      'Referral Source': 'Inbound WhatsApp'
    }
  },
  {
    id: 'conv-102',
    contactId: 'cnt-2',
    contactName: 'Karthik Ramanathan',
    contactPhone: '+91 98402 88123',
    contactEmail: 'karthik.ram@outlook.com',
    channel: 'live_chat',
    status: 'open',
    priority: 'medium',
    assignedAgent: 'Kavitha Sundaram',
    assignedTeam: 'Customer Care',
    labels: ['Website Live Chat', 'Consultation'],
    lastMessage: 'Thank you, that works for me.',
    lastTimestamp: '9:15 AM',
    unreadCount: 0,
    inbox: 'Website Live Chat',
    messages: [
      {
        id: 'm201',
        sender: 'contact',
        text: 'Hi there! Are slots open for tele-consultation this afternoon?',
        timestamp: '9:00 AM',
        status: 'read'
      },
      {
        id: 'm202',
        sender: 'agent',
        senderName: 'Kavitha Sundaram',
        text: 'Good morning Karthik! Yes, we have a slot open at 02:30 PM with Dr. Malathi.',
        timestamp: '9:10 AM',
        status: 'read'
      },
      {
        id: 'm203',
        sender: 'contact',
        text: 'Thank you, that works for me.',
        timestamp: '9:15 AM',
        status: 'read'
      }
    ],
    customAttributes: {
      'Preferred Language': 'English',
      'Branch Location': 'Anna Nagar Hub',
      'Customer Tier': 'Priority Client',
      'Referral Source': 'Website Live Chat'
    }
  },
  {
    id: 'conv-103',
    contactId: 'cnt-3',
    contactName: 'Ananya Venkatesh',
    contactPhone: '+91 97910 55432',
    contactEmail: 'ananya.v@techcorp.in',
    channel: 'whatsapp',
    status: 'pending',
    priority: 'medium',
    assignedAgent: 'Kavitha Sundaram',
    assignedTeam: 'Customer Care',
    labels: ['Reschedule', 'WhatsApp Main'],
    lastMessage: 'I would like to change my appointment time.',
    lastTimestamp: 'Yesterday',
    unreadCount: 0,
    inbox: 'Agamagizh WhatsApp Main',
    messages: [
      {
        id: 'm301',
        sender: 'agent',
        senderName: 'Kavitha Sundaram',
        text: 'Vanakkam Ananya, confirming your scheduled check-in for Thursday at 11:00 AM.',
        timestamp: 'Yesterday 3:20 PM',
        status: 'read'
      },
      {
        id: 'm302',
        sender: 'contact',
        text: 'I would like to change my appointment time.',
        timestamp: 'Yesterday 4:05 PM',
        status: 'delivered'
      },
      {
        id: 'm303',
        sender: 'system',
        text: 'Status updated to Pending • Waiting for slot preference',
        timestamp: 'Yesterday 4:06 PM'
      }
    ],
    customAttributes: {
      'Preferred Language': 'Tamil / English',
      'Branch Location': 'OMR Hub',
      'Customer Tier': 'Standard',
      'Referral Source': 'Inbound WhatsApp'
    }
  },
  {
    id: 'conv-104',
    contactId: 'cnt-4',
    contactName: 'Suresh Ramanathan',
    contactPhone: '+91 98401 92831',
    contactEmail: 'suresh.ram@gmail.com',
    channel: 'whatsapp',
    status: 'resolved',
    priority: 'low',
    assignedAgent: 'Kavitha Sundaram',
    assignedTeam: 'Customer Care',
    labels: ['VIP Client', 'Adyar Branch'],
    lastMessage: 'All details confirmed. Thank you!',
    lastTimestamp: 'Sep 12',
    unreadCount: 0,
    inbox: 'Agamagizh WhatsApp Main',
    messages: [
      {
        id: 'm401',
        sender: 'contact',
        text: 'Could you share the consolidated receipt for August?',
        timestamp: 'Sep 12 10:00 AM',
        status: 'read'
      },
      {
        id: 'm402',
        sender: 'agent',
        senderName: 'Kavitha Sundaram',
        text: 'Here is the requested receipt statement.',
        timestamp: 'Sep 12 10:15 AM',
        status: 'read',
        attachments: [
          { name: 'Agamagizh-Receipt-Aug2026.pdf', type: 'pdf', size: '142 KB' }
        ]
      },
      {
        id: 'm403',
        sender: 'contact',
        text: 'All details confirmed. Thank you!',
        timestamp: 'Sep 12 10:30 AM',
        status: 'read'
      },
      {
        id: 'm404',
        sender: 'system',
        text: 'Conversation marked as Resolved by Kavitha Sundaram',
        timestamp: 'Sep 12 10:31 AM'
      }
    ],
    customAttributes: {
      'Preferred Language': 'English / Tamil',
      'Branch Location': 'Adyar Main Campus',
      'Customer Tier': 'Enterprise Account',
      'Referral Source': 'Direct Referral'
    }
  },
  {
    id: 'conv-105',
    contactId: 'cnt-5',
    contactName: 'Venkatesh Balaji',
    contactPhone: '+91 94440 33819',
    contactEmail: 'venkat.b@yahoo.com',
    channel: 'whatsapp',
    status: 'pending',
    priority: 'medium',
    assignedAgent: 'Deepa Muthukumar',
    assignedTeam: 'Customer Care (Adyar)',
    labels: ['Regular Client'],
    lastMessage: 'Received the PDF exercise guidance sheet. Thank you!',
    lastTimestamp: '2 days ago',
    unreadCount: 0,
    inbox: 'Adyar Reception Desk',
    messages: [
      {
        id: 'm501',
        sender: 'contact',
        text: 'Received the PDF exercise guidance sheet. Thank you!',
        timestamp: '2 days ago',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-106',
    contactId: 'cnt-6',
    contactName: 'Kavita Menon',
    contactPhone: '+91 98200 84912',
    contactEmail: 'kavita.menon@gmail.com',
    channel: 'live_chat',
    status: 'open',
    priority: 'low',
    assignedAgent: 'Priya Narayanan',
    assignedTeam: 'Corporate Accounts',
    labels: ['New Inquiry'],
    lastMessage: 'Looking for wellness session details.',
    lastTimestamp: '3 days ago',
    unreadCount: 0,
    inbox: 'Website Live Chat',
    messages: [
      {
        id: 'm601',
        sender: 'contact',
        text: 'Looking for wellness session details for our firm.',
        timestamp: '3 days ago',
        status: 'read'
      }
    ]
  }
];

export const CLINIC_PIPELINE_STAGES: ClinicPipelineStage[] = [
  { id: 'lead_inquiry', title: 'New Leads & Inquiries', color: '#6366F1', description: 'Fresh inbound inquiries via WhatsApp, web chat, or referral.' },
  { id: 'contacted_qualified', title: 'Contacted & Qualified', color: '#0EA5E9', description: 'First contact established, requirements and location noted.' },
  { id: 'consultation_scheduled', title: 'Consultation Scheduled', color: '#EAB308', description: 'Session slot confirmed, reminders dispatched via WhatsApp.' },
  { id: 'active_client', title: 'Active Client / Enrolled', color: '#10B981', description: 'Ongoing regular consultations and operational check-ins.' },
  { id: 'retention_review', title: 'Review & Follow-up', color: '#8B5CF6', description: 'Quarterly review, survey follow-up, and program renewal.' }
];

export const CLINIC_PIPELINE_CARDS: ClinicPipelineCard[] = [
  {
    id: 'card-1',
    stageId: 'lead_inquiry',
    title: 'Consultation Inquiry - Adyar',
    contactName: 'Suresh Ramanathan',
    contactPhone: '+91 98401 92831',
    company: 'Apex Health Network',
    value: '₹3,500',
    assignedAgent: 'Kavitha Sundaram',
    priority: 'high',
    labels: ['VIP Client', 'Inbound WhatsApp'],
    nextActivity: 'Confirm Saturday 10:30 AM slot availability',
    lastContacted: '10m ago',
    conversationId: 'conv-101'
  },
  {
    id: 'card-2',
    stageId: 'lead_inquiry',
    title: 'Corporate Wellness Inquiry',
    contactName: 'Kavita Menon',
    contactPhone: '+91 98200 84912',
    company: 'Menon Associates',
    value: '₹45,000',
    assignedAgent: 'Priya Narayanan',
    priority: 'medium',
    labels: ['Web Inquiry', 'Corporate'],
    nextActivity: 'Send institutional brochure via WhatsApp',
    lastContacted: '2h ago'
  },
  {
    id: 'card-3',
    stageId: 'contacted_qualified',
    title: 'Appointment Time Change Request',
    contactName: 'Meenakshi Sundaram',
    contactPhone: '+91 97910 44821',
    company: 'Sundaram Wellness',
    value: '₹2,800',
    assignedAgent: 'Arunmozhi Rajan',
    priority: 'urgent',
    labels: ['Reschedule', 'Anna Nagar'],
    nextActivity: 'Reschedule to Thursday 3:00 PM',
    lastContacted: '1h ago',
    conversationId: 'conv-102'
  },
  {
    id: 'card-4',
    stageId: 'consultation_scheduled',
    title: 'Confirmed Saturday Visit',
    contactName: 'Rajesh Subramanian',
    contactPhone: '+91 98410 77219',
    company: 'Self',
    value: '₹3,500',
    assignedAgent: 'Deepa Muthukumar',
    priority: 'high',
    labels: ['Adyar Campus', 'Pre-paid'],
    nextActivity: 'Send automated location pin via WhatsApp',
    lastContacted: '4h ago'
  },
  {
    id: 'card-5',
    stageId: 'active_client',
    title: 'Ongoing Wellness Package',
    contactName: 'Venkatesh Balaji',
    contactPhone: '+91 94440 33819',
    company: 'Self-employed',
    value: '₹18,000',
    assignedAgent: 'Deepa Muthukumar',
    priority: 'medium',
    labels: ['Package 10-Sessions', 'Velachery'],
    nextActivity: 'Session 6 review note due next Monday',
    lastContacted: '1d ago',
    conversationId: 'conv-104'
  },
  {
    id: 'card-6',
    stageId: 'retention_review',
    title: 'Quarterly Corporate Review',
    contactName: 'Ananya Deshmukh',
    contactPhone: '+91 98842 11904',
    company: 'TechCorp India',
    value: '₹85,000',
    assignedAgent: 'Priya Narayanan',
    priority: 'high',
    labels: ['Enterprise', 'Contract Renewal'],
    nextActivity: 'Q4 Renewal discussion scheduled',
    lastContacted: 'Yesterday',
    conversationId: 'conv-103'
  }
];

export const INITIAL_CAMPAIGNS: WhatsAppCampaign[] = [
  {
    id: 'cmp-1',
    title: 'Q4 Center Operational Timings & Holiday Notice',
    channelInbox: 'Agamagizh WhatsApp Main',
    status: 'completed',
    audienceType: 'labels',
    audienceSummary: 'Targeted: Labels [Adyar Branch, Anna Nagar Hub]',
    templateId: 'tpl-1',
    templateName: 'holiday_schedule_update_2026',
    scheduledAt: '2026-09-10 09:00 AM',
    totalRecipients: 420,
    sentCount: 420,
    deliveredCount: 412,
    readCount: 388,
    repliedCount: 64,
    failedCount: 8,
    excludedCount: 14,
    createdAt: '2026-09-08'
  },
  {
    id: 'cmp-2',
    title: 'October Health & Wellness Workshop Announcement',
    channelInbox: 'Agamagizh WhatsApp Main',
    status: 'running',
    audienceType: 'csv',
    audienceSummary: 'Uploaded CSV (oct_registered_clients.csv)',
    templateId: 'tpl-2',
    templateName: 'event_invitation_wellness_v1',
    scheduledAt: 'Today 10:00 AM',
    totalRecipients: 650,
    sentCount: 520,
    deliveredCount: 498,
    readCount: 395,
    repliedCount: 42,
    failedCount: 12,
    excludedCount: 28,
    createdAt: '2026-09-13'
  },
  {
    id: 'cmp-3',
    title: 'Weekend Consultation Reminders',
    channelInbox: 'Adyar Reception Desk',
    status: 'scheduled',
    audienceType: 'saved_filter',
    audienceSummary: 'Saved Filter: Scheduled for Saturday',
    templateId: 'tpl-3',
    templateName: 'appointment_reminder_bilingual',
    scheduledAt: 'Friday 06:00 PM',
    totalRecipients: 84,
    sentCount: 0,
    deliveredCount: 0,
    readCount: 0,
    repliedCount: 0,
    failedCount: 0,
    excludedCount: 2,
    createdAt: '2026-09-14'
  },
  {
    id: 'cmp-4',
    title: 'Annual Client Satisfaction Feedback Survey',
    channelInbox: 'Agamagizh WhatsApp Main',
    status: 'draft',
    audienceType: 'manual',
    audienceSummary: 'Manual Contact Selection (45 contacts)',
    templateId: 'tpl-4',
    templateName: 'csat_feedback_request',
    totalRecipients: 45,
    sentCount: 0,
    deliveredCount: 0,
    readCount: 0,
    repliedCount: 0,
    failedCount: 0,
    excludedCount: 0,
    createdAt: '2026-09-14'
  }
];

export const CAMPAIGN_RECIPIENTS_SAMPLE: CampaignRecipient[] = [
  { id: 'rec-1', campaignId: 'cmp-1', contactName: 'Suresh Ramanathan', phone: '+91 98401 92831', status: 'read', lifecycleTime: '10:14 AM' },
  { id: 'rec-2', campaignId: 'cmp-1', contactName: 'Meenakshi Sundaram', phone: '+91 97910 44821', status: 'read', lifecycleTime: '10:18 AM' },
  { id: 'rec-3', campaignId: 'cmp-1', contactName: 'Ananya Deshmukh', phone: '+91 98842 11904', status: 'delivered', lifecycleTime: '10:15 AM' },
  { id: 'rec-4', campaignId: 'cmp-1', contactName: 'Venkatesh Balaji', phone: '+91 94440 33819', status: 'read', lifecycleTime: '10:30 AM' },
  { id: 'rec-5', campaignId: 'cmp-1', contactName: 'Raghavan Pillai', phone: '+91 98400 99881', status: 'failed', lifecycleTime: '10:12 AM', reason: 'Phone number not registered on WhatsApp' },
  { id: 'rec-6', campaignId: 'cmp-1', contactName: 'Devi Saravanan', phone: '+91 94441 55667', status: 'excluded', lifecycleTime: '10:10 AM', reason: 'Contact opted out of broadcast messaging' },
  { id: 'rec-7', campaignId: 'cmp-1', contactName: 'Bala Chandran', phone: '+91 98840 22331', status: 'delivered', lifecycleTime: '10:16 AM' },
  { id: 'rec-8', campaignId: 'cmp-1', contactName: 'Nithya Krishnan', phone: '+91 97909 88123', status: 'read', lifecycleTime: '10:45 AM' },
  { id: 'rec-9', campaignId: 'cmp-1', contactName: 'Manojbhai Shah', phone: '+91 98201 33445', status: 'failed', lifecycleTime: '10:13 AM', reason: 'Meta Cloud API Error: Recipient phone number format invalid' },
  { id: 'rec-10', campaignId: 'cmp-1', contactName: 'Karthika Selvam', phone: '+91 98403 66778', status: 'read', lifecycleTime: '11:02 AM' }
];

export const INITIAL_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl-1',
    name: 'holiday_schedule_update_2026',
    category: 'UTILITY',
    language: 'English (en)',
    status: 'approved',
    source: 'provider',
    isCampaignEligible: true,
    lastSyncedAt: 'Today 09:00 AM',
    header: { type: 'text', text: 'Agamagizh Operational Announcement' },
    body: 'Dear {{1}},\n\nPlease note our clinic operational timings for the upcoming holiday on {{2}}. Our Adyar and Anna Nagar centers will be open for pre-scheduled sessions between {{3}}.\n\nFor emergency support, reach our floor manager at +91 44 2445 0099.',
    footer: 'Agamagizh Care Operations',
    buttons: [
      { type: 'QUICK_REPLY', text: 'Confirm Timing' },
      { type: 'URL', text: 'View Holiday Roster', value: 'https://agamagizh.org/schedule' }
    ]
  },
  {
    id: 'tpl-2',
    name: 'event_invitation_wellness_v1',
    category: 'MARKETING',
    language: 'English (en)',
    status: 'approved',
    source: 'provider',
    isCampaignEligible: true,
    lastSyncedAt: 'Yesterday 04:15 PM',
    header: { type: 'image' },
    body: 'Hello {{1}}!\n\nYou are cordially invited to our upcoming Community Workshop on {{2}} at our {{3}} branch. Topic: "Holistic Development & Family Wellness".\n\nSeats are limited. Reply YES to reserve your place.',
    footer: 'Agamagizh Community Programs',
    buttons: [
      { type: 'QUICK_REPLY', text: 'Reserve My Seat' },
      { type: 'QUICK_REPLY', text: 'More Details' }
    ]
  },
  {
    id: 'tpl-3',
    name: 'appointment_reminder_bilingual',
    category: 'UTILITY',
    language: 'English / Tamil (en_IN)',
    status: 'approved',
    source: 'provider',
    isCampaignEligible: true,
    lastSyncedAt: '12 Sep 2026',
    header: { type: 'text', text: 'Agamagizh Appointment Reminder' },
    body: 'Vanakkam {{1}},\n\nThis is a friendly reminder of your confirmed session on {{2}} at {{3}} with {{4}} at {{5}}.\n\nதயவுசெய்து நேரத்திற்கு 10 நிமிடம் முன் வரவும்.\n\nPlease reply 1 to Confirm or 2 to Reschedule.',
    footer: 'Agamagizh Operations Desk',
    buttons: [
      { type: 'QUICK_REPLY', text: '1 - Confirm Slot' },
      { type: 'QUICK_REPLY', text: '2 - Request Reschedule' }
    ]
  },
  {
    id: 'tpl-4',
    name: 'csat_feedback_request',
    category: 'UTILITY',
    language: 'English (en)',
    status: 'pending',
    source: 'provider',
    isCampaignEligible: false,
    lastSyncedAt: 'Today 10:20 AM',
    header: { type: 'none' },
    body: 'Dear {{1}},\n\nThank you for visiting Agamagizh. How would you rate your experience today with our team on a scale of 1 to 5?\n\nYour feedback helps us continuously elevate our service quality.',
    footer: 'Agamagizh Quality Assurance',
    buttons: [
      { type: 'QUICK_REPLY', text: '⭐⭐⭐⭐⭐ 5 Stars' },
      { type: 'QUICK_REPLY', text: 'Need Assistance' }
    ]
  },
  {
    id: 'tpl-5',
    name: 'promotional_discount_draft',
    category: 'MARKETING',
    language: 'English (en)',
    status: 'local_draft',
    source: 'local_draft',
    isCampaignEligible: false,
    header: { type: 'text', text: 'Special Offer' },
    body: 'Hi {{1}}, take advantage of 20% off on all annual wellness registrations this month for {{2}}.',
    footer: 'Agamagizh Wellness Plans'
  },
  {
    id: 'tpl-6',
    name: 'direct_medical_claim_rejected',
    category: 'MARKETING',
    language: 'English (en)',
    status: 'rejected',
    source: 'provider',
    isCampaignEligible: false,
    lastSyncedAt: '10 Sep 2026',
    rejectionReason: 'Meta Cloud API Policy Violation: Contains unverified therapeutic guarantees and direct medical assertions prohibited under WhatsApp Commerce Guidelines.',
    header: { type: 'none' },
    body: 'Hello {{1}}, our clinical therapies are guaranteed to cure all persistent pain symptoms within 3 visits. Book your package today!',
    footer: 'Rejection Reason: Commerce Policy Violation 2.1'
  }
];

export const INITIAL_WHATSAPP_RULES: WhatsAppRule[] = [
  {
    id: 'rule-1',
    name: 'Auto-Assign Inbound WhatsApp to Adyar Desk',
    description: 'When a new WhatsApp conversation arrives from Adyar contacts, assign to Adyar Reception Team and tag VIP if eligible.',
    isEnabled: true,
    eventTrigger: 'Inbound WhatsApp Message',
    conditions: ['Inbox equals "Agamagizh WhatsApp Main"', 'Contact Label contains "Adyar"'],
    actions: ['Assign to "Adyar Care Desk"', 'Add Tag "Adyar Branch"'],
    channelInbox: 'Agamagizh WhatsApp Main',
    executionCount: 1420
  },
  {
    id: 'rule-2',
    name: 'Tag Urgent Inquiries & Notify Lead Agent',
    description: 'When an incoming message contains keywords like "emergency", "urgent", or "cancel today", raise priority and tag urgent.',
    isEnabled: true,
    eventTrigger: 'Message Content Matches',
    conditions: ['Text contains "urgent" OR "emergency" OR "cancel today"'],
    actions: ['Set Priority: High', 'Assign Agent "Kavitha Sundaram"'],
    channelInbox: 'Agamagizh WhatsApp Main',
    executionCount: 284
  },
  {
    id: 'rule-3',
    name: 'After-Hours Auto-Acknowledgement',
    description: 'Send automated off-hours template message when messages arrive outside 08:30 AM - 07:30 PM IST.',
    isEnabled: true,
    eventTrigger: 'Message Arrived Outside Business Hours',
    conditions: ['Time is between 07:30 PM and 08:30 AM IST'],
    actions: ['Dispatch Template "after_hours_auto_reply"'],
    channelInbox: 'Agamagizh WhatsApp Main',
    executionCount: 3491
  }
];

export const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'rule-1',
    title: 'Auto-Assign Inbound WhatsApp to Adyar Desk',
    description: 'When a new WhatsApp conversation arrives from Adyar contacts, assign to Adyar Reception Team and tag VIP if eligible.',
    enabled: true,
    status: 'published',
    trigger: 'conversation_created',
    conditionMatch: 'ALL',
    conditions: [
      { attribute: 'inbox_name', operator: 'equals', value: 'Agamagizh WhatsApp Main' },
      { attribute: 'contact_labels', operator: 'contains', value: 'Adyar' }
    ],
    actions: [
      { action: 'assign_team', params: { team: 'Customer Care (Adyar)' } },
      { action: 'add_label', params: { label: 'Adyar Branch' } }
    ],
    executionCount: 1420,
    lastTriggered: '12m ago'
  },
  {
    id: 'rule-2',
    title: 'Tag Urgent Inquiries & Notify Lead Agent',
    description: 'When an incoming message contains keywords like "emergency", "urgent", or "cancel today", raise priority and tag urgent.',
    enabled: true,
    status: 'published',
    trigger: 'message_created',
    conditionMatch: 'ANY',
    conditions: [
      { attribute: 'message_content', operator: 'contains', value: 'urgent' },
      { attribute: 'message_content', operator: 'contains', value: 'emergency' },
      { attribute: 'message_content', operator: 'contains', value: 'cancel today' }
    ],
    actions: [
      { action: 'add_label', params: { label: 'Urgent Attention' } },
      { action: 'assign_agent', params: { agent: 'Kavitha Sundaram' } }
    ],
    executionCount: 284,
    lastTriggered: '1h ago'
  },
  {
    id: 'rule-3',
    title: 'After-Hours Auto-Acknowledgement',
    description: 'Send automated off-hours template message when messages arrive outside 08:00 AM - 08:00 PM IST.',
    enabled: true,
    status: 'published',
    trigger: 'message_created',
    conditionMatch: 'ALL',
    conditions: [
      { attribute: 'business_hours_status', operator: 'equals', value: 'offline' }
    ],
    actions: [
      { action: 'send_message', params: { template: 'after_hours_auto_reply' } }
    ],
    executionCount: 3491,
    lastTriggered: 'Yesterday 10:45 PM'
  },
  {
    id: 'rule-4',
    title: 'Auto-Resolve Inactive Conversations after 48h',
    description: 'When conversation is snoozed and no reply received in 48 hours, automatically mark resolved.',
    enabled: false,
    status: 'paused',
    trigger: 'conversation_status_changed',
    conditionMatch: 'ALL',
    conditions: [
      { attribute: 'status', operator: 'equals', value: 'snoozed' }
    ],
    actions: [
      { action: 'resolve_conversation', params: { note: 'Auto-resolved after 48 hours inactivity' } }
    ],
    executionCount: 95,
    lastTriggered: '3 days ago'
  }
];

export const INITIAL_CHATBOTS: WhatsAppChatbot[] = [
  {
    id: 'bot-1',
    name: 'Front-Desk Reception Bot',
    channelInbox: 'Agamagizh WhatsApp Main',
    triggerKeyword: 'Any initial inbound WhatsApp message',
    status: 'active',
    description: 'Greets inbound contacts, presents center options, and auto-routes to Adyar or Anna Nagar specialists.',
    triggersCount: 4180,
    steps: [
      {
        id: 's1',
        stepNumber: 1,
        type: 'send_message',
        prompt: 'Vanakkam! Welcome to Agamagizh Center. How may we assist your family today?',
        options: ['1 - Book Consultation', '2 - Center Timings & Directions', '3 - Speak to Coordinator']
      },
      {
        id: 's2',
        stepNumber: 2,
        type: 'branch_choice',
        prompt: 'Please select an option (1, 2, or 3).'
      },
      {
        id: 's3',
        stepNumber: 3,
        type: 'handoff_agent',
        prompt: 'Connecting you to our Adyar Care Desk coordinator. Please hold on a moment...',
        targetAction: 'Assign to Adyar Care Desk'
      }
    ]
  },
  {
    id: 'bot-2',
    name: 'After-Hours Auto-Responder',
    channelInbox: 'Agamagizh WhatsApp Main',
    triggerKeyword: 'Messages received outside 08:30 AM - 07:30 PM IST',
    status: 'active',
    description: 'Acknowledges late-evening caregiver inquiries and queues high priority morning callbacks.',
    triggersCount: 1690,
    steps: [
      {
        id: 's2-1',
        stepNumber: 1,
        type: 'send_message',
        prompt: 'Thank you for reaching out! Our centers are closed for the evening. Operating hours are Mon-Sat 08:30 AM to 07:30 PM. Our team will contact you first thing in the morning.'
      }
    ]
  }
];

export const INITIAL_CHATBOT: ChatbotFlow = {
  id: 'bot-1',
  name: 'Agamagizh Front-Desk Reception Bot',
  description: 'Greets inbound WhatsApp contacts, collects inquiry details, and routes to the correct clinic branch or agent.',
  status: 'published',
  version: 'v2.4',
  lastModified: '2026-09-12',
  nodes: [
    {
      id: 'node-start',
      type: 'start',
      title: 'Inbound Conversation Trigger',
      content: { messageText: 'Triggered when user sends any first message on WhatsApp' },
      x: 100,
      y: 120
    },
    {
      id: 'node-welcome',
      type: 'message',
      title: 'Welcome Greeting',
      content: { messageText: 'Vanakkam! Welcome to Agamagizh Console. How may we assist your visit today?' },
      x: 100,
      y: 260
    },
    {
      id: 'node-branch-choice',
      type: 'choice',
      title: 'Branch / Inquiry Selector',
      content: {
        choices: [
          '1 - Book New Appointment',
          '2 - Reschedule Visit',
          '3 - Center Timings & Directions',
          '4 - Speak with Live Specialist'
        ]
      },
      x: 100,
      y: 400
    },
    {
      id: 'node-timings',
      type: 'message',
      title: 'Share Timings & Location',
      content: { messageText: 'Our Adyar and Anna Nagar centers are open Mon-Sat 08:30 AM to 07:30 PM. Location details: https://agamagizh.org/centers' },
      x: 350,
      y: 540
    },
    {
      id: 'node-handoff',
      type: 'handoff',
      title: 'Handoff to Desk Agent',
      content: { handoffTeam: 'Customer Care (Adyar)', messageText: 'Connecting you to our care coordinator. Please hold on a moment...' },
      x: -120,
      y: 540
    },
    {
      id: 'node-end',
      type: 'end',
      title: 'Conversation Resolved',
      content: { messageText: 'Thank you for contacting Agamagizh!' },
      x: 100,
      y: 700
    }
  ],
  edges: [
    { id: 'e1', source: 'node-start', target: 'node-welcome' },
    { id: 'e2', source: 'node-welcome', target: 'node-branch-choice' },
    { id: 'e3', source: 'node-branch-choice', target: 'node-handoff', label: 'Option 1, 2, 4' },
    { id: 'e4', source: 'node-branch-choice', target: 'node-timings', label: 'Option 3' },
    { id: 'e5', source: 'node-timings', target: 'node-end' }
  ]
};

export const OPERATIONAL_ANALYTICS_DATA = {
  kpis: {
    sent: 12480,
    delivered: 12210,
    read: 10840,
    replied: 3410,
    failed: 180,
    excluded: 90
  },
  deliveryRate: '97.8%',
  readRate: '88.8%',
  replyRate: '31.4%',
  averageResponseTime: '12m 40s',
  firstResponseTime: '4m 15s',
  csatScore: '94.8%'
};
