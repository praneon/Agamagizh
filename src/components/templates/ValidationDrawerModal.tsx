import React from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { ValidationIssue } from './types';

interface ValidationDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: ValidationIssue[];
  onNavigateToSection: (section: string) => void;
  theme: 'dark' | 'light';
}

export const ValidationDrawerModal: React.FC<ValidationDrawerModalProps> = ({
  isOpen,
  onClose,
  issues,
  onNavigateToSection,
  theme
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="validation-drawer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150"
    >
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all ${
          isDark
            ? 'bg-[#181A1F] border-[#2C313C] text-white'
            : 'bg-white border-[#E3E5E9] text-slate-900'
        }`}
      >
        {/* HEADER */}
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                errors.length > 0
                  ? 'bg-rose-500/10 text-rose-500'
                  : warnings.length > 0
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'bg-emerald-500/10 text-emerald-500'
              }`}
            >
              {errors.length > 0 ? (
                <AlertTriangle className="w-4 h-4" />
              ) : warnings.length > 0 ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 id="validation-drawer-title" className="text-sm font-bold">
                Draft Integrity Inspection
              </h3>
              <p className="text-[11px] text-slate-400">
                {issues.length === 0
                  ? 'All local validation checks passed'
                  : `${errors.length} error(s), ${warnings.length} warning(s) identified`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
          {issues.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Template Draft is Locally Valid
                </h4>
                <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
                  Identifier syntax, message body structure, variable sample values, and button configurations satisfy Meta Cloud API constraints.
                </p>
              </div>
              <div
                className={`p-3 rounded-xl border text-[11px] max-w-sm mx-auto text-left flex items-center gap-2 ${
                  isDark ? 'bg-[#21252B] border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#5A4AD2] shrink-0" />
                <span>
                  Note: Local validation confirms schema readiness. Authoritative template approval is granted only by Meta after provider synchronization.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                    issue.severity === 'error'
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : 'bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {issue.severity === 'error' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold capitalize text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                          {issue.section}
                        </span>
                        <span className="font-semibold text-xs text-slate-900 dark:text-white">
                          {issue.message}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToSection(issue.section);
                      onClose();
                    }}
                    className="text-[11px] font-bold text-[#5A4AD2] hover:underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span>Fix</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div
          className={`px-5 py-3 border-t flex items-center justify-end ${
            isDark ? 'bg-[#181A1F] border-[#2C313C]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
