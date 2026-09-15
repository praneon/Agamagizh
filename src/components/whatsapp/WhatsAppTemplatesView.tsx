import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  RefreshCw, 
  Eye, 
  ExternalLink, 
  Phone, 
  CornerDownLeft, 
  ShieldCheck, 
  Copy, 
  Edit3, 
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Check
} from 'lucide-react';
import { WhatsAppTemplate } from '../../types';
import { INITIAL_TEMPLATES } from '../../data/mockData';
import { TemplateBuilder } from '../templates/TemplateBuilder';
import { TemplateDraft, TemplateButtonType } from '../templates/types';
import { SAMPLE_DRAFTS, extractVariablesFromText, interpolateText } from '../templates/templateUtils';
import { ProviderTemplateDetailModal } from '../templates/ProviderTemplateDetailModal';

// Conversion helpers between WhatsAppTemplate and TemplateDraft
function templateToDraft(tpl: WhatsAppTemplate): TemplateDraft {
  const detectedIndices = extractVariablesFromText(`${tpl.header?.text || ''} ${tpl.body || ''}`);
  const variables = detectedIndices.map((idx) => ({
    token: `{{${idx}}}`,
    index: idx,
    example: tpl.variableExamples?.[`{{${idx}}}`] || (idx === 1 ? 'Meera Sundaram' : idx === 2 ? '14 Sep, 10:30 AM' : idx === 3 ? 'Adyar Campus' : 'Sample'),
    description: tpl.variableDescriptions?.[`{{${idx}}}`] || `Parameter ${idx}`
  }));

  const isLocal = tpl.status === 'local_draft';

  return {
    id: isLocal ? tpl.id : `draft-${Date.now()}`,
    name: isLocal ? tpl.name : `${tpl.name}_copy`,
    category: tpl.category,
    language: tpl.language.includes('ta') ? 'ta' : tpl.language.includes('hi') ? 'hi' : 'en_US',
    source: 'local_draft',
    status: 'local_draft',
    isCampaignEligible: false,
    header: {
      type: tpl.header?.type || 'none',
      text: tpl.header?.text
    },
    body: tpl.body,
    footer: tpl.footer || '',
    variables,
    buttons: (tpl.buttons || []).map((b, i) => {
      let bType: TemplateButtonType = 'QUICK_REPLY';
      if (b.type.toUpperCase() === 'URL') bType = 'URL';
      else if (b.type.toUpperCase() === 'PHONE_NUMBER') bType = 'PHONE_NUMBER';
      return {
        id: `btn-${i}-${Date.now()}`,
        type: bType,
        text: b.text,
        value: b.value,
        phoneNumber: b.value
      };
    }),
    createdAt: tpl.createdAt || 'Today',
    updatedAt: 'Just now'
  };
}

function draftToTemplate(draft: TemplateDraft): WhatsAppTemplate {
  return {
    id: draft.id,
    name: draft.name,
    category: draft.category,
    language: draft.language,
    status: 'local_draft',
    source: 'local_draft',
    isCampaignEligible: false,
    header: draft.header.type !== 'none' ? { type: draft.header.type, text: draft.header.text } : undefined,
    body: draft.body,
    footer: draft.footer || undefined,
    buttons: draft.buttons.map((b) => ({
      type: b.type,
      text: b.text,
      value: b.value || b.phoneNumber
    })),
    createdAt: draft.createdAt,
    lastSyncedAt: undefined
  };
}

