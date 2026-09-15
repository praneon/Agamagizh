import { FlowNode, FlowEdge, ChatbotProject, StarterTemplate } from './types';

// Flagship Simple Demo Flow: Horizontal Left-to-Right layout
export const SIMPLE_DEMO_NODES: FlowNode[] = [
  {
    id: 'node-start',
    type: 'start',
    x: 40,
    y: 220,
    data: {
      title: 'Start',
      messageText: 'Inbound WhatsApp conversation'
    }
  },
  {
    id: 'node-welcome',
    type: 'message',
    x: 275,
    y: 220,
    data: {
      title: 'Send Message',
      messageText: 'Vanakkam! How can we help you today?'
    }
  },
  {
    id: 'node-choice',
    type: 'choice',
    x: 510,
    y: 170,
    data: {
      title: 'Choice',
      questionText: 'What would you like help with?',
      choices: [
        { id: 'opt-appt', label: 'Appointment enquiry', targetNodeId: 'node-appt-msg' },
        { id: 'opt-timings', label: 'Clinic timings', targetNodeId: 'node-timings-msg' },
        { id: 'opt-person', label: 'Speak to a person', targetNodeId: 'node-handoff' }
      ]
    }
  },
  // Branch 1: Appointment enquiry (Top lane)
  {
    id: 'node-appt-msg',
    type: 'message',
    x: 755,
    y: 40,
    data: {
      title: 'Send Message',
      messageText: "I'll help you with appointment information."
    }
  },
  {
    id: 'node-end-appt',
    type: 'end',
    x: 990,
    y: 40,
    data: {
      title: 'End',
      endSummary: 'Finish this path'
    }
  },
  // Branch 2: Clinic timings (Middle lane)
  {
    id: 'node-timings-msg',
    type: 'message',
    x: 755,
    y: 220,
    data: {
      title: 'Send Message',
      messageText: 'Our team can share the latest clinic timings.'
    }
  },
  {
    id: 'node-end-timings',
    type: 'end',
    x: 990,
    y: 220,
    data: {
      title: 'End',
      endSummary: 'Finish this path'
    }
  },
  // Branch 3: Speak to a person (Bottom lane)
  {
    id: 'node-handoff',
    type: 'handoff',
    x: 755,
    y: 400,
    data: {
      title: 'Handoff',
      handoff: {
        destinationType: 'team',
        target: 'Reception Team'
      }
    }
  },
  {
    id: 'node-end-handoff',
    type: 'end',
    x: 990,
    y: 400,
    data: {
      title: 'End',
      endSummary: 'Finish this path'
    }
  }
];

export const SIMPLE_DEMO_EDGES: FlowEdge[] = [
  {
    id: 'edge-start-welcome',
    source: 'node-start',
    sourceHandle: 'default',
    target: 'node-welcome',
    label: 'Next'
  },
  {
    id: 'edge-welcome-choice',
    source: 'node-welcome',
    sourceHandle: 'default',
    target: 'node-choice',
    label: 'Next'
  },
  {
    id: 'edge-choice-appt',
    source: 'node-choice',
    sourceHandle: 'opt-appt',
    target: 'node-appt-msg',
    label: 'Appointment enquiry'
  },
  {
    id: 'edge-appt-end',
    source: 'node-appt-msg',
    sourceHandle: 'default',
    target: 'node-end-appt',
    label: 'Next'
  },
  {
    id: 'edge-choice-timings',
    source: 'node-choice',
    sourceHandle: 'opt-timings',
    target: 'node-timings-msg',
    label: 'Clinic timings'
  },
  {
    id: 'edge-timings-end',
    source: 'node-timings-msg',
    sourceHandle: 'default',
    target: 'node-end-timings',
    label: 'Next'
  },
  {
    id: 'edge-choice-person',
    source: 'node-choice',
    sourceHandle: 'opt-person',
    target: 'node-handoff',
    label: 'Speak to a person'
  },
  {
    id: 'edge-handoff-end',
    source: 'node-handoff',
    sourceHandle: 'default',
    target: 'node-end-handoff',
    label: 'Next'
  }
];

