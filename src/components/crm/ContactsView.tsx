import React, { useState } from 'react';
import { Contact } from '../../types';
import { 
  Search, 
  Filter, 
  Plus, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Tag, 
  MessageSquare, 
  MoreVertical, 
  ArrowUpDown, 
  Calendar,
  X,
  Send,
  MapPin
} from 'lucide-react';

interface ContactsViewProps {
  contacts: Contact[];
  onOpenConversationWithContact: (contact: Contact) => void;
  onAddNewContact: (contact: Omit<Contact, 'id' | 'conversationsCount' | 'lastActivity'>) => void;
  onUpdateContactLabels?: (contactId: string, labels: string[]) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts = [],
  onOpenConversationWithContact,
  onAddNewContact
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabelFilter, setSelectedLabelFilter] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: 'Chennai, Tamil Nadu',
    channel: 'whatsapp' as const,
    labels: 'WhatsApp, Inbound'
  });

  // Extract all unique labels safely
  const safeContacts = contacts || [];
  const allLabels = Array.from(new Set(safeContacts.flatMap(c => c.labels || [])));

  const filteredContacts = safeContacts.filter((c) => {
    if (selectedLabelFilter !== 'all' && !(c.labels || []).includes(selectedLabelFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.company && c.company.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    onAddNewContact({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company || 'Individual',
      status: 'active',
      labels: formData.labels.split(',').map(s => s.trim()).filter(Boolean),
      channel: formData.channel,
      location: formData.location,
      customAttributes: {
        'Onboarding Source': 'Console Manual Entry',
        'Registered Date': 'Today'
      }
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      location: 'Chennai, Tamil Nadu',
      channel: 'whatsapp',
      labels: 'WhatsApp, Inbound'
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Contacts Directory</h1>
          <p className="text-xs text-[#6E737F]">
            Operational CRM records, contact profiles, and WhatsApp conversation history.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Contact</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#E3E5E9] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, email, organization..."
            className="w-full text-xs pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Filter:</span>
          <button
            onClick={() => setSelectedLabelFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              selectedLabelFilter === 'all'
                ? 'bg-[#5A4AD2] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({contacts.length})
          </button>
          {allLabels.slice(0, 4).map((lbl) => (
            <button
              key={lbl}
              onClick={() => setSelectedLabelFilter(lbl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedLabelFilter === lbl
                  ? 'bg-[#5A4AD2] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Data Table & Mobile Cards */}
      <div className="bg-white rounded-2xl border border-[#E3E5E9] shadow-2xs overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-[#6E737F] font-bold border-b border-[#E3E5E9] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Phone / WhatsApp</th>
                <th className="py-3.5 px-4">Company / Location</th>
                <th className="py-3.5 px-4">Labels</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No contacts found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedContact(c)}
                    className="hover:bg-[#EEECFB]/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#5A4AD2]/10 text-[#5A4AD2] font-bold flex items-center justify-center shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{c.name}</span>
                          <span className="text-[11px] text-slate-500">{c.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-800 font-medium">{c.phone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="text-slate-800 font-semibold block">{c.company || '—'}</span>
                        <span className="text-[11px] text-slate-400">{c.location || 'India'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(c.labels || []).map((lbl, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEECFB] text-[#5A4AD2] border border-[#5A4AD2]/20"
                          >
                            {lbl}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {c.lastActivity}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenConversationWithContact(c);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EEECFB] hover:bg-[#5A4AD2] text-[#5A4AD2] hover:text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Contact Cards (390px) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredContacts.length === 0 ? (
            <div className="py-10 px-4 text-center text-slate-400 text-xs">
              No contacts found matching your criteria.
            </div>
          ) : (
            filteredContacts.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedContact(c)}
                className="p-4 space-y-2.5 active:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#5A4AD2]/10 text-[#5A4AD2] font-bold text-sm flex items-center justify-center shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm leading-tight">{c.name}</div>
                      <div className="text-[11px] font-mono text-slate-600 mt-0.5">{c.phone}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenConversationWithContact(c);
                    }}
                    className="p-2 bg-[#EEECFB] text-[#5A4AD2] rounded-xl hover:bg-[#5A4AD2] hover:text-white transition-colors"
                    title="Open WhatsApp Chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>{c.company || 'Direct Contact'} • {c.location || 'India'}</span>
                  <span>{c.lastActivity}</span>
                </div>

                {c.labels && c.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {c.labels.map((lbl, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEECFB] text-[#5A4AD2] border border-[#5A4AD2]/20"
                      >
                        {lbl}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Contact Profile Drawer / Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end">
          <div className="w-full sm:max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#5A4AD2] text-white font-extrabold text-lg flex items-center justify-center">
                    {selectedContact.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">{selectedContact.name}</h2>
                    <span className="text-xs text-slate-500">{selectedContact.company || 'Direct Contact'}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenConversationWithContact(selectedContact);
                    setSelectedContact(null);
                  }}
                  className="py-2.5 px-3 bg-[#5A4AD2] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#4C3DC2]"
                >
                  <MessageSquare className="w-4 h-4" />
                  Open WhatsApp Chat
                </button>
                <a
                  href={`tel:${selectedContact.phone}`}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  Call Contact
                </a>
              </div>

              {/* Attributes & Contact Details */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone Number</span>
                  <span className="font-semibold text-slate-900">{selectedContact.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                  <span className="font-semibold text-slate-900">{selectedContact.email || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                  <span className="font-semibold text-slate-900">{selectedContact.location || 'Chennai, India'}</span>
                </div>
              </div>

              {/* Custom Attributes */}
              {selectedContact.customAttributes && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Custom Attributes</h4>
                  <div className="space-y-2 text-xs">
                    {Object.entries(selectedContact.customAttributes).map(([k, v]) => (
                      <div key={k} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">{k}</span>
                        <span className="font-semibold text-slate-800">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assigned Labels */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Labels</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedContact.labels || []).map((lbl, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EEECFB] text-[#5A4AD2] border border-[#5A4AD2]/20">
                      {lbl}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedContact(null)}
                className="w-full py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Add New Contact</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Narayanan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98401 23456"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="radhika@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Organization</label>
                <input
                  type="text"
                  placeholder="Sundaram Wellness"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Labels (comma separated)</label>
                <input
                  type="text"
                  placeholder="Lead, Adyar Branch, WhatsApp"
                  value={formData.labels}
                  onChange={(e) => setFormData({ ...formData, labels: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white font-bold rounded-xl"
                >
                  Create Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