export const WhatsAppTemplatesView: React.FC = () => {
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(INITIAL_TEMPLATES);
  const [activeTab, setActiveTab] = useState<'all' | 'local_draft' | 'approved' | 'pending' | 'rejected'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);

  // Builder Workspace Navigation State
  const [viewMode, setViewMode] = useState<'library' | 'builder'>('library');
  const [activeDraft, setActiveDraft] = useState<TemplateDraft | null>(null);

  // Provider Detail Modal State
  const [providerDetailTemplate, setProviderDetailTemplate] = useState<WhatsAppTemplate | null>(null);

  // Sync templates simulated state
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  // Filtering
  const filtered = templates.filter((t) => {
    if (activeTab !== 'all' && t.status !== activeTab) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.body.toLowerCase().includes(q);
    }
    return true;
  });

  const previewTemplate = selectedTemplate || filtered[0] || templates[0];

  // Actions
  const handleOpenNewTemplate = () => {
    setActiveDraft(SAMPLE_DRAFTS.appointment_reminder);
    setViewMode('builder');
  };

  const handleEditLocalDraft = (tpl: WhatsAppTemplate) => {
    setActiveDraft(templateToDraft(tpl));
    setViewMode('builder');
  };

  const handleInspectProviderTemplate = (tpl: WhatsAppTemplate) => {
    setProviderDetailTemplate(tpl);
  };

  const handleDuplicateAsDraft = (tpl: WhatsAppTemplate) => {
    const duplicated = templateToDraft(tpl);
    setActiveDraft(duplicated);
    setViewMode('builder');
  };

  const handleSaveFromBuilder = (savedDraft: TemplateDraft) => {
    const updatedTpl = draftToTemplate(savedDraft);
    setTemplates((prev) => {
      const exists = prev.some((t) => t.id === updatedTpl.id);
      if (exists) {
        return prev.map((t) => (t.id === updatedTpl.id ? updatedTpl : t));
      }
      return [updatedTpl, ...prev];
    });
  };

  const handleTriggerSync = () => {
    setSyncState('syncing');
    setTimeout(() => {
      setSyncState('synced');
      setTimeout(() => setSyncState('idle'), 3500);
    }, 1200);
  };

  // IF IN BUILDER MODE: RENDER DEDICATED FULL-PAGE BUILDER WORKSPACE
  if (viewMode === 'builder') {
    return (
      <div className="h-full w-full">
        <TemplateBuilder
          initialDraft={activeDraft}
          onSaveTemplate={handleSaveFromBuilder}
          onBackToLibrary={() => {
            setViewMode('library');
            setActiveDraft(null);
          }}
        />
      </div>
    );
  }

  // PREVIEW INTERPOLATION FOR LIBRARY PHONE
  const previewVariables = extractVariablesFromText(
    `${previewTemplate?.header?.text || ''} ${previewTemplate?.body || ''}`
  ).map((idx) => ({
    token: `{{${idx}}}`,
    index: idx,
    example: idx === 1 ? 'Meera Sundaram' : idx === 2 ? '14 Sep, 10:30 AM' : idx === 3 ? 'Adyar Campus' : 'Sample',
    description: ''
  }));

  const interpolatedPreviewBody = previewTemplate ? interpolateText(previewTemplate.body, previewVariables) : '';
  const interpolatedPreviewHeader = previewTemplate?.header?.type === 'text' && previewTemplate?.header?.text
    ? interpolateText(previewTemplate.header.text, previewVariables)
    : '';

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 select-text">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              WhatsApp Templates
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Meta Sync v20.0
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#5A4AD2] border border-indigo-200">
              Local Builder Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage local template drafts and view provider-synced HSM messages. Authoritative approval is determined by Meta upon external provider sync.
          </p>
        </div>

        {/* Action controls: Sync Templates & New Template */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Sync Templates Button */}
          <button
            type="button"
            onClick={handleTriggerSync}
            disabled={syncState === 'syncing'}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              syncState === 'synced'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold'
                : syncState === 'syncing'
                ? 'bg-slate-50 border-slate-200 text-slate-400'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-2xs'
            }`}
            title="Fetch authoritative template approval statuses from Meta Cloud API"
          >
            {syncState === 'syncing' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#5A4AD2]" />
                <span>Syncing…</span>
              </>
            ) : syncState === 'synced' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Templates Updated</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Sync Templates</span>
              </>
            )}
          </button>

          {/* New Template Primary Action: Opens Local Template Builder */}
          <button
            type="button"
            onClick={handleOpenNewTemplate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Template</span>
          </button>
        </div>
      </div>

      {/* 2. Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#E3E5E9] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Tabs: All, Local Drafts, Approved, Pending, Rejected */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
          {[
            { id: 'all', label: 'All Templates' },
            { id: 'local_draft', label: 'Local Drafts' },
            { id: 'approved', label: 'Approved' },
            { id: 'pending', label: 'Pending' },
            { id: 'rejected', label: 'Rejected' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-[#5A4AD2] shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5A4AD2] text-slate-700 font-semibold"
          >
            <option value="all">All Categories</option>
            <option value="UTILITY">Utility</option>
            <option value="MARKETING">Marketing</option>
            <option value="AUTHENTICATION">Authentication</option>
          </select>

          {/* Search Input */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or content…"
              className="w-full text-xs pl-8.5 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5A4AD2] focus:bg-white text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* 3. Main Content: Template Cards List & Sticky Phone Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Template Cards */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-[#E3E5E9] text-xs text-slate-400 space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No templates match the selected criteria.</p>
              <p className="text-[11px] text-slate-400">Try changing the status filter or clearing your search query.</p>
            </div>
          ) : (
            filtered.map((tpl) => {
              const isSelected = selectedTemplate?.id === tpl.id;
              const isLocalDraft = tpl.status === 'local_draft';
              const isApproved = tpl.status === 'approved';
              const isPending = tpl.status === 'pending';
              const isRejected = tpl.status === 'rejected';

              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`bg-white p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                    isSelected
                      ? 'border-[#5A4AD2] shadow-md ring-2 ring-[#5A4AD2]/10'
                      : 'border-[#E3E5E9] hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* Card Header Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-slate-900 text-xs truncate">
                          {tpl.name}
                        </span>

                        {/* Status badge with text + semantic styling */}
                        {isLocalDraft && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-300">
                            Local Draft
                          </span>
                        )}
                        {isApproved && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Approved</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Pending Provider</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                            <XCircle className="w-2.5 h-2.5" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </div>

                      {/* Source & Eligibility descriptor */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-1">
                        <span>{tpl.category} • {tpl.language}</span>
                        <span>•</span>
                        {isLocalDraft && (
                          <span className="text-slate-500">Stored locally • Not campaign eligible</span>
                        )}
                        {isApproved && (
                          <span className="text-emerald-700 font-semibold">Provider synced • Campaign eligible</span>
                        )}
                        {isPending && (
                          <span className="text-amber-700">Provider synced • Awaiting provider decision</span>
                        )}
                        {isRejected && (
                          <span className="text-rose-700">Provider synced • Not campaign eligible</span>
                        )}
                      </div>
                    </div>

                    {/* Campaign ready indicator or Draft indicator */}
                    {tpl.isCampaignEligible ? (
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0">
                        Campaign Ready
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-200 text-[10px] font-medium shrink-0">
                        {isLocalDraft ? 'Draft' : 'Ineligible'}
                      </span>
                    )}
                  </div>

                  {/* Body Content Preview Box */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans line-clamp-3">
                    {tpl.body}
                  </div>

                  {/* Rejection Reason Notice (If Rejected) */}
                  {isRejected && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-[11px] text-rose-800 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <p className="line-clamp-2">
                        {tpl.rejectionReason || 'Policy violation: Prohibited claims or category mismatch.'}
                      </p>
                    </div>
                  )}

                  {/* Card Actions Footer */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">
                      {isLocalDraft ? 'Created in Agamagizh local storage' : `Synced ${tpl.lastSyncedAt || 'Today'}`}
                    </span>

                    <div className="flex items-center gap-3">
                      {isLocalDraft ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLocalDraft(tpl);
                          }}
                          className="text-[#5A4AD2] font-bold hover:underline flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Continue Editing in Builder →</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInspectProviderTemplate(tpl);
                          }}
                          className="text-[#5A4AD2] font-bold hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Provider Details →</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: WhatsApp Phone Frame Mockup */}
        <div className="bg-slate-900 text-white rounded-3xl p-4 shadow-xl flex flex-col items-center justify-start border-4 border-slate-800 h-[640px] sticky top-20">
          {/* Phone Top Notch */}
          <div className="w-28 h-4 bg-slate-800 rounded-b-xl mb-3 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-700 mr-2" />
            <div className="w-10 h-1 bg-slate-700 rounded" />
          </div>

          {/* WhatsApp Header in phone */}
          <div className="w-full bg-[#075E54] text-white p-3 rounded-t-2xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold truncate">Agamagizh Center</span>
                  <span className="w-3 h-3 rounded-full bg-white text-[#075E54] flex items-center justify-center text-[8px] font-black">
                    ✓
                  </span>
                </div>
                <span className="text-[9px] text-emerald-200 block truncate">
                  Verified Business Account
                </span>
              </div>
            </div>

            {previewTemplate && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-100">
                {previewTemplate.language}
              </span>
            )}
          </div>

          {/* WhatsApp Chat Canvas */}
          <div
            className="w-full flex-1 bg-[#ECE5DD] p-3 rounded-b-2xl overflow-y-auto space-y-2 flex flex-col justify-end"
            style={{
              backgroundImage: 'radial-gradient(#DFD7CA 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          >
            {previewTemplate && (
              <div className="bg-white rounded-xl p-3 shadow-md text-slate-900 space-y-2 max-w-full text-xs">
                {/* Header */}
                {previewTemplate.header && previewTemplate.header.type !== 'none' && (
                  <div className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-1">
                    {interpolatedPreviewHeader || (previewTemplate.header.type === 'image' ? '[Image Banner Header]' : '[Document Attachment Header]')}
                  </div>
                )}

                {/* Interpolated Body */}
                <p className="whitespace-pre-wrap text-[11px] leading-relaxed text-slate-800 font-sans">
                  {interpolatedPreviewBody || previewTemplate.body}
                </p>

                {/* Footer */}
                {previewTemplate.footer && (
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {previewTemplate.footer}
                  </span>
                )}

                {/* Action Buttons */}
                {previewTemplate.buttons && previewTemplate.buttons.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    {previewTemplate.buttons.map((btn, bIdx) => (
                      <div
                        key={bIdx}
                        className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#00A884] font-bold text-center rounded-lg text-[11px] flex items-center justify-center gap-1.5"
                      >
                        {btn.type === 'QUICK_REPLY' && <CornerDownLeft className="w-3 h-3 opacity-60" />}
                        {btn.type === 'URL' && <ExternalLink className="w-3 h-3 opacity-60" />}
                        {btn.type === 'PHONE_NUMBER' && <Phone className="w-3 h-3 opacity-60" />}
                        <span>{btn.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-full text-center py-2 text-[10px] text-slate-400">
            Previewing: {previewTemplate?.name || 'template'}
          </div>
        </div>
      </div>

      {/* Provider Synced Template Read-Only Inspector */}
      <ProviderTemplateDetailModal
        isOpen={Boolean(providerDetailTemplate)}
        onClose={() => setProviderDetailTemplate(null)}
        template={providerDetailTemplate}
        onDuplicateAsDraft={handleDuplicateAsDraft}
      />
    </div>
  );
};
