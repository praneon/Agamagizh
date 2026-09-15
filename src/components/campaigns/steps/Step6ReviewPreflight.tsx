import React, { useState, useEffect } from 'react';
import { 
  CampaignDraftState, 
  CanonicalPreflightResult, 
  PreflightExclusionCategory,
  WizardStep 
} from '../types';
import { WhatsAppTemplate } from '../../../types';
import { getMockPreflight } from '../campaignMockData';
import { PreflightExclusionDrawer } from '../PreflightExclusionDrawer';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  Edit3, 
  Users, 
  FileText, 
  Calendar, 
  Clock, 
  Send, 
  AlertCircle, 
  Check, 
  Eye, 
  HelpCircle,
  XCircle,
  Info
} from 'lucide-react';

interface Step6ReviewPreflightProps {
  draft: CampaignDraftState;
  template?: WhatsAppTemplate;
  candidateCount: number;
  onJumpToStep: (step: WizardStep) => void;
  onLaunchCampaign: () => void;
  onSaveDraft: () => void;
  isBlockedSimulation?: boolean;
}

export const Step6ReviewPreflight: React.FC<Step6ReviewPreflightProps> = ({
  draft,
  template,
  candidateCount,
  onJumpToStep,
  onLaunchCampaign,
  onSaveDraft,
  isBlockedSimulation = false
}) => {
  const [isRunningPreflight, setIsRunningPreflight] = useState(true);
  const [preflightResult, setPreflightResult] = useState<CanonicalPreflightResult | null>(null);
  
  // Exclusion Drawer
  const [isExclusionDrawerOpen, setIsExclusionDrawerOpen] = useState(false);
  const [selectedExclusionCategory, setSelectedExclusionCategory] = useState<PreflightExclusionCategory | 'all'>('all');

  // Run preflight simulation
  const runPreflight = () => {
    setIsRunningPreflight(true);
    setTimeout(() => {
      const result = getMockPreflight(candidateCount, draft.audienceType, isBlockedSimulation);
      setPreflightResult(result);
      setIsRunningPreflight(false);
    }, 700);
  };

  useEffect(() => {
    runPreflight();
  }, [candidateCount, draft.audienceType, isBlockedSimulation]);

  // Check blockers
  const blockers: { step: WizardStep; message: string; actionLabel: string }[] = [];

  if (!draft.name.trim()) {
    blockers.push({
      step: 1,
      message: 'Campaign name is missing.',
      actionLabel: 'Fix Details'
    });
  }

  if (candidateCount === 0) {
    blockers.push({
      step: 2,
      message: 'Audience candidate pool is empty. Please select candidate contacts or upload a CSV.',
      actionLabel: 'Fix Audience'
    });
  }

  if (!template || template.status !== 'approved' || !template.isCampaignEligible) {
    blockers.push({
      step: 3,
      message: 'Template is missing or not approved by Meta WhatsApp Cloud API.',
      actionLabel: 'Fix Template'
    });
  }

  // Personalization check
  if (template) {
    const tokens = template.body.match(/\{\{\d+\}\}/g) || [];
    tokens.forEach(tok => {
      const map = draft.mappings[tok];
      if (map?.source === 'static_value' && !map.staticValue?.trim()) {
        blockers.push({
          step: 4,
          message: `Variable ${tok} requires a static text value.`,
          actionLabel: 'Fix Personalization'
        });
      }
    });
  }

  // Schedule check
  if (draft.scheduleMode === 'schedule_later') {
    if (!draft.scheduleDate || !draft.scheduleTime) {
      blockers.push({
        step: 5,
        message: 'Scheduled date and time are incomplete.',
        actionLabel: 'Fix Schedule'
      });
    } else {
      const chosen = new Date(`${draft.scheduleDate}T${draft.scheduleTime}`);
      if (chosen.getTime() <= Date.now()) {
        blockers.push({
          step: 5,
          message: 'Scheduled date/time is in the past. It must be a future timestamp.',
          actionLabel: 'Fix Schedule'
        });
      }
    }
  }

  // Zero eligible check
  if (preflightResult && preflightResult.eligible === 0 && candidateCount > 0) {
    blockers.push({
      step: 2,
      message: 'Zero eligible recipients: All candidate contacts were excluded during preflight checks.',
      actionLabel: 'Review Audience'
    });
  }

  const isBlocked = blockers.length > 0;

  const handleOpenExclusions = (cat: PreflightExclusionCategory | 'all') => {
    setSelectedExclusionCategory(cat);
    setIsExclusionDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Review & Canonical Preflight</h3>
        <p className="text-xs text-slate-500 mt-1">
          Review the campaign configuration and verify authoritative preflight recipient eligibility before dispatch.
        </p>
      </div>

      {/* ================= 1. CAMPAIGN CONFIGURATION SUMMARY ================= */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs overflow-hidden">
        {/* Step 1 Details */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              1. Campaign Details
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{draft.name || 'Untitled Campaign'}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">Inbox: {draft.channelInbox}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(1)}
            className="px-2.5 py-1 text-[#5A4AD2] hover:bg-[#EEECFB] rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* Step 2 Audience */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              2. Audience Strategy
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 capitalize">{draft.audienceType.replace('_', ' ')}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">
                {draft.audienceType === 'labels' && `Tags: [${draft.selectedLabels.join(', ') || 'None'}]`}
                {draft.audienceType === 'csv' && `File: ${draft.csvData?.fileName || 'default.csv'}`}
                {draft.audienceType === 'saved_filter' && 'Dynamic Filter Query'}
                {draft.audienceType === 'manual' && `${draft.selectedContactIds.length} Selected Contacts`}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-[#5A4AD2] font-bold">{candidateCount} Candidates</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(2)}
            className="px-2.5 py-1 text-[#5A4AD2] hover:bg-[#EEECFB] rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* Step 3 Template */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              3. WhatsApp Template
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-900">{template?.name || 'None selected'}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">Category: {template?.category}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">{template?.language}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Approved
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(3)}
            className="px-2.5 py-1 text-[#5A4AD2] hover:bg-[#EEECFB] rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* Step 4 Personalize */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              4. Variable Mappings
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-medium">
                {Object.keys(draft.mappings).length > 0 
                  ? Object.entries(draft.mappings).map(([k, v]) => `${k} → ${(v as any).source}`).join(', ')
                  : 'No variables configured'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(4)}
            className="px-2.5 py-1 text-[#5A4AD2] hover:bg-[#EEECFB] rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* Step 5 Schedule */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              5. Dispatch Timing
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">
                {draft.scheduleMode === 'send_now' ? 'Send Immediately' : `${draft.scheduleDate} at ${draft.scheduleTime}`}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">{draft.scheduleTimezone} (UTC+05:30)</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(5)}
            className="px-2.5 py-1 text-[#5A4AD2] hover:bg-[#EEECFB] rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* ================= 2. CANONICAL PREFLIGHT SYSTEM ================= */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#5A4AD2]" />
            <div>
              <h4 className="font-bold text-xs text-slate-900">Authoritative Preflight Eligibility</h4>
              <p className="text-[11px] text-slate-500">
                Preflight validates consent, suppresses unengaged numbers, removes duplicates, and filters invalid destinations.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={runPreflight}
            disabled={isRunningPreflight}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunningPreflight ? 'animate-spin text-[#5A4AD2]' : ''}`} />
            <span>Re-check Preflight</span>
          </button>
        </div>

        {/* Preflight Loading / Calculation */}
        {isRunningPreflight ? (
          <div className="py-8 text-center space-y-2 bg-white rounded-xl border border-slate-200/80">
            <RefreshCw className="w-6 h-6 text-[#5A4AD2] animate-spin mx-auto" />
            <span className="font-bold text-xs text-slate-800 block">Checking campaign eligibility…</span>
            <span className="text-[11px] text-slate-400">Verifying consent records, suppression lists, and phone formatting</span>
          </div>
        ) : preflightResult ? (
          <div className="space-y-4">
            {/* Metric Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {/* Candidates */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">Total Candidates</span>
                <span className="text-xl font-extrabold text-slate-800 block mt-1">{preflightResult.totalCandidates}</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Selected pool</span>
              </div>

              {/* Eligible */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center ring-1 ring-emerald-300">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block truncate">Eligible</span>
                <span className="text-xl font-extrabold text-emerald-900 block mt-1">{preflightResult.eligible}</span>
                <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">Approved to send</span>
              </div>

              {/* Missing Consent */}
              <div
                onClick={() => handleOpenExclusions('missing_consent')}
                className="p-3 bg-white hover:bg-amber-50/50 rounded-xl border border-amber-200/90 text-center cursor-pointer transition-colors"
              >
                <span className="text-[10px] uppercase font-bold text-amber-800 block truncate">Missing Consent</span>
                <span className="text-xl font-extrabold text-amber-900 block mt-1">{preflightResult.missingConsent}</span>
                <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block hover:underline">Inspect →</span>
              </div>

              {/* Suppressed */}
              <div
                onClick={() => handleOpenExclusions('suppressed')}
                className="p-3 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 text-center cursor-pointer transition-colors"
              >
                <span className="text-[10px] uppercase font-bold text-slate-600 block truncate">Suppressed</span>
                <span className="text-xl font-extrabold text-slate-800 block mt-1">{preflightResult.suppressed}</span>
                <span className="text-[10px] text-slate-600 font-semibold mt-0.5 block hover:underline">Inspect →</span>
              </div>

              {/* Duplicates */}
              <div
                onClick={() => handleOpenExclusions('duplicates')}
                className="p-3 bg-white hover:bg-purple-50/50 rounded-xl border border-purple-200 text-center cursor-pointer transition-colors"
              >
                <span className="text-[10px] uppercase font-bold text-[#5A4AD2] block truncate">Duplicates</span>
                <span className="text-xl font-extrabold text-[#5A4AD2] block mt-1">{preflightResult.duplicates}</span>
                <span className="text-[10px] text-[#5A4AD2] font-semibold mt-0.5 block hover:underline">Inspect →</span>
              </div>

              {/* Invalid Destination */}
              <div
                onClick={() => handleOpenExclusions('invalid_destination')}
                className="p-3 bg-white hover:bg-red-50/50 rounded-xl border border-red-200 text-center cursor-pointer transition-colors"
              >
                <span className="text-[10px] uppercase font-bold text-red-700 block truncate">Invalid Dest.</span>
                <span className="text-xl font-extrabold text-red-800 block mt-1">{preflightResult.invalidDestination}</span>
                <span className="text-[10px] text-red-600 font-semibold mt-0.5 block hover:underline">Inspect →</span>
              </div>
            </div>

            {/* Semantic Explanatory Callout */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span>
                  <strong>Candidates</strong> are raw contacts matched by the audience step. 
                  <strong> Eligible recipients</strong> are records cleared by backend consent ledgers, active opt-ins, suppression checks, and Meta E.164 validity tests.
                </span>
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleOpenExclusions('all')}
                    className="text-[#5A4AD2] hover:underline font-bold text-[11px] inline-flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View all excluded candidate records ({preflightResult.totalCandidates - preflightResult.eligible})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* ================= 3. BLOCKED PREFLIGHT NOTICES (IF ANY) ================= */}
      {isBlocked && (
        <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-red-900">
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>Campaign Preflight Blocked — Action Required</span>
          </div>
          <p className="text-xs text-red-700">
            The campaign cannot be scheduled or launched until all preflight integrity checks pass. Please resolve the following items:
          </p>

          <div className="space-y-2">
            {blockers.map((blk, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-red-200 text-xs text-red-800"
              >
                <span>{blk.message}</span>
                <button
                  type="button"
                  onClick={() => onJumpToStep(blk.step)}
                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-lg text-[11px] shrink-0"
                >
                  {blk.actionLabel} →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 4. FINAL ACTIONS ================= */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-slate-500 text-[11px]">
          All dispatches are recorded in the canonical campaign recipient ledger.
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onSaveDraft}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors"
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={isBlocked || isRunningPreflight}
            onClick={onLaunchCampaign}
            className={`px-5 py-2 text-white font-bold rounded-xl shadow-xs inline-flex items-center gap-2 transition-all ${
              isBlocked || isRunningPreflight
                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                : 'bg-[#5A4AD2] hover:bg-[#4C3DC2]'
            }`}
          >
            {draft.scheduleMode === 'send_now' ? (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Launch Campaign</span>
              </>
            ) : (
              <>
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Campaign</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Exclusion Records Drawer Modal */}
      {preflightResult && (
        <PreflightExclusionDrawer
          isOpen={isExclusionDrawerOpen}
          onClose={() => setIsExclusionDrawerOpen(false)}
          exclusions={preflightResult.exclusionRecords}
          initialCategory={selectedExclusionCategory}
        />
      )}
    </div>
  );
};
