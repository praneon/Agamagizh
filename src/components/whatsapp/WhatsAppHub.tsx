import React from 'react';
import { 
  Conversation, 
  Contact, 
  WhatsAppCampaign 
} from '../../types';
import { ConversationsWorkbench } from '../inbox/ConversationsWorkbench';
import { WhatsAppTemplatesView } from './WhatsAppTemplatesView';
import { CampaignsView } from '../campaigns/CampaignsView';
import { WhatsAppChatbotsView } from './WhatsAppChatbotsView';
import { WhatsAppRulesView } from './WhatsAppRulesView';
import { WhatsAppAnalyticsView } from './WhatsAppAnalyticsView';
import { PipelineKanbanView } from '../pipeline/PipelineKanbanView';

interface WhatsAppHubProps {
  conversations: Conversation[];
  activeConvoId: string;
  onSelectConvo: (id: string) => void;
  onSendMessage: (convoId: string, text: string, isPrivateNote?: boolean) => void;
  onUpdateStatus?: (convoId: string, status: Conversation['status']) => void;
  onUpdateAssignee?: (convoId: string, agentName: string) => void;
  onAddLabel?: (convoId: string, label: string) => void;
  campaigns: WhatsAppCampaign[];
  onCreateCampaign: (campaign: any) => void;
  currentWhatsAppSub?: string;
  initialSubTab?: 'conversations' | 'templates' | 'campaigns' | 'chatbots' | 'rules' | 'analytics';
  onOpenQuickCompose?: () => void;
  onOpenContact?: (contact: Contact) => void;
}

export const WhatsAppHub: React.FC<WhatsAppHubProps> = ({
  conversations,
  activeConvoId,
  onSelectConvo,
  onSendMessage,
  onUpdateStatus,
  onUpdateAssignee,
  onAddLabel,
  campaigns,
  onCreateCampaign,
  currentWhatsAppSub,
  initialSubTab = 'conversations',
  onOpenQuickCompose,
  onOpenContact
}) => {
  // Determine subTab from currentWhatsAppSub or initialSubTab
  // Left sidebar menu is authoritative:
  // 'inbox' -> conversations
  // 'templates' -> templates
  // 'campaigns' | 'broadcasts' -> campaigns
  // 'chatbots' -> chatbots
  // 'automations' | 'rules' -> rules
  // 'analytics' -> analytics
  const activeSub = (currentWhatsAppSub || initialSubTab || 'conversations').toLowerCase();

  // Filter WhatsApp specific conversations
  const whatsappConversations = conversations.filter(c => c.channel === 'whatsapp');

  return (
    <div className="flex flex-col h-full bg-[#F4F5F7] overflow-hidden">
      {/* NO duplicate horizontal module tabs strip. Authoritative navigation is the left WhatsApp submenu */}

      {/* Main SubTab View Container */}
      <div className="flex-1 overflow-hidden">
        {(activeSub === 'conversations' || activeSub === 'inbox') && (
          <ConversationsWorkbench
            conversations={whatsappConversations}
            activeConvoId={activeConvoId}
            onSelectConvo={onSelectConvo}
            onSendMessage={onSendMessage}
            onUpdateStatus={onUpdateStatus}
            onUpdateAssignee={onUpdateAssignee}
            onAddLabel={onAddLabel}
            filterChannel="whatsapp"
            isWhatsAppInbox={true}
            onOpenQuickCompose={onOpenQuickCompose}
            onOpenContact={onOpenContact}
          />
        )}

        {activeSub === 'templates' && <WhatsAppTemplatesView />}

        {(activeSub === 'campaigns' || activeSub === 'broadcasts') && (
          <CampaignsView
            campaigns={campaigns}
            onCreateCampaign={onCreateCampaign}
            onViewAnalytics={() => {}}
          />
        )}

        {activeSub === 'chatbots' && <WhatsAppChatbotsView />}

        {activeSub === 'pipelines' && (
          <PipelineKanbanView
            context="whatsapp"
            onOpenConversation={(item) => {
              const matched = conversations.find(c => c.contactPhone === item.contactPhone || c.id === item.conversationId);
              if (matched) {
                onSelectConvo(matched.id);
              }
            }}
            onOpenContact={(item) => {
              if (onOpenContact) {
                onOpenContact({
                  id: item.contactId || `cnt-${item.id}`,
                  name: item.contactName,
                  phone: item.contactPhone,
                  email: item.contactEmail || '',
                  channel: 'whatsapp',
                  status: 'active',
                  labels: item.labels,
                  conversationsCount: 1,
                  lastActivity: item.lastActivity,
                  customAttributes: {}
                });
              }
            }}
          />
        )}

        {(activeSub === 'rules' || activeSub === 'automations') && <WhatsAppRulesView />}

        {activeSub === 'analytics' && (
          <WhatsAppAnalyticsView 
            onSelectConvo={(convoId) => {
              const matched = conversations.find(c => c.id === convoId || c.contactPhone.replace(/\s+/g, '') === convoId.replace(/\s+/g, ''));
              if (matched) {
                onSelectConvo(matched.id);
              } else if (conversations.length > 0) {
                onSelectConvo(conversations[0].id);
              }
            }}
            onOpenContact={(item) => {
              if (onOpenContact) {
                onOpenContact({
                  id: item.id,
                  name: item.name,
                  phone: item.phone,
                  email: '',
                  channel: 'whatsapp',
                  status: 'active',
                  labels: ['WhatsApp Campaign Recipient'],
                  conversationsCount: 1,
                  lastActivity: 'Just now',
                  customAttributes: {}
                });
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
