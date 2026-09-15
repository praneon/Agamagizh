import { PipelineDefinition, PipelineItem, PipelineStage } from './types';

export const OPERATIONAL_STAGES: PipelineStage[] = [
  {
    id: 'new_enquiry',
    title: 'New Enquiry',
    color: '#6366F1', // Indigo/violet
    description: 'Incoming inquiry waiting for first response or qualification.',
    order: 1
  },
  {
    id: 'contacted',
    title: 'Contacted',
    color: '#0EA5E9', // Sky blue
    description: 'First reply sent, requirements and availability gathered.',
    order: 2
  },
  {
    id: 'follow_up',
    title: 'Follow-up',
    color: '#F59E0B', // Amber
    description: 'Awaiting client response, schedule clarification, or callback.',
    order: 3
  },
  {
    id: 'confirmed',
    title: 'Confirmed',
    color: '#10B981', // Emerald
    description: 'Slot or consultation confirmed, schedule details dispatched.',
    order: 4
  },
  {
    id: 'completed',
    title: 'Completed',
    color: '#8B5CF6', // Purple
    description: 'Enquiry cycle concluded, enrolled, or fulfilled.',
    order: 5
  }
];

export const PIPELINE_DEFINITIONS: PipelineDefinition[] = [
  {
    id: 'general_enquiries',
    name: 'General Enquiries',
    description: 'Operational intake pipeline for inquiries, appointments, and client communications.',
    stages: OPERATIONAL_STAGES
  },
  {
    id: 'follow_up_pipeline',
    name: 'Client Follow-up & Retention',
    description: 'Secondary pipeline for ongoing follow-up, feedback, and service renewals.',
    stages: [
      { id: 'feedback_due', title: 'Feedback Due', color: '#6366F1', description: 'Clients due for satisfaction check-in.', order: 1 },
      { id: 'follow_up_contacted', title: 'Review In-Progress', color: '#0EA5E9', description: 'Discussion underway regarding ongoing plan.', order: 2 },
      { id: 'renewal_confirmed', title: 'Renewal Confirmed', color: '#10B981', description: 'Extended plan or continued sessions confirmed.', order: 3 },
      { id: 'closed_archived', title: 'Closed / Archived', color: '#64748B', description: 'Engagement concluded.', order: 4 }
    ]
  }
];

