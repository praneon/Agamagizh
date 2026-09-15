import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShieldCheck, 
  Copy, 
  AlertTriangle, 
  Layers, 
  MessageSquare, 
  Tag, 
  Calendar,
  Send,
  Sparkles
} from 'lucide-react';
import { WhatsAppTemplate } from '../../types';

interface ProviderTemplateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: WhatsAppTemplate | null;
  onDuplicateAsDraft: (template: WhatsAppTemplate) => void;
  theme?: 'dark' | 'light';
}

export const ProviderTemplateDetailModal: React.FC<ProviderTemplateDetailModalProps> = ({
  isOpen,
  onClose,
  template,
  onDuplicateAsDraft,
  theme = 'light'
}) => {
  if (!isOpen || !template) return null;

  const isDark = theme === 'dark';

  const isApproved = template.status === 'approved';
  const isPending = template.status === 'pending';
  const isRejected = template.status === 'rejected';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="provider-template-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all ${
          isDark ? 'bg-[#181A1F] border-[#2C313C] text-white' : 'bg-white border-[#E3E5E9] text-slate-900'
        }`}
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isApproved
                  ? 'bg-emerald-500/15 text-emerald-500'
                  : isPending
                  ? 'bg-amber-500/15 text-amber-500'
                  : 'bg-rose-500/15 text-rose-500'
              }`}
            >
              {isApproved && <CheckCircle2 className="w-5 h-5" />}
              {isPending && <Clock className="w-5 h-5" />}
              {isRejected && <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="provider-template-detail-title" className="text-sm sm:text-base font-mono font-bold truncate">
                  {template.name}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isApproved
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      : isPending
                      ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                  }`}
                >
                  {template.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Provider-synced template • Category: {template.category} • {template.language}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* REJECTION REASON CALLOUT (If Rejected) */}
        {isRejected && (
          <div className="px-6 py-3.5 bg-rose-500/10 border-b border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-400 block mb-0.5">
                Meta Rejection Reason:
              </span>
              <p className="leading-relaxed text-rose-200/90">
                {template.rejectionReason ||
                  'Policy violation: Message content violates WhatsApp Commerce Guidelines or contains promotional claims incompatible with the selected Utility category.'}
              </p>
              <p className="text-[11px] text-rose-400 mt-1 font-semibold">
                Tip: Duplicate as a Local Draft to rephrase the message and adjust the category before resubmitting.
              </p>
            </div>
          </div>
        )}

        {/* PENDING ADVISORY (If Pending) */}
        {isPending && (
          <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Awaiting Meta review decision. Synced templates in pending status cannot yet be dispatched in live campaigns.
            </span>
          </div>
        )}

        {/* METADATA STRIP */}
        <div
          className={`px-6 py-3 border-b grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs ${
            isDark ? 'bg-[#1F232B] border-[#2C313C]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Source</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              Provider Synced
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Campaign Status</span>
            <p
              className={`font-semibold mt-0.5 ${
                template.isCampaignEligible ? 'text-emerald-500' : 'text-slate-400'
              }`}
            >
              {template.isCampaignEligible ? 'Campaign Eligible' : 'Not Eligible'}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Last Synced</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {template.lastSyncedAt || 'Today 08:30 AM'}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Template ID</span>
            <p className="font-mono text-[11px] text-slate-500 mt-0.5 truncate">
              {template.id}
            </p>
          </div>
        </div>

        {/* TEMPLATE CONTENT PREVIEW */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Header */}
          {template.header && template.header.type !== 'none' && (
            <div
              className={`p-3.5 rounded-xl border ${
                isDark ? 'bg-[#21252B] border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase mb-1">
                <Layers className="w-3.5 h-3.5 text-[#5A4AD2]" />
                <span>Header ({template.header.type})</span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">
                {template.header.text || `[Dynamic ${template.header.type} attachment]`}
              </p>
            </div>
          )}

          {/* Body */}
          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isDark ? 'bg-[#21252B] border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>Message Body</span>
            </div>
            <div className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200 font-sans text-xs">
              {template.body}
            </div>
          </div>

          {/* Footer */}
          {template.footer && (
            <div
              className={`p-3 rounded-xl border ${
                isDark ? 'bg-[#21252B] border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
                Footer
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                {template.footer}
              </p>
            </div>
          )}

          {/* Buttons */}
          {template.buttons && template.buttons.length > 0 && (
            <div
              className={`p-3.5 rounded-xl border space-y-2 ${
                isDark ? 'bg-[#21252B] border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Interactive Buttons ({template.buttons.length})
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {template.buttons.map((btn, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#5A4AD2]/10 text-[#8B7FF5] border border-[#5A4AD2]/20"
                  >
                    <span>[{btn.type.toUpperCase()}]</span>
                    <span>{btn.text}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div
          className={`px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 ${
            isDark ? 'bg-[#181A1F] border-[#2C313C]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="text-xs text-slate-400">
            Provider templates are read-only. Duplicate to make changes in Local Drafts.
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                isDark ? 'border-slate-700 hover:bg-white/5 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onDuplicateAsDraft(template);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicate as Local Draft</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
