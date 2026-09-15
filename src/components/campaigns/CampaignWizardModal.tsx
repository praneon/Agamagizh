import React, { useState } from 'react';
import { 
  WhatsAppCampaign, 
  WhatsAppTemplate 
} from '../../types';
import { 
  CampaignDraftState, 
  CampaignAudienceType, 
  CampaignScheduleMode,
  CampaignVariableMapping,
  WizardStep 
} from './types';
import { 
  INITIAL_TEMPLATES, 
  INBOXES_LIST, 
  INITIAL_CONTACTS 
} from '../../data/mockData';
import { 
  MOCK_DEFAULT_CSV, 
  SAVED_CONTACT_FILTERS, 
  AVAILABLE_CRM_LABELS 
} from './campaignMockData';

import { Step1Details } from './steps/Step1Details';
import { Step2Audience } from './steps/Step2Audience';
import { Step3Template } from './steps/Step3Template';
import { Step4Personalize } from './steps/Step4Personalize';
import { Step5Schedule } from './steps/Step5Schedule';
import { Step6ReviewPreflight } from './steps/Step6ReviewPreflight';

import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  Save, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface CampaignWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCampaign: (campaign: Omit<WhatsAppCampaign, 'id' | 'createdAt' | 'sentCount' | 'deliveredCount' | 'readCount' | 'repliedCount' | 'failedCount' | 'excludedCount'> & {
    sentCount?: number;
    deliveredCount?: number;
    readCount?: number;
    repliedCount?: number;
    failedCount?: number;
    excludedCount?: number;
  }) => void;
  initialCampaign?: WhatsAppCampaign | null;
}

