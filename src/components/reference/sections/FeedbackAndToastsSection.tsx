import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X, 
  Loader2, 
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react';

interface FeedbackAndToastsSectionProps {
  isDark?: boolean;
}

export const FeedbackAndToastsSection: React.FC<FeedbackAndToastsSectionProps> = ({ isDark = false }) => {
  const [showUnsavedPrompt, setShowUnsavedPrompt] = useState(false);

  const toastExamples = [
    {
      type: 'success',
      title: 'Draft saved',
      description: 'Your broadcast campaign draft was saved locally.',
      icon: CheckCircle2,
      border: 'border-emerald-200 dark:border-emerald-800',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      text: 'text-emerald-800 dark:text-emerald-200'
    },
    {
      type: 'error',
      title: "Couldn't save changes",
      description: 'The network connection timed out while syncing with Rails backend.',
      icon: AlertCircle,
      border: 'border-rose-200 dark:border-rose-800',
      bg: 'bg-rose-50 dark:bg-rose-950/60',
      text: 'text-rose-800 dark:text-rose-200'
    },
    {
      type: 'warning',
      title: 'Move failed and was reverted',
      description: 'The recipient is in a locked clinic triage stage and was returned to Intake.',
      icon: AlertTriangle,
      border: 'border-amber-200 dark:border-amber-800',
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      text: 'text-amber-800 dark:text-amber-200'
    },
    {
      type: 'info',
      title: 'Templates updated',
      description: 'Meta Cloud API synchronized 14 approved message templates.',
      icon: Info,
      border: 'border-sky-200 dark:border-sky-800',
      bg: 'bg-sky-50 dark:bg-sky-950/60',
      text: 'text-sky-800 dark:text-sky-200'
    }
  ];

  return (
    <section id="feedback" className="space-y-8">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#5A4AD2]" />
          <span>Feedback System, Compact Toasts & Inline States</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Compact non-intrusive toast notifications, inline live save indicators, and unsaved changes safety barriers.
        </p>
      </div>

      {/* 1. Compact Toast Notifications */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Canonical Toast Notifications (Compact & High Contrast)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {toastExamples.map((toast, i) => {
            const Icon = toast.icon;
            return (
              <div
                key={i}
                className={`p-3.5 rounded-xl border flex items-start gap-3 shadow-xs ${toast.bg} ${toast.border}`}
              >
                <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${toast.text}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-bold ${toast.text}`}>
                    {toast.title}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                    {toast.description}
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Dismiss toast"
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Inline Live Feedback States */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Preferred Inline Feedback Indicators
        </h3>

        <div className={`p-4 sm:p-5 rounded-2xl border divide-y ${
          isDark ? 'bg-slate-900 border-slate-800 divide-slate-800' : 'bg-white border-slate-200 divide-slate-100'
        }`}>
          {/* Saved */}
          <div className="py-2.5 first:pt-0 flex items-center justify-between">
            <span className="text-xs text-slate-500">Operation Success:</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>Saved</span>
            </span>
          </div>

          {/* Saving... */}
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-xs text-slate-500">In-Flight Persistence:</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5A4AD2]" />
              <span>Saving…</span>
            </span>
          </div>

          {/* Unsaved changes */}
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-xs text-slate-500">Dirty Form State:</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Unsaved changes</span>
            </span>
          </div>

          {/* Save failed */}
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-xs text-slate-500">Persistence Error:</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Save failed</span>
            </span>
          </div>

          {/* Flow is valid */}
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-xs text-slate-500">Rules / Graph Validation:</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Flow is valid</span>
            </span>
          </div>

          {/* 3 issues need attention */}
          <div className="py-2.5 last:pb-0 flex items-center justify-between">
            <span className="text-xs text-slate-500">Validation Summary:</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>3 issues need attention</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Unsaved Changes Barrier Banner */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Unsaved Changes Interaction Barrier
        </h3>

        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDark ? 'bg-slate-900 border-amber-900/60' : 'bg-amber-50/70 border-amber-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                You have unsaved changes.
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Leaving now will discard 3 modified conditions in the automation builder.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Keep Editing
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/60"
            >
              Discard Changes
            </button>
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#5A4AD2] text-white hover:bg-[#4838B8]"
            >
              Save Draft
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
