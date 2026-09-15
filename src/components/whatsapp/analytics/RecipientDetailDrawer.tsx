import React, { useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Send, 
  CheckCheck, 
  Eye, 
  MessageSquareReply, 
  AlertCircle, 
  ShieldAlert, 
  Clock, 
  MessageSquare, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { RecipientLedgerItem } from './types';

interface RecipientDetailDrawerProps {
  recipient: RecipientLedgerItem | null;
  onClose: () => void;
  onOpenConversation?: (conversationId: string) => void;
  onOpenContact?: (contactId: string, name: string, phone: string) => void;
  isDark?: boolean;
}

export const RecipientDetailDrawer: React.FC<RecipientDetailDrawerProps> = ({
  recipient,
  onClose,
  onOpenConversation,
  onOpenContact,
  isDark = false
}) => {
  const [copied, setCopied] = React.useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key press & handle focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (recipient) {
      window.addEventListener('keydown', handleKeyDown);
      closeBtnRef.current?.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [recipient, onClose]);

  if (!recipient) return null;

  const handleCopy = () => {
    const text = `Recipient: ${recipient.contactName} (${recipient.destination})\nCampaign: ${recipient.campaignName}\nStatus: ${recipient.status.toUpperCase()}\nLifecycle Time: ${recipient.lifecycleTime}${recipient.reason ? `\nReason: ${recipient.reason}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (recipient.status) {
      case 'sent':
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isDark ? 'bg-sky-950 text-sky-300 border border-sky-800' : 'bg-sky-100 text-sky-800'
          }`}>
            <Send className="w-3 h-3" />
            Sent
          </span>
        );
      case 'delivered':
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isDark ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            <CheckCheck className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'read':
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isDark ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-indigo-100 text-indigo-800'
          }`}>
            <Eye className="w-3 h-3" />
            Read
          </span>
        );
      case 'replied':
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isDark ? 'bg-teal-950 text-teal-300 border border-teal-800' : 'bg-teal-100 text-teal-800'
          }`}>
            <MessageSquareReply className="w-3 h-3" />
            Replied
          </span>
        );
      case 'failed':
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isDark ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-rose-100 text-rose-800'
          }`}>
            <AlertCircle className="w-3 h-3" />
            Failed
          </span>
        );
      case 'excluded':
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isDark ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-amber-100 text-amber-800'
          }`}>
            <ShieldAlert className="w-3 h-3" />
            Excluded
          </span>
        );
      case 'queued':
      default:
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
          }`}>
            <Clock className="w-3 h-3" />
            Queued
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Recipient details for ${recipient.contactName}`}
          className={`w-screen max-w-md shadow-2xl flex flex-col h-full overflow-hidden transition-colors ${
            isDark ? 'bg-slate-900 border-l border-slate-800 text-slate-100' : 'bg-white border-l border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
            isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50/50'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Recipient Details
                </h2>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Campaign delivery audit record #{recipient.id}
              </p>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className={`p-1.5 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {/* Section 1: Contact */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Contact Information
              </span>
              <div className={`p-3.5 rounded-xl border space-y-2 ${
                isDark ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#5A4AD2]" />
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {recipient.contactName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {recipient.contactId}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{recipient.destination}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Campaign */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Campaign & Channel
              </span>
              <div className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                isDark ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Campaign Name:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                    {recipient.campaignName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Channel Inbox:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {recipient.inbox}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Campaign ID:</span>
                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {recipient.campaignId}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Recipient Status & Outcome Diagnostics */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Status & Outcome
              </span>
              <div className={`p-3.5 rounded-xl border space-y-3 text-xs ${
                isDark ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Current Status:</span>
                  <span className="font-bold capitalize">{recipient.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Lifecycle Timestamp:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {recipient.lifecycleTime}
                  </span>
                </div>
                {recipient.attempts !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Delivery Attempts:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {recipient.attempts} {recipient.attempts === 1 ? 'attempt' : 'attempts'}
                    </span>
                  </div>
                )}

                {/* Specific Failed Outcome Box */}
                {recipient.status === 'failed' && (
                  <div className={`p-3 rounded-lg border space-y-1 ${
                    isDark ? 'bg-rose-950/40 border-rose-900/60 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Failure Reason: {recipient.reason || 'Delivery failed'}</span>
                    </div>
                    <p className="text-[11px] opacity-90 leading-relaxed">
                      The message was accepted by the Cloud API dispatch queue, but terminal delivery failed during handset routing.
                    </p>
                    {recipient.attempts && (
                      <div className="text-[10px] font-semibold pt-1">
                        Dispatch attempts exhausted: {recipient.attempts} / 2
                      </div>
                    )}
                  </div>
                )}

                {/* Specific Excluded Outcome Box */}
                {recipient.status === 'excluded' && (
                  <div className={`p-3 rounded-lg border space-y-1 ${
                    isDark ? 'bg-amber-950/40 border-amber-900/60 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Exclusion Reason: {recipient.reason || 'Missing consent'}</span>
                    </div>
                    <p className="text-[11px] opacity-90 leading-relaxed">
                      Candidate was evaluated against campaign audience filters and withheld prior to Cloud API dispatch. No messaging charges or quota consumed.
                    </p>
                    <div className="text-[10px] font-semibold pt-1">
                      Safety Rule: Agamagizh Pre-Flight Consent & Opt-In Verification
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Compact Lifecycle Timeline */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Lifecycle History
              </span>
              <div className={`p-3.5 rounded-xl border ${
                isDark ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  {recipient.lifecycleHistory.map((item, idx) => {
                    const isError = item.isTerminalError || item.stage.toLowerCase().includes('failed') || item.stage.toLowerCase().includes('excluded');
                    
                    return (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 ${
                          isError 
                            ? 'bg-rose-500 border-rose-200 dark:border-rose-900' 
                            : 'bg-emerald-500 border-emerald-200 dark:border-emerald-900'
                        }`} />
                        <div className="flex items-baseline justify-between gap-2">
                          <span className={`text-xs font-bold ${
                            isError 
                              ? 'text-rose-600 dark:text-rose-400' 
                              : 'text-slate-900 dark:text-slate-100'
                          }`}>
                            {item.stage}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {item.timestamp}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 5: Action Navigation */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Navigation Actions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onOpenContact?.(recipient.contactId, recipient.contactName, recipient.destination)}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-colors ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-[#5A4AD2]" />
                  <span>Open Contact</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenConversation?.(recipient.conversationId || `conv-${recipient.id}`)}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-colors ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Open Conversation</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold transition-colors ${
                  isDark 
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Audit Details Copied' : 'Copy Audit Details'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
