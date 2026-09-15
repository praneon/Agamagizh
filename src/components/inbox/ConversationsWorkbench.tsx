import React, { useState } from 'react';
import { 
  Conversation, 
  Contact, 
  Message, 
  AgentUser 
} from '../../types';
import { 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Send, 
  Paperclip, 
  Lock, 
  CheckCheck, 
  Clock, 
  User, 
  Tag, 
  MoreVertical, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown,
  Building2, 
  FileText, 
  Smile, 
  ArrowLeft,
  Calendar,
  AlertCircle,
  Copy,
  ExternalLink,
  MessageSquare,
  Check,
  X,
  Plus,
  ShieldCheck,
  Download,
  RotateCcw
} from 'lucide-react';
import { AGENTS_LIST, INITIAL_CONTACTS } from '../../data/mockData';
import { WhatsAppEmbeddedSignupModal } from '../whatsapp/WhatsAppEmbeddedSignupModal';

interface ConversationsWorkbenchProps {
  conversations: Conversation[];
  activeConvoId: string;
  onSelectConvo: (id: string) => void;
  onSendMessage: (convoId: string, text: string, isPrivateNote?: boolean) => void;
  onUpdateStatus?: (convoId: string, status: Conversation['status']) => void;
  onUpdateAssignee?: (convoId: string, agentName: string) => void;
  onAddLabel?: (convoId: string, label: string) => void;
  filterChannel?: string;
  isWhatsAppInbox?: boolean;
  onOpenQuickCompose?: () => void;
  onOpenContact?: (contact: Contact) => void;
}

