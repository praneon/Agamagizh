/**
 * Agamagizh CRM Adapter
 * Transforms real Chatwoot Rails API models & shapes into Agamagizh Studio UI representations
 * and vice versa.
 */

import {
  CrmConversation,
  CrmMessage,
  CrmContact,
  CrmCompany,
  CrmClinicPipelineCard,
  CrmClinicPipelineStage,
  CrmCampaign,
  CrmAutomationFlow,
  CrmWhatsAppTemplate,
  CrmWhatsAppTemplateDraft,
} from '../types/crm';

import {
  Conversation,
  Message,
  Contact,
  Company,
  ClinicPipelineCard,
  ClinicPipelineStage,
  WhatsAppCampaign,
  WhatsAppTemplate,
  ChatbotFlow,
  ChatbotNode,
  ChatbotEdge,
} from '../types';

// ==========================================
// 1. Conversations & Messages
// ==========================================

export function chatwootToStudioMessage(crmMsg: CrmMessage): Message {
  const isAgent = crmMsg.message_type === 'outgoing' || (crmMsg.sender && crmMsg.sender.type === 'user');
  const isSystem = crmMsg.message_type === 'activity' || (crmMsg.sender && crmMsg.sender.type === 'agent_bot');
  
  const dateObj = new Date(crmMsg.created_at * 1000);
  const timestamp = isNaN(dateObj.getTime())
    ? 'Just now'
    : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    id: String(crmMsg.id),
    conversationId: String(crmMsg.conversation_id),
    sender: isSystem ? 'system' : isAgent ? 'agent' : 'contact',
    senderName: crmMsg.sender?.name || (isAgent ? 'Agent' : 'Contact'),
    text: crmMsg.content || '',
    timestamp,
    status: crmMsg.status || 'delivered',
    isPrivateNote: crmMsg.private,
    attachments: (crmMsg.attachments || []).map((att) => ({
      name: `attachment-${att.id}`,
      type: att.file_type === 'image' ? 'image' : att.file_type === 'audio' ? 'audio' : 'doc',
      size: att.file_size ? `${Math.round(att.file_size / 1024)} KB` : '120 KB',
      url: att.data_url,
    })),
  };
}

export function chatwootToStudioConversation(crmConvo: CrmConversation): Conversation {
  const sender = crmConvo.meta?.sender;
  const contactName = sender?.name || 'WhatsApp Contact';
  const contactPhone = sender?.phone_number || '';
  const contactEmail = sender?.email || '';

  const messages = (crmConvo.messages || []).map(chatwootToStudioMessage);
  const lastMsg = messages[messages.length - 1];

  return {
    id: String(crmConvo.id),
    contactId: sender ? String(sender.id) : String(crmConvo.contact_inbox_id || crmConvo.id),
    contactName,
    contactPhone,
    contactEmail,
    channel: crmConvo.meta?.channel?.includes('whatsapp') ? 'whatsapp' : 'whatsapp',
    status: crmConvo.status === 'pending' ? 'pending' : crmConvo.status,
    priority: crmConvo.priority || 'medium',
    assignedAgent: crmConvo.meta?.assignee?.name || 'Unassigned',
    assignedTeam: crmConvo.meta?.team?.name || 'Adyar Care Desk',
    labels: crmConvo.labels || [],
    lastMessage: lastMsg ? lastMsg.text : 'No messages yet',
    lastTimestamp: lastMsg ? lastMsg.timestamp : 'Just now',
    unreadCount: crmConvo.unread_count || 0,
    inbox: 'Agamagizh WhatsApp Main',
    messages,
    customAttributes: crmConvo.custom_attributes as Record<string, string> || {},
  };
}

// ==========================================
// 2. Contacts & Companies
// ==========================================

export function chatwootToStudioContact(crmContact: CrmContact): Contact {
  const createdDate = new Date(crmContact.created_at * 1000);
  const lastActivity = crmContact.last_activity_at 
    ? new Date(crmContact.last_activity_at * 1000).toLocaleDateString()
    : !isNaN(createdDate.getTime()) ? createdDate.toLocaleDateString() : 'Recent';

  return {
    id: String(crmContact.id),
    name: crmContact.name || 'Anonymous Contact',
    email: crmContact.email || '',
    phone: crmContact.phone_number,
    avatar: crmContact.thumbnail,
    company: (crmContact.additional_attributes?.company_name as string) || undefined,
    lastActivity,
    status: 'active',
    labels: (crmContact.custom_attributes?.labels as string[]) || ['WhatsApp Lead'],
    conversationsCount: crmContact.conversations_count || 1,
    channel: 'whatsapp',
    location: (crmContact.additional_attributes?.city as string) || 'Chennai, TN',
    customAttributes: Object.entries(crmContact.custom_attributes || {}).reduce((acc, [k, v]) => {
      acc[k] = String(v);
      return acc;
    }, {} as Record<string, string>),
  };
}

export function studioToChatwootContact(contact: Partial<Contact>): Partial<CrmContact> {
  return {
    name: contact.name,
    email: contact.email,
    phone_number: contact.phone,
    custom_attributes: {
      ...contact.customAttributes,
      labels: contact.labels,
    },
    additional_attributes: {
      company_name: contact.company,
      city: contact.location,
    },
  };
}

export function chatwootToStudioCompany(crmCompany: CrmCompany): Company {
  return {
    id: String(crmCompany.id),
    name: crmCompany.name,
    domain: crmCompany.domain || '',
    industry: crmCompany.industry || 'Healthcare Services',
    phone: '',
    address: crmCompany.address || 'Chennai, India',
    contactsCount: crmCompany.contacts_count || 0,
    openConversations: 0,
  };
}

