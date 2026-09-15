import React, { useState } from 'react';
import { WhatsAppTemplate } from '../../../types';
import { INITIAL_TEMPLATES } from '../../../data/mockData';
import { 
  Check, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  Lock,
  MessageSquare,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface Step3TemplateProps {
  selectedTemplateId: string;
  onSelectTemplate: (template: WhatsAppTemplate) => void;
  showErrors?: boolean;
}

export const Step3Template: React.FC<Step3TemplateProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  showErrors
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'UTILITY' | 'MARKETING' | 'AUTHENTICATION'>('ALL');

  const selectedTemplate = INITIAL_TEMPLATES.find(t => t.id === selectedTemplateId);

  const filteredTemplates = INITIAL_TEMPLATES.filter((tpl) => {
    if (categoryFilter !== 'ALL' && tpl.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return tpl.name.toLowerCase().includes(q) || tpl.body.toLowerCase().includes(q);
    }
    return true;
  });

  const countVariables = (body: string) => {
    const matches = body.match(/\{\{\d+\}\}/g);
    return matches ? new Set(matches).size : 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Select WhatsApp Template</h3>
        <p className="text-xs text-slate-500 mt-1">
          WhatsApp Cloud API strictly mandates that all broadcast dispatches use Meta-approved provider templates.
        </p>
      </div>

      {/* Selected Template Banner (if already chosen) */}
      {selectedTemplate && (
        <div className="p-4 bg-[#EEECFB]/60 rounded-2xl border border-[#5A4AD2]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5A4AD2] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{selectedTemplate.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Approved & Eligible
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Category: {selectedTemplate.category} • Language: {selectedTemplate.language} • {countVariables(selectedTemplate.body)} Variables
              </span>
            </div>
          </div>

          <span className="px-3 py-1 bg-white text-[#5A4AD2] font-bold text-[11px] rounded-lg border border-[#5A4AD2]/20">
            Current Selection
          </span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates by name or text..."
            className="w-full text-xs pl-8.5 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          {(['ALL', 'UTILITY', 'MARKETING'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-white text-[#5A4AD2] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="space-y-3">
        {filteredTemplates.map((tpl) => {
          const isSelected = selectedTemplateId === tpl.id;
          const isEligible = tpl.status === 'approved' && tpl.isCampaignEligible;
          const varCount = countVariables(tpl.body);

          return (
            <div
              key={tpl.id}
              onClick={() => {
                if (isEligible) {
                  onSelectTemplate(tpl);
                }
              }}
              className={`p-4 rounded-2xl border transition-all text-xs ${
                !isEligible
                  ? 'bg-slate-50/70 border-slate-200 opacity-70 cursor-not-allowed'
                  : isSelected
                  ? 'bg-[#EEECFB]/40 border-[#5A4AD2] shadow-xs cursor-pointer ring-1 ring-[#5A4AD2]'
                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 font-mono text-xs">{tpl.name}</span>
                  {tpl.status === 'approved' && isEligible && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Approved & Campaign Eligible
                    </span>
                  )}
                  {tpl.status === 'pending' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Awaiting Provider Approval
                    </span>
                  )}
                  {tpl.status === 'rejected' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                      Provider Rejected
                    </span>
                  )}
                  {tpl.status === 'local_draft' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700 border border-slate-300">
                      Local Draft
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="px-2 py-0.5 bg-slate-100 rounded-md font-semibold">{tpl.category}</span>
                  <span>{tpl.language}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#5A4AD2] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Body snippet */}
              <div className="p-3 bg-slate-50 rounded-xl font-sans text-slate-700 text-xs leading-relaxed whitespace-pre-wrap border border-slate-100">
                {tpl.body}
              </div>

              {/* Header / Buttons / Ineligibility note */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5 pt-2 text-[11px]">
                <div className="flex items-center gap-3 text-slate-500">
                  <span>Variables: <strong className="text-slate-800">{varCount}</strong></span>
                  {tpl.buttons && tpl.buttons.length > 0 && (
                    <span>Buttons: <strong className="text-slate-800">{tpl.buttons.length}</strong></span>
                  )}
                  {tpl.header && tpl.header.type !== 'none' && (
                    <span className="capitalize">Header: {tpl.header.type}</span>
                  )}
                </div>

                {!isEligible && (
                  <div className="flex items-center gap-1 text-slate-500 font-semibold italic">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>
                      {tpl.status === 'pending'
                        ? 'Not available for campaigns: Awaiting Meta review.'
                        : tpl.status === 'rejected'
                        ? 'Not available for campaigns: Template rejected by Meta.'
                        : 'Not available for campaigns: Must be submitted and approved.'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showErrors && !selectedTemplateId && (
        <p className="text-xs text-red-600 font-semibold flex items-center gap-1.5 p-3 bg-red-50 rounded-xl border border-red-200">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          Please select an approved and campaign-eligible template to continue.
        </p>
      )}
    </div>
  );
};
