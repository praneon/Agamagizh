import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Sparkles, 
  Sun, 
  Moon, 
  Edit2, 
  Check, 
  RefreshCw, 
  FileCode,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { SaveState, ValidationIssue } from './types';

interface TemplateToolbarProps {
  templateName: string;
  onUpdateTemplateName: (newName: string) => void;
  onBackToLibrary: () => void;
  saveState: SaveState;
  onSaveDraft: () => void;
  onOpenValidation: () => void;
  onOpenReviewPayload: () => void;
  validationIssues: ValidationIssue[];
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isMobilePreviewActive?: boolean;
  onToggleMobilePreview?: () => void;
}

export const TemplateToolbar: React.FC<TemplateToolbarProps> = ({
  templateName,
  onUpdateTemplateName,
  onBackToLibrary,
  saveState,
  onSaveDraft,
  onOpenValidation,
  onOpenReviewPayload,
  validationIssues,
  theme,
  onToggleTheme,
  isMobilePreviewActive,
  onToggleMobilePreview
}) => {
  const isDark = theme === 'dark';
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(templateName);

  const errors = validationIssues.filter((i) => i.severity === 'error');
  const warnings = validationIssues.filter((i) => i.severity === 'warning');
  const isValid = errors.length === 0;

  const handleFinishNameEdit = () => {
    const cleaned = tempName.trim().toLowerCase().replace(/\s+/g, '_');
    if (cleaned) {
      onUpdateTemplateName(cleaned);
    }
    setIsEditingName(false);
  };

  return (
    <div
      id="template-builder-toolbar"
      className={`h-14 px-3 sm:px-6 flex items-center justify-between border-b shrink-0 transition-colors ${
        isDark
          ? 'bg-[#181A1F] border-[#2C313C] text-white'
          : 'bg-white border-[#E3E5E9] text-slate-800'
      }`}
    >
      {/* LEFT: Breadcrumb, Template Name, Status, Save State */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onBackToLibrary}
          className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-2 rounded-lg transition-colors ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-white/5'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Return to Template Library"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">WhatsApp / Templates</span>
        </button>

        <div className={`h-4 w-px hidden sm:block ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

        {/* Template Identifier (Inline editable) */}
        <div className="flex items-center gap-2 min-w-0">
          {isEditingName ? (
            <input
              type="text"
              autoFocus
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleFinishNameEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFinishNameEdit();
                if (e.key === 'Escape') {
                  setTempName(templateName);
                  setIsEditingName(false);
                }
              }}
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark
                  ? 'bg-[#21252B] border-slate-600 text-white'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setTempName(templateName);
                setIsEditingName(true);
              }}
              className="flex items-center gap-1.5 group min-w-0 text-left"
              title="Click to edit template identifier name"
            >
              <h2 className="text-xs sm:text-sm font-mono font-bold truncate tracking-tight">
                {templateName || 'new_template'}
              </h2>
              <Edit2
                className={`w-3 h-3 opacity-0 group-hover:opacity-70 transition-opacity shrink-0 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              />
            </button>
          )}
        </div>

        {/* Clear Status Indicator: Local Draft (Distinct source/state) */}
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 ${
            isDark
              ? 'bg-slate-800 border-slate-600 text-slate-300'
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}
          title="Stored locally in Agamagizh Console. Not provider approved or submitted."
        >
          Local Draft
        </span>

        {/* Save State feedback */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] font-medium shrink-0">
          {saveState === 'saving' && (
            <span className="flex items-center gap-1 text-slate-400">
              <RefreshCw className="w-3 h-3 animate-spin text-[#5A4AD2]" />
              <span>Saving…</span>
            </span>
          )}
          {saveState === 'saved' && (
            <span className="flex items-center gap-1 text-emerald-500">
              <Check className="w-3 h-3" />
              <span>Saved</span>
            </span>
          )}
          {saveState === 'unsaved' && (
            <span className="flex items-center gap-1 text-amber-500">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Unsaved changes</span>
            </span>
          )}
          {saveState === 'error' && (
            <span className="flex items-center gap-1 text-rose-400">
              <AlertCircle className="w-3 h-3" />
              <span>Save failed.</span>
              <button
                type="button"
                onClick={onSaveDraft}
                className="underline font-bold hover:text-rose-300 ml-1"
              >
                Try Again
              </button>
            </span>
          )}
        </div>
      </div>

      {/* RIGHT: Action controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Mobile Edit / Preview Mode Switcher */}
        {onToggleMobilePreview && (
          <button
            type="button"
            onClick={onToggleMobilePreview}
            className={`md:hidden px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isMobilePreviewActive
                ? 'bg-[#5A4AD2] border-[#5A4AD2] text-white'
                : isDark
                ? 'bg-[#21252B] border-slate-700 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isMobilePreviewActive ? 'Edit' : 'Preview'}</span>
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          className={`p-1.5 sm:p-2 rounded-xl border text-xs font-semibold transition-colors ${
            isDark
              ? 'bg-[#21252B] border-slate-700 hover:bg-[#282C34] text-slate-300'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
          }`}
          title={isDark ? 'Switch to Light Workspace' : 'Switch to Dark Workspace'}
        >
          {isDark ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-slate-600" />
          )}
        </button>

        {/* Save Draft Action */}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={saveState === 'saving'}
          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            isDark
              ? 'bg-[#21252B] border-slate-700 hover:bg-[#282C34] text-slate-300'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
          }`}
          title="Save changes to local draft storage"
        >
          <Save className="w-3.5 h-3.5 text-[#5A4AD2]" />
          <span>Save Draft</span>
        </button>

        {/* Validate Action */}
        <button
          type="button"
          onClick={onOpenValidation}
          className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
            errors.length > 0
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
              : warnings.length > 0
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
              : isDark
              ? 'bg-[#21252B] border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/50'
          }`}
          title="Inspect draft integrity and syntax"
        >
          {errors.length > 0 ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{errors.length} {errors.length === 1 ? 'Error' : 'Errors'}</span>
            </>
          ) : warnings.length > 0 ? (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{warnings.length} {warnings.length === 1 ? 'Notice' : 'Notices'}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Draft Valid</span>
            </>
          )}
        </button>

        {/* Primary Forward Action: Review / Prepare Payload (Agamagizh Violet) */}
        <button
          type="button"
          onClick={onOpenReviewPayload}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
          title="Inspect formatted Meta API payload and review draft readiness"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Review / Prepare Payload</span>
          <span className="sm:hidden">Review</span>
        </button>
      </div>
    </div>
  );
};
