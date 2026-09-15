import React, { useState } from 'react';
import { X, Send, MessageSquare, Phone, User, Tag } from 'lucide-react';
import { INBOXES_LIST } from '../../data/mockData';
import { Contact } from '../../types';

interface QuickComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts?: Contact[];
  onSendMessage?: (contactName: string, contactPhone: string, inbox: string, message: string) => void;
  onSend?: (recipient: string, message: string, templateId?: string) => void;
}

export const QuickComposeModal: React.FC<QuickComposeModalProps> = ({
  isOpen,
  onClose,
  contacts = [],
  onSendMessage,
  onSend
}) => {
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [inbox, setInbox] = useState(INBOXES_LIST[0].name);
  const [messageText, setMessageText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    let targetName = customName;
    let targetPhone = customPhone;

    if (selectedContactId) {
      const found = (contacts || []).find(c => c.id === selectedContactId);
      if (found) {
        targetName = found.name;
        targetPhone = found.phone;
      }
    }

    if (!targetPhone) return;

    if (onSendMessage) {
      onSendMessage(targetName || 'New Contact', targetPhone, inbox, messageText);
    } else if (onSend) {
      onSend(targetPhone, messageText);
    }
    onClose();
    setMessageText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EEECFB] text-[#5A4AD2] flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">New Outbound Message</h3>
              <p className="text-xs text-slate-500">Initiate conversation via connected inbox</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSend} className="p-6 space-y-4">
          {/* Inbox Channel */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Inbox Channel
            </label>
            <select
              value={inbox}
              onChange={(e) => setInbox(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white text-slate-800"
            >
              {INBOXES_LIST.map((ib) => (
                <option key={ib.id} value={ib.name}>
                  {ib.name} ({ib.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Contact Picker or Direct Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Existing Contact
            </label>
            <select
              value={selectedContactId}
              onChange={(e) => {
                setSelectedContactId(e.target.value);
                if (e.target.value) {
                  const c = contacts.find(item => item.id === e.target.value);
                  if (c) {
                    setCustomName(c.name);
                    setCustomPhone(c.phone);
                  }
                }
              }}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white text-slate-800"
            >
              <option value="">-- Or enter new phone number below --</option>
              {(contacts || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          {!selectedContactId && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Raman"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  WhatsApp Phone
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98401 23456"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Message Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Message Content
            </label>
            <textarea
              rows={4}
              required
              placeholder="Type your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white placeholder-slate-400"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-[#5A4AD2] hover:bg-[#4C3DC2] rounded-xl flex items-center gap-2 shadow-sm shadow-[#5A4AD2]/30 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Send Outbound Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
