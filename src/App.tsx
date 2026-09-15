import React, { useState } from 'react';
import { 
  TopNavSection, 
  WhatsAppSubSection, 
  Conversation, 
  Contact, 
  Company, 
  ClinicPipelineCard, 
  WhatsAppCampaign, 
  ToastNotification 
} from './types';
import { 
  INITIAL_CONVERSATIONS, 
  INITIAL_CONTACTS, 
  INITIAL_COMPANIES, 
  CLINIC_PIPELINE_CARDS, 
  INITIAL_CAMPAIGNS 
} from './data/mockData';

import { Shell } from './components/layout/Shell';
import { CommandPalette } from './components/layout/CommandPalette';
import { QuickComposeModal } from './components/layout/QuickComposeModal';
import { ToastContainer } from './components/ui/Toast';

import { ConversationsWorkbench } from './components/inbox/ConversationsWorkbench';
import { MyInboxView } from './components/inbox/MyInboxView';
import { ContactsView } from './components/crm/ContactsView';
import { CompaniesView } from './components/crm/CompaniesView';
import { ClinicPipelineView } from './components/pipeline/ClinicPipelineView';
import { CampaignsView } from './components/campaigns/CampaignsView';
import { WhatsAppHub } from './components/whatsapp/WhatsAppHub';
import { CaptainView } from './components/operations/CaptainView';
import { ReportsView } from './components/operations/ReportsView';
import { HelpCenterView } from './components/operations/HelpCenterView';
import { SettingsView } from './components/settings/SettingsView';
import { UIReferenceView } from './components/reference/UIReferenceView';
import { CrmProvider, useCrm } from './context/CrmContext';

