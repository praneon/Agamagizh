import React, { useState } from 'react';
import { WhatsAppCampaign } from '../../types';
import { 
  Send, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  Eye, 
  Pause, 
  Play, 
  MoreVertical,
  BarChart2,
  Edit3,
  ChevronRight
} from 'lucide-react';
import { CampaignWizardModal } from './CampaignWizardModal';
import { CampaignRecipientsDrawer } from './CampaignRecipientsDrawer';
import { CampaignDetailView } from './CampaignDetailView';

interface CampaignsViewProps {
  campaigns: WhatsAppCampaign[];
  onCreateCampaign: (campaign: any) => void;
  onViewAnalytics?: () => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns = [],
  onCreateCampaign,
  onViewAnalytics
}) => {
  const [search, setSearch] = useState('');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingDraftCampaign, setEditingDraftCampaign] = useState<WhatsAppCampaign | null>(null);
  const [selectedCampaignForDetail, setSelectedCampaignForDetail] = useState<WhatsAppCampaign | null>(null);
  const [selectedCampaignForRecipients, setSelectedCampaignForRecipients] = useState<WhatsAppCampaign | null>(null);
  const [campaignList, setCampaignList] = useState<WhatsAppCampaign[]>(campaigns);

  // Sync props
  React.useEffect(() => {
    setCampaignList(campaigns);
  }, [campaigns]);

  const handleCreateOrUpdateCampaign = (campaignData: any) => {
    onCreateCampaign(campaignData);
    setIsWizardOpen(false);
    setEditingDraftCampaign(null);
  };

  const handleUpdateStatus = (campaignId: string, newStatus: WhatsAppCampaign['status']) => {
    setCampaignList(prev => prev.map(c => c.id === campaignId ? { ...c, status: newStatus } : c));
    if (selectedCampaignForDetail && selectedCampaignForDetail.id === campaignId) {
      setSelectedCampaignForDetail(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const safeCampaigns = campaignList || [];
  const filteredCampaigns = safeCampaigns.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.templateName.toLowerCase().includes(search.toLowerCase())
  );

  // If a campaign is selected for detailed inspection, show the full CampaignDetailView!
  if (selectedCampaignForDetail) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <CampaignDetailView
          campaign={selectedCampaignForDetail}
          onBack={() => setSelectedCampaignForDetail(null)}
          onContinueDraft={(cmp) => {
            setEditingDraftCampaign(cmp);
            setIsWizardOpen(true);
          }}
          onUpdateCampaignStatus={handleUpdateStatus}
        />

        {/* Wizard Modal in case user clicks Continue Draft */}
        <CampaignWizardModal
          isOpen={isWizardOpen}
          onClose={() => {
            setIsWizardOpen(false);
            setEditingDraftCampaign(null);
          }}
          onCreateCampaign={handleCreateOrUpdateCampaign}
          initialCampaign={editingDraftCampaign}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              WhatsApp Broadcasts & Campaigns
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Cloud API Live
            </span>
          </div>
          <p className="text-xs text-[#6E737F]">
            Scheduled bulk dispatches, operational announcements, and verified broadcast messaging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onViewAnalytics && (
            <button
              onClick={onViewAnalytics}
              className="px-3.5 py-2 bg-white border border-[#E3E5E9] text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5 text-[#5A4AD2]" />
              <span>Broadcast Analytics</span>
            </button>
          )}

          <button
            onClick={() => {
              setEditingDraftCampaign(null);
              setIsWizardOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Canonical Campaign Metrics ONLY) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Dispatched</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {campaignList.reduce((sum, c) => sum + c.sentCount, 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">98.2% Deliverability</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Messages Read</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {campaignList.reduce((sum, c) => sum + c.readCount, 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-[#5A4AD2] font-semibold">89.4% Read Rate</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Replies</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {campaignList.reduce((sum, c) => sum + c.repliedCount, 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Inbound responses</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Delivery Failures</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {campaignList.reduce((sum, c) => sum + c.failedCount, 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Meta Cloud API errors</span>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-[#E3E5E9] shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-[#E3E5E9] flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="w-full text-xs pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-[#6E737F] font-bold border-b border-[#E3E5E9] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Campaign Name</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Audience</th>
                <th className="py-3.5 px-4">Template</th>
                <th className="py-3.5 px-4">Sent / Read</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCampaigns.map((cmp) => (
                <tr
                  key={cmp.id}
                  onClick={() => setSelectedCampaignForDetail(cmp)}
                  className="hover:bg-[#EEECFB]/30 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 hover:text-[#5A4AD2] transition-colors">
                      {cmp.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {cmp.channelInbox} • {cmp.scheduledAt || 'Immediate Dispatch'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      cmp.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : cmp.status === 'running'
                        ? 'bg-blue-100 text-blue-800 animate-pulse'
                        : cmp.status === 'scheduled'
                        ? 'bg-purple-100 text-[#5A4AD2]'
                        : cmp.status === 'draft'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {cmp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 block">{cmp.totalRecipients} Candidates</span>
                    <span className="text-[11px] text-slate-400 block truncate max-w-xs">{cmp.audienceSummary}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {cmp.templateName}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">
                      {cmp.sentCount} / <span className="text-[#5A4AD2]">{cmp.readCount} read</span>
                    </div>
                    {cmp.failedCount > 0 && (
                      <span className="text-[10px] text-red-600 font-bold block">{cmp.failedCount} failed</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {cmp.status === 'draft' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDraftCampaign(cmp);
                            setIsWizardOpen(true);
                          }}
                          className="px-3 py-1.5 bg-[#EEECFB] hover:bg-[#5A4AD2] text-[#5A4AD2] hover:text-white rounded-xl font-bold transition-colors inline-flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Continue Draft</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedCampaignForDetail(cmp)}
                          className="px-3 py-1.5 bg-[#EEECFB] hover:bg-[#5A4AD2] text-[#5A4AD2] hover:text-white rounded-xl font-bold transition-colors inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Detail</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wizard Modal */}
      <CampaignWizardModal
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setEditingDraftCampaign(null);
        }}
        onCreateCampaign={handleCreateOrUpdateCampaign}
        initialCampaign={editingDraftCampaign}
      />

      {/* Recipient Records Drawer (quick view if triggered directly) */}
      {selectedCampaignForRecipients && (
        <CampaignRecipientsDrawer
          isOpen={!!selectedCampaignForRecipients}
          onClose={() => setSelectedCampaignForRecipients(null)}
          campaignTitle={selectedCampaignForRecipients.title}
        />
      )}
    </div>
  );
};