// =====================================================================
// ALL NODES DEMO (BRANCHING DEMO)
// Demonstrates every supported core node:
// Start, Message, Question, Choice, Condition (True/False), Wait, Handoff, End
// Clean horizontal non-crossing layout
// =====================================================================
export const ALL_NODES_DEMO_NODES: FlowNode[] = [
  // Linear Spine: Start -> Message -> Question -> Choice
  {
    id: 'an-start',
    type: 'start',
    x: 40,
    y: 240,
    data: {
      title: 'Start',
      messageText: 'Inbound WhatsApp conversation'
    }
  },
  {
    id: 'an-welcome',
    type: 'message',
    x: 275,
    y: 240,
    data: {
      title: 'Send Message',
      messageText: 'Vanakkam! Welcome to Agamagizh Health Center.'
    }
  },
  {
    id: 'an-patient-name',
    type: 'question',
    x: 510,
    y: 240,
    data: {
      title: 'Ask Question',
      questionText: 'Could you please share your full name?',
      saveResponseAs: 'contact.name',
      answerType: 'text'
    }
  },
  {
    id: 'an-choice-main',
    type: 'choice',
    x: 745,
    y: 190,
    data: {
      title: 'Choice',
      questionText: 'How can our clinic help you today, {{contact.name}}?',
      choices: [
        { id: 'opt-appt', label: 'Appointment enquiry', targetNodeId: 'an-dept-question' },
        { id: 'opt-timings', label: 'Clinic timings', targetNodeId: 'an-timings-msg' },
        { id: 'opt-person', label: 'Speak to a person', targetNodeId: 'an-person-handoff' }
      ]
    }
  },

  // Branch 1: Appointment enquiry -> Question -> Condition
  {
    id: 'an-dept-question',
    type: 'question',
    x: 990,
    y: 40,
    data: {
      title: 'Ask Question',
      questionText: 'Which medical department or doctor do you wish to consult?',
      saveResponseAs: 'appointment.department',
      answerType: 'text'
    }
  },
  {
    id: 'an-condition-vip',
    type: 'condition',
    x: 1225,
    y: 40,
    data: {
      title: 'Check Condition',
      condition: {
        field: 'Contact label',
        operator: 'equals',
        value: 'VIP'
      }
    }
  },
  // Condition TRUE -> Message -> End
  {
    id: 'an-vip-msg',
    type: 'message',
    x: 1470,
    y: 20,
    data: {
      title: 'Send Message',
      messageText: 'Priority appointment confirmed with our Chief Medical Specialist.'
    }
  },
  {
    id: 'an-vip-end',
    type: 'end',
    x: 1705,
    y: 20,
    data: {
      title: 'End',
      endSummary: 'Finish priority VIP booking'
    }
  },
  // Condition FALSE -> Wait -> Handoff -> End
  {
    id: 'an-standard-wait',
    type: 'wait',
    x: 1470,
    y: 150,
    data: {
      title: 'Wait',
      wait: {
        duration: 5,
        unit: 'minutes'
      }
    }
  },
  {
    id: 'an-standard-handoff',
    type: 'handoff',
    x: 1705,
    y: 150,
    data: {
      title: 'Handoff',
      handoff: {
        destinationType: 'team',
        target: 'Reception Team'
      }
    }
  },
  {
    id: 'an-standard-end',
    type: 'end',
    x: 1940,
    y: 150,
    data: {
      title: 'End',
      endSummary: 'Finish standard intake'
    }
  },

  // Branch 2: Clinic timings -> Message -> End
  {
    id: 'an-timings-msg',
    type: 'message',
    x: 990,
    y: 280,
    data: {
      title: 'Send Message',
      messageText: 'Agamagizh Clinic is open Mon-Sat 8:00 AM - 8:00 PM. Emergency desk is 24/7.'
    }
  },
  {
    id: 'an-timings-end',
    type: 'end',
    x: 1225,
    y: 280,
    data: {
      title: 'End',
      endSummary: 'Finish timings inquiry'
    }
  },

  // Branch 3: Speak to a person -> Handoff -> End
  {
    id: 'an-person-handoff',
    type: 'handoff',
    x: 990,
    y: 430,
    data: {
      title: 'Handoff',
      handoff: {
        destinationType: 'agent',
        target: 'Kavitha Sundaram'
      }
    }
  },
  {
    id: 'an-person-end',
    type: 'end',
    x: 1225,
    y: 430,
    data: {
      title: 'End',
      endSummary: 'Finish agent handoff'
    }
  }
];

