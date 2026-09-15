import { 
  TriggerDefinition, 
  FieldDefinition, 
  OperatorDefinition, 
  ActionDefinition, 
  AutomationRuleItem,
  FieldDataType 
} from './types';

export const AVAILABLE_INBOXES = [
  'Agamagizh WhatsApp Main',
  'Adyar Reception Desk',
  'Anna Nagar Hub Line',
  'Clinical Appointments Line'
];

export const AVAILABLE_TEAMS = [
  'Reception Desk',
  'Adyar Care Desk',
  'Customer Care',
  'Clinical Specialists',
  'Billing & Support'
];

export const AVAILABLE_AGENTS = [
  'Kavitha Sundaram',
  'Ragu MD',
  'Arun Kumar',
  'Divya Bharathi',
  'Dr. Priya Raman'
];

export const AVAILABLE_LABELS = [
  'Follow-up',
  'Urgent Attention',
  'Appointment Enquiry',
  'Adyar Branch',
  'Anna Nagar Branch',
  'VIP Client',
  'After Hours',
  'Inbound Lead',
  'Billing Query',
  'Feedback'
];

export const AVAILABLE_TRIGGERS: TriggerDefinition[] = [
  {
    type: 'conversation_created',
    label: 'Conversation Created',
    description: 'Fires when a new WhatsApp conversation is initiated by a contact or agent',
    defaultChannel: 'whatsapp',
    configurableFields: ['inbox']
  },
  {
    type: 'message_received',
    label: 'Message Received',
    description: 'Fires whenever an incoming WhatsApp message is delivered to an inbox',
    defaultChannel: 'whatsapp',
    configurableFields: ['inbox', 'messageDirection']
  },
  {
    type: 'conversation_updated',
    label: 'Conversation Updated',
    description: 'Fires when conversation status, priority, or metadata are updated',
    defaultChannel: 'whatsapp',
    configurableFields: ['inbox']
  },
  {
    type: 'contact_updated',
    label: 'Contact Updated',
    description: 'Fires when contact details, phone, or attributes are modified',
    defaultChannel: 'whatsapp',
    configurableFields: ['inbox']
  },
  {
    type: 'label_added',
    label: 'Label Added',
    description: 'Fires when a specific tag or classification label is attached',
    defaultChannel: 'whatsapp',
    configurableFields: ['inbox', 'targetLabel']
  }
];

export const AVAILABLE_FIELDS: FieldDefinition[] = [
  {
    id: 'contact_label',
    label: 'Contact Label',
    dataType: 'label',
    options: AVAILABLE_LABELS.map(l => ({ label: l, value: l }))
  },
  {
    id: 'message_text',
    label: 'Message Text',
    dataType: 'text',
    placeholder: 'e.g. appointment, urgent, timing...'
  },
  {
    id: 'conversation_status',
    label: 'Conversation Status',
    dataType: 'selection',
    options: [
      { label: 'Open', value: 'open' },
      { label: 'Resolved', value: 'resolved' },
      { label: 'Pending', value: 'pending' },
      { label: 'Snoozed', value: 'snoozed' }
    ]
  },
  {
    id: 'priority',
    label: 'Priority',
    dataType: 'selection',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
      { label: 'Urgent', value: 'urgent' }
    ]
  },
  {
    id: 'assigned_team',
    label: 'Assigned Team',
    dataType: 'selection',
    options: AVAILABLE_TEAMS.map(t => ({ label: t, value: t }))
  },
  {
    id: 'contact_name',
    label: 'Contact Name',
    dataType: 'text',
    placeholder: 'e.g. Meera'
  },
  {
    id: 'contact_phone',
    label: 'Contact Phone',
    dataType: 'text',
    placeholder: 'e.g. +91 98401'
  },
  {
    id: 'outside_business_hours',
    label: 'Outside Business Hours',
    dataType: 'boolean'
  },
  {
    id: 'is_first_contact',
    label: 'First Contact / New Client',
    dataType: 'boolean'
  }
];

export const OPERATORS_BY_DATA_TYPE: Record<FieldDataType, OperatorDefinition[]> = {
  text: [
    { value: 'contains', label: 'contains' },
    { value: 'does_not_contain', label: 'does not contain' },
    { value: 'is', label: 'is' },
    { value: 'is_not', label: 'is not' }
  ],
  selection: [
    { value: 'is', label: 'is' },
    { value: 'is_not', label: 'is not' }
  ],
  label: [
    { value: 'contains', label: 'contains' },
    { value: 'does_not_contain', label: 'does not contain' }
  ],
  boolean: [
    { value: 'is_true', label: 'is true' },
    { value: 'is_false', label: 'is false' }
  ]
};

export const AVAILABLE_ACTIONS: ActionDefinition[] = [
  {
    type: 'assign_conversation',
    label: 'Assign Conversation',
    description: 'Route conversation to a designated team or care agent',
    defaultParams: { targetType: 'team', targetValue: 'Reception Desk' }
  },
  {
    type: 'add_label',
    label: 'Add Label',
    description: 'Attach a classification label to the conversation',
    defaultParams: { label: 'Follow-up' }
  },
  {
    type: 'remove_label',
    label: 'Remove Label',
    description: 'Remove a specific label if previously attached',
    defaultParams: { label: 'Inbound Lead' }
  },
  {
    type: 'change_status',
    label: 'Change Status',
    description: 'Update the conversation state (Open, Resolved, Snoozed, Pending)',
    defaultParams: { status: 'open' }
  },
  {
    type: 'send_message',
    label: 'Send Message',
    description: 'Dispatch an automated acknowledgment or notification text',
    defaultParams: { messageText: '' }
  }
];

