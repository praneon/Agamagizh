import React from 'react';
import { CampaignRecipientRecord } from './types';
import { 
  X, 
  Phone, 
  User, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink,
  Ban
} from 'lucide-react';

interface RecipientDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: CampaignRecipientRecord | null;
  campaignTitle: string;
  onOpenConversation?: (phone: string) => void;
}

export const RecipientDetailDrawer: React.FC<RecipientDetailDrawerProps> = ({
  isOpen,
  onClose,
  recipient,
  campaignTitle,
  onOpenConversation
}) => {
  if (!isOpen || !recipient) return null;

  const getStatusBadge = (status: CampaignRecipientRecord['status']) => {
    switch (status) {
      case 'replied':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">Replied</span>;
      case 'read':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-[#5A4AD2] border border-purple-200">Read</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 border border-blue-200">Delivered</span>;
      case 'sent':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200">Sent</span>;
      case 'queued':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-500 border border-slate-200">Queued</span>;
      case 'failed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-red-700 border border-red-200">Delivery Failed</span>;
      case 'excluded':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200">Preflight Excluded</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#5A4AD2]">
                Recipient Ledger Entry
              </span>
              <h2 className="text-base font-extrabold text-slate-900 truncate">
                {recipient.contactName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status & Destination card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Lifecycle State:</span>
              {getStatusBadge(recipient.status)}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Destination Number:</span>
              <span className="font-mono font-bold text-slate-900">{recipient.destination}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Campaign:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">{campaignTitle}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Last State Change:</span>
              <span className="text-slate-700">{recipient.lifecycleTime}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Transmission Attempts:</span>
              <span className="font-bold text-slate-900">{recipient.attempts}</span>
            </div>
          </div>

          {/* Reason Card (If failed or excluded) */}
          {recipient.reason && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              recipient.status === 'failed'
                ? 'bg-red-50/70 border-red-200 text-red-900'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                {recipient.status === 'failed' ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Meta Cloud API Transmission Failure</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Canonical Safety Preflight Exclusion</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed text-[11px]">{recipient.reason}</p>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/40">
                {recipient.status === 'failed'
                  ? 'Transmission failed after handshake with WhatsApp servers.'
                  : 'Contact was excluded prior to campaign release to protect sender quality rating.'}
              </div>
            </div>
          )}

          {/* Contact Action Shortcuts */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-700 block">Actions</span>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => onOpenConversation?.(recipient.destination)}
                className="w-full p-2.5 bg-slate-50 hover:bg-[#EEECFB] hover:text-[#5A4AD2] text-slate-700 font-bold rounded-xl border border-slate-200 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#5A4AD2]" />
                  <span>Open WhatsApp Conversation</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