function AgamagizhConsoleApp() {
  const { provider, mode } = useCrm();
  const [currentSection, setCurrentSection] = useState<TopNavSection>('my_inbox');
  const [currentWhatsAppSub, setCurrentWhatsAppSub] = useState<WhatsAppSubSection>('inbox');

  // Internal UI Reference route state (/ui-reference)
  const [isUiReferenceOpen, setIsUiReferenceOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      return path.includes('/ui-reference') || hash.includes('ui-reference') || search.includes('ui-reference');
    }
    return false;
  });

  // Listen to popstate and hashchange for /ui-reference
  React.useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      if (path.includes('/ui-reference') || hash.includes('ui-reference') || search.includes('ui-reference')) {
        setIsUiReferenceOpen(true);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Operational State
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvoId, setActiveConvoId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [pipelineCards, setPipelineCards] = useState<ClinicPipelineCard[]>(CLINIC_PIPELINE_CARDS);
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>(INITIAL_CAMPAIGNS);

  // Sync state with active CRM Data Provider (Local fixtures or Real Chatwoot Rails API)
  React.useEffect(() => {
    let isMounted = true;
    async function syncCrmData() {
      try {
        const [convos, cnts, cards, cmps] = await Promise.all([
          provider.getConversations().catch(() => INITIAL_CONVERSATIONS),
          provider.getContacts().catch(() => INITIAL_CONTACTS),
          provider.getPipelineCards().catch(() => CLINIC_PIPELINE_CARDS),
          provider.getCampaigns().catch(() => INITIAL_CAMPAIGNS),
        ]);
        if (isMounted) {
          if (convos && convos.length > 0) {
            setConversations(convos);
            setActiveConvoId((prev) => (convos.some((c) => c.id === prev) ? prev : convos[0].id));
          }
          if (cnts) setContacts(cnts);
          if (cards) setPipelineCards(cards);
          if (cmps) setCampaigns(cmps);
        }
      } catch (err) {
        console.warn('CRM provider initial sync notification:', err);
      }
    }
    syncCrmData();
    return () => {
      isMounted = false;
    };
  }, [provider]);

  // Global Dialogs & Overlays
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickComposeOpen, setIsQuickComposeOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Toast Helper
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastNotification = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Global Navigation
  const handleNavigate = (section: TopNavSection, waSub?: WhatsAppSubSection) => {
    if ((section as any) === 'ui-reference') {
      setIsUiReferenceOpen(true);
      if (typeof window !== 'undefined' && window.history?.pushState) {
        window.history.pushState({}, '', '/ui-reference');
      }
      return;
    }
    setCurrentSection(section);
    if (waSub) {
      setCurrentWhatsAppSub(waSub);
    }
  };

  // Send message / internal note
  const handleSendMessage = (convoId: string, text: string, isPrivateNote: boolean = false) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsgId = `msg-${Date.now()}`;

    // Dispatch to CRM Data Provider (Real Chatwoot or In-Memory Local)
    provider.sendMessage(convoId, text, isPrivateNote).catch((err) => {
      console.warn('CRM provider sendMessage notification:', err);
    });

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convoId) {
          return {
            ...c,
            lastMessage: isPrivateNote ? c.lastMessage : text,
            lastTimestamp: timeNow,
            status: c.status === 'resolved' ? 'open' : c.status,
            messages: [
              ...c.messages,
              {
                id: newMsgId,
                sender: 'agent',
                senderName: 'Kavitha Sundaram',
                text,
                timestamp: timeNow,
                status: 'delivered',
                isPrivateNote
              }
            ]
          };
        }
        return c;
      })
    );

    if (isPrivateNote) {
      showToast('Internal Note Added', 'Saved private note visible only to Agamagizh agents.', 'info');
    } else {
      showToast('WhatsApp Message Sent', 'Message dispatched via Meta Cloud API.', 'success');

      // Simulate contact read verification
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === convoId) {
              return {
                ...c,
                messages: (c.messages || []).map((m) =>
                  m.id === newMsgId ? { ...m, status: 'read' } : m
                )
              };
            }
            return c;
          })
        );
      }, 1400);
    }
  };

  // Update conversation status
  const handleUpdateStatus = (convoId: string, status: Conversation['status']) => {
    provider.updateConversationStatus(convoId, status).catch((err) => {
      console.warn('CRM provider updateStatus notification:', err);
    });

    setConversations((prev) =>
      prev.map((c) => (c.id === convoId ? { ...c, status } : c))
    );
    showToast(
      'Status Updated',
      `Conversation marked as ${status.toUpperCase()}.`,
      status === 'resolved' ? 'success' : 'info'
    );
  };

  // Update conversation assignee
  const handleUpdateAssignee = (convoId: string, agentName: string) => {
    provider.updateConversationAssignee(convoId, agentName).catch((err) => {
      console.warn('CRM provider updateAssignee notification:', err);
    });

    setConversations((prev) =>
      prev.map((c) => (c.id === convoId ? { ...c, assignedAgent: agentName } : c))
    );
    showToast('Assignment Changed', `Reassigned conversation to ${agentName}.`, 'info');
  };

  // Add conversation label
  const handleAddLabel = (convoId: string, label: string) => {
    provider.addConversationLabel(convoId, label).catch((err) => {
      console.warn('CRM provider addLabel notification:', err);
    });

    setConversations((prev) =>
      prev.map((c) => (c.id === convoId && !c.labels.includes(label) ? { ...c, labels: [...c.labels, label] } : c))
    );
    showToast('Label Added', `Tagged with "${label}".`, 'success');
  };

  // Start chat with contact from Contacts directory
  const handleOpenConversationWithContact = (contact: Contact) => {
    provider.createConversationWithContact(contact).catch((err) => {
      console.warn('CRM provider createConversation notification:', err);
    });

    const existing = conversations.find(c => c.contactPhone === contact.phone);
    if (existing) {
      setActiveConvoId(existing.id);
      setCurrentSection('conversations');
    } else {
      const newConvoId = `convo-${Date.now()}`;
      const newConvo: Conversation = {
        id: newConvoId,
        contactId: contact.id,
        contactName: contact.name,
        contactPhone: contact.phone,
        contactEmail: contact.email,
        inbox: 'Agamagizh WhatsApp Main',
        channel: 'whatsapp',
        status: 'open',
        priority: 'medium',
        assignedAgent: 'Kavitha Sundaram',
        assignedTeam: 'Adyar Care Desk',
        labels: contact.labels,
        lastMessage: 'Conversation opened from Contacts directory.',
        lastTimestamp: 'Just now',
        unreadCount: 0,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'system',
            text: `Conversation initialized with ${contact.name} via WhatsApp.`,
            timestamp: 'Just now',
            status: 'read'
          }
        ]
      };
      setConversations([newConvo, ...conversations]);
      setActiveConvoId(newConvoId);
      setCurrentSection('conversations');
    }
  };

  // Add new Contact
  const handleAddNewContact = (contactData: Omit<Contact, 'id' | 'conversationsCount' | 'lastActivity'>) => {
    provider.createContact(contactData).catch((err) => {
      console.warn('CRM provider createContact notification:', err);
    });

    const newContact: Contact = {
      ...contactData,
      id: `cnt-${Date.now()}`,
      conversationsCount: 1,
      lastActivity: 'Just now'
    };
    setContacts([newContact, ...contacts]);
    showToast('Contact Created', `${newContact.name} saved to CRM directory.`, 'success');
  };

  // Pipeline card actions
  const handleMovePipelineStage = (cardId: string, newStageId: string) => {
    provider.movePipelineCard(cardId, newStageId).catch((err) => {
      console.warn('CRM provider movePipelineCard notification:', err);
    });

    setPipelineCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, stageId: newStageId } : c))
    );
    const card = pipelineCards.find((c) => c.id === cardId);
    showToast('Pipeline Advanced', `${card?.title || 'Card'} moved to stage.`, 'success');
  };

  const handleAddNewPipelineCard = (cardData: Omit<ClinicPipelineCard, 'id' | 'lastContacted'>) => {
    provider.createPipelineCard(cardData).catch((err) => {
      console.warn('CRM provider createPipelineCard notification:', err);
    });

    const newCard: ClinicPipelineCard = {
      ...cardData,
      id: `pipe-${Date.now()}`,
      lastContacted: 'Today'
    };
    setPipelineCards([newCard, ...pipelineCards]);
    showToast('Lead Created', `${newCard.title} added to intake pipeline.`, 'success');
  };

  // Create Campaign
  const handleCreateCampaign = (campaignData: any) => {
    provider.createCampaign(campaignData).catch((err) => {
      console.warn('CRM provider createCampaign notification:', err);
    });

    const newCmp: WhatsAppCampaign = {
      ...campaignData,
      id: `cmp-${Date.now()}`,
      createdAt: 'Just now',
      sentCount: campaignData.status === 'running' ? campaignData.totalRecipients : 0,
      deliveredCount: campaignData.status === 'running' ? Math.floor(campaignData.totalRecipients * 0.98) : 0,
      readCount: campaignData.status === 'running' ? Math.floor(campaignData.totalRecipients * 0.88) : 0,
      repliedCount: campaignData.status === 'running' ? Math.floor(campaignData.totalRecipients * 0.22) : 0,
      failedCount: 0,
      excludedCount: 8
    };
    setCampaigns([newCmp, ...campaigns]);
    showToast('Campaign Configured', `${newCmp.title} registered in queue.`, 'success');
  };

  // Quick Compose dispatch
  const handleQuickComposeSend = (recipient: string, message: string, templateId?: string) => {
    const matchedContact = contacts.find(c => c.phone.includes(recipient) || c.name.toLowerCase().includes(recipient.toLowerCase()));
    const contactName = matchedContact ? matchedContact.name : recipient;

    const newConvoId = `convo-out-${Date.now()}`;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newConvo: Conversation = {
      id: newConvoId,
      contactId: matchedContact ? matchedContact.id : `cnt-quick-${Date.now()}`,
      contactName,
      contactPhone: matchedContact ? matchedContact.phone : recipient,
      contactEmail: matchedContact ? matchedContact.email : '',
      inbox: 'Agamagizh WhatsApp Main',
      channel: 'whatsapp',
      status: 'open',
      priority: 'high',
      assignedAgent: 'Kavitha Sundaram',
      assignedTeam: 'Adyar Care Desk',
      labels: ['Outbound Reach', 'WhatsApp'],
      lastMessage: message,
      lastTimestamp: timeNow,
      unreadCount: 0,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'agent',
          senderName: 'Kavitha Sundaram',
          text: message,
          timestamp: timeNow,
          status: 'delivered'
        }
      ]
    };

    setConversations([newConvo, ...conversations]);
    setActiveConvoId(newConvoId);
    setCurrentSection('conversations');
    showToast('Message Dispatched', `Outbound WhatsApp sent to ${contactName}.`, 'success');
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const openConversationsCount = conversations.filter(c => c.status === 'open').length;

  // Render Internal Universal UI & System States Reference Surface
  if (isUiReferenceOpen) {
    return (
      <UIReferenceView 
        onBackToConsole={() => {
          setIsUiReferenceOpen(false);
          if (typeof window !== 'undefined' && window.history?.pushState) {
            window.history.pushState({}, '', '/');
          }
        }} 
      />
    );
  }

  return (
    <Shell
      currentSection={currentSection}
      currentWhatsAppSub={currentWhatsAppSub}
      onNavigate={handleNavigate}
      unreadCount={totalUnread}
      openConversationsCount={openConversationsCount}
      contactsCount={contacts.length}
      pipelineCount={pipelineCards.length}
      campaignsCount={campaigns.length}
      onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      onOpenQuickCompose={() => setIsQuickComposeOpen(true)}
    >
      {/* 1. MY INBOX */}
      {(currentSection === 'my_inbox' || (currentSection as any) === 'my-inbox') && (
        <MyInboxView
          conversations={conversations}
          activeConvoId={activeConvoId}
          onSelectConvo={(id) => setActiveConvoId(id)}
          onSendMessage={handleSendMessage}
          onUpdateStatus={handleUpdateStatus}
          onUpdateAssignee={handleUpdateAssignee}
          onAddLabel={handleAddLabel}
          onOpenContact={(contact) => handleOpenConversationWithContact(contact)}
          onOpenQuickCompose={() => setIsQuickComposeOpen(true)}
        />
      )}

      {/* 2. ALL CONVERSATIONS */}
      {currentSection === 'conversations' && (
        <ConversationsWorkbench
          conversations={conversations}
          activeConvoId={activeConvoId}
          onSelectConvo={(id) => setActiveConvoId(id)}
          onSendMessage={handleSendMessage}
          onUpdateStatus={handleUpdateStatus}
          onUpdateAssignee={handleUpdateAssignee}
          onAddLabel={handleAddLabel}
          filterChannel=""
          isWhatsAppInbox={false}
          onOpenQuickCompose={() => setIsQuickComposeOpen(true)}
          onOpenContact={(contact) => handleOpenConversationWithContact(contact)}
        />
      )}

      {/* 3. CAPTAIN AI HUB */}
      {currentSection === 'captain' && <CaptainView />}

      {/* 4. CONTACTS CRM */}
      {currentSection === 'contacts' && (
        <ContactsView
          contacts={contacts}
          onOpenConversationWithContact={handleOpenConversationWithContact}
          onAddNewContact={handleAddNewContact}
        />
      )}

      {/* 5. COMPANIES & ORGANIZATIONS */}
      {currentSection === 'companies' && <CompaniesView />}

      {/* 6. OPERATIONAL REPORTS */}
      {currentSection === 'reports' && <ReportsView />}

      {/* 7. CLINIC INTAKE PIPELINE */}
      {(currentSection === 'clinic_pipeline' || (currentSection as any) === 'clinic-pipeline') && (
        <ClinicPipelineView
          cards={pipelineCards}
          onMoveStage={handleMovePipelineStage}
          onOpenConversation={(card) => {
            const matched = conversations.find(c => c.contactPhone === card.contactPhone);
            if (matched) {
              setActiveConvoId(matched.id);
              setCurrentSection('conversations');
            } else {
              handleOpenConversationWithContact({
                id: `cnt-${card.id}`,
                name: card.contactName,
                phone: card.contactPhone,
                email: '',
                channel: 'whatsapp',
                status: 'active',
                labels: card.labels,
                conversationsCount: 1,
                lastActivity: 'Today',
                customAttributes: {}
              });
            }
          }}
          onAddNewCard={handleAddNewPipelineCard}
        />
      )}

      {/* 8. BROADCASTS & CAMPAIGNS */}
      {currentSection === 'campaigns' && (
        <CampaignsView
          campaigns={campaigns}
          onCreateCampaign={handleCreateCampaign}
          onViewAnalytics={() => handleNavigate('whatsapp', 'analytics')}
        />
      )}

      {/* 9. WHATSAPP SUITE */}
      {currentSection === 'whatsapp' && (
        <WhatsAppHub
          conversations={conversations}
          activeConvoId={activeConvoId}
          onSelectConvo={(id) => setActiveConvoId(id)}
          onSendMessage={handleSendMessage}
          onUpdateStatus={handleUpdateStatus}
          onUpdateAssignee={handleUpdateAssignee}
          onAddLabel={handleAddLabel}
          campaigns={campaigns}
          onCreateCampaign={handleCreateCampaign}
          currentWhatsAppSub={currentWhatsAppSub}
          onOpenQuickCompose={() => setIsQuickComposeOpen(true)}
          onOpenContact={(contact) => handleOpenConversationWithContact(contact)}
        />
      )}

      {/* 10. HELP CENTER & KNOWLEDGE BASE */}
      {(currentSection === 'help_center' || (currentSection as any) === 'help-center') && <HelpCenterView />}

      {/* 11. WORKSPACE SETTINGS */}
      {currentSection === 'settings' && <SettingsView />}

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
        contacts={contacts}
        conversations={conversations}
        onSelectContact={handleOpenConversationWithContact}
        onSelectConversation={(id) => {
          setActiveConvoId(id);
          setCurrentSection('conversations');
        }}
      />

      {/* Quick Compose Modal */}
      <QuickComposeModal
        isOpen={isQuickComposeOpen}
        onClose={() => setIsQuickComposeOpen(false)}
        contacts={contacts}
        onSend={handleQuickComposeSend}
        onSendMessage={(targetName, targetPhone, inbox, message) => {
          handleQuickComposeSend(targetPhone, message);
        }}
      />

      {/* Operational Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Internal Development Reference Quick-Access Trigger (Non-production navigation) */}
      <div className="fixed bottom-3 right-3 z-30 opacity-70 hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => {
            setIsUiReferenceOpen(true);
            if (typeof window !== 'undefined' && window.history?.pushState) {
              window.history.pushState({}, '', '/ui-reference');
            }
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 text-white text-[10px] font-mono font-medium shadow-md backdrop-blur-xs hover:bg-slate-900 border border-slate-700"
          title="Open Internal Universal UI Reference (/ui-reference)"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Dev: /ui-reference</span>
        </button>
      </div>
    </Shell>
  );
}

export default function App() {
  return (
    <CrmProvider>
      <AgamagizhConsoleApp />
    </CrmProvider>
  );
}
