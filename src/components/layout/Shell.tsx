import React, { useState } from 'react';
import { 
  TopNavSection, 
  WhatsAppSubSection, 
  AgentUser, 
  Contact, 
  Conversation 
} from '../../types';
import { 
  Inbox, 
  MessageSquare, 
  Bot, 
  Users, 
  Building2, 
  BarChart3, 
  Kanban, 
  Send, 
  HelpCircle, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Plus, 
  Bell, 
  CheckCircle2, 
  Menu, 
  X,
  PhoneCall,
  LayoutDashboard,
  Sparkles,
  Zap,
  Sliders,
  Workflow
} from 'lucide-react';
import { CURRENT_USER } from '../../data/mockData';
import { useCrm } from '../../context/CrmContext';

interface ShellProps {
  currentSection: TopNavSection;
  currentWhatsAppSub: WhatsAppSubSection;
  onNavigate: (section: TopNavSection, waSub?: WhatsAppSubSection) => void;
  unreadCount: number;
  openConversationsCount: number;
  contactsCount: number;
  pipelineCount: number;
  campaignsCount: number;
  onOpenCommandPalette: () => void;
  onOpenQuickCompose: () => void;
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({
  currentSection,
  currentWhatsAppSub,
  onNavigate,
  unreadCount,
  openConversationsCount,
  contactsCount,
  pipelineCount,
  campaignsCount,
  onOpenCommandPalette,
  onOpenQuickCompose,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [whatsAppExpanded, setWhatsAppExpanded] = useState(true);
  const [userStatus, setUserStatus] = useState<'online' | 'busy' | 'offline'>('online');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const { mode, setMode } = useCrm();

  const whatsAppSubItems: { id: WhatsAppSubSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inbox', icon: MessageSquare },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'broadcasts', label: 'Broadcasts', icon: Send },
    { id: 'templates', label: 'Templates', icon: Sparkles },
    { id: 'pipelines', label: 'Pipelines', icon: Kanban },
    { id: 'automations', label: 'Automations', icon: Zap },
    { id: 'chatbots', label: 'Chatbots', icon: Workflow },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  const topNavItems = [
    { id: 'my-inbox' as TopNavSection, label: 'My Inbox', icon: Inbox, badge: unreadCount > 0 ? unreadCount : null },
    { id: 'conversations' as TopNavSection, label: 'Conversations', icon: MessageSquare, badge: openConversationsCount },
    { id: 'captain' as TopNavSection, label: 'Captain', icon: Bot, highlight: 'AI' },
    { id: 'contacts' as TopNavSection, label: 'Contacts', icon: Users, badge: contactsCount },
    { id: 'companies' as TopNavSection, label: 'Companies', icon: Building2 },
    { id: 'reports' as TopNavSection, label: 'Reports', icon: BarChart3 },
    { id: 'clinic-pipeline' as TopNavSection, label: 'Clinic Pipeline', icon: Kanban, badge: pipelineCount },
    { id: 'campaigns' as TopNavSection, label: 'Campaigns', icon: Send, badge: campaignsCount },
    { id: 'help-center' as TopNavSection, label: 'Help Center', icon: HelpCircle },
    { id: 'settings' as TopNavSection, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col font-sans text-[#323739]">
      {/* Top Application Bar */}
      <header className="h-14 bg-white border-b border-[#E3E5E9] sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 shadow-2xs">
        {/* Brand & Left controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => onNavigate('conversations')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            {/* Logo Mark */}
            <div className="w-8 h-8 rounded-lg bg-[#5A4AD2] text-white flex items-center justify-center shadow-xs overflow-hidden p-1">
              <img 
                src="/logo.svg" 
                alt="Agamagizh Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback if svg fails to render
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-sm font-extrabold tracking-tight text-slate-900">Agamagizh</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#EEECFB] text-[#5A4AD2] border border-[#5A4AD2]/20">
                  Console
                </span>
              </div>
              <span className="text-[10px] font-medium text-[#6E737F] block mt-0.5">
                Communication & WhatsApp Operations
              </span>
            </div>
          </div>
        </div>

        {/* Global Search / Jump-To (Cmd+K) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <button
            onClick={onOpenCommandPalette}
            className="w-full text-xs px-3.5 py-1.5 bg-[#F4F5F7] hover:bg-slate-100 border border-[#E3E5E9] rounded-xl flex items-center justify-between text-[#6E737F] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search conversations, contacts, campaigns...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-[#E3E5E9] rounded text-slate-500 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Outbound Message */}
          <button
            onClick={onOpenQuickCompose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            title="Compose new WhatsApp / Outbound message"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Message</span>
          </button>

          {/* Quick Broadcast Campaign */}
          <button
            onClick={() => onNavigate('campaigns')}
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            <Send className="w-3 h-3 text-[#5A4AD2]" />
            <span>Broadcast</span>
          </button>

          {/* Channel Health status & Data Provider Mode */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-lg text-[11px] font-medium text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>WA Cloud API</span>
            </div>
            <button
              type="button"
              onClick={() => setMode(mode === 'local' ? 'real' : 'local')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                mode === 'real'
                  ? 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
                  : 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
              }`}
              title="Click to toggle between Demo Local Fixtures and Real Chatwoot Rails API contracts"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${mode === 'real' ? 'bg-blue-600' : 'bg-purple-600'} animate-pulse`} />
              <span>{mode === 'real' ? 'CRM: Live API' : 'CRM: Demo Fixtures'}</span>
            </button>
          </div>

          {/* User Profile & Agent Status */}
          <div className="relative pl-2 border-l border-[#E3E5E9]">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded-xl transition-colors"
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-[#5A4AD2] text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                  {CURRENT_USER.avatar}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  userStatus === 'online' ? 'bg-emerald-500' : userStatus === 'busy' ? 'bg-amber-500' : 'bg-slate-400'
                }`} />
              </div>
              <div className="hidden xl:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">{CURRENT_USER.name}</span>
                <span className="text-[10px] text-[#6E737F] block -mt-0.5">{CURRENT_USER.role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Status Dropdown Popover */}
            {showStatusDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-[#E3E5E9] py-1 z-50 animate-in fade-in zoom-in-95 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">{CURRENT_USER.name}</p>
                  <p className="text-[11px] text-slate-500">{CURRENT_USER.email}</p>
                </div>
                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">Agent Status</div>
                  {(['online', 'busy', 'offline'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setUserStatus(st);
                        setShowStatusDropdown(false);
                      }}
                      className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-[#EEECFB] hover:text-[#5A4AD2] text-left capitalize"
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        st === 'online' ? 'bg-emerald-500' : st === 'busy' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                      <span>{st}</span>
                      {userStatus === st && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-[#5A4AD2]" />}
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setShowStatusDropdown(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Workspace Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Authoritative Sidebar Navigation */}
        <aside className="w-60 bg-white border-r border-[#E3E5E9] hidden md:flex flex-col justify-between py-3 px-2 shrink-0 select-none overflow-y-auto">
          <div className="space-y-4">
            {/* Top Level Nav Items */}
            <div className="space-y-0.5">
              {topNavItems.slice(0, 2).map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#5A4AD2] text-white shadow-xs shadow-[#5A4AD2]/20 font-bold'
                        : 'text-slate-600 hover:bg-[#EEECFB]/60 hover:text-[#5A4AD2]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6E737F]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#EEECFB] text-[#5A4AD2]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Expandable WhatsApp Operational Suite */}
            <div className="border-t border-b border-slate-100 py-2">
              <button
                onClick={() => {
                  setWhatsAppExpanded(!whatsAppExpanded);
                  if (currentSection !== 'whatsapp') {
                    onNavigate('whatsapp', currentWhatsAppSub);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentSection === 'whatsapp'
                    ? 'bg-[#EEECFB] text-[#5A4AD2]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    WA
                  </div>
                  <span>WhatsApp Suite</span>
                </div>
                {whatsAppExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {/* 10 Fixed WhatsApp Sub-items */}
              {whatsAppExpanded && (
                <div className="pl-4 pr-1 mt-1 space-y-0.5 border-l-2 border-[#5A4AD2]/20 ml-4">
                  {whatsAppSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = currentSection === 'whatsapp' && currentWhatsAppSub === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => onNavigate('whatsapp', sub.id)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          isSubActive
                            ? 'bg-[#5A4AD2] text-white font-bold shadow-2xs'
                            : 'text-slate-600 hover:bg-[#EEECFB]/50 hover:text-[#5A4AD2]'
                        }`}
                      >
                        <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Secondary Standard Top-level Items */}
            <div className="space-y-0.5">
              {topNavItems.slice(2).map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#5A4AD2] text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:bg-[#EEECFB]/60 hover:text-[#5A4AD2]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6E737F]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#F4F5F7] text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.highlight && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-purple-100 text-purple-700">
                        {item.highlight}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer info */}
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 space-y-1 px-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600">Agamagizh v3.2</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Live
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">Chatwoot Enterprise Engine</p>
          </div>
        </aside>

        {/* Mobile Flyout Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-4 flex flex-col justify-between shadow-2xl overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#5A4AD2] text-white flex items-center justify-center font-bold text-xs">
                      AG
                    </div>
                    <span className="font-bold text-slate-900">Agamagizh Console</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Top Level Nav */}
                <div className="space-y-1">
                  {topNavItems.slice(0, 2).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                        currentSection === item.id ? 'bg-[#5A4AD2] text-white' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  ))}

                  {/* Mobile WhatsApp subitems */}
                  <div className="pt-2 pb-1 text-[11px] font-bold text-slate-400 px-3 uppercase">
                    WhatsApp Suite
                  </div>
                  {whatsAppSubItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        onNavigate('whatsapp', sub.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs ${
                        currentSection === 'whatsapp' && currentWhatsAppSub === sub.id
                          ? 'bg-[#5A4AD2] text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <sub.icon className="w-3.5 h-3.5" />
                      <span>{sub.label}</span>
                    </button>
                  ))}

                  <div className="pt-2 pb-1 text-[11px] font-bold text-slate-400 px-3 uppercase">
                    Workspace & Operations
                  </div>
                  {topNavItems.slice(2).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                        currentSection === item.id ? 'bg-[#5A4AD2] text-white' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    onOpenQuickCompose();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-[#5A4AD2] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Outbound Message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Primary Workspace View */}
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
};