export const ALL_NODES_DEMO_EDGES: FlowEdge[] = [
  // Spine connections
  { id: 'ane-start-welcome', source: 'an-start', sourceHandle: 'default', target: 'an-welcome', label: 'Next' },
  { id: 'ane-welcome-name', source: 'an-welcome', sourceHandle: 'default', target: 'an-patient-name', label: 'Next' },
  { id: 'ane-name-choice', source: 'an-patient-name', sourceHandle: 'default', target: 'an-choice-main', label: 'Next' },

  // Choice options
  { id: 'ane-choice-appt', source: 'an-choice-main', sourceHandle: 'opt-appt', target: 'an-dept-question', label: 'Appointment enquiry' },
  { id: 'ane-choice-timings', source: 'an-choice-main', sourceHandle: 'opt-timings', target: 'an-timings-msg', label: 'Clinic timings' },
  { id: 'ane-choice-person', source: 'an-choice-main', sourceHandle: 'opt-person', target: 'an-person-handoff', label: 'Speak to a person' },

  // Branch 1: Question -> Condition
  { id: 'ane-dept-cond', source: 'an-dept-question', sourceHandle: 'default', target: 'an-condition-vip', label: 'Next' },
  // Condition TRUE -> Message -> End
  { id: 'ane-cond-true', source: 'an-condition-vip', sourceHandle: 'true', target: 'an-vip-msg', label: 'True Branch' },
  { id: 'ane-vip-end', source: 'an-vip-msg', sourceHandle: 'default', target: 'an-vip-end', label: 'Next' },
  // Condition FALSE -> Wait -> Handoff -> End
  { id: 'ane-cond-false', source: 'an-condition-vip', sourceHandle: 'false', target: 'an-standard-wait', label: 'False Branch' },
  { id: 'ane-wait-handoff', source: 'an-standard-wait', sourceHandle: 'default', target: 'an-standard-handoff', label: 'Next' },
  { id: 'ane-handoff-end', source: 'an-standard-handoff', sourceHandle: 'default', target: 'an-standard-end', label: 'Next' },

  // Branch 2: Message -> End
  { id: 'ane-timings-end', source: 'an-timings-msg', sourceHandle: 'default', target: 'an-timings-end', label: 'Next' },

  // Branch 3: Handoff -> End
  { id: 'ane-person-end', source: 'an-person-handoff', sourceHandle: 'default', target: 'an-person-end', label: 'Next' }
];

// =====================================================================
// VALIDATION ISSUES DEMO (Exactly 3 issues to demonstrate validation)
// 1. Message text missing (error)
// 2. Choice branch not connected (warning)
// 3. Condition value missing (error)
// =====================================================================
export const INVALID_DEMO_NODES: FlowNode[] = [
  {
    id: 'inv-start',
    type: 'start',
    x: 40,
    y: 220,
    data: {
      title: 'Start',
      messageText: 'Inbound WhatsApp conversation'
    }
  },
  {
    id: 'inv-empty-msg',
    type: 'message',
    x: 275,
    y: 220,
    data: {
      title: 'Send Message',
      messageText: '' // Issue 1: Message text is empty
    }
  },
  {
    id: 'inv-choice',
    type: 'choice',
    x: 510,
    y: 180,
    data: {
      title: 'Choice',
      questionText: 'Please choose an option:',
      choices: [
        { id: 'opt-consult', label: 'Doctor Consultation', targetNodeId: 'inv-cond' },
        { id: 'opt-unconnected', label: 'Emergency care' } // Issue 2: Choice option not connected
      ]
    }
  },
  {
    id: 'inv-cond',
    type: 'condition',
    x: 755,
    y: 200,
    data: {
      title: 'Check Condition',
      condition: {
        field: 'Contact label',
        operator: 'equals',
        value: '' // Issue 3: Condition value missing
      }
    }
  },
  {
    id: 'inv-end',
    type: 'end',
    x: 990,
    y: 200,
    data: {
      title: 'End',
      endSummary: 'Finish this path'
    }
  }
];

export const INVALID_DEMO_EDGES: FlowEdge[] = [
  { id: 'ie-1', source: 'inv-start', sourceHandle: 'default', target: 'inv-empty-msg', label: 'Next' },
  { id: 'ie-2', source: 'inv-empty-msg', sourceHandle: 'default', target: 'inv-choice', label: 'Next' },
  { id: 'ie-3', source: 'inv-choice', sourceHandle: 'opt-consult', target: 'inv-cond', label: 'Doctor Consultation' },
  { id: 'ie-4', source: 'inv-cond', sourceHandle: 'true', target: 'inv-end', label: 'True Branch' }
];

