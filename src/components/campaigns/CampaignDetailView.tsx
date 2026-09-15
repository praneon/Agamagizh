import React, { useState } from 'react';
import { WhatsAppCampaign } from '../../types';
import { CampaignRecipientRecord } from './types';
import { DETAILED_CAMPAIGN_RECIPIENTS } from './campaignMockData';
import { RecipientDetailDrawer } from './RecipientDetailDrawer';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  XCircle, 
  Edit3, 
  Send, 
  Users, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  AlertTriangle, 
  ShieldAlert, 
  Calendar, 
  Building2,
  Phone
} from 'lucide-react';

interface CampaignDetailViewProps {
  campaign: WhatsAppCampaign;
  onBack: () => void;
  onContinueDraft?: (campaign: WhatsAppCampaign) => void;
  onUpdateCampaignStatus?: (id: string, newStatus: WhatsAppCampaign['status']) => void;
  onOpenConversation?: (phone: string) => void;
}

export const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({
  campaign,
  onBack,
  onContinueDraft,
  onUpdateCampaignStatus,
  onOpenConversation
}) => {
  const [currentStatus, setCurrentStatus] = useState(campaign.status);
  const [recipients, setRecipients] = useState<CampaignRecipientRecord[]>(DETAILED_CAMPAIGN_RECIPIENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Selected recipient for right drawer
  const [selectedRecipient, setSelectedRecipient] = useState<CampaignRecipientRecord | null>(null);

  // Status management
  const handleStatusChange = (newStatus: WhatsAppCampaign['status']) => {
    setCurrentStatus(newStatus);
    onUpdateCampaignStatus?.(campaign.id, newStatus);
  };

  const getStatusBadge = (st: WhatsAppCampaign['status']) => {
    switch (st) {
      case 'completed':
        return <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">Completed</span>;
      case 'running':
        return <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">Running</span>;
      case 'paused':
        return <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200">Paused</span>;
      case 'scheduled':
        return <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-purple-100 text-[#5A4AD2] border border-purple-200">Scheduled</span>;
      case 'draft':
        return <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-slate-100 text-slate-600 border border-slate-200">Draft</span>;
      case 'cancelled':
        return <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-red-100 text-red-700 border border-red-200">Cancelled</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200">{st}</span>;
    }
  };

  // Filter recipients
  const filteredRecipients = recipients.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.contactName.toLowerCase().includes(q) || r.destination.includes(q) || (r.reason && r.reason.toLowerCase().includes(q));
    }
    return true;
  });

  const totalPages = Math.ceil(filteredRecipients.length / pageSize) || 1;
  const paginatedRecipients = filteredRecipients.slice((page - 1) * pageSize, page * pageSize);

  // Recipient status badge
  const getRecipientBadge = (rec: CampaignRecipientRecord) => {
    if (rec.status === 'failed') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Delivery Failed
        </span>
      );
    }
    if (rec.status === 'excluded') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3" />
          Preflight Excluded
        </span>
      );
    }
    if (rec.status === 'replied') {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">Replied</span>;
    }
    if (rec.status === 'read') {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-[#5A4AD2] border border-purple-200">Read</span>;
    }
    if (rec.status === 'delivered') {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 border border-blue-200">Delivered</span>;
    }
    if (rec.status === 'sent') {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200">Sent</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-500 border border-slate-200">Queued</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Breadcrumb & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{campaign.title}</h2>
              {getStatusBadge(currentStatus)}
            </div>
            <span className="text-xs text-slate-500">
              Sender: <strong>{campaign.channelInbox}</strong> • Created: {campaign.createdAt} • Target: {campaign.audienceSummary}
            </span>
          </div>
        </div>

        {/* Lifecycle Action Buttons */}
        <div className="flex items-center gap-2">
          {currentStatus === 'draft' && (
            <button
              type="button"
              onClick={() => onContinueDraft?.(campaign)}
              className="px-4 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Continue Draft Wizard</span>
            </button>
          )}

          {currentStatus === 'running' && (
            <>
              <button
                type="button"
                onClick={() => handleStatusChange('paused')}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl border border-amber-200 flex items-center gap-1.5 transition-colors"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Broadcast</span>
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('cancelled')}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-1.5 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </>
          )}

          {currentStatus === 'paused' && (
            <>
              <button
                type="button"
                onClick={() => handleStatusChange('running')}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume Broadcast</span>
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('cancelled')}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-1.5 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </>
          )}

          {currentStatus === 'scheduled' && (
            <button
              type="button"
              onClick={() => handleStatusChange('cancelled')}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-1.5 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Schedule</span>
            </button>
          )}
        </div>
      </div>

      {/* Campaign Details Info Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Template Name</span>
          <span className="font-mono font-bold text-slate-900 block truncate">{campaign.templateName}</span>
          <span className="text-[11px] text-slate-500">Provider Synced (Meta Cloud API)</span>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Audience Strategy</span>
          <span className="font-bold text-slate-900 block capitalize">{campaign.audienceType.replace('_', ' ')}</span>
          <span className="text-[11px] text-slate-500 truncate block">{campaign.audienceSummary}</span>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Dispatch Schedule</span>
          <span className="font-bold text-slate-900 block">{campaign.scheduledAt || 'Immediate Dispatch'}</span>
          <span className="text-[11px] text-slate-500">Asia/Kolkata (IST)</span>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Connected Channel</span>
          <span className="font-bold text-slate-900 block">{campaign.channelInbox}</span>
          <span className="text-[11px] text-emerald-700 font-semibold">Quality Tier: High</span>
        </div>
      </div>

      {/* KPI Family Strip (Canonical Campaign Metrics ONLY) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Canonical Lifecycle Ledger
          </h3>
          <span className="text-[11px] text-slate-400">
            Total Candidates: <strong>{campaign.totalRecipients}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {/* Queued */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Queued</span>
            <span className="text-lg font-extrabold text-slate-700 block mt-1">
              {Math.max(0, campaign.totalRecipients - campaign.sentCount - campaign.excludedCount)}
            </span>
          </div>

          {/* Sent */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Sent</span>
            <span className="text-lg font-extrabold text-slate-900 block mt-1">{campaign.sentCount}</span>
          </div>

          {/* Delivered */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-blue-700 block">Delivered</span>
            <span className="text-lg font-extrabold text-blue-900 block mt-1">{campaign.deliveredCount}</span>
          </div>

          {/* Read */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-[#5A4AD2] block">Read</span>
            <span className="text-lg font-extrabold text-[#5A4AD2] block mt-1">{campaign.readCount}</span>
          </div>

          {/* Replied */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Replied</span>
            <span className="text-lg font-extrabold text-emerald-900 block mt-1">{campaign.repliedCount}</span>
          </div>

          {/* Failed */}
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-center">
            <span className="text-[10px] uppercase font-bold text-red-700 block">Failed</span>
            <span className="text-lg font-extrabold text-red-900 block mt-1">{campaign.failedCount}</span>
          </div>

          {/* Excluded */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Excluded</span>
            <span className="text-lg font-extrabold text-amber-900 block mt-1">{campaign.excludedCount}</span>
          </div>
        </div>
      </div>

      {/* Recipient Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Campaign Recipient Records</h3>
            <p className="text-[11px] text-slate-500">
              High-density ledger tracking transmission states, preflight exclusion reasons, and replies.
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
            {['all', 'replied', 'read', 'delivered', 'sent', 'queued', 'failed', 'excluded'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => { setStatusFilter(st); setPage(1); }}
                className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap text-[11px] transition-colors ${
                  statusFilter === st
                    ? 'bg-white text-[#5A4AD2] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search contact, phone number, or reason..."
            className="w-full text-xs pl-8.5 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white"
          />
        </div>

        {/* Recipient Table */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold">
              <tr>
                <th className="py-2.5 px-4">Recipient</th>
                <th className="py-2.5 px-4">Destination</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Lifecycle Time</th>
                <th className="py-2.5 px-4">Attempts</th>
                <th className="py-2.5 px-4">Failure / Exclusion Reason</th>
                <th className="py-2.5 px-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecipients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No recipient records match the selected filter.
                  </td>
                </tr>
              ) : (
                paginatedRecipients.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => setSelectedRecipient(rec)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {rec.contactName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 text-[11px]">
                      {rec.destination}
                    </td>
                    <td className="py-3 px-4">
                      {getRecipientBadge(rec)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {rec.lifecycleTime}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-semibold">
                      {rec.attempts}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      {rec.reason ? (
                        <span className={`text-[11px] truncate block ${
                          rec.status === 'failed' ? 'text-red-700 font-medium' : 'text-amber-800'
                        }`}>
                          {rec.reason}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecipient(rec);
                        }}
                        className="px-2.5 py-1 text-[#5A4AD2] hover:bg-[#EEECFB] rounded-lg font-bold text-[11px] inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>
            Showing {paginatedRecipients.length} of {filteredRecipients.length} recipients
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 rounded-lg font-bold text-[11px]"
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 rounded-lg font-bold text-[11px]"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Recipient Detail Right Drawer */}
      <RecipientDetailDrawer
        isOpen={!!selectedRecipient}
        onClose={() => setSelectedRecipient(null)}
        recipient={selectedRecipient}
        campaignTitle={campaign.title}
        onOpenConversation={onOpenConversation}
      />
    </div>
  );
};