export const CampaignWizardModal: React.FC<CampaignWizardModalProps> = ({
  isOpen,
  onClose,
  onCreateCampaign,
  initialCampaign
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [showStepErrors, setShowStepErrors] = useState(false);

  // Default initial draft state
  const [draft, setDraft] = useState<CampaignDraftState>(() => {
    if (initialCampaign) {
      return {
        id: initialCampaign.id,
        name: initialCampaign.title,
        channelInbox: initialCampaign.channelInbox || INBOXES_LIST[0].name,
        audienceType: initialCampaign.audienceType,
        selectedLabels: ['Adyar Branch', 'VIP Client'],
        csvData: MOCK_DEFAULT_CSV,
        csvMapping: { nameCol: 'name', phoneCol: 'phone' },
        savedFilterId: SAVED_CONTACT_FILTERS[0].id,
        selectedContactIds: INITIAL_CONTACTS.slice(0, 4).map(c => c.id),
        selectedTemplateId: initialCampaign.templateId || INITIAL_TEMPLATES[0].id,
        mappings: {
          '{{1}}': { token: '{{1}}', source: 'contact_name', exampleValue: 'Meera Sundaram' },
          '{{2}}': { token: '{{2}}', source: 'contact_attribute', attributeName: 'preferred_language', exampleValue: 'English' },
          '{{3}}': { token: '{{3}}', source: 'static_value', staticValue: 'Adyar Main Hub', exampleValue: 'Adyar Main Hub' }
        },
        scheduleMode: initialCampaign.scheduledAt?.includes('Immediate') ? 'send_now' : 'schedule_later',
        scheduleDate: '2026-09-20',
        scheduleTime: '10:00',
        scheduleTimezone: 'Asia/Kolkata (IST)'
      };
    }

    return {
      name: '',
      channelInbox: INBOXES_LIST.find(ib => ib.channel === 'whatsapp')?.name || 'Agamagizh WhatsApp Main',
      audienceType: 'labels',
      selectedLabels: ['Adyar Branch', 'VIP Client'],
      csvData: MOCK_DEFAULT_CSV,
      csvMapping: { nameCol: 'name', phoneCol: 'phone' },
      savedFilterId: SAVED_CONTACT_FILTERS[0].id,
      selectedContactIds: INITIAL_CONTACTS.slice(0, 3).map(c => c.id),
      selectedTemplateId: INITIAL_TEMPLATES[0].id,
      mappings: {
        '{{1}}': { token: '{{1}}', source: 'contact_name', exampleValue: 'Meera Sundaram' },
        '{{2}}': { token: '{{2}}', source: 'contact_attribute', attributeName: 'registered_branch', exampleValue: 'Adyar Main Hub' },
        '{{3}}': { token: '{{3}}', source: 'static_value', staticValue: '10:00 AM to 02:00 PM', exampleValue: '10:00 AM to 02:00 PM' }
      },
      scheduleMode: 'send_now',
      scheduleDate: '2026-09-22',
      scheduleTime: '11:00',
      scheduleTimezone: 'Asia/Kolkata (IST)'
    };
  });

  if (!isOpen) return null;

  const selectedTemplate = INITIAL_TEMPLATES.find(t => t.id === draft.selectedTemplateId) || INITIAL_TEMPLATES[0];

  // Dynamic Candidate Count calculation
  const calculateCandidateCount = (): number => {
    switch (draft.audienceType) {
      case 'labels': {
        if (draft.selectedLabels.length === 0) return 0;
        let total = 0;
        draft.selectedLabels.forEach(lbl => {
          const match = AVAILABLE_CRM_LABELS.find(l => l.name === lbl);
          total += match ? match.count : 40;
        });
        // Remove simulated label intersection duplicates
        return Math.round(total * 0.85);
      }
      case 'csv': {
        return draft.csvData ? draft.csvData.validRows : 0;
      }
      case 'saved_filter': {
        const match = SAVED_CONTACT_FILTERS.find(f => f.id === draft.savedFilterId);
        return match ? match.candidateCount : 210;
      }
      case 'manual': {
        return draft.selectedContactIds.length;
      }
      default:
        return 0;
    }
  };

  const candidateCount = calculateCandidateCount();

  // Validate step progression
  const validateStep = (step: WizardStep): boolean => {
    if (step === 1) {
      return Boolean(draft.name.trim() && draft.channelInbox);
    }
    if (step === 2) {
      return candidateCount > 0;
    }
    if (step === 3) {
      return Boolean(selectedTemplate && selectedTemplate.status === 'approved' && selectedTemplate.isCampaignEligible);
    }
    if (step === 4) {
      // If template has variables, verify static ones aren't empty
      const tokens = selectedTemplate.body.match(/\{\{\d+\}\}/g) || [];
      for (const tok of tokens) {
        const m = draft.mappings[tok];
        if (m?.source === 'static_value' && !m.staticValue?.trim()) {
          return false;
        }
      }
      return true;
    }
    if (step === 5) {
      if (draft.scheduleMode === 'schedule_later') {
        if (!draft.scheduleDate || !draft.scheduleTime) return false;
        const chosen = new Date(`${draft.scheduleDate}T${draft.scheduleTime}`);
        if (chosen.getTime() <= Date.now()) return false;
      }
      return true;
    }
    return true;
  };

  const handleContinue = () => {
    if (!validateStep(currentStep)) {
      setShowStepErrors(true);
      return;
    }
    setShowStepErrors(false);
    setCurrentStep(s => Math.min(6, (s + 1) as WizardStep) as WizardStep);
  };

  const handleBack = () => {
    setShowStepErrors(false);
    setCurrentStep(s => Math.max(1, (s - 1) as WizardStep) as WizardStep);
  };

  const handleSaveDraft = () => {
    const audienceSummary = draft.audienceType === 'labels'
      ? `Labels: [${draft.selectedLabels.join(', ')}]`
      : draft.audienceType === 'csv'
      ? `CSV: ${draft.csvData?.fileName || 'custom.csv'}`
      : draft.audienceType === 'saved_filter'
      ? `Filter: ${SAVED_CONTACT_FILTERS.find(f => f.id === draft.savedFilterId)?.name || 'Dynamic'}`
      : `Manual: ${draft.selectedContactIds.length} contacts`;

    onCreateCampaign({
      title: draft.name.trim() || 'Draft Campaign',
      channelInbox: draft.channelInbox,
      status: 'draft',
      audienceType: draft.audienceType,
      audienceSummary,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      scheduledAt: draft.scheduleMode === 'send_now' ? 'Immediate Dispatch' : `${draft.scheduleDate} ${draft.scheduleTime}`,
      totalRecipients: candidateCount,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      repliedCount: 0,
      failedCount: 0,
      excludedCount: 0
    });
    onClose();
  };

  const handleLaunchCampaign = () => {
    const isImmediate = draft.scheduleMode === 'send_now';
    const total = candidateCount;
    const estimatedExclusions = Math.max(2, Math.round(total * 0.08));
    const eligible = Math.max(0, total - estimatedExclusions);

    const audienceSummary = draft.audienceType === 'labels'
      ? `Labels: [${draft.selectedLabels.join(', ')}]`
      : draft.audienceType === 'csv'
      ? `CSV: ${draft.csvData?.fileName || 'custom.csv'}`
      : draft.audienceType === 'saved_filter'
      ? `Filter: ${SAVED_CONTACT_FILTERS.find(f => f.id === draft.savedFilterId)?.name || 'Dynamic'}`
      : `Manual: ${draft.selectedContactIds.length} contacts`;

    onCreateCampaign({
      title: draft.name.trim() || 'Broadcast Campaign',
      channelInbox: draft.channelInbox,
      status: isImmediate ? 'running' : 'scheduled',
      audienceType: draft.audienceType,
      audienceSummary,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      scheduledAt: isImmediate ? 'Immediate Dispatch' : `${draft.scheduleDate} at ${draft.scheduleTime} (IST)`,
      totalRecipients: total,
      sentCount: isImmediate ? eligible : 0,
      deliveredCount: isImmediate ? Math.floor(eligible * 0.96) : 0,
      readCount: isImmediate ? Math.floor(eligible * 0.82) : 0,
      repliedCount: isImmediate ? Math.floor(eligible * 0.18) : 0,
      failedCount: isImmediate ? 2 : 0,
      excludedCount: estimatedExclusions
    });
    onClose();
  };

  const steps = [
    { num: 1 as WizardStep, title: 'Details' },
    { num: 2 as WizardStep, title: 'Audience' },
    { num: 3 as WizardStep, title: 'Template' },
    { num: 4 as WizardStep, title: 'Personalize' },
    { num: 5 as WizardStep, title: 'Schedule' },
    { num: 6 as WizardStep, title: 'Review & Preflight' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95">
        
        {/* Wizard Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5A4AD2]">
                WhatsApp Broadcast Wizard
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500 font-semibold">Canonical 6-Step Workflow</span>
            </div>
            <h2 className="text-base font-extrabold text-slate-900">
              {draft.name || 'Create Meta WhatsApp Campaign'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        {/* Desktop Step Rail */}
        <div className="hidden md:flex items-center justify-between px-6 py-3 bg-white border-b border-slate-100 text-xs font-bold overflow-x-auto shrink-0">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                onClick={() => {
                  if (s.num < currentStep) {
                    setShowStepErrors(false);
                    setCurrentStep(s.num);
                  }
                }}
                className={`flex items-center gap-2 shrink-0 ${s.num < currentStep ? 'cursor-pointer' : ''}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-colors ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-[#5A4AD2] text-white shadow-xs ring-2 ring-[#5A4AD2]/20'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className={`whitespace-nowrap ${
                  isCurrent ? 'text-[#5A4AD2]' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  {s.title}
                </span>
                {s.num < steps.length && (
                  <div className={`w-6 h-0.5 mx-1 transition-colors ${
                    isCompleted ? 'bg-emerald-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Compact Stepper Indicator */}
        <div className="md:hidden px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#5A4AD2] text-white text-[10px] font-bold flex items-center justify-center">
              {currentStep}
            </span>
            <span className="font-bold text-slate-900">
              Step {currentStep} of 6: {steps.find(s => s.num === currentStep)?.title}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {steps.map(s => (
              <div
                key={s.num}
                className={`w-2 h-2 rounded-full ${
                  s.num === currentStep ? 'bg-[#5A4AD2]' : s.num < currentStep ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Body (Scrollable) */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {currentStep === 1 && (
            <Step1Details
              name={draft.name}
              onChangeName={(name) => setDraft(d => ({ ...d, name }))}
              channelInbox={draft.channelInbox}
              onChangeChannelInbox={(channelInbox) => setDraft(d => ({ ...d, channelInbox }))}
              showErrors={showStepErrors}
            />
          )}

          {currentStep === 2 && (
            <Step2Audience
              audienceType={draft.audienceType}
              onChangeAudienceType={(audienceType) => setDraft(d => ({ ...d, audienceType }))}
              selectedLabels={draft.selectedLabels}
              onChangeSelectedLabels={(selectedLabels) => setDraft(d => ({ ...d, selectedLabels }))}
              csvData={draft.csvData}
              onChangeCsvData={(csvData) => setDraft(d => ({ ...d, csvData }))}
              csvMapping={draft.csvMapping}
              onChangeCsvMapping={(csvMapping) => setDraft(d => ({ ...d, csvMapping }))}
              savedFilterId={draft.savedFilterId}
              onChangeSavedFilterId={(savedFilterId) => setDraft(d => ({ ...d, savedFilterId }))}
              selectedContactIds={draft.selectedContactIds}
              onChangeSelectedContactIds={(selectedContactIds) => setDraft(d => ({ ...d, selectedContactIds }))}
              candidateCount={candidateCount}
            />
          )}

          {currentStep === 3 && (
            <Step3Template
              selectedTemplateId={draft.selectedTemplateId}
              onSelectTemplate={(tpl) => setDraft(d => ({ ...d, selectedTemplateId: tpl.id }))}
              showErrors={showStepErrors}
            />
          )}

          {currentStep === 4 && (
            <Step4Personalize
              template={selectedTemplate}
              mappings={draft.mappings}
              onChangeMapping={(tok, map) => setDraft(d => ({
                ...d,
                mappings: { ...d.mappings, [tok]: map }
              }))}
              showErrors={showStepErrors}
            />
          )}

          {currentStep === 5 && (
            <Step5Schedule
              scheduleMode={draft.scheduleMode}
              onChangeScheduleMode={(scheduleMode) => setDraft(d => ({ ...d, scheduleMode }))}
              scheduleDate={draft.scheduleDate}
              onChangeScheduleDate={(scheduleDate) => setDraft(d => ({ ...d, scheduleDate }))}
              scheduleTime={draft.scheduleTime}
              onChangeScheduleTime={(scheduleTime) => setDraft(d => ({ ...d, scheduleTime }))}
              scheduleTimezone={draft.scheduleTimezone}
              onChangeScheduleTimezone={(scheduleTimezone) => setDraft(d => ({ ...d, scheduleTimezone }))}
              showErrors={showStepErrors}
            />
          )}

          {currentStep === 6 && (
            <Step6ReviewPreflight
              draft={draft}
              template={selectedTemplate}
              candidateCount={candidateCount}
              onJumpToStep={(step) => {
                setShowStepErrors(false);
                setCurrentStep(step);
              }}
              onLaunchCampaign={handleLaunchCampaign}
              onSaveDraft={handleSaveDraft}
            />
          )}
        </div>

        {/* Wizard Navigation Footer (Sticky) */}
        {currentStep < 6 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={handleBack}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={handleContinue}
                className="px-5 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