// ==========================================
// 3. Clinic Pipeline (Kanban Intake)
// ==========================================

export function chatwootToStudioPipelineStage(crmStage: CrmClinicPipelineStage): ClinicPipelineStage {
  return {
    id: String(crmStage.id),
    title: crmStage.name,
    color: crmStage.color || '#0d9488',
    description: `Stage ${crmStage.position + 1}`,
  };
}

export function chatwootToStudioPipelineCard(crmCard: CrmClinicPipelineCard): ClinicPipelineCard {
  return {
    id: String(crmCard.id),
    stageId: String(crmCard.clinic_pipeline_stage_id),
    title: crmCard.title,
    contactName: crmCard.contact?.name || 'Patient Inquiry',
    contactPhone: crmCard.contact?.phone_number || '+91 98400 00000',
    value: crmCard.value ? `₹${crmCard.value.toLocaleString()}` : '₹0',
    assignedAgent: 'Kavitha Sundaram',
    priority: crmCard.priority || 'medium',
    labels: crmCard.labels || [],
    nextActivity: crmCard.due_date || 'Schedule Consultation',
    lastContacted: 'Today',
  };
}

// ==========================================
// 4. WhatsApp Campaigns & Broadcasts
// ==========================================

export function chatwootToStudioCampaign(crmCampaign: CrmCampaign): WhatsAppCampaign {
  return {
    id: String(crmCampaign.id),
    title: crmCampaign.title,
    channelInbox: 'Agamagizh WhatsApp Main',
    status: crmCampaign.campaign_status as WhatsAppCampaign['status'],
    audienceType: crmCampaign.audience_type,
    audienceSummary: crmCampaign.audience_metadata?.csv_file_name 
      ? `CSV: ${crmCampaign.audience_metadata.csv_file_name}` 
      : crmCampaign.audience_metadata?.labels 
      ? `Labels: ${crmCampaign.audience_metadata.labels.join(', ')}`
      : 'Targeted Patient List',
    templateId: crmCampaign.template_params?.template_id || 'tpl_general',
    templateName: crmCampaign.template_params?.template_name || 'Agamagizh Official Notification',
    scheduledAt: crmCampaign.scheduled_at,
    totalRecipients: crmCampaign.total_recipients,
    sentCount: crmCampaign.sent_count,
    deliveredCount: crmCampaign.delivered_count,
    readCount: crmCampaign.read_count,
    repliedCount: crmCampaign.replied_count || 0,
    failedCount: crmCampaign.failed_count,
    excludedCount: crmCampaign.excluded_count,
    createdAt: crmCampaign.created_at,
  };
}

// ==========================================
// 5. WhatsApp Templates
// ==========================================

export function chatwootToStudioTemplate(
  crmTpl: CrmWhatsAppTemplate | CrmWhatsAppTemplateDraft
): WhatsAppTemplate {
  if ('components' in crmTpl) {
    const bodyComp = crmTpl.components.find((c) => c.type === 'BODY');
    const headerComp = crmTpl.components.find((c) => c.type === 'HEADER');
    const footerComp = crmTpl.components.find((c) => c.type === 'FOOTER');
    const btnComp = crmTpl.components.find((c) => c.type === 'BUTTONS');

    return {
      id: crmTpl.id,
      name: crmTpl.name,
      category: crmTpl.category,
      language: crmTpl.language,
      status: crmTpl.status === 'APPROVED' ? 'approved' : crmTpl.status === 'REJECTED' ? 'rejected' : 'pending',
      source: 'provider',
      isCampaignEligible: crmTpl.status === 'APPROVED',
      header: headerComp ? {
        type: headerComp.format?.toLowerCase() as any || 'text',
        text: headerComp.text,
      } : undefined,
      body: bodyComp?.text || '',
      footer: footerComp?.text,
      buttons: btnComp?.buttons?.map((b) => ({
        type: b.type === 'QUICK_REPLY' ? 'QUICK_REPLY' : 'URL',
        text: b.text,
        value: b.url || b.phone_number,
      })),
    };
  }

  // Handle draft
  return {
    id: String(crmTpl.id),
    name: crmTpl.name,
    category: (crmTpl.category as any) || 'UTILITY',
    language: crmTpl.language || 'en',
    status: 'local_draft',
    source: 'local_draft',
    isCampaignEligible: false,
    body: crmTpl.body || '',
  };
}

// ==========================================
// 6. Automation Flows & Visual Chatbots
// ==========================================

export function chatwootToStudioFlow(flow: CrmAutomationFlow): ChatbotFlow {
  const nodes: ChatbotNode[] = (flow.definition?.nodes || []).map((n) => ({
    id: n.id,
    type: n.type as any,
    title: n.title,
    x: n.position?.x || 100,
    y: n.position?.y || 100,
    content: n.data?.content || {},
  }));

  const edges: ChatbotEdge[] = (flow.definition?.edges || []).map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
  }));

  return {
    id: String(flow.id),
    name: flow.title,
    description: flow.description || '',
    version: flow.version ? `v${flow.version}` : 'v1.0',
    status: flow.status === 'active' ? 'published' : 'draft',
    lastModified: flow.updated_at || 'Recently',
    nodes,
    edges,
  };
}

export function studioToChatwootFlow(flow: ChatbotFlow): Partial<CrmAutomationFlow> {
  return {
    title: flow.name,
    description: flow.description,
    status: flow.status === 'published' ? 'active' : 'draft',
    version: parseInt(flow.version.replace(/[^0-9]/g, ''), 10) || 1,
    definition: {
      nodes: flow.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        position: { x: n.x, y: n.y },
        data: { content: n.content },
      })),
      edges: flow.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
      })),
    },
  };
}
