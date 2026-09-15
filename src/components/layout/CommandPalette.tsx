import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Users, TrendingUp, Sparkles, Send, ArrowRight, X } from 'lucide-react';
import { TopNavSection, WhatsAppSubSection, Contact } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: TopNavSection, waSub?: WhatsAppSubSection) => void;
  contacts?: Contact[];
  conversations?: any[];
  onSelectContact: (contact: Contact) => void;
  onSelectConversation?: (id: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  contacts = [],
  onSelectContact
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNav = [
    { label: 'My Inbox', section: 'my-inbox' as TopNavSection, icon: MessageSquare, desc: 'Assigned conversations' },
    { label: 'Conversations Workbench', section: 'conversations' as TopNavSection, icon: MessageSquare, desc: 'All incoming threads' },
    { label: 'WhatsApp Broadcasts & Campaigns', section: 'campaigns' as TopNavSection, icon: Send, desc: 'Create or view broadcasts' },
    { label: 'WhatsApp Templates', section: 'whatsapp' as TopNavSection, waSub: 'templates' as WhatsAppSubSection, icon: Sparkles, desc: 'Meta approved message templates' },
    { label: 'Clinic Pipeline', section: 'clinic-pipeline' as TopNavSection, icon: TrendingUp, desc: 'Intake Kanban board' },
    { label: 'Contacts Directory', section: 'contacts' as TopNavSection, icon: Users, desc: 'CRM and client database' },
    { label: 'WhatsApp Chatbot Builder', section: 'whatsapp' as TopNavSection, waSub: 'chatbots' as WhatsAppSubSection, icon: Sparkles, desc: 'Reception flow canvas' },
    { label: 'WhatsApp Analytics', section: 'whatsapp' as TopNavSection, waSub: 'analytics' as WhatsAppSubSection, icon: TrendingUp, desc: 'Delivery & read metrics' },
    { label: 'Internal: UI & System States Reference', section: 'ui-reference' as any, icon: Sparkles, desc: 'Shared visual tokens & system states (/ui-reference)' }
  ];

  const safeContacts = contacts || [];
  const filteredNav = quickNav.filter(n => n.label.toLowerCase().includes(query.toLowerCase()));
  const filteredContacts = safeContacts.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.phone.includes(query) ||
    (c.email && c.email.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200">
          <Search className="w-5 h-5 text-[#5A4AD2] mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, route, or search contact... (Esc to close)"
            className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 p-2 text-xs">
          {/* Quick Navigation */}
          {filteredNav.length > 0 && (
            <div className="py-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                Navigation & Features
              </div>
              {filteredNav.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onNavigate(item.section, item.waSub);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-[#EEECFB] hover:text-[#5A4AD2] group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-[#5A4AD2] group-hover:text-white flex items-center justify-center text-slate-600 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 group-hover:text-[#5A4AD2]">{item.label}</div>
                        <div className="text-[11px] text-slate-400">{item.desc}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#5A4AD2]" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Contacts */}
          {filteredContacts.length > 0 && (
            <div className="py-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                Contacts ({filteredContacts.length})
              </div>
              {filteredContacts.slice(0, 4).map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectContact(c);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500">{c.phone} • {c.company || 'Direct'}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {c.channel}
                  </span>
                </button>
              ))}
            </div>
          )}

          {filteredNav.length === 0 && filteredContacts.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              No matching commands or contacts found for "{query}"
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigate using keyboard or mouse</span>
          <span className="font-medium text-slate-500">Agamagizh Console Jump-To</span>
        </div>
      </div>
    </div>
  );
};
