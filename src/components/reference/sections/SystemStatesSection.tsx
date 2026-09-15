import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  FileText, 
  MessageSquare, 
  GitFork, 
  Layers, 
  Trash2, 
  Archive, 
  Ban, 
  Unplug, 
  ArrowRight,
  Info
} from 'lucide-react';

interface SystemStatesSectionProps {
  isDark?: boolean;
}

export const SystemStatesSection: React.FC<SystemStatesSectionProps> = ({ isDark = false }) => {
  const [emptyCategory, setEmptyCategory] = useState<'records' | 'recipients' | 'conversations' | 'pipeline' | 'flow'>('records');

  return (
    <section id="states" className="space-y-8">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#5A4AD2]" />
          <span>System States: Loading, Errors, Permissions & Danger UX</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Standardized handling for network interruptions, role-based permission tiers, explicit empty states, and dangerous operations.
        </p>
      </div>

      {/* 1. Loading Skeletons Matrix */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Loading Skeleton Architecture (No Monolithic Spinners)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card Skeleton */}
          <div className={`p-4 rounded-2xl border space-y-3 animate-pulse ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Metric Card Skeleton</span>
            <div className={`h-3 w-20 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className={`h-7 w-28 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
            <div className={`h-2.5 w-36 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          </div>

          {/* Table Skeleton */}
          <div className={`p-4 rounded-2xl border space-y-2.5 animate-pulse ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Table Row Skeleton</span>
            <div className={`h-3 w-32 rounded mb-2 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className={`h-8 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
            <div className={`h-8 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
          </div>

          {/* Drawer Skeleton */}
          <div className={`p-4 rounded-2xl border space-y-2.5 animate-pulse ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Drawer Inspection Skeleton</span>
            <div className={`h-4 w-28 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className={`h-14 rounded-xl ${isDark ? 'bg-slate-800/60' : 'bg-slate-100'}`} />
            <div className={`h-14 rounded-xl ${isDark ? 'bg-slate-800/60' : 'bg-slate-100'}`} />
          </div>
        </div>
      </div>

      {/* 2. Canonical Empty States (Restrained Copy, No Oversized Cartoons) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Purposeful Empty States (Restrained Copy)
          </h3>
          <div className="flex gap-1.5">
            {(['records', 'recipients', 'conversations', 'pipeline', 'flow'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setEmptyCategory(cat)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize ${
                  emptyCategory === cat 
                    ? 'bg-[#5A4AD2] text-white' 
                    : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className={`p-8 rounded-2xl border text-center ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {emptyCategory === 'records' && (
            <div className="max-w-sm mx-auto space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">No records yet</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Create a new campaign or import contacts to begin managing operational records.
              </p>
            </div>
          )}

          {emptyCategory === 'recipients' && (
            <div className="max-w-sm mx-auto space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">No recipients</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                No audience members currently qualify for this filter criteria or pre-flight consent rule.
              </p>
            </div>
          )}

          {emptyCategory === 'conversations' && (
            <div className="max-w-sm mx-auto space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">No conversations in this inbox</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                New incoming patient chats from WhatsApp channels will appear here automatically.
              </p>
            </div>
          )}

          {emptyCategory === 'pipeline' && (
            <div className="max-w-sm mx-auto space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Stage is currently empty</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Drag cards from Intake or create a new consultation card to populate this column.
              </p>
            </div>
          )}

          {emptyCategory === 'flow' && (
            <div className="max-w-sm mx-auto space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <GitFork className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">No automation rules configured</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Add a trigger event (WHEN) to establish your first automated triage condition.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Error States vs. Empty States */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Error States & Retry Loops (Do NOT Present Errors as Empty Content)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section Level Error */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900 border-rose-900/60' : 'bg-rose-50/50 border-rose-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                  Network interruption: Meta Cloud API timeout
                </h4>
                <p className="text-[11px] text-rose-700 dark:text-rose-300 leading-relaxed">
                  Campaign statistics could not be refreshed from the webhook aggregation cluster. Existing local state is preserved.
                </p>
                <button
                  type="button"
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry Request</span>
                </button>
              </div>
            </div>
          </div>

          {/* Save Concurrency Error */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900 border-amber-900/60' : 'bg-amber-50/50 border-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Save conflict: Rule modified by another agent
                </h4>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                  Kavitha Sundaram updated this rule 2 minutes ago. Review server changes before overwriting.
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700"
                  >
                    Compare Differences
                  </button>
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-300 text-amber-800 dark:text-amber-300"
                  >
                    Reload Latest
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Permission States & Action-Specific Denials */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Role Permission States & Action-Specific Denials
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* View-Only Rule with Explicit Explanation */}
          <div className={`p-4 rounded-2xl border space-y-2 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Rule: "High-Priority Pediatric Triage"
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Lock className="w-3 h-3" />
                View-Only
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
              You can view this rule but don't have permission to edit it. Contact an organization administrator to request workflow authoring permissions.
            </div>
            <button
              type="button"
              disabled
              title="You don't have permission to edit this rule."
              className="w-full py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed text-center"
            >
              Edit Rule (Locked)
            </button>
          </div>

          {/* Disabled with Explicit Explanation Banner */}
          <div className={`p-4 rounded-2xl border space-y-2 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Template: "appointment_reminder_v2"
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Awaiting Approval
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
              <strong>Template unavailable:</strong> Awaiting Meta provider approval. Broadcast campaigns cannot dispatch until verified.
            </div>
            <button
              type="button"
              disabled
              className="w-full py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed text-center"
            >
              Dispatch Broadcast (Disabled)
            </button>
          </div>
        </div>
      </div>

      {/* 5. Danger UX Operations */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Danger UX Matrix (Coral / Red Reserved Exclusively for Destructive Actions)
        </h3>

        <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Coral/Red (`#E11D48`) is reserved exclusively for destructive, irreversible operations. Normal negative statuses (such as paused or draft) use calm neutrals.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Delete */}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Rule</span>
            </button>

            {/* Archive */}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archive Campaign</span>
            </button>

            {/* Cancel Campaign */}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Campaign</span>
            </button>

            {/* Disconnect */}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950"
            >
              <Unplug className="w-3.5 h-3.5" />
              <span>Disconnect WABA Channel</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
