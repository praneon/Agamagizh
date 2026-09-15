import React from 'react';
import { 
  Search, 
  X, 
  Send, 
  CheckCheck, 
  Eye, 
  MessageSquareReply, 
  AlertCircle, 
  ShieldAlert, 
  Clock, 
  ChevronRight,
  ExternalLink,
  Filter
} from 'lucide-react';
import { RecipientLedgerItem, CanonicalRecipientStatus } from './types';

interface RecipientLedgerTableProps {
  recipients: RecipientLedgerItem[];
  selectedStatus?: CanonicalRecipientStatus | 'all';
  onSelectStatus: (status: CanonicalRecipientStatus | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onViewDetails: (recipient: RecipientLedgerItem) => void;
  onClearFilters: () => void;
  isDark?: boolean;
}

export const RecipientLedgerTable: React.FC<RecipientLedgerTableProps> = ({
  recipients,
  selectedStatus = 'all',
  onSelectStatus,
  searchQuery,
  onSearchChange,
  onViewDetails,
  onClearFilters,
  isDark = false
}) => {
  const statusOptions: { label: string; value: CanonicalRecipientStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Queued', value: 'queued' },
    { label: 'Sent', value: 'sent' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Read', value: 'read' },
    { label: 'Replied', value: 'replied' },
    { label: 'Failed', value: 'failed' },
    { label: 'Excluded', value: 'excluded' }
  ];

  const getStatusBadge = (status: CanonicalRecipientStatus) => {
    switch (status) {
      case 'sent':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
            isDark ? 'bg-sky-950/60 text-sky-300 border border-sky-800/80' : 'bg-sky-50 text-sky-700 border border-sky-200'
          }`}>
            <Send className="w-2.5 h-2.5" />
            Sent
          </span>
        );
      case 'delivered':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
            isDark ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <CheckCheck className="w-2.5 h-2.5" />
            Delivered
          </span>
        );
      case 'read':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
            isDark ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/80' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
          }`}>
            <Eye className="w-2.5 h-2.5" />
            Read
          </span>
        );
      case 'replied':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
            isDark ? 'bg-teal-950/60 text-teal-300 border border-teal-800/80' : 'bg-teal-50 text-teal-700 border border-teal-200'
          }`}>
            <MessageSquareReply className="w-2.5 h-2.5" />
            Replied
          </span>
        );
      case 'failed':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
            isDark ? 'bg-rose-950/60 text-rose-300 border border-rose-800/80' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            <AlertCircle className="w-2.5 h-2.5" />
            Failed
          </span>
        );
      case 'excluded':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
            isDark ? 'bg-amber-950/60 text-amber-300 border border-amber-800/80' : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            <ShieldAlert className="w-2.5 h-2.5" />
            Excluded
          </span>
        );
      case 'queued':
      default:
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
            isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}>
            <Clock className="w-2.5 h-2.5" />
            Queued
          </span>
        );
    }
  };

  const getReasonBadge = (recipient: RecipientLedgerItem) => {
    if (recipient.status === 'failed') {
      return (
        <div className="flex flex-col gap-0.5">
          <span className={`inline-flex items-center gap-1 font-semibold text-xs ${
            isDark ? 'text-rose-400' : 'text-rose-700'
          }`}>
            <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
            {recipient.reason || 'Delivery failed'}
          </span>
          {recipient.attempts && (
            <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Attempts: {recipient.attempts}
            </span>
          )}
        </div>
      );
    }

    if (recipient.status === 'excluded') {
      return (
        <div className="flex flex-col gap-0.5">
          <span className={`inline-flex items-center gap-1 font-semibold text-xs ${
            isDark ? 'text-amber-400' : 'text-amber-700'
          }`}>
            <ShieldAlert className="w-3 h-3 text-amber-500 shrink-0" />
            {recipient.reason || 'Missing consent'}
          </span>
          <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Pre-send safety rule
          </span>
        </div>
      );
    }

    if (recipient.status === 'replied') {
      return (
        <span className={`text-[11px] ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>
          Inbound response received
        </span>
      );
    }

    if (recipient.status === 'read') {
      return (
        <span className={`text-[11px] ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
          Blue tick acknowledged
        </span>
      );
    }

    if (recipient.status === 'delivered') {
      return (
        <span className={`text-[11px] ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
          Handset receipt confirmed
        </span>
      );
    }

    return (
      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        —
      </span>
    );
  };

  return (
    <div className={`rounded-2xl border transition-colors ${
      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#E3E5E9]'
    }`}>
      {/* Search & Filter Header Toolbar */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Recipient Delivery Ledger
              </h3>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
              }`}>
                {recipients.length} {recipients.length === 1 ? 'record' : 'records'}
              </span>
            </div>
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Individual recipient lifecycle events, carrier outcomes, and exclusion diagnostics
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search contact, phone, campaign..."
              className={`w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-slate-200 placeholder-slate-500' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className={`text-[11px] font-semibold mr-1 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Status:
          </span>
          {statusOptions.map(opt => {
            const isSelected = selectedStatus === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSelectStatus(opt.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                  isSelected
                    ? isDark ? 'bg-[#5A4AD2] text-white shadow-xs' : 'bg-[#5A4AD2] text-white shadow-xs'
                    : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipient Table (Desktop) */}
      <div className="hidden md:block overflow-x-auto">
        {recipients.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 ${
              isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              <Filter className="w-5 h-5" />
            </div>
            <h4 className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              No recipients match your filters.
            </h4>
            <p className={`text-xs mt-1 max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Try clearing the search query or resetting your status selection.
            </p>
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-4 px-4 py-1.5 text-xs font-bold rounded-lg bg-[#5A4AD2] text-white hover:bg-[#4838b8] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'bg-slate-800/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-3">Destination</th>
                <th className="py-3 px-3">Campaign</th>
                <th className="py-3 px-3">Inbox</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Lifecycle Time</th>
                <th className="py-3 px-3">Reason / Outcome</th>
                <th className="py-3 px-4 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {recipients.map(r => (
                <tr 
                  key={r.id}
                  className={`transition-colors ${
                    isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Contact */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                        isDark ? 'bg-slate-800 text-violet-300' : 'bg-violet-100 text-[#5A4AD2]'
                      }`}>
                        {r.contactName.charAt(0)}
                      </div>
                      <div>
                        <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                          {r.contactName}
                        </div>
                        <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          ID: {r.contactId}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Destination Phone */}
                  <td className={`py-3 px-3 font-mono text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {r.destination}
                  </td>

                  {/* Campaign */}
                  <td className="py-3 px-3">
                    <span className={`text-xs font-semibold block truncate max-w-[170px] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {r.campaignName}
                    </span>
                  </td>

                  {/* Inbox */}
                  <td className={`py-3 px-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-[11px] truncate max-w-[130px] block">
                      {r.inbox}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3">
                    {getStatusBadge(r.status)}
                  </td>

                  {/* Lifecycle Time */}
                  <td className={`py-3 px-3 text-[11px] whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {r.lifecycleTime}
                  </td>

                  {/* Reason Column */}
                  <td className="py-3 px-3">
                    {getReasonBadge(r)}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onViewDetails(r)}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                        isDark 
                          ? 'bg-slate-800 text-violet-300 hover:bg-slate-700' 
                          : 'bg-violet-50 text-[#5A4AD2] hover:bg-violet-100'
                      }`}
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recipient Cards (Mobile ~390x844) */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {recipients.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              No recipients match your filters.
            </p>
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-3 px-3 py-1 text-xs font-bold rounded bg-[#5A4AD2] text-white"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          recipients.map(r => (
            <div key={r.id} className="p-3.5 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className={`font-bold text-xs ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {r.contactName}
                  </div>
                  <div className={`font-mono text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {r.destination}
                  </div>
                </div>
                <div>{getStatusBadge(r.status)}</div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {r.campaignName}
                </span>
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {r.lifecycleTime}
                </span>
              </div>

              {/* Reason if failed or excluded */}
              {(r.status === 'failed' || r.status === 'excluded') && (
                <div className={`p-2 rounded-lg text-xs ${
                  r.status === 'failed' 
                    ? isDark ? 'bg-rose-950/40 text-rose-300' : 'bg-rose-50 text-rose-700'
                    : isDark ? 'bg-amber-950/40 text-amber-300' : 'bg-amber-50 text-amber-700'
                }`}>
                  <div className="font-bold text-[11px] uppercase tracking-wide">
                    {r.status === 'failed' ? 'Failure Reason' : 'Exclusion Reason'}:
                  </div>
                  <div>{r.reason}</div>
                  {r.attempts && (
                    <div className="text-[10px] opacity-80 mt-0.5">
                      Attempts: {r.attempts}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => onViewDetails(r)}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${
                    isDark ? 'bg-slate-800 text-violet-300' : 'bg-violet-50 text-[#5A4AD2]'
                  }`}
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