// Complex Multi-Branch Graph: Horizontal Left-to-Right layout
export const COMPLEX_DEMO_NODES: FlowNode[] = [
  {
    id: 'c-start',
    type: 'start',
    x: 60,
    y: 260,
    data: {
      title: 'Start',
      messageText: 'Inbound WhatsApp conversation'
    }
  },
  {
    id: 'c-welcome',
    type: 'message',
    x: 360,
    y: 260,
    data: {
      title: 'Send Message',
      messageText: 'Hi {{contact.name}}! Welcome to Agamagizh Health Services.'
    }
  },
  {
    id: 'c-ask-topic',
    type: 'question',
    x: 680,
    y: 260,
    data: {
      title: 'Ask Question',
      questionText: 'What would you like help with today?',
      saveResponseAs: 'support_topic',
      answerType: 'text'
    }
  },
  {
    id: 'c-choice',
    type: 'choice',
    x: 1000,
    y: 210,
    data: {
      title: 'Choice',
      questionText: 'Select one of the department pathways:',
      choices: [
        { id: 'c-opt-appt', label: 'Appointment enquiry', targetNodeId: 'c-ask-date' },
        { id: 'c-opt-timings', label: 'Clinic timings', targetNodeId: 'c-timings-msg' },
        { id: 'c-opt-person', label: 'Speak to a person', targetNodeId: 'c-handoff-person' }
      ]
    }
  },
  // Appointment Branch (Top Lane)
  {
    id: 'c-ask-date',
    type: 'question',
    x: 1340,
    y: 70,
    data: {
      title: 'Ask Question',
      questionText: 'Please share your preferred consultation date:',
      saveResponseAs: 'preferred_date',
      answerType: 'date'
    }
  },
  {
    id: 'c-cond-vip',
    type: 'condition',
    x: 1660,
    y: 70,
    data: {
      title: 'Condition',
      condition: {
        field: 'Contact label',
        operator: 'contains',
        value: 'VIP'
      }
    }
  },
  {
    id: 'c-confirm-vip',
    type: 'message',
    x: 1980,
    y: 0,
    data: {
      title: 'Send Message',
      messageText: 'Thank you Priority Member! Dr. Malathi has reserved your priority slot for {{preferred_date}}.'
    }
  },
  {
    id: 'c-end-vip',
    type: 'end',
    x: 2300,
    y: 0,
    data: {
      title: 'End',
      endSummary: 'Finish this path'
    }
  },
  {
    id: 'c-handoff-desk',
    type: 'handoff',
    x: 1980,
    y: 150,
    data: {
      title: 'Handoff',
      handoff: {
        destinationType: 'team',
        target: 'Customer Care (Adyar)'
      }
    }
  },
  {
    id: 'c-end-standard',
    type: 'end',
    x: 2300,
    y: 150,
    data: {
      title: 'End',
      endSummary: 'Finish this path'
    }
  },
  // Timings Branch (Middle Lane)
  {
    id: 'c-timings-msg',
    type: 'message',
    x: 1340,
    y: 280,
    data: {
      title: 'Send Message',
      messageText: 'Our clinics are open Mon-Sat 08:30 AM to 07:30 PM IST. Location: 14/2 Gandhi Nagar, Adyar.'
    }
  },
  {
    id: 'c-end-timings',
    type: 'end',
    x: 1660,
    y: 280,
    data: {
      title: 'End',
      endSummary: 'Finish this path'
    }
  },
  // Speak to a Person Branch (Bottom Lane)
  {
    id: 'c-handoff-person',
    type: 'handoff',
    x: 1340,
    y: 440,
    data: {
      title: 'Handoff',
      handoff: {
        destinationType: 'team',
        target: 'Reception Team'
      }
    }
  },
  {
    id: 'c-end-person',
    type: 'end',
    x: 1660,
    y: 440,
    data: {
      title: 'End',
      endSummary: 'Finish this path'
    }
  }
];

