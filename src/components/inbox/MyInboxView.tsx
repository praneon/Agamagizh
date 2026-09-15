import React, { useState, useRef, useEffect } from 'react';
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
  RotateCcw,
  Inbox,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { AGENTS_LIST, CURRENT_USER, INITIAL_CONTACTS } from '../../data/mockData';

interface MyInboxViewProps {
  conversations: Conversation[];
  activeConvoId: string;
  onSelectConvo: (id: string) => void;
  onSendMessage: (convoId: string, text: string, isPrivateNote?: boolean) => void;
  onUpdateStatus?: (convoId: string, status: Conversation['status']) => void;
  onUpdateAssignee?: (convoId: string, agentName: string) => void;
  onAddLabel?: (convoId: string, label: string) => void;
  onOpenContact?: (contact: Contact) => void;
  onOpenQuickCompose?: () => void;
}

export const MyInboxView: React.FC<MyInboxViewProps> = ({
  conversations = [],
  activeConvoId,
  onSelectConvo,
  onSendMessage,
  onUpdateStatus,
  onUpdateAssignee,
  onAddLabel,
  onOpenContact,
  onOpenQuickCompose
}) => {
  // Operational Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'pending' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'unread' | 'oldest'>('newest');

  // Simulated System States (for previewing loading, error, and caught up states)
  const [viewState, setViewState] = useState<'ready' | 'loading' | 'error' | 'caught_up'>('ready');

  // Composer State
  const [composerMode, setComposerMode] = useState<'reply' | 'note'>('reply');
  const [inputText, setInputText] = useState('');
  const [newLabelInput, setNewLabelInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);

  // Right Context Panel & Mobile Responsive Panes
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [mobilePane, setMobilePane] = useState<'list' | 'thread' | 'info'>('list');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showSnoozeDropdown, setShowSnoozeDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  // Accessibility: focus tracking
  const togglePanelButtonRef = useRef<HTMLButtonElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Filter conversations strictly relevant to the signed-in agent
  // Current user is Kavitha Sundaram
  const agentConversations = conversations.filter(
    (c) => c.assignedAgent === CURRENT_USER.name || c.assignedAgent === 'Kavitha Sundaram'
  );

  // Apply status and search filters
  const filteredConversations = agentConversations
    .filter((c) => {
      // Status Filter
      if (statusFilter !== 'all' && c.status !== statusFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (c.contactName || '').toLowerCase().includes(q);
        const matchesPhone = (c.contactPhone || '').includes(q);
        const matchesMessage = (c.lastMessage || '').toLowerCase().includes(q);
        const matchesLabel = (c.labels || []).some((l) => l.toLowerCase().includes(q));
        const matchesInbox = (c.inbox || '').toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesMessage || matchesLabel || matchesInbox;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'unread') {
        return (b.unreadCount || 0) - (a.unreadCount || 0);
      }
      if (sortBy === 'oldest') {
        return a.id.localeCompare(b.id);
      }
      // default: newest
      return b.id.localeCompare(a.id);
    });

  // Calculate status counts for personal queue tabs
  const openCount = agentConversations.filter((c) => c.status === 'open').length;
  const pendingCount = agentConversations.filter((c) => c.status === 'pending').length;
  const resolvedCount = agentConversations.filter((c) => c.status === 'resolved').length;
  const totalUnreadCount = agentConversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);

  // Find currently selected conversation
  const activeConvo = agentConversations.find((c) => c.id === activeConvoId) || 
    (filteredConversations.length > 0 ? filteredConversations[0] : null);

  // When activeConvo changes on mobile, move to thread
  const handleSelectConversation = (id: string) => {
    onSelectConvo(id);
    setMobilePane('thread');
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (activeConvo && mobilePane === 'thread') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConvo?.messages?.length, activeConvoId, mobilePane]);

  // Handle composer submission
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvo) return;

    const isNote = composerMode === 'note';
    onSendMessage(activeConvo.id, inputText.trim(), isNote);
    setInputText('');
    setAttachedFile(null);
  };

  const handleCopyPhone = () => {
    if (activeConvo?.contactPhone) {
      navigator.clipboard.writeText(activeConvo.contactPhone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleInsertCanned = (text: string) => {
    setInputText((prev) => (prev ? `${prev} ${text}` : text));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  // Close context panel and return focus
  const handleCloseContextPanel = () => {
    setShowRightPanel(false);
    if (mobilePane === 'info') {
      setMobilePane('thread');
    }
    togglePanelButtonRef.current?.focus();
  };

  // =========================================================================
  // 1. SIMULATED / ERROR STATE
  // =========================================================================
  if (viewState === 'error') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F4F5F7] min-h-[600px]">
        <div 
          id="my-inbox-error-card"
          className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">We couldn't load your inbox.</h2>
            <p className="text-xs text-slate-500 mt-1">
              An unexpected network glitch occurred while syncing your operational conversations.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setViewState('ready')}
              className="px-4 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#5A4AD2]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              type="button"
              onClick={() => setViewState('ready')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. LOADING STATE (Dense Skeletons for Rows, Thread & Context)
  // =========================================================================
  if (viewState === 'loading') {
    return (
      <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-[#F4F5F7] overflow-hidden">
        {/* Compact Skeleton Header */}
        <div className="bg-white border-b border-[#E3E5E9] px-6 py-3 shrink-0 flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-5 w-28 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-64 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-48 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-8 w-24 bg-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* 3-Pane Workbench Skeletons */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Queue Skeleton */}
          <div className="w-full sm:w-80 lg:w-96 bg-white border-r border-[#E3E5E9] p-3 space-y-3 shrink-0">
            <div className="h-8 bg-slate-100 rounded-xl animate-pulse" />
            <div className="space-y-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-3 border border-slate-100 rounded-xl space-y-2 bg-slate-50/50 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200" />
                      <div className="h-3.5 w-24 bg-slate-200 rounded" />
                    </div>
                    <div className="h-2.5 w-12 bg-slate-200 rounded" />
                  </div>
                  <div className="h-3 w-48 bg-slate-200 rounded ml-10" />
                  <div className="flex items-center gap-1.5 ml-10">
                    <div className="h-4 w-12 bg-slate-200 rounded" />
                    <div className="h-4 w-16 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center Thread Skeleton */}
          <div className="hidden sm:flex flex-1 flex-col bg-slate-50 border-r border-[#E3E5E9]">
            <div className="h-14 bg-white border-b border-[#E3E5E9] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-3.5 w-32 bg-slate-200 rounded animate-pulse" />
                  <div className="h-2.5 w-20 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-7 w-20 bg-slate-200 rounded-lg animate-pulse" />
            </div>
            <div className="flex-1 p-6 space-y-4">
              <div className="flex justify-start">
                <div className="h-14 w-64 bg-slate-200 rounded-2xl animate-pulse" />
              </div>
              <div className="flex justify-end">
                <div className="h-16 w-72 bg-[#EEECFB] rounded-2xl animate-pulse" />
              </div>
              <div className="flex justify-start">
                <div className="h-12 w-56 bg-slate-200 rounded-2xl animate-pulse" />
              </div>
            </div>
            <div className="h-20 bg-white border-t border-[#E3E5E9] p-3 animate-pulse" />
          </div>

          {/* Right Context Skeleton */}
          <div className="hidden lg:flex w-80 bg-white p-4 flex-col space-y-4 shrink-0">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl animate-pulse">
              <div className="w-10 h-10 rounded-full bg-slate-200" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-28 bg-slate-200 rounded" />
                <div className="h-2.5 w-20 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="h-28 bg-slate-50 rounded-xl animate-pulse" />
            <div className="h-32 bg-slate-50 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Quick toggle to exit preview skeleton */}
        <div className="bg-slate-900 text-white text-[11px] py-1 px-4 text-center flex items-center justify-between">
          <span>Viewing loading skeleton demonstration</span>
          <button 
            type="button" 
            onClick={() => setViewState('ready')}
            className="text-purple-200 underline hover:text-white"
          >
            Switch to Interactive Mode
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. MAIN WORKBENCH LAYOUT
  // =========================================================================
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-[#F4F5F7] overflow-hidden">
      {/* ------------------------------------------------------------------- */}
      {/* COMPACT PAGE HEADER                                                 */}
      {/* ------------------------------------------------------------------- */}
      <div 
        id="my-inbox-header"
        className="bg-white border-b border-[#E3E5E9] px-4 sm:px-6 py-2.5 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-[#323739] tracking-tight">
              My Inbox
            </h1>
            {totalUnreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5A4AD2] text-white">
                {totalUnreadCount} unread
              </span>
            )}
          </div>
          <p className="text-[12px] text-slate-500 font-medium leading-tight">
            Conversations assigned to you and items that need your attention.
          </p>
        </div>

        {/* Header Controls: Search, Status Filter & Preview State Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Compact Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="my-inbox-search"
              aria-label="Search my conversations"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-[#E3E5E9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] text-slate-800 placeholder-slate-400 w-44 sm:w-56 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <select
            id="my-inbox-sort"
            aria-label="Sort conversations"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 bg-slate-50 border border-[#E3E5E9] rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#5A4AD2]"
          >
            <option value="newest">Newest activity</option>
            <option value="unread">Unread first</option>
            <option value="oldest">Oldest activity</option>
          </select>

          {/* Quick Action: Quick Compose */}
          {onOpenQuickCompose && (
            <button
              type="button"
              id="my-inbox-quick-compose-btn"
              onClick={onOpenQuickCompose}
              className="px-3 py-1.5 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#5A4AD2]"
              title="Compose new conversation"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Message</span>
            </button>
          )}

          {/* State Demo Switcher Dropdown (Restrained, for checking All Caught Up, Loading, Error) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStateDropdown(!showStateDropdown)}
              aria-label="Toggle demo state preview"
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-600 flex items-center gap-1 transition-colors"
              title="Preview inbox states (Loading, Error, All Caught Up)"
            >
              <span>State: {viewState === 'ready' ? 'Normal' : viewState}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showStateDropdown && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Operational View State
                </div>
                <button
                  type="button"
                  onClick={() => { setViewState('ready'); setShowStateDropdown(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 text-xs flex items-center justify-between ${viewState === 'ready' ? 'font-bold text-[#5A4AD2]' : 'text-slate-700'}`}
                >
                  <span>Interactive Queue</span>
                  {viewState === 'ready' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => { setViewState('caught_up'); setShowStateDropdown(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 text-xs flex items-center justify-between ${viewState === 'caught_up' ? 'font-bold text-[#5A4AD2]' : 'text-slate-700'}`}
                >
                  <span>All Caught Up</span>
                  {viewState === 'caught_up' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => { setViewState('loading'); setShowStateDropdown(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-xs text-slate-700 flex items-center justify-between"
                >
                  <span>Loading Skeletons</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setViewState('error'); setShowStateDropdown(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-xs text-rose-600 flex items-center justify-between"
                >
                  <span>Error State</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3-PANE OPERATIONAL WORKBENCH                                         */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================================================================= */}
        {/* LEFT / PRIMARY QUEUE (Personal Conversation List)                 */}
        {/* ================================================================= */}
        <div 
          id="my-inbox-queue-pane"
          className={`${
            mobilePane === 'list' ? 'flex' : 'hidden sm:flex'
          } w-full sm:w-80 lg:w-96 bg-white border-r border-[#E3E5E9] flex-col shrink-0 overflow-hidden`}
        >
          {/* Status Filter Tabs */}
          <div className="p-2.5 border-b border-slate-100 shrink-0 bg-slate-50/50">
            <div 
              role="tablist" 
              aria-label="Conversation Status Filters"
              className="grid grid-cols-4 gap-1 p-0.5 bg-slate-200/70 rounded-xl text-xs font-semibold text-slate-600"
            >
              <button
                type="button"
                role="tab"
                aria-selected={statusFilter === 'all'}
                onClick={() => setStatusFilter('all')}
                className={`py-1 rounded-lg text-center transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white text-[#5A4AD2] shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                All ({agentConversations.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={statusFilter === 'open'}
                onClick={() => setStatusFilter('open')}
                className={`py-1 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  statusFilter === 'open'
                    ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <span>Open</span>
                {openCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={statusFilter === 'pending'}
                onClick={() => setStatusFilter('pending')}
                className={`py-1 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  statusFilter === 'pending'
                    ? 'bg-white text-amber-700 shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <span>Pending</span>
                {pendingCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                )}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={statusFilter === 'resolved'}
                onClick={() => setStatusFilter('resolved')}
                className={`py-1 rounded-lg text-center transition-all ${
                  statusFilter === 'resolved'
                    ? 'bg-white text-slate-800 shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Conversation Rows List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {/* 1. ALL CAUGHT UP STATE */}
            {(viewState === 'caught_up' || (agentConversations.length === 0 && !searchQuery)) ? (
              <div 
                id="my-inbox-all-caught-up"
                className="p-8 text-center flex flex-col items-center justify-center h-full space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-[#EEECFB] text-[#5A4AD2] flex items-center justify-center border border-[#5A4AD2]/20 shadow-2xs">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <h3 className="text-sm font-bold text-slate-900">
                    You're all caught up
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    There are no active conversations assigned to you right now.
                  </p>
                </div>
                {viewState === 'caught_up' && (
                  <button
                    type="button"
                    onClick={() => setViewState('ready')}
                    className="mt-2 text-xs font-semibold text-[#5A4AD2] hover:underline"
                  >
                    Return to active queue
                  </button>
                )}
              </div>
            ) : filteredConversations.length === 0 ? (
              /* 2. NO SEARCH / FILTER RESULTS */
              <div 
                id="my-inbox-no-results"
                className="p-8 text-center flex flex-col items-center justify-center h-full space-y-3"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <h3 className="text-xs font-bold text-slate-800">
                    No conversations match these filters.
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Try adjusting your search terms or status filter.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              /* 3. DENSE CONVERSATION ROWS */
              filteredConversations.map((c) => {
                const isSelected = activeConvo?.id === c.id;
                const initials = c.contactName
                  ? c.contactName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : '??';

                return (
                  <div
                    key={c.id}
                    role="button"
                    tabIndex={0}
                    aria-selected={isSelected}
                    aria-label={`Conversation with ${c.contactName}, ${c.unreadCount ? `${c.unreadCount} unread` : 'all read'}`}
                    onClick={() => handleSelectConversation(c.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectConversation(c.id);
                      }
                    }}
                    className={`p-3 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5A4AD2] ${
                      isSelected
                        ? 'bg-[#EEECFB]/70 border-l-4 border-[#5A4AD2]'
                        : 'hover:bg-slate-50 border-l-4 border-transparent'
                    }`}
                  >
                    {/* Top line: Avatar, Contact Name, Channel Badge, Timestamp */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Avatar / Initials */}
                        <div className="w-8 h-8 rounded-full bg-[#EEECFB] text-[#5A4AD2] font-extrabold text-xs flex items-center justify-center shrink-0 border border-[#5A4AD2]/20">
                          {initials}
                        </div>

                        <div className="min-w-0">
                          {/* 1. Contact Name */}
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {c.contactName}
                            </span>
                            {/* Channel Chip */}
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider shrink-0 ${
                              c.channel === 'live_chat'
                                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              {c.channel === 'live_chat' ? 'Live Chat' : 'WhatsApp'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 4. Timestamp */}
                      <span className="text-[11px] text-slate-400 font-medium shrink-0 whitespace-nowrap">
                        {c.lastTimestamp}
                      </span>
                    </div>

                    {/* Middle line: 2. Latest message preview */}
                    <div className="mt-1.5 pl-10.5">
                      <p className={`text-xs truncate ${
                        (c.unreadCount || 0) > 0 ? 'font-bold text-slate-900' : 'text-slate-600'
                      }`}>
                        {c.lastMessage}
                      </p>
                    </div>

                    {/* Bottom line: 3. Attention / unread state, Status badge & Labels */}
                    <div className="mt-2 pl-10.5 flex items-center justify-between gap-2 flex-wrap text-[11px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Status badge */}
                        <span className={`px-1.5 py-0.2 rounded font-semibold capitalize text-[10px] ${
                          c.status === 'open'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {c.status}
                        </span>

                        {/* Labels where useful */}
                        {(c.labels || []).slice(0, 1).map((lbl, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium text-[10px]">
                            {lbl}
                          </span>
                        ))}
                      </div>

                      {/* Unread indicator / count badge */}
                      {(c.unreadCount || 0) > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A4AD2] text-white shrink-0">
                          {c.unreadCount} unread
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* CENTER PANE: SELECTED CONVERSATION THREAD                          */}
        {/* ================================================================= */}
        <div 
          id="my-inbox-thread-pane"
          className={`${
            mobilePane === 'thread' ? 'flex' : 'hidden sm:flex'
          } flex-1 flex-col bg-[#F4F5F7] border-r border-[#E3E5E9] overflow-hidden`}
        >
          {activeConvo ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Thread Header */}
              <div 
                id="my-inbox-thread-header"
                className="h-14 bg-white border-b border-[#E3E5E9] px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs"
              >
                {/* Mobile Back Button + Contact Information */}
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setMobilePane('list')}
                    className="sm:hidden p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                    aria-label="Back to conversation list"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-[#323739] truncate">
                        {activeConvo.contactName}
                      </h2>
                      {/* Channel Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        activeConvo.channel === 'live_chat'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {activeConvo.inbox}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-700">
                        Assigned to you ({activeConvo.assignedAgent})
                      </span>
                      <span>•</span>
                      <span className="capitalize">{activeConvo.assignedTeam}</span>
                    </div>
                  </div>
                </div>

                {/* Right Header Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Status Toggle Button */}
                  <button
                    type="button"
                    onClick={() => onUpdateStatus && onUpdateStatus(
                      activeConvo.id,
                      activeConvo.status === 'resolved' ? 'open' : 'resolved'
                    )}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      activeConvo.status === 'resolved'
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {activeConvo.status === 'resolved' ? 'Reopen' : 'Resolve'}
                    </span>
                  </button>

                  {/* Toggle Context Panel Button */}
                  <button
                    ref={togglePanelButtonRef}
                    type="button"
                    aria-label="Toggle contact details panel"
                    onClick={() => {
                      setShowRightPanel(!showRightPanel);
                      setMobilePane(mobilePane === 'info' ? 'thread' : 'info');
                    }}
                    className={`p-2 rounded-xl text-xs font-semibold border transition-colors ${
                      showRightPanel
                        ? 'bg-[#EEECFB] text-[#5A4AD2] border-[#5A4AD2]/30 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                    title="Toggle contact details & context"
                  >
                    <User className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Stream: Incoming, Outgoing, Internal Note, System Event, Attachment */}
              <div 
                id="my-inbox-message-stream"
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5"
              >
                {(activeConvo.messages || []).map((m) => {
                  // 1. Internal Team Note (Chatwoot amber note)
                  if (m.isPrivateNote) {
                    return (
                      <div 
                        key={m.id} 
                        className="max-w-xl mx-auto bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 text-xs shadow-2xs my-1"
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 mb-1.5 pb-1 border-b border-amber-200/60">
                          <div className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Internal Note by {m.senderName || 'Agent'}</span>
                          </div>
                          <span className="font-normal text-amber-700">{m.timestamp}</span>
                        </div>
                        <p className="text-amber-950 font-medium whitespace-pre-wrap leading-relaxed">
                          {m.text}
                        </p>
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
                                  <span className="text-[10px] opacity-75">{att.size} • Document</span>
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
                <div ref={messagesEndRef} />
              </div>

              {/* =================================================================== */}
              {/* STICKY WORKBENCH COMPOSER                                            */}
              {/* =================================================================== */}
              <div 
                id="my-inbox-composer"
                className="p-3 bg-white border-t border-[#E3E5E9] shrink-0 space-y-2 sticky bottom-0"
              >
                {/* Mode Switcher: Reply vs Private Note & Quick Macros */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {/* Reply vs Internal Note Mode Switcher */}
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
                      Reply
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
                      <span>Internal Note</span>
                    </button>
                  </div>

                  {/* Quick Canned Response / Macro Access */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 overflow-x-auto no-scrollbar">
                    <span className="hidden sm:inline font-medium">Macros:</span>
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
                      onClick={() => handleInsertCanned('To reschedule your appointment, please let us know your preferred date and time.')}
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
                    <span>INTERNAL NOTE — Only visible to team members; will NOT be sent to the contact.</span>
                  </div>
                )}

                {/* Attached file preview chip if present */}
                {attachedFile && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900">
                    <FileText className="w-3.5 h-3.5 text-[#5A4AD2]" />
                    <span>{attachedFile.name}</span>
                    <span className="text-[10px] text-purple-600">({attachedFile.size})</span>
                    <button 
                      type="button"
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
                      id="my-inbox-composer-textarea"
                      rows={3}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={
                        composerMode === 'reply'
                          ? `Type reply to ${activeConvo.contactName}... (Enter to send, Shift+Enter for newline)`
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
                        title="Attach document / file"
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
                      id="my-inbox-send-btn"
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
                          <span>Send Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* Restrained Empty-Selection State (when no conversation is selected) */
            <div 
              id="my-inbox-empty-selection"
              className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-[#EEECFB] text-[#5A4AD2] flex items-center justify-center border border-[#5A4AD2]/20 shadow-2xs">
                <Inbox className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-sm font-bold text-slate-800">
                  Select a conversation
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Choose a conversation from your personal queue on the left to view the thread and respond.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* RIGHT CONTEXT PANEL: CONTACT / CONVERSATION CONTEXT               */}
        {/* ================================================================= */}
        {showRightPanel && activeConvo && (
          <div 
            id="my-inbox-context-panel"
            className={`${
              mobilePane === 'info' ? 'flex' : 'hidden lg:flex'
            } w-full sm:w-80 lg:w-80 bg-white border-l border-[#E3E5E9] flex-col shrink-0 overflow-y-auto p-4 space-y-4`}
          >
            {/* Panel Header with accessible close button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Contact & Context
              </span>
              <button
                type="button"
                onClick={handleCloseContextPanel}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Close details panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. CONTACT: Name, Phone, Email */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EEECFB] text-[#5A4AD2] font-extrabold text-sm flex items-center justify-center shrink-0 border border-[#5A4AD2]/20 shadow-2xs">
                  {activeConvo.contactName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 truncate">
                    {activeConvo.contactName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{activeConvo.contactPhone}</span>
                    <button 
                      type="button"
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

              {/* View CRM Contact action */}
              {onOpenContact && (
                <button
                  type="button"
                  onClick={() => {
                    const cRecord = INITIAL_CONTACTS.find((c) => c.name === activeConvo.contactName);
                    if (cRecord) onOpenContact(cRecord);
                  }}
                  className="w-full mt-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#5A4AD2]" />
                  <span>Open in Contacts CRM</span>
                </button>
              )}
            </div>

            {/* 2. ASSIGNMENT: Agent & Team */}
            <div className="space-y-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Assignment
              </span>
              
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
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Conversation Details
              </span>
              
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

            {/* 4. LABELS: Conversation Labels */}
            <div className="space-y-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Labels
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(activeConvo.labels || []).map((lbl, idx) => (
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
                  aria-label="Add label"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 5. CUSTOM ATTRIBUTES: Only generic supported attributes */}
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
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Recent Activity
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Last agent reply</span>
                  <span className="font-medium text-slate-800">10:50 AM</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>First response time</span>
                  <span className="font-medium text-slate-800">2 mins</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Total messages</span>
                  <span className="font-medium text-slate-800">{(activeConvo.messages || []).length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
