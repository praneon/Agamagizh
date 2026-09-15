import React, { useState, useEffect, useRef } from 'react';
import { TemplateDraft, SaveState, ValidationIssue } from './types';
import { SAMPLE_DRAFTS, validateTemplateDraft, syncVariables } from './templateUtils';
import { TemplateToolbar } from './TemplateToolbar';
import { TemplateEditor } from './TemplateEditor';
import { TemplateLivePreview } from './TemplateLivePreview';
import { ReviewPayloadModal } from './ReviewPayloadModal';
import { ValidationDrawerModal } from './ValidationDrawerModal';

interface TemplateBuilderProps {
  initialDraft?: TemplateDraft | null;
  onSaveTemplate: (savedDraft: TemplateDraft) => void;
  onBackToLibrary: () => void;
  initialTheme?: 'dark' | 'light';
}

export const TemplateBuilder: React.FC<TemplateBuilderProps> = ({
  initialDraft,
  onSaveTemplate,
  onBackToLibrary,
  initialTheme = 'dark'
}) => {
  // Initialize draft state
  const [draft, setDraft] = useState<TemplateDraft>(() => {
    if (initialDraft) return initialDraft;
    return SAMPLE_DRAFTS.appointment_reminder;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(initialTheme);
  const [activeSection, setActiveSection] = useState<string>('basics');
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [isReviewPayloadOpen, setIsReviewPayloadOpen] = useState(false);

  // Auto-save debounce timer ref
  const autosaveTimerRef = useRef<any>(null);

  // Validation issues calculated in real-time
  const validationIssues: ValidationIssue[] = validateTemplateDraft(draft);

  // Handle draft changes
  const handleDraftChange = (updated: TemplateDraft) => {
    setDraft(updated);
    setSaveState('unsaved');

    // Debounced autosave
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      setSaveState('saving');
      setTimeout(() => {
        onSaveTemplate(updated);
        setSaveState('saved');
      }, 400);
    }, 1200);
  };

  // Explicit Save Draft action
  const handleManualSave = () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    setSaveState('saving');
    setTimeout(() => {
      onSaveTemplate(draft);
      setSaveState('saved');
    }, 350);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      id="whatsapp-template-builder-workspace"
      className={`flex flex-col h-full overflow-hidden select-text ${
        isDark ? 'bg-[#181A1F] text-white' : 'bg-[#F4F5F7] text-slate-900'
      }`}
    >
      {/* 1. TOP TOOLBAR */}
      <TemplateToolbar
        templateName={draft.name}
        onUpdateTemplateName={(name) => handleDraftChange({ ...draft, name, updatedAt: 'Just now' })}
        onBackToLibrary={onBackToLibrary}
        saveState={saveState}
        onSaveDraft={handleManualSave}
        onOpenValidation={() => setIsValidationOpen(true)}
        onOpenReviewPayload={() => setIsReviewPayloadOpen(true)}
        validationIssues={validationIssues}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        isMobilePreviewActive={mobileTab === 'preview'}
        onToggleMobilePreview={() => setMobileTab((prev) => (prev === 'edit' ? 'preview' : 'edit'))}
      />

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* DESKTOP SPLIT VIEW / MOBILE CONDITIONAL VIEW */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* EDITOR SECTION (Dominant area) */}
          <div
            className={`flex-1 h-full overflow-hidden transition-all ${
              mobileTab === 'preview' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <TemplateEditor
              draft={draft}
              onChange={handleDraftChange}
              validationIssues={validationIssues}
              activeSection={activeSection}
              onSelectSection={(sec) => setActiveSection(sec)}
              theme={theme}
              onOpenReviewPayload={() => setIsReviewPayloadOpen(true)}
            />
          </div>

          {/* LIVE PREVIEW SECTION (Sticky on Desktop, Tabbed on Mobile) */}
          <aside
            aria-label="WhatsApp Live Preview"
            className={`w-full md:w-[380px] lg:w-[420px] md:border-l p-4 sm:p-6 overflow-y-auto shrink-0 flex items-start justify-center transition-colors ${
              mobileTab === 'edit' ? 'hidden md:flex' : 'flex'
            } ${
              isDark
                ? 'bg-[#121417] border-[#2C313C]'
                : 'bg-[#EDEDEF] border-[#E3E5E9]'
            }`}
          >
            <div className="sticky top-0 w-full flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Live WhatsApp Preview
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Auto-updated
                </span>
              </div>
              <TemplateLivePreview draft={draft} theme={theme} />
            </div>
          </aside>
        </div>
      </div>

      {/* 3. MODALS */}
      <ReviewPayloadModal
        isOpen={isReviewPayloadOpen}
        onClose={() => setIsReviewPayloadOpen(false)}
        draft={draft}
        validationIssues={validationIssues}
        theme={theme}
      />

      <ValidationDrawerModal
        isOpen={isValidationOpen}
        onClose={() => setIsValidationOpen(false)}
        issues={validationIssues}
        onNavigateToSection={(sec) => setActiveSection(sec)}
        theme={theme}
      />
    </div>
  );
};