export const COMPLEX_DEMO_EDGES: FlowEdge[] = [
  { id: 'ce-1', source: 'c-start', sourceHandle: 'default', target: 'c-welcome', label: 'Next' },
  { id: 'ce-2', source: 'c-welcome', sourceHandle: 'default', target: 'c-ask-topic', label: 'Next' },
  { id: 'ce-3', source: 'c-ask-topic', sourceHandle: 'default', target: 'c-choice', label: 'Next' },
  { id: 'ce-4', source: 'c-choice', sourceHandle: 'c-opt-appt', target: 'c-ask-date', label: 'Appointment enquiry' },
  { id: 'ce-5', source: 'c-ask-date', sourceHandle: 'default', target: 'c-cond-vip', label: 'Next' },
  { id: 'ce-6', source: 'c-cond-vip', sourceHandle: 'true', target: 'c-confirm-vip', label: 'True Branch' },
  { id: 'ce-7', source: 'c-confirm-vip', sourceHandle: 'default', target: 'c-end-vip', label: 'Next' },
  { id: 'ce-8', source: 'c-cond-vip', sourceHandle: 'false', target: 'c-handoff-desk', label: 'False Branch' },
  { id: 'ce-9', source: 'c-handoff-desk', sourceHandle: 'default', target: 'c-end-standard', label: 'Next' },
  { id: 'ce-10', source: 'c-choice', sourceHandle: 'c-opt-timings', target: 'c-timings-msg', label: 'Clinic timings' },
  { id: 'ce-11', source: 'c-timings-msg', sourceHandle: 'default', target: 'c-end-timings', label: 'Next' },
  { id: 'ce-12', source: 'c-choice', sourceHandle: 'c-opt-person', target: 'c-handoff-person', label: 'Speak to a person' },
  { id: 'ce-13', source: 'c-handoff-person', sourceHandle: 'default', target: 'c-end-person', label: 'Next' }
];