export const INITIAL_AUTOMATION_RULES: AutomationRuleItem[] = [
  {
    id: 'rule-1',
    name: 'Assign Follow-up Enquiries',
    description: 'Routes conversations flagged with Follow-up label directly to the Reception Desk.',
    status: 'Enabled',
    triggerType: 'conversation_created',
    triggerConfig: {
      channel: 'whatsapp',
      inbox: 'Agamagizh WhatsApp Main'
    },
    matchMode: 'ALL',
    conditions: [
      {
        id: 'c-101',
        field: 'contact_label',
        operator: 'contains',
        value: 'Follow-up'
      }
    ],
    actions: [
      {
        id: 'a-201',
        type: 'assign_conversation',
        params: { targetType: 'team', targetValue: 'Reception Desk' }
      },
      {
        id: 'a-202',
        type: 'add_label',
        params: { label: 'Appointment Enquiry' }
      }
    ],
    executionCount: 1420,
    lastUpdated: 'Updated 2h ago'
  },
  {
    id: 'rule-2',
    name: 'Tag Urgent Appointment Inquiries',
    description: 'Detects emergency and appointment keywords in inbound WhatsApp messages and escalates them immediately.',
    status: 'Enabled',
    triggerType: 'message_received',
    triggerConfig: {
      channel: 'whatsapp',
      inbox: 'Agamagizh WhatsApp Main',
      messageDirection: 'incoming'
    },
    matchMode: 'ANY',
    conditions: [
      {
        id: 'c-201',
        field: 'message_text',
        operator: 'contains',
        value: 'urgent'
      },
      {
        id: 'c-202',
        field: 'message_text',
        operator: 'contains',
        value: 'emergency'
      },
      {
        id: 'c-203',
        field: 'message_text',
        operator: 'contains',
        value: 'appointment'
      }
    ],
    actions: [
      {
        id: 'a-301',
        type: 'change_status',
        params: { status: 'open' }
      },
      {
        id: 'a-302',
        type: 'add_label',
        params: { label: 'Urgent Attention' }
      },
      {
        id: 'a-303',
        type: 'assign_conversation',
        params: { targetType: 'agent', targetValue: 'Kavitha Sundaram' }
      }
    ],
    executionCount: 642,
    lastUpdated: 'Updated yesterday'
  },
  {
    id: 'rule-3',
    name: 'After-Hours Auto-Acknowledgement',
    description: 'Informs clients reaching out past operational hours of our next clinic availability.',
    status: 'Enabled',
    triggerType: 'message_received',
    triggerConfig: {
      channel: 'whatsapp',
      inbox: 'Agamagizh WhatsApp Main',
      messageDirection: 'incoming'
    },
    matchMode: 'ALL',
    conditions: [
      {
        id: 'c-301',
        field: 'outside_business_hours',
        operator: 'is_true',
        value: 'true'
      }
    ],
    actions: [
      {
        id: 'a-401',
        type: 'send_message',
        params: {
          messageText: 'Vanakkam! Thank you for contacting Agamagizh. Our clinical consultation desks are currently closed (Operating hours: 08:30 AM to 07:30 PM IST). A care coordinator will attend to your message as soon as we reopen.'
        }
      },
      {
        id: 'a-402',
        type: 'add_label',
        params: { label: 'After Hours' }
      }
    ],
    executionCount: 3180,
    lastUpdated: 'Updated 3 days ago'
  },
  {
    id: 'rule-4',
    name: 'Auto-Resolve Inactive Snoozed Inquiries (48h)',
    description: 'Marks snoozed conversations resolved when no new follow-up response arrives.',
    status: 'Disabled',
    triggerType: 'conversation_updated',
    triggerConfig: {
      channel: 'whatsapp',
      inbox: 'Agamagizh WhatsApp Main'
    },
    matchMode: 'ALL',
    conditions: [
      {
        id: 'c-401',
        field: 'conversation_status',
        operator: 'is',
        value: 'snoozed'
      }
    ],
    actions: [
      {
        id: 'a-501',
        type: 'change_status',
        params: { status: 'resolved' }
      },
      {
        id: 'a-502',
        type: 'add_label',
        params: { label: 'Billing Query' }
      }
    ],
    executionCount: 194,
    lastUpdated: 'Updated Sep 10'
  },
  {
    id: 'rule-5',
    name: 'VIP Client Priority Routing',
    description: 'Dedicated routing rule for VIP clients to assign immediately to senior medical staff.',
    status: 'Draft',
    triggerType: 'conversation_created',
    triggerConfig: {
      channel: 'whatsapp',
      inbox: 'Agamagizh WhatsApp Main'
    },
    matchMode: 'ALL',
    conditions: [
      {
        id: 'c-501',
        field: 'contact_label',
        operator: 'contains',
        value: 'VIP Client'
      }
    ],
    actions: [
      {
        id: 'a-601',
        type: 'assign_conversation',
        params: { targetType: 'agent', targetValue: 'Ragu MD' }
      },
      {
        id: 'a-602',
        type: 'change_status',
        params: { status: 'open' }
      }
    ],
    executionCount: 0,
    lastUpdated: 'Updated just now'
  }
];