export const ConversationsWorkbench: React.FC<ConversationsWorkbenchProps> = ({
  conversations,
  activeConvoId,
  onSelectConvo,
  onSendMessage,
  onUpdateStatus,
  onUpdateAssignee,
  onAddLabel,
  filterChannel = 'whatsapp',
  isWhatsAppInbox = true,
  onOpenQuickCompose,
  onOpenContact
}) => {
  // Inbox / Channel filter
  const [selectedInbox, setSelectedInbox] = useState<'all' | 'main' | 'adyar'>('all');
  
  // Folder & status filters
  const [activeFolder, setActiveFolder] = useState<'mine' | 'unassigned' | 'all'>('all');
  const [activeStatus, setActiveStatus] = useState<'open' | 'pending' | 'snoozed' | 'resolved'>('open');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Composer state
  const [composerMode, setComposerMode] = useState<'reply' | 'note'>('reply');
  const [inputText, setInputText] = useState('');
  const [newLabelInput, setNewLabelInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);
  
  // UI Panels and Modals
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [mobilePane, setMobilePane] = useState<'list' | 'thread' | 'info'>('thread');
  const [isEmbeddedSignupOpen, setIsEmbeddedSignupOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showContactDetailsModal, setShowContactDetailsModal] = useState(false);
  const [showSnoozeDropdown, setShowSnoozeDropdown] = useState(false);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    // Channel filter
    if (filterChannel && c.channel !== filterChannel) return false;
    
    // Inbox filter
    if (selectedInbox === 'main' && !c.inbox.toLowerCase().includes('main')) return false;
    if (selectedInbox === 'adyar' && !c.inbox.toLowerCase().includes('adyar')) return false;
    
    // Status filter
    if (activeStatus && c.status !== activeStatus) return false;
    
    // Folder filter
    if (activeFolder === 'mine' && c.assignedAgent !== 'Kavitha Sundaram') return false;
    if (activeFolder === 'unassigned' && c.assignedAgent !== 'Unassigned') return false;
    
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.contactName.toLowerCase().includes(q) ||
        c.contactPhone.includes(q) ||
        c.lastMessage.toLowerCase().includes(q) ||
        c.labels.some(l => l.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Calculate folder counts
  const mineCount = conversations.filter(c => (filterChannel ? c.channel === filterChannel : true) && c.assignedAgent === 'Kavitha Sundaram').length;
  const unassignedCount = conversations.filter(c => (filterChannel ? c.channel === filterChannel : true) && c.assignedAgent === 'Unassigned').length;
  const allCount = conversations.filter(c => (filterChannel ? c.channel === filterChannel : true)).length;

  // Calculate status counts
  const openCount = conversations.filter(c => (filterChannel ? c.channel === filterChannel : true) && c.status === 'open').length;
  const pendingCount = conversations.filter(c => (filterChannel ? c.channel === filterChannel : true) && c.status === 'pending').length;
  const snoozedCount = conversations.filter(c => (filterChannel ? c.channel === filterChannel : true) && c.status === 'snoozed').length;
  const resolvedCount = conversations.filter(c => (filterChannel ? c.channel === filterChannel : true) && c.status === 'resolved').length;

  const activeConvo = conversations.find(c => c.id === activeConvoId) || filteredConversations[0] || conversations[0];

  // Matched contact record
  const matchedContact = INITIAL_CONTACTS.find(c => c.id === activeConvo?.contactId || c.phone === activeConvo?.contactPhone);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvo) return;

    onSendMessage(activeConvo.id, inputText, composerMode === 'note');
    setInputText('');
    setAttachedFile(null);
  };

  const handleInsertCanned = (phrase: string) => {
    setInputText(prev => prev ? `${prev} ${phrase}` : phrase);
  };

  const handleCopyPhone = () => {
    if (!activeConvo) return;
    navigator.clipboard?.writeText(activeConvo.contactPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleOpenContactAction = () => {
    if (matchedContact && onOpenContact) {
      onOpenContact(matchedContact);
    } else {
      setShowContactDetailsModal(true);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[#F4F5F7] overflow-hidden">
      {/* ========================================================================= */}
      {/* WORKSPACE HEADER: Page-relevant controls only (No duplicate module tabs)  */}
      {/* ========================================================================= */}
      {isWhatsAppInbox && (
        <div className="bg-white border-b border-[#E3E5E9] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs z-10">
          <div className="flex items-center gap-3">
            {/* Title & Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                WA
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">WhatsApp Inbox</h1>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Official Cloud API
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block -mt-0.5">
                  WhatsApp-filtered view of canonical Chatwoot conversations
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* Optional Inbox / Channel Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 hidden md:inline">Inbox:</span>
              <select
                value={selectedInbox}
                onChange={(e) => setSelectedInbox(e.target.value as any)}
                className="text-xs font-bold text-slate-800 bg-[#F4F5F7] hover:bg-slate-100 border border-[#E3E5E9] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] cursor-pointer transition-colors"
              >
                <option value="all">All WhatsApp Inboxes (2 Desks)</option>
                <option value="main">Agamagizh WhatsApp Main (+91 98401 23456)</option>
                <option value="adyar">Adyar Reception Desk (+91 98402 34567)</option>
              </select>
            </div>
          </div>

          {/* Right Action Controls: Cloud API Status & Outbound Message */}
          <div className="flex items-center gap-2.5">
            {/* Meta Cloud API Connection Badge */}
            <button
              onClick={() => setIsEmbeddedSignupOpen(true)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Click to view Meta WhatsApp Cloud API Connection Details"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">+91 98401 98401</span>
              <span className="text-[9px] font-extrabold uppercase bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                Connected
              </span>
            </button>

            {/* Page Action: New Outbound WhatsApp Message */}
            {onOpenQuickCompose && (
              <button
                onClick={onOpenQuickCompose}
                className="px-3 py-1.5 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                title="Compose new outbound WhatsApp message"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New WhatsApp Message</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* THREE-PANE CONVERSATION WORKBENCH                                         */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* ----------------------------------------------------------------------- */}
        {/* PANE 1: Left Conversation Directory                                      */}
        {/* ----------------------------------------------------------------------- */}
        <div className={`w-full md:w-80 lg:w-88 xl:w-96 bg-white border-r border-[#E3E5E9] flex flex-col shrink-0 ${
          mobilePane !== 'list' ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Top Filter Controls: Assignment Folders & Search & Status */}
          <div className="p-3 border-b border-[#E3E5E9] space-y-2.5 bg-white shrink-0">
            {/* Folder Tabs: Mine / Unassigned / All */}
            <div className="grid grid-cols-3 gap-1 bg-[#F4F5F7] p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveFolder('mine')}
                className={`py-1.5 rounded-lg transition-colors text-center flex items-center justify-center gap-1.5 ${
                  activeFolder === 'mine'
                    ? 'bg-white text-[#5A4AD2] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Mine</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeFolder === 'mine' ? 'bg-[#EEECFB] text-[#5A4AD2]' : 'bg-slate-200 text-slate-600'
                }`}>
                  {mineCount}
                </span>
              </button>

              <button
                onClick={() => setActiveFolder('unassigned')}
                className={`py-1.5 rounded-lg transition-colors text-center flex items-center justify-center gap-1.5 ${
                  activeFolder === 'unassigned'
                    ? 'bg-white text-[#5A4AD2] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Unassigned</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeFolder === 'unassigned' ? 'bg-[#EEECFB] text-[#5A4AD2]' : 'bg-slate-200 text-slate-600'
                }`}>
                  {unassignedCount}
                </span>
              </button>

              <button
                onClick={() => setActiveFolder('all')}
                className={`py-1.5 rounded-lg transition-colors text-center flex items-center justify-center gap-1.5 ${
                  activeFolder === 'all'
                    ? 'bg-white text-[#5A4AD2] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>All</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeFolder === 'all' ? 'bg-[#EEECFB] text-[#5A4AD2]' : 'bg-slate-200 text-slate-600'
                }`}>
                  {allCount}
                </span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations, contacts, labels..."
                className="w-full text-xs pl-8.5 pr-8 py-1.5 bg-[#F4F5F7] border border-[#E3E5E9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white text-slate-800 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-[11px]">
              {(['open', 'pending', 'snoozed', 'resolved'] as const).map((st) => {
                const count = st === 'open' ? openCount : st === 'pending' ? pendingCount : st === 'snoozed' ? snoozedCount : resolvedCount;
                const isSelected = activeStatus === st;
                return (
                  <button
                    key={st}
                    onClick={() => setActiveStatus(st)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-colors shrink-0 flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#5A4AD2] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{st}</span>
                    <span className={`text-[9px] px-1 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversation List Rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-600">No conversations found</p>
                <p className="text-[11px]">No chats match the selected folder, status, or search query.</p>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c.id === activeConvo?.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectConvo(c.id);
                      setMobilePane('thread');
                    }}
                    className={`p-3.5 cursor-pointer transition-all relative select-none ${
                      isSelected
                        ? 'bg-[#EEECFB]/75 border-l-4 border-[#5A4AD2]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Row Top: Contact Name & Timestamp */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#5A4AD2]/10 text-[#5A4AD2] font-bold text-xs flex items-center justify-center shrink-0">
                          {c.contactName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            {c.contactName}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {c.contactPhone}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {c.lastTimestamp}
                      </span>
                    </div>

                    {/* Message Preview */}
                    <p className="text-xs text-slate-600 line-clamp-1 mb-1.5 pl-10 font-normal">
                      {c.lastMessage}
                    </p>

                    {/* Row Bottom: Channel indicator, Labels, Assignment & Unread count */}
                    <div className="flex items-center justify-between pl-10 text-[10px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* WhatsApp Indicator */}
                        <span className="px-1.5 py-0.2 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          WhatsApp
                        </span>

                        {/* Assigned Agent badge */}
                        <span className="text-slate-500 font-medium">
                          {(c.assignedAgent || 'Unassigned').split(' ')[0]}
                        </span>

                        {/* Labels */}
                        {c.labels?.slice(0, 1).map((lbl, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                            {lbl}
                          </span>
                        ))}

                        {/* Status badge if not Open */}
                        {c.status !== 'open' && (
                          <span className={`px-1.5 py-0.2 rounded font-bold capitalize ${
                            c.status === 'resolved' 
                              ? 'bg-slate-100 text-slate-500' 
                              : c.status === 'snoozed'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {c.status}
                          </span>
                        )}
                      </div>

                      {/* Unread Counter */}
                      {c.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#5A4AD2] text-white font-bold flex items-center justify-center text-[9px] shadow-2xs shrink-0">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* PANE 2: Central Conversation Thread & Composer                           */}
        {/* ----------------------------------------------------------------------- */}
        {activeConvo ? (
          <div className={`flex-1 bg-[#F4F5F7] flex flex-col overflow-hidden ${
            mobilePane === 'list' ? 'hidden md:flex' : mobilePane === 'info' ? 'hidden lg:flex' : 'flex'
          }`}>
            {/* Thread Header */}
            <div className="h-14 bg-white border-b border-[#E3E5E9] px-4 flex items-center justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setMobilePane('list')}
                  className="md:hidden p-1 text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="w-9 h-9 rounded-full bg-[#5A4AD2] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                  {activeConvo.contactName.charAt(0)}
                </div>
                
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900 truncate">{activeConvo.contactName}</h2>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>WhatsApp</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {activeConvo.inbox} • Assigned: <span className="font-semibold text-slate-700">{activeConvo.assignedAgent}</span>
                  </p>
                </div>
              </div>

              {/* Thread Action Controls */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Status selector dropdown */}
                <select
                  value={activeConvo.status}
                  onChange={(e) => onUpdateStatus && onUpdateStatus(activeConvo.id, e.target.value as any)}
                  className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#5A4AD2] capitalize cursor-pointer transition-colors"
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="snoozed">Snoozed</option>
                  <option value="resolved">Resolved</option>
                </select>

                {/* Primary Resolve / Reopen Button */}
                <button
                  onClick={() => onUpdateStatus && onUpdateStatus(activeConvo.id, activeConvo.status === 'resolved' ? 'open' : 'resolved')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeConvo.status === 'resolved'
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{activeConvo.status === 'resolved' ? 'Reopen' : 'Resolve'}</span>
                </button>

                {/* Toggle Context Panel Button */}
                <button
                  onClick={() => {
                    setShowRightPanel(!showRightPanel);
                    setMobilePane(mobilePane === 'info' ? 'thread' : 'info');
                  }}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-colors ${
                    showRightPanel
                      ? 'bg-[#EEECFB] text-[#5A4AD2] border-[#5A4AD2]/30 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                  title="Toggle Contact Details & Context Panel"
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Stream: Incoming, Outgoing, Internal Note, System Event, Attachment */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {activeConvo.messages?.map((m) => {
                // 1. Internal Team Note (Chatwoot amber note)
                if (m.isPrivateNote) {
                  return (
                    <div key={m.id} className="max-w-xl mx-auto bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 text-xs shadow-2xs my-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 mb-1.5 pb-1 border-b border-amber-200/60">
                        <div className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Internal Note by {m.senderName || 'Agent'}</span>
                        </div>
                        <span className="font-normal text-amber-700">{m.timestamp}</span>
                      </div>
                      <p className="text-amber-950 font-medium whitespace-pre-wrap leading-relaxed">{m.text}</p>
                    </div>
                  );
                }

                // 2. System Event (Chatwoot system notification)
                if (m.sender === 'system') {
                  return (
                    <div key={m.id} className="text-center my-2">
                      <span className="text-[11px] font-medium bg-slate-200/80 text-slate-600 px-3.5 py-1 rounded-full shadow-2xs inline-block">
                        {m.text}
                      </span>
                    </div>
                  );
                }

                const isAgent = m.sender === 'agent';

                // 3. Customer Incoming Message & Agent Outgoing Message
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`max-w-md lg:max-w-lg rounded-2xl p-3.5 text-xs shadow-2xs ${
                      isAgent
                        ? 'bg-[#5A4AD2] text-white rounded-br-xs'
                        : 'bg-white text-slate-900 border border-[#E3E5E9] rounded-bl-xs'
                    }`}>
                      {/* Sender label */}
                      <span className={`text-[10px] font-bold block mb-1 ${
                        isAgent ? 'text-purple-200' : 'text-slate-500'
                      }`}>
                        {isAgent ? m.senderName || 'Agent' : activeConvo.contactName}
                      </span>

                      {/* Text content */}
                      <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>

                      {/* Document Attachment where useful */}
                      {m.attachments && m.attachments.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-white/20 space-y-1.5">
                          {m.attachments.map((att, idx) => (
                            <div key={idx} className={`flex items-center gap-2 p-2 rounded-xl text-[11px] ${
                              isAgent ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800'
                            }`}>
                              <FileText className="w-4 h-4 text-[#5A4AD2]" />
                              <div className="min-w-0 flex-1">
                                <span className="font-semibold block truncate">{att.name}</span>
                                <span className="text-[10px] opacity-75">{att.size} • PDF Document</span>
                              </div>
                              <button 
                                type="button" 
                                className="p-1 hover:bg-black/10 rounded transition-colors"
                                title="Download attachment"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Timestamp & Read/Delivered ticks */}
                      <div className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] ${
                        isAgent ? 'text-purple-200' : 'text-slate-400'
                      }`}>
                        <span>{m.timestamp}</span>
                        {isAgent && (
                          <CheckCheck className={`w-3.5 h-3.5 ${m.status === 'read' ? 'text-emerald-300' : 'text-purple-200'}`} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* =================================================================== */}
            {/* STICKY WORKBENCH COMPOSER                                            */}
            {/* =================================================================== */}
            <div className="p-3 bg-white border-t border-[#E3E5E9] shrink-0 space-y-2">
              {/* Mode Switcher: Reply vs Private Note & Quick Canned Responses */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Reply vs Private Note Mode Switcher */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setComposerMode('reply')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      composerMode === 'reply'
                        ? 'bg-[#5A4AD2] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    WhatsApp Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerMode('note')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      composerMode === 'note'
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Lock className="w-3 h-3" />
                    <span>Private Note</span>
                  </button>
                </div>

                {/* Canonical Canned Response / Macro Access */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 overflow-x-auto no-scrollbar">
                  <span className="hidden sm:inline font-medium">Quick macro:</span>
                  <button
                    type="button"
                    onClick={() => handleInsertCanned('Vanakkam! Welcome to Agamagizh. How may we help you today?')}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors"
                  >
                    /greeting
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertCanned('Our clinic timings are Monday to Saturday from 08:30 AM to 07:30 PM.')}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors"
                  >
                    /timings
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertCanned('To reschedule your appointment, please let us know your preferred slot.')}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors"
                  >
                    /reschedule
                  </button>
                </div>
              </div>

              {/* Internal Note Distinction Banner */}
              {composerMode === 'note' && (
                <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2 font-medium">
                  <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>INTERNAL NOTE — Only visible to team members; will NOT be sent to the customer on WhatsApp.</span>
                </div>
              )}

              {/* Attached file preview chip if present */}
              {attachedFile && (
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900">
                  <FileText className="w-3.5 h-3.5 text-[#5A4AD2]" />
                  <span>{attachedFile.name}</span>
                  <span className="text-[10px] text-purple-600">({attachedFile.size})</span>
                  <button 
                    onClick={() => setAttachedFile(null)}
                    className="text-purple-400 hover:text-purple-700 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Message Composer Form */}
              <form onSubmit={handleSend} className="space-y-2">
                <div className="relative">
                  <textarea
                    rows={3}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      composerMode === 'reply'
                        ? `Type WhatsApp message to ${activeConvo.contactName}... (Enter to send, Shift+Enter for newline)`
                        : 'Write an internal private note for teammates...'
                    }
                    className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                      composerMode === 'note'
                        ? 'bg-amber-50/70 border-amber-300 focus:ring-amber-500 text-amber-950 placeholder-amber-700/60'
                        : 'bg-slate-50 border-[#E3E5E9] focus:ring-[#5A4AD2] focus:bg-white text-slate-900 placeholder-slate-400'
                    }`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  {/* Left Controls: Attachment & Emoji */}
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <button 
                      type="button" 
                      onClick={() => setAttachedFile({ name: 'Clinic-Timings-Saturday.pdf', size: '185 KB' })}
                      className="p-1.5 hover:text-[#5A4AD2] hover:bg-slate-100 rounded-lg transition-colors"
                      title="Attach file / document"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleInsertCanned('😊')}
                      className="p-1.5 hover:text-[#5A4AD2] hover:bg-slate-100 rounded-lg transition-colors"
                      title="Insert emoji"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Send / Save Note Button */}
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-colors disabled:opacity-40 shadow-xs ${
                      composerMode === 'note'
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-[#5A4AD2] hover:bg-[#4C3DC2]'
                    }`}
                  >
                    {composerMode === 'note' ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Save Internal Note</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400 p-8 text-center">
            Select a conversation from the left to view messages and details
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* PANE 3: Right Contact & Conversation Context Panel                       */}
        {/* ----------------------------------------------------------------------- */}
        {showRightPanel && activeConvo && (
          <div className={`w-full lg:w-72 xl:w-80 bg-white border-l border-[#E3E5E9] flex flex-col shrink-0 overflow-y-auto p-4 space-y-4 ${
            mobilePane === 'info' ? 'flex' : 'hidden lg:flex'
          }`}>
            {/* Header with Close on Mobile */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Conversation Context</span>
              <button
                onClick={() => setMobilePane('thread')}
                className="lg:hidden p-1 text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* 1. CONTACT Details Card */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#EEECFB] text-[#5A4AD2] font-extrabold text-base flex items-center justify-center shrink-0 border border-[#5A4AD2]/20 shadow-2xs">
                  {activeConvo.contactName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 truncate">{activeConvo.contactName}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{activeConvo.contactPhone}</span>
                    <button 
                      onClick={handleCopyPhone} 
                      className="text-slate-400 hover:text-[#5A4AD2] transition-colors"
                      title="Copy phone number"
                    >
                      {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  {activeConvo.contactEmail && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{activeConvo.contactEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Actions: Open Contact & View Conversation History */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200/60">
                <button
                  onClick={handleOpenContactAction}
                  className="px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-center gap-1 transition-colors"
                >
                  <User className="w-3 h-3 text-[#5A4AD2]" />
                  <span>Open Contact</span>
                </button>
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-center gap-1 transition-colors"
                >
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>History</span>
                </button>
              </div>
            </div>

            {/* 2. ASSIGNMENT: Agent & Team */}
            <div className="space-y-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Assignment</span>
              
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Assigned Agent</label>
                <select
                  value={activeConvo.assignedAgent}
                  onChange={(e) => onUpdateAssignee && onUpdateAssignee(activeConvo.id, e.target.value)}
                  className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#5A4AD2]"
                >
                  {AGENTS_LIST.map((ag) => (
                    <option key={ag.id} value={ag.name}>{ag.name}</option>
                  ))}
                  <option value="Unassigned">Unassigned</option>
                </select>
              </div>

              <div className="pt-1">
                <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Assigned Team</label>
                <div className="text-xs font-semibold text-slate-800 p-1.5 bg-white rounded-lg border border-slate-200">
                  {activeConvo.assignedTeam}
                </div>
              </div>
            </div>

            {/* 3. CONVERSATION Operational Metadata */}
            <div className="space-y-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Conversation</span>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Inbox / Channel:</span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[140px]">{activeConvo.inbox}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] capitalize ${
                    activeConvo.status === 'open'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeConvo.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : activeConvo.status === 'snoozed'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {activeConvo.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Last Activity:</span>
                  <span className="font-semibold text-slate-800">{activeConvo.lastTimestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Priority:</span>
                  <span className={`font-semibold capitalize ${
                    activeConvo.priority === 'high' ? 'text-rose-600' : activeConvo.priority === 'medium' ? 'text-amber-600' : 'text-slate-600'
                  }`}>
                    {activeConvo.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. LABELS: Conversation & Contact Labels */}
            <div className="space-y-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Labels
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeConvo.labels?.map((lbl, idx) => (
                  <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEECFB] text-[#5A4AD2] border border-[#5A4AD2]/20">
                    {lbl}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 pt-1">
                <input
                  type="text"
                  placeholder="Add label..."
                  value={newLabelInput}
                  onChange={(e) => setNewLabelInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newLabelInput.trim()) {
                      onAddLabel && onAddLabel(activeConvo.id, newLabelInput.trim());
                      setNewLabelInput('');
                    }
                  }}
                  className="flex-1 text-xs px-2.5 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5A4AD2]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newLabelInput.trim()) {
                      onAddLabel && onAddLabel(activeConvo.id, newLabelInput.trim());
                      setNewLabelInput('');
                    }
                  }}
                  className="p-1 bg-[#5A4AD2] text-white rounded-lg text-xs hover:bg-[#4C3DC2]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 5. CUSTOM ATTRIBUTES: Generic supported custom attributes only */}
            {activeConvo.customAttributes && Object.keys(activeConvo.customAttributes).length > 0 && (
              <div className="space-y-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                <span className="text-xs font-bold text-slate-700 block">Custom Attributes</span>
                <div className="space-y-1.5 text-xs">
                  {Object.entries(activeConvo.customAttributes).map(([key, val]) => (
                    <div key={key} className="p-2 bg-white rounded-lg border border-slate-200/70">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">{key}</span>
                      <span className="font-semibold text-slate-800">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. RECENT CONVERSATIONS: Compact history where useful */}
            <div className="space-y-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Recent Conversations</span>
                <span className="text-[10px] text-slate-400 font-medium">History</span>
              </div>
              <div className="space-y-1.5">
                <div className="p-2 bg-white rounded-lg border border-slate-200/70 space-y-0.5">
                  <span className="font-semibold text-slate-800 text-[11px] block truncate">
                    Weekend clinic timings inquiry
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Resolved</span>
                    <span>Sep 10</span>
                  </div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200/70 space-y-0.5">
                  <span className="font-semibold text-slate-800 text-[11px] block truncate">
                    Invoice copy & GST statement
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Resolved</span>
                    <span>Aug 24</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. SLA Operational Metadata: Chatwoot operational field */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>First Response SLA: Met</span>
              </div>
              <p className="text-[11px] text-emerald-900">
                Logged in 3m 40s (Target: &lt; 15m) • Chatwoot SLA compliant.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Signup Modal */}
      <WhatsAppEmbeddedSignupModal
        isOpen={isEmbeddedSignupOpen}
        onClose={() => setIsEmbeddedSignupOpen(false)}
      />

      {/* Full Contact Details Modal fallback */}
      {showContactDetailsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#5A4AD2]" />
                <h3 className="text-sm font-bold text-slate-900">Contact Record</h3>
              </div>
              <button 
                onClick={() => setShowContactDetailsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Name</span>
                <p className="text-sm font-bold text-slate-900">{activeConvo?.contactName}</p>
                <p className="text-slate-600">{activeConvo?.contactPhone}</p>
                <p className="text-slate-600">{activeConvo?.contactEmail}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Canonical Attributes</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Channel</span>
                    <span className="font-semibold text-slate-800">WhatsApp WABA</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Total Chats</span>
                    <span className="font-semibold text-slate-800">3 Conversations</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowContactDetailsModal(false)}
                className="px-4 py-2 bg-[#5A4AD2] text-white rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conversation History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5A4AD2]" />
                <h3 className="text-sm font-bold text-slate-900">Conversation History • {activeConvo?.contactName}</h3>
              </div>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">WhatsApp Inquiry • Saturday Timings</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">Latest message: "Could you share the clinic timings for this Saturday?"</p>
                <span className="text-[10px] text-slate-400 block">Today 10:42 AM • Assigned to Kavitha Sundaram</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Inquiry on Adyar center visit slots</span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    Resolved
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">Inquired about morning vs evening slots and center location guidance.</p>
                <span className="text-[10px] text-slate-400 block">Sep 10, 2026 • Assigned to Kavitha Sundaram</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">GST Invoice Statement Dispatch</span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    Resolved
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">Dispatched consolidated wellness invoice PDF via WhatsApp Cloud API.</p>
                <span className="text-[10px] text-slate-400 block">Aug 24, 2026 • Assigned to Priya Narayanan</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