export const INITIAL_BOT_PROJECTS: ChatbotProject[] = [
  {
    id: 'bot-1',
    name: 'Front Desk Reception Bot',
    description: 'Initial triage & reception flow directing patients to appointments, timing information, or care desk.',
    status: 'draft',
    version: 'v1.0-draft',
    lastUpdated: '10 minutes ago',
    nodesCount: 9,
    triggersCount: 1420,
    inbox: 'Agamagizh WhatsApp Main',
    nodes: SIMPLE_DEMO_NODES,
    edges: SIMPLE_DEMO_EDGES
  },
  {
    id: 'bot-2',
    name: 'After Hours Responder',
    description: 'Off-hours auto-responder with delayed notification dispatch and emergency hotline display.',
    status: 'published',
    version: 'v2.4',
    lastUpdated: 'Yesterday',
    nodesCount: 4,
    triggersCount: 380,
    inbox: 'Agamagizh WhatsApp Main',
    nodes: [
      {
        id: 'ah-start',
        type: 'start',
        x: 60,
        y: 200,
        data: { title: 'Start', messageText: 'Inbound WhatsApp conversation' }
      },
      {
        id: 'ah-wait',
        type: 'wait',
        x: 380,
        y: 200,
        data: { title: 'Wait', wait: { duration: 5, unit: 'minutes' } }
      },
      {
        id: 'ah-msg',
        type: 'message',
        x: 700,
        y: 200,
        data: {
          title: 'Send Message',
          messageText: 'Our clinics are currently closed. For medical emergencies please call our 24/7 hotline: +91 44 2490 8888.'
        }
      },
      {
        id: 'ah-end',
        type: 'end',
        x: 1020,
        y: 200,
        data: { title: 'End', endSummary: 'Finish this path' }
      }
    ],
    edges: [
      { id: 'ae-1', source: 'ah-start', sourceHandle: 'default', target: 'ah-wait', label: 'Next' },
      { id: 'ae-2', source: 'ah-wait', sourceHandle: 'default', target: 'ah-msg', label: 'Next' },
      { id: 'ae-3', source: 'ah-msg', sourceHandle: 'default', target: 'ah-end', label: 'Next' }
    ]
  },
  {
    id: 'bot-3',
    name: 'Patient Intake & Triage Flow',
    description: 'Comprehensive patient assessment flow collecting symptoms, urgency score, and booking confirmation.',
    status: 'draft',
    version: 'v3.1',
    lastUpdated: '3 days ago',
    nodesCount: 14,
    triggersCount: 940,
    inbox: 'Agamagizh WhatsApp Main',
    nodes: COMPLEX_DEMO_NODES,
    edges: COMPLEX_DEMO_EDGES
  }
];

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: 'tpl-welcome-handoff',
    name: 'Welcome & Handoff',
    description: 'Simple greeting followed by automatic desk routing.',
    nodeCount: 4,
    category: 'Reception',
    nodes: [
      {
        id: 'wh-start',
        type: 'start',
        x: 60,
        y: 200,
        data: { title: 'Start', messageText: 'Inbound WhatsApp conversation' }
      },
      {
        id: 'wh-msg',
        type: 'message',
        x: 380,
        y: 200,
        data: { title: 'Send Message', messageText: 'Vanakkam! Welcome to Agamagizh. Connecting you to a care coordinator.' }
      },
      {
        id: 'wh-handoff',
        type: 'handoff',
        x: 700,
        y: 200,
        data: { title: 'Handoff', handoff: { destinationType: 'team', target: 'Reception Team' } }
      },
      {
        id: 'wh-end',
        type: 'end',
        x: 1020,
        y: 200,
        data: { title: 'End', endSummary: 'Finish this path' }
      }
    ],
    edges: [
      { id: 'whe-1', source: 'wh-start', sourceHandle: 'default', target: 'wh-msg', label: 'Next' },
      { id: 'whe-2', source: 'wh-msg', sourceHandle: 'default', target: 'wh-handoff', label: 'Next' },
      { id: 'whe-3', source: 'wh-handoff', sourceHandle: 'default', target: 'wh-end', label: 'Next' }
    ]
  },
  {
    id: 'tpl-appointment-enquiry',
    name: 'Appointment Enquiry',
    description: 'Branching consultation booking flow with timing information.',
    nodeCount: 9,
    category: 'Booking',
    nodes: SIMPLE_DEMO_NODES,
    edges: SIMPLE_DEMO_EDGES
  },
  {
    id: 'tpl-faq',
    name: 'FAQ & Center Timings',
    description: 'Self-service menu answering common queries and clinic directions.',
    nodeCount: 7,
    category: 'Support',
    nodes: [
      {
        id: 'faq-start',
        type: 'start',
        x: 60,
        y: 240,
        data: { title: 'Start', messageText: 'Inbound WhatsApp conversation' }
      },
      {
        id: 'faq-msg',
        type: 'message',
        x: 380,
        y: 240,
        data: { title: 'Send Message', messageText: 'Hello! Please select from our self-service directory:' }
      },
      {
        id: 'faq-choice',
        type: 'choice',
        x: 700,
        y: 200,
        data: {
          title: 'Choice',
          questionText: 'Select an information topic:',
          choices: [
            { id: 'faq-opt-1', label: 'Clinic Timings', targetNodeId: 'faq-ans-1' },
            { id: 'faq-opt-2', label: 'Adyar Location', targetNodeId: 'faq-ans-2' }
          ]
        }
      },
      {
        id: 'faq-ans-1',
        type: 'message',
        x: 1040,
        y: 100,
        data: { title: 'Send Message', messageText: 'Operating hours: Monday to Saturday from 08:30 AM to 07:30 PM.' }
      },
      {
        id: 'faq-ans-2',
        type: 'message',
        x: 1040,
        y: 300,
        data: { title: 'Send Message', messageText: 'Adyar Campus: 14/2 Gandhi Nagar, 2nd Main Road, Chennai 600020.' }
      },
      {
        id: 'faq-end-1',
        type: 'end',
        x: 1360,
        y: 100,
        data: { title: 'End', endSummary: 'Finish this path' }
      },
      {
        id: 'faq-end-2',
        type: 'end',
        x: 1360,
        y: 300,
        data: { title: 'End', endSummary: 'Finish this path' }
      }
    ],
    edges: [
      { id: 'fe-1', source: 'faq-start', sourceHandle: 'default', target: 'faq-msg', label: 'Next' },
      { id: 'fe-2', source: 'faq-msg', sourceHandle: 'default', target: 'faq-choice', label: 'Next' },
      { id: 'fe-3', source: 'faq-choice', sourceHandle: 'faq-opt-1', target: 'faq-ans-1', label: 'Clinic Timings' },
      { id: 'fe-4', source: 'faq-choice', sourceHandle: 'faq-opt-2', target: 'faq-ans-2', label: 'Adyar Location' },
      { id: 'fe-5', source: 'faq-ans-1', sourceHandle: 'default', target: 'faq-end-1', label: 'Next' },
      { id: 'fe-6', source: 'faq-ans-2', sourceHandle: 'default', target: 'faq-end-2', label: 'Next' }
    ]
  },
  {
    id: 'tpl-contact-capture',
    name: 'Contact Capture & Triage',
    description: 'Ask for customer name and issue category before team notification.',
    nodeCount: 6,
    category: 'Lead Capture',
    nodes: [
      {
        id: 'cc-start',
        type: 'start',
        x: 60,
        y: 200,
        data: { title: 'Start', messageText: 'Inbound WhatsApp conversation' }
      },
      {
        id: 'cc-q1',
        type: 'question',
        x: 380,
        y: 200,
        data: {
          title: 'Ask Question',
          questionText: 'What is your full name?',
          saveResponseAs: 'patient_name',
          answerType: 'text'
        }
      },
      {
        id: 'cc-q2',
        type: 'question',
        x: 700,
        y: 200,
        data: {
          title: 'Ask Question',
          questionText: 'Which phone number or email should we reach you on?',
          saveResponseAs: 'contact_info',
          answerType: 'phone'
        }
      },
      {
        id: 'cc-msg',
        type: 'message',
        x: 1020,
        y: 200,
        data: {
          title: 'Send Message',
          messageText: 'Thank you {{patient_name}}! We have noted your details and our care coordinator will reach out shortly.'
        }
      },
      {
        id: 'cc-handoff',
        type: 'handoff',
        x: 1340,
        y: 200,
        data: { title: 'Handoff', handoff: { destinationType: 'team', target: 'Customer Care (Adyar)' } }
      },
      {
        id: 'cc-end',
        type: 'end',
        x: 1660,
        y: 200,
        data: { title: 'End', endSummary: 'Finish this path' }
      }
    ],
    edges: [
      { id: 'cce-1', source: 'cc-start', sourceHandle: 'default', target: 'cc-q1', label: 'Next' },
      { id: 'cce-2', source: 'cc-q1', sourceHandle: 'default', target: 'cc-q2', label: 'Next' },
      { id: 'cce-3', source: 'cc-q2', sourceHandle: 'default', target: 'cc-msg', label: 'Next' },
      { id: 'cce-4', source: 'cc-msg', sourceHandle: 'default', target: 'cc-handoff', label: 'Next' },
      { id: 'cce-5', source: 'cc-handoff', sourceHandle: 'default', target: 'cc-end', label: 'Next' }
    ]
  },
  {
    id: 'tpl-feedback',
    name: 'Feedback & Rating',
    description: 'Post-consultation customer satisfaction survey with rating collection.',
    nodeCount: 5,
    category: 'Survey',
    nodes: [
      {
        id: 'fb-start',
        type: 'start',
        x: 60,
        y: 200,
        data: { title: 'Start', messageText: 'Inbound WhatsApp conversation' }
      },
      {
        id: 'fb-choice',
        type: 'choice',
        x: 380,
        y: 160,
        data: {
          title: 'Choice',
          questionText: 'How would you rate your clinic visit today?',
          choices: [
            { id: 'fb-opt-pos', label: '⭐⭐⭐⭐⭐ Excellent', targetNodeId: 'fb-msg-pos' },
            { id: 'fb-opt-neg', label: 'Needs Improvement', targetNodeId: 'fb-msg-neg' }
          ]
        }
      },
      {
        id: 'fb-msg-pos',
        type: 'message',
        x: 720,
        y: 80,
        data: { title: 'Send Message', messageText: 'Thank you for your warm words! We look forward to serving you again.' }
      },
      {
        id: 'fb-msg-neg',
        type: 'message',
        x: 720,
        y: 260,
        data: { title: 'Send Message', messageText: 'We sincerely apologize for any inconvenience. Our team supervisor will review your feedback immediately.' }
      },
      {
        id: 'fb-end',
        type: 'end',
        x: 1060,
        y: 180,
        data: { title: 'End', endSummary: 'Finish this path' }
      }
    ],
    edges: [
      { id: 'fbe-1', source: 'fb-start', sourceHandle: 'default', target: 'fb-choice', label: 'Next' },
      { id: 'fbe-2', source: 'fb-choice', sourceHandle: 'fb-opt-pos', target: 'fb-msg-pos', label: 'Excellent' },
      { id: 'fbe-3', source: 'fb-choice', sourceHandle: 'fb-opt-neg', target: 'fb-msg-neg', label: 'Needs Improvement' },
      { id: 'fbe-4', source: 'fb-msg-pos', sourceHandle: 'default', target: 'fb-end', label: 'Next' },
      { id: 'fbe-5', source: 'fb-msg-neg', sourceHandle: 'default', target: 'fb-end', label: 'Next' }
    ]
  }
];