export const INITIAL_PIPELINE_ITEMS: PipelineItem[] = [
  // Stage 1: New Enquiry (3 items)
  {
    id: 'item-1',
    stageId: 'new_enquiry',
    title: 'New Consultation Enquiry',
    contactName: 'Suresh Ramanathan',
    contactPhone: '+91 98401 92831',
    contactEmail: 'suresh.r@gmail.com',
    assignedAgent: 'Kavitha Sundaram',
    assignedTeam: 'Reception Team',
    labels: ['Adyar Branch', 'WhatsApp Inbound'],
    lastActivity: '12 min ago',
    channel: 'whatsapp',
    inbox: 'Agamagizh WhatsApp Main',
    recentNote: 'Inquired about weekend wellness consultation slots.',
    recentMessageSnippet: 'Hello, what are your available timings for Saturday morning in Adyar?',
    conversationId: 'conv-101',
    contactId: 'cnt-1'
  },
  {
    id: 'item-2',
    stageId: 'new_enquiry',
    title: 'Corporate Session Inquiry',
    contactName: 'Kavita Menon',
    contactPhone: '+91 98200 84912',
    contactEmail: 'kavita.menon@menonassociates.com',
    assignedAgent: 'Priya Narayanan',
    assignedTeam: 'Accounts Desk',
    labels: ['Corporate', 'High Priority'],
    lastActivity: '35 min ago',
    channel: 'whatsapp',
    inbox: 'Agamagizh WhatsApp Main',
    recentNote: 'Seeking institutional wellness workshop for 40 staff members.',
    recentMessageSnippet: 'Can you share the institutional proposal document with pricing details?',
    conversationId: 'conv-105',
    contactId: 'cnt-2'
  },
  {
    id: 'item-3',
    stageId: 'new_enquiry',
    title: 'Weekend Timings Question',
    contactName: 'Ramesh Krishnan',
    contactPhone: '+91 97890 12345',
    contactEmail: 'ramesh.k@yahoo.com',
    assignedAgent: 'Arunmozhi Rajan',
    assignedTeam: 'Reception Team',
    labels: ['New Lead', 'Website Inquiry'],
    lastActivity: '1h ago',
    channel: 'live_chat',
    inbox: 'Website Live Chat',
    recentNote: 'Client asked if parking is available at the center.',
    recentMessageSnippet: 'Is there dedicated parking available at the center?',
    conversationId: 'conv-106',
    contactId: 'cnt-3'
  },

  // Stage 2: Contacted (2 items)
  {
    id: 'item-4',
    stageId: 'contacted',
    title: 'Package Registration Request',
    contactName: 'Ananya Deshmukh',
    contactPhone: '+91 98842 11904',
    contactEmail: 'ananya.deshmukh@techcorp.in',
    assignedAgent: 'Priya Narayanan',
    assignedTeam: 'Accounts Desk',
    labels: ['VIP Client', 'Adyar Campus'],
    lastActivity: '45 min ago',
    channel: 'whatsapp',
    inbox: 'Agamagizh WhatsApp Main',
    recentNote: 'Shared standard registration brochure and slot sheet via WhatsApp.',
    recentMessageSnippet: 'Thank you Priya, reviewing the session packages with my team today.',
    conversationId: 'conv-103',
    contactId: 'cnt-4'
  },
  {
    id: 'item-5',
    stageId: 'contacted',
    title: 'Family Wellness Intake',
    contactName: 'Girish Chandran',
    contactPhone: '+91 99401 55620',
    contactEmail: 'girish.c@gmail.com',
    assignedAgent: 'Kavitha Sundaram',
    assignedTeam: 'Reception Team',
    labels: ['Family Plan', 'Anna Nagar'],
    lastActivity: '2h ago',
    channel: 'whatsapp',
    inbox: 'Agamagizh WhatsApp Main',
    recentNote: 'Sent availability for Dr. Ragu on Thursday evening.',
    recentMessageSnippet: 'Received the slot list, checking with my spouse regarding 4 PM.',
    conversationId: 'conv-107',
    contactId: 'cnt-5'
  },

  // Stage 3: Follow-up (Demonstrate large stage with 6 cards to test internal scrolling!)
  {
    id: 'item-6',
    stageId: 'follow_up',
    title: 'Callback for Saturday Consultation',
    contactName: 'Meera Sundaram',
    contactPhone: '+91 98401 22345',
    contactEmail: 'meera.sundaram@gmail.com',
    assignedAgent: 'Kavitha Sundaram',
    assignedTeam: 'Reception Team',
    labels: ['Follow-up', 'VIP Client'],
    lastActivity: '20 min ago',
    channel: 'whatsapp',
    inbox: 'Agamagizh WhatsApp Main',
    recentNote: 'Client requested callback after 11:30 AM once in office.',
    recentMessageSnippet: 'Please call me at 11:30 AM to finalize the appointment timing.',
    conversationId: 'conv-108',
    contactId: 'cnt-6'
  },
  {
    id: 'item-7',
    stageId: 'follow_up',
    title: 'Slot Confirmation Awaiting Client',
    contactName: 'Meenakshi Sundaram',
    contactPhone: '+91 97910 44821',
    contactEmail: 'meenakshi.s@outlook.com',
    assignedAgent: 'Arunmozhi Rajan',
    assignedTeam: 'Reception Team',
    labels: ['Reschedule', 'Anna Nagar'],
    lastActivity: '1h ago',
    channel: 'whatsapp',
    inbox: 'Agamagizh WhatsApp Main',
    recentNote: 'Offered Thursday 3:00 PM slot, awaiting final confirmation.',
    recentMessageSnippet: 'Thursday 3 PM works. Sending the confirmation in a moment.',
    conversationId: 'conv-102',
    contactId: 'cnt-7'
  },
  {
    id: 'item-8',
    stageId: 'follow_up',
    title: 'Documentation Review Required',
    contactName: 'Deepak Varma',
    contactPhone: '+91 94441 88920',
    contactEmail: 'deepak.varma@gmail.com',
    assignedAgent: 'Deepa Muthukumar',
    assignedTeam: 'Customer Care',
    labels: ['Adyar Branch', 'Documentation'],
    lastActivity: '3h ago',
    channel: 'whatsapp',
    inbox: 'Agamagizh WhatsApp Main',
    recentNote: 'Awaiting client to upload ID proof copy via WhatsApp.',
    recentMessageSnippet: 'I will scan and share the ID card this evening.',
    conversationId: 'conv-109',
    contactId: 'cnt-8'
  },
  {
    id: 'item-9',
    stageId: 'follow_up',
    title: 'Payment Link Resent',
    contactName: 'Nandhini Balasubramanian',
    contactPhone: '+91 98402 33410',
    contactEmail: 'nandhini.b@gmail.com',
    assignedAgent: 'Priya Narayanan',
    assignedTeam: 'Accounts Desk',
    labels: ['Payment Pending', 'Package 10-Sessions'],
    lastActivity: '4h ago',
    channel: 'whatsapp',
    inbox: 'Agamagizh WhatsApp Main',
    recentNote: 'UPI link dispatched, following up on transaction status.',
    recentMessageSnippet: 'Payment link received, completing it shortly.',
    conversationId: 'conv-110',
    contactId: 'cnt-9'
  },
  {
    id: 'item-10',
    stageId: 'follow_up',
    title: 'Branch Transfer Clarification',
    contactName: 'Karthik Sivakumar',
    contactPhone: '+91 97100 44219',
    contactEmail: 'karthik.s@gmail.com',
    assignedAgent: 'Arunmozhi Rajan',
    assignedTeam: 'Reception Team',
    labels: ['Branch Transfer', 'Velachery'],
    lastActivity: '5h ago',
    channel: 'whatsapp',
    inbox: 'Agamagizh WhatsApp Main',
    recentNote: 'Inquired if remaining sessions can be availed at Adyar center.',
    recentMessageSnippet: 'Can I attend the Saturday session at Adyar instead of Velachery?',
    conversationId: 'conv-111',
    contactId: 'cnt-10'
  },
  {
    id: 'item-11',
    stageId: 'follow_up',
    title: 'Reminder for Consultation Slot',
    contactName: 'Shalini Venkatesan',
    contactPhone: '+91 99620 18833',
    contactEmail: 'shalini.v@gmail.com',
    assignedAgent: 'Kavitha Sundaram',
    assignedTeam: 'Reception Team',
    labels: ['Routine Follow-up'],
    lastActivity: '6h ago',
    channel: 'whatsapp',
    inbox: 'Agamagizh WhatsApp Main',
    recentNote: 'Sent 24-hour reminder for Friday afternoon session.',
    recentMessageSnippet: 'Yes, I received the reminder message.',
    conversationId: 'conv-112',
    contactId: 'cnt-11'
  },

  // Stage 4: Confirmed (3 items)
  {
    id: 'item-12',
    stageId: 'confirmed',
    title: 'Saturday Slot Confirmed',
    contactName: 'Rajesh Subramanian',
    contactPhone: '+91 98410 77219',
    contactEmail: 'rajesh.subramanian@gmail.com',
    assignedAgent: 'Deepa Muthukumar',
    assignedTeam: 'Reception Team',
    labels: ['Adyar Campus', 'Pre-paid'],
    lastActivity: '4h ago',
    channel: 'whatsapp',
    inbox: 'Agamagizh WhatsApp Main',
    recentNote: 'Slot confirmed. Automated Google Maps location pin dispatched.',
    recentMessageSnippet: 'Got the location pin, will be there at 10:30 AM.',
    conversationId: 'conv-113',
    contactId: 'cnt-12'
  },
  {
    id: 'item-13',
    stageId: 'confirmed',
    title: 'Annual Plan Enrollment Confirmed',
    contactName: 'Venkatesh Balaji',
    contactPhone: '+91 94440 33819',
    contactEmail: 'v.balaji@chennaienterprises.com',
    assignedAgent: 'Deepa Muthukumar',
    assignedTeam: 'Accounts Desk',
    labels: ['VIP Client', 'Annual Member'],
    lastActivity: 'Yesterday',
    channel: 'whatsapp',
    inbox: 'Agamagizh WhatsApp Main',
    recentNote: 'Annual wellness agreement countersigned.',
    recentMessageSnippet: 'Agreement received, excited to continue with the center.',
    conversationId: 'conv-104',
    contactId: 'cnt-13'
  },
  {
    id: 'item-14',
    stageId: 'confirmed',
    title: 'Group Session Booking',
    contactName: 'Dr. Radhika Srinivasan',
    contactPhone: '+91 98409 66321',
    contactEmail: 'radhika.s@healthnet.org',
    assignedAgent: 'Priya Narayanan',
    assignedTeam: 'Accounts Desk',
    labels: ['Group Booking', 'Verified'],
    lastActivity: 'Yesterday',
    channel: 'whatsapp',
    inbox: 'Agamagizh WhatsApp Main',
    recentNote: 'Confirmed 8 participants for Friday afternoon workshop.',
    recentMessageSnippet: 'List of 8 attendees sent to reception.',
    conversationId: 'conv-114',
    contactId: 'cnt-14'
  },

  // Stage 5: Completed (1 item)
  {
    id: 'item-15',
    stageId: 'completed',
    title: 'Initial Intake Concluded',
    contactName: 'Bhavani Shankar',
    contactPhone: '+91 98840 77120',
    contactEmail: 'bhavani.s@gmail.com',
    assignedAgent: 'Kavitha Sundaram',
    assignedTeam: 'Reception Team',
    labels: ['Completed', 'Adyar Branch'],
    lastActivity: '2d ago',
    channel: 'whatsapp',
    inbox: 'Agamagizh WhatsApp Main',
    recentNote: 'Intake consultation concluded, transition to active member register completed.',
    recentMessageSnippet: 'Thank you for the warm reception today.',
    conversationId: 'conv-115',
    contactId: 'cnt-15'
  }
];

export const AVAILABLE_AGENTS = [
  'All Assignees',
  'Kavitha Sundaram',
  'Priya Narayanan',
  'Arunmozhi Rajan',
  'Deepa Muthukumar'
];

export const AVAILABLE_PIPELINE_LABELS = [
  'All Labels',
  'Adyar Branch',
  'VIP Client',
  'Corporate',
  'High Priority',
  'Reschedule',
  'Anna Nagar',
  'Pre-paid',
  'Family Plan'
];
