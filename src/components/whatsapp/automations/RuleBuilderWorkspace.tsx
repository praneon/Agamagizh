import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  AutomationRuleItem, 
  RuleConditionItem, 
  RuleActionItem, 
  ValidationIssue, 
  SaveState,
  RuleTriggerType
} from './types';
import { 
  AVAILABLE_TRIGGERS, 
  AVAILABLE_INBOXES, 
  AVAILABLE_LABELS,
  AVAILABLE_FIELDS,
  AVAILABLE_ACTIONS,
  AVAILABLE_TEAMS
} from './rulesMockData';
import { RuleConditionRow } from './RuleConditionRow';
import { RuleActionRow } from './RuleActionRow';
import { RuleSummaryPanel } from './RuleSummaryPanel';
import { 
  EnableRuleDialog, 
  DisableRuleDialog, 
  ArchiveRuleDialog, 
  UnsavedChangesDialog 
} from './RuleConfirmDialogs';
import { 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Save, 
  ShieldAlert, 
  Sparkles, 
  Plus, 
  RotateCcw, 
  Layers, 
  Zap, 
  HelpCircle,
  Sun,
  Moon,
  Loader2,
  RefreshCw,
  Power,
  ChevronDown
} from 'lucide-react';

interface RuleBuilderWorkspaceProps {
  initialRule: AutomationRuleItem;
  isReadOnly?: boolean;
  theme?: 'light' | 'dark';
  onBack: () => void;
  onSaveRule: (updated: AutomationRuleItem) => void;
  onToggleTheme?: () => void;
}

export const RuleBuilderWorkspace: React.FC<RuleBuilderWorkspaceProps> = ({
  initialRule,
  isReadOnly = false,
  theme = 'light',
  onBack,
  onSaveRule,
  onToggleTheme
}) => {
  // Working draft state
  const [rule, setRule] = useState<AutomationRuleItem>({ ...initialRule });
  const [originalSnapshot, setOriginalSnapshot] = useState<string>(JSON.stringify(initialRule));
  
  // Save & network states
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [simulateSaveError, setSimulateSaveError] = useState(false);

  // Dialog states
  const [isEnableDialogOpen, setIsEnableDialogOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isUnsavedDialogOpen, setIsUnsavedDialogOpen] = useState(false);

  // Active validation error focus
  const [focusedIssueId, setFocusedIssueId] = useState<string | null>(null);

  const isDark = theme === 'dark';

  // Has unsaved changes check
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(rule) !== originalSnapshot;
  }, [rule, originalSnapshot]);

  // Update saveState when changes occur
  useEffect(() => {
    if (hasUnsavedChanges && saveState === 'saved') {
      setSaveState('unsaved');
    }
  }, [hasUnsavedChanges, saveState]);

  // -------------------------------------------------------------
  // VALIDATION ENGINE
  // -------------------------------------------------------------
  const validationIssues = useMemo<ValidationIssue[]>(() => {
    const issues: ValidationIssue[] = [];

    // 1. Rule Name
    if (!rule.name.trim()) {
      issues.push({
        id: 'name-missing',
        section: 'name',
        message: 'Rule Name cannot be empty'
      });
    }

    // 2. Trigger check
    if (!rule.triggerType) {
      issues.push({
        id: 'trigger-missing',
        section: 'trigger',
        message: 'A trigger event must be selected'
      });
    }

    // 3. Condition validation
    rule.conditions.forEach((c, idx) => {
      const fieldDef = AVAILABLE_FIELDS.find(f => f.id === c.field);
      const isBoolean = fieldDef?.dataType === 'boolean';
      if (!isBoolean && (!c.value || !c.value.trim())) {
        issues.push({
          id: `cond-val-${c.id}`,
          section: 'conditions',
          targetId: c.id,
          message: `Condition #${idx + 1} (${fieldDef?.label || 'Condition'}) value cannot be empty`
        });
      }
    });

    // 4. Action validation
    if (rule.actions.length === 0) {
      issues.push({
        id: 'action-empty',
        section: 'actions',
        message: 'At least one action step must be configured'
      });
    } else {
      rule.actions.forEach((act, idx) => {
        if (act.type === 'send_message' && (!act.params.messageText || !act.params.messageText.trim())) {
          issues.push({
            id: `act-val-${act.id}`,
            section: 'actions',
            targetId: act.id,
            message: `Action #${idx + 1} (Send Message) content is empty`
          });
        }
      });
    }

    return issues;
  }, [rule]);

  const isValid = validationIssues.length === 0;

  // -------------------------------------------------------------
  // SAVE HANDLER
  // -------------------------------------------------------------
  const handleSaveDraft = async () => {
    if (isReadOnly) return;
    setSaveState('saving');

    // Simulate backend network latency
    await new Promise(resolve => setTimeout(resolve, 500));

    if (simulateSaveError) {
      setSaveState('error');
      return;
    }

    const updated = {
      ...rule,
      lastUpdated: 'Just now'
    };
    setRule(updated);
    setOriginalSnapshot(JSON.stringify(updated));
    setSaveState('saved');
    onSaveRule(updated);
  };

  // -------------------------------------------------------------
  // LIFECYCLE MODIFIERS
  // -------------------------------------------------------------
  const handleConfirmEnable = () => {
    const updated: AutomationRuleItem = {
      ...rule,
      status: 'Enabled',
      lastUpdated: 'Just now'
    };
    setRule(updated);
    setOriginalSnapshot(JSON.stringify(updated));
    setSaveState('saved');
    onSaveRule(updated);
  };

  const handleConfirmDisable = () => {
    const updated: AutomationRuleItem = {
      ...rule,
      status: 'Disabled',
      lastUpdated: 'Just now'
    };
    setRule(updated);
    setOriginalSnapshot(JSON.stringify(updated));
    setSaveState('saved');
    onSaveRule(updated);
  };

  const handleConfirmArchive = () => {
    const updated: AutomationRuleItem = {
      ...rule,
      status: 'Archived',
      lastUpdated: 'Just now'
    };
    setRule(updated);
    setOriginalSnapshot(JSON.stringify(updated));
    setSaveState('saved');
    onSaveRule(updated);
  };

  // Safe back navigation check
  const handleSafeBack = () => {
    if (hasUnsavedChanges) {
      setIsUnsavedDialogOpen(true);
    } else {
      onBack();
    }
  };

  // Focus on issue target
  const handleSelectIssue = (issue: ValidationIssue) => {
    setFocusedIssueId(issue.targetId || null);
    if (issue.targetId) {
      const el = document.getElementById(`condition-row-${issue.targetId}`) || document.getElementById(`action-row-${issue.targetId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (issue.section === 'name') {
      const nameInput = document.getElementById('rule-name-input');
      if (nameInput) nameInput.focus();
    }
  };

  // -------------------------------------------------------------
  // CONDITIONS LOGIC
  // -------------------------------------------------------------
  const handleAddCondition = () => {
    if (isReadOnly) return;
    const newCond: RuleConditionItem = {
      id: `c-${Date.now()}`,
      field: 'message_text',
      operator: 'contains',
      value: ''
    };
    setRule(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCond]
    }));
  };

  const handleUpdateCondition = (index: number, updated: RuleConditionItem) => {
    setRule(prev => {
      const next = [...prev.conditions];
      next[index] = updated;
      return { ...prev, conditions: next };
    });
  };

  const handleMoveCondition = (index: number, direction: 'up' | 'down') => {
    if (isReadOnly) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= rule.conditions.length) return;

    setRule(prev => {
      const next = [...prev.conditions];
      const temp = next[index];
      next[index] = next[targetIdx];
      next[targetIdx] = temp;
      return { ...prev, conditions: next };
    });
  };

  const handleDuplicateCondition = (index: number) => {
    if (isReadOnly) return;
    const toCopy = rule.conditions[index];
    const copied: RuleConditionItem = {
      ...toCopy,
      id: `c-${Date.now()}`
    };
    setRule(prev => {
      const next = [...prev.conditions];
      next.splice(index + 1, 0, copied);
      return { ...prev, conditions: next };
    });
  };

  const handleRemoveCondition = (index: number) => {
    if (isReadOnly) return;
    setRule(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  // -------------------------------------------------------------
  // ACTIONS LOGIC
  // -------------------------------------------------------------
  const handleAddAction = () => {
    if (isReadOnly) return;
    const newAction: RuleActionItem = {
      id: `a-${Date.now()}`,
      type: 'assign_conversation',
      params: { targetType: 'team', targetValue: AVAILABLE_TEAMS[0] }
    };
    setRule(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
  };

  const handleUpdateAction = (index: number, updated: RuleActionItem) => {
    setRule(prev => {
      const next = [...prev.actions];
      next[index] = updated;
      return { ...prev, actions: next };
    });
  };

  const handleMoveAction = (index: number, direction: 'up' | 'down') => {
    if (isReadOnly) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= rule.actions.length) return;

    setRule(prev => {
      const next = [...prev.actions];
      const temp = next[index];
      next[index] = next[targetIdx];
      next[targetIdx] = temp;
      return { ...prev, actions: next };
    });
  };

  const handleDuplicateAction = (index: number) => {
    if (isReadOnly) return;
    const toCopy = rule.actions[index];
    const copied: RuleActionItem = {
      ...toCopy,
      id: `a-${Date.now()}`
    };
    setRule(prev => {
      const next = [...prev.actions];
      next.splice(index + 1, 0, copied);
      return { ...prev, actions: next };
    });
  };

  const handleRemoveAction = (index: number) => {
    if (isReadOnly) return;
    setRule(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const currentTriggerDef = AVAILABLE_TRIGGERS.find(t => t.type === rule.triggerType) || AVAILABLE_TRIGGERS[0];

  return (
    <div className={`min-h-full flex flex-col font-sans transition-colors duration-150 ${
      isDark ? 'bg-[#0F1117] text-slate-100' : 'bg-[#F4F5F7] text-[#323739]'
    }`}>
      {/* 1. Header & Toolbar */}
      <header className={`p-4 sm:px-6 border-b sticky top-0 z-30 transition-colors ${
        isDark ? 'bg-[#151821] border-slate-800' : 'bg-white border-[#E3E5E9]'
      }`}>
        <div className="max-w-[1920px] mx-auto space-y-3">
          {/* Top Line: Navigation, Rule Title & Save Status, Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Left: Back button & Rule Title Input */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                type="button"
                onClick={handleSafeBack}
                className={`p-2 rounded-xl border transition-colors shrink-0 ${
                  isDark 
                    ? 'border-slate-800 hover:bg-slate-800 text-slate-300' 
                    : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
                title="Back to Automations list"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    WhatsApp / Automations
                  </span>
                  {/* Status badge */}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    rule.status === 'Enabled'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : rule.status === 'Draft'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                      : rule.status === 'Disabled'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {rule.status}
                  </span>
                </div>

                {/* Rule Name Input */}
                <div className="flex items-center gap-2 mt-1">
                  <input
                    id="rule-name-input"
                    type="text"
                    value={rule.name}
                    disabled={isReadOnly}
                    onChange={(e) => setRule(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter rule name..."
                    className={`text-base sm:text-lg font-extrabold bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#5A4AD2] focus:outline-none w-full max-w-xl transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Right: Save State Indicator & Action Buttons */}
            <div className="flex items-center flex-wrap gap-2.5 shrink-0">
              {/* Save State Indicator */}
              <div className="text-xs font-semibold px-2 py-1 flex items-center gap-1.5">
                {saveState === 'saving' && (
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving…</span>
                  </span>
                )}
                {saveState === 'saved' && (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </span>
                )}
                {saveState === 'unsaved' && (
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Unsaved changes</span>
                  </span>
                )}
                {saveState === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Save failed</span>
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="underline font-bold hover:text-red-700"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>

              {/* Prototype simulation toggle */}
              <button
                type="button"
                onClick={() => setSimulateSaveError(!simulateSaveError)}
                title="Toggle simulated save error"
                className={`text-[11px] font-semibold px-2 py-1 rounded-lg border hidden lg:inline-flex ${
                  simulateSaveError
                    ? 'bg-red-500 text-white border-red-600'
                    : isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}
              >
                {simulateSaveError ? 'Fail Sim: ON' : 'Fail Sim: OFF'}
              </button>

              {/* Theme toggle */}
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  aria-label="Toggle theme"
                  className={`p-2 rounded-xl border transition-colors ${
                    isDark 
                      ? 'border-slate-800 text-amber-400 hover:bg-slate-800' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}

              {/* Validate action button */}
              <button
                type="button"
                onClick={() => {
                  if (validationIssues.length > 0) {
                    setIsEnableDialogOpen(true);
                  } else {
                    alert('Rule is valid! All conditions and action steps are properly configured.');
                  }
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                  isValid 
                    ? isDark ? 'border-emerald-800 bg-emerald-950/40 text-emerald-400' : 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : isDark ? 'border-amber-800 bg-amber-950/40 text-amber-400' : 'border-amber-300 bg-amber-50 text-amber-700'
                }`}
              >
                {isValid ? 'Rule is Valid' : `Validate (${validationIssues.length} issues)`}
              </button>

              {/* Save Draft button */}
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={saveState === 'saving'}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                    isDark 
                      ? 'border-slate-700 text-slate-200 hover:bg-slate-800' 
                      : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Save Draft
                </button>
              )}

              {/* Enable / Disable lifecycle buttons */}
              {!isReadOnly && rule.status !== 'Enabled' && (
                <button
                  type="button"
                  onClick={() => setIsEnableDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Enable Rule</span>
                </button>
              )}

              {!isReadOnly && rule.status === 'Enabled' && (
                <button
                  type="button"
                  onClick={() => setIsDisableDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>Disable Rule</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Permission banner if view-only */}
      {isReadOnly && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-800 dark:text-amber-300">
          <div className="max-w-[1920px] mx-auto flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>View-only Mode:</strong> You don't have permission to edit automation rules. You may inspect the complete configuration below.
            </span>
          </div>
        </div>
      )}

      {/* 2. Main Builder Body (Linear Form + Live Summary Panel) */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================================= */}
          {/* LEFT: LINEAR STRUCTURED FORM (WHEN -> IF ALL/ANY -> THEN)                 */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* ----------------------------------------------------------------------- */}
            {/* SECTION 1: WHEN (Trigger)                                               */}
            {/* ----------------------------------------------------------------------- */}
            <section className={`p-5 rounded-2xl border shadow-2xs space-y-4 ${
              isDark ? 'bg-[#151821] border-slate-800' : 'bg-white border-[#E3E5E9]'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#5A4AD2]/10 text-[#5A4AD2] font-black text-xs flex items-center justify-center border border-[#5A4AD2]/20">
                    1
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold tracking-tight">WHEN</h2>
                    <p className="text-xs text-slate-500">Choose what starts this rule.</p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-400">Trigger Event</span>
              </div>

              {/* Trigger Selector Dropdown */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Select Starting Trigger Event
                  </label>
                  <select
                    value={rule.triggerType}
                    disabled={isReadOnly}
                    onChange={(e) => setRule(prev => ({
                      ...prev,
                      triggerType: e.target.value as RuleTriggerType
                    }))}
                    className={`w-full text-xs font-bold py-2 px-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                      isDark ? 'bg-[#1E222D] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    {AVAILABLE_TRIGGERS.map(t => (
                      <option key={t.type} value={t.type}>{t.label} — {t.description}</option>
                    ))}
                  </select>
                </div>

                {/* Structured Trigger Card */}
                <div className={`p-4 rounded-xl border space-y-3 ${
                  isDark ? 'bg-[#1C202B] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#5A4AD2]" />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {currentTriggerDef.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {currentTriggerDef.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      <span>Channel: WhatsApp</span>
                    </div>
                  </div>

                  {/* Trigger Configuration Fields (shown directly beneath if applicable) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Channel Inbox
                      </label>
                      <select
                        value={rule.triggerConfig.inbox}
                        disabled={isReadOnly}
                        onChange={(e) => setRule(prev => ({
                          ...prev,
                          triggerConfig: { ...prev.triggerConfig, inbox: e.target.value }
                        }))}
                        className={`w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                          isDark ? 'bg-[#1E222D] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        {AVAILABLE_INBOXES.map(inbox => (
                          <option key={inbox} value={inbox}>{inbox}</option>
                        ))}
                      </select>
                    </div>

                    {/* Conditional for Message Received */}
                    {rule.triggerType === 'message_received' && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Message Direction
                        </label>
                        <select
                          value={rule.triggerConfig.messageDirection || 'incoming'}
                          disabled={isReadOnly}
                          onChange={(e) => setRule(prev => ({
                            ...prev,
                            triggerConfig: { ...prev.triggerConfig, messageDirection: e.target.value as any }
                          }))}
                          className={`w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                            isDark ? 'bg-[#1E222D] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <option value="incoming">Incoming from Contact</option>
                          <option value="outgoing">Outgoing from Agent / Bot</option>
                        </select>
                      </div>
                    )}

                    {/* Conditional for Label Added */}
                    {rule.triggerType === 'label_added' && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Specific Label
                        </label>
                        <select
                          value={rule.triggerConfig.targetLabel || AVAILABLE_LABELS[0]}
                          disabled={isReadOnly}
                          onChange={(e) => setRule(prev => ({
                            ...prev,
                            triggerConfig: { ...prev.triggerConfig, targetLabel: e.target.value }
                          }))}
                          className={`w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                            isDark ? 'bg-[#1E222D] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <option value="any">Any Label Attached</option>
                          {AVAILABLE_LABELS.map(lbl => (
                            <option key={lbl} value={lbl}>{lbl}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Downward flow indicator */}
            <div className="flex justify-center -my-3">
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-2xs ${
                isDark ? 'bg-[#181B26] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
              }`}>
                ↓ then evaluate conditions
              </div>
            </div>

            {/* ----------------------------------------------------------------------- */}
            {/* SECTION 2: IF (Conditions)                                              */}
            {/* ----------------------------------------------------------------------- */}
            <section className={`p-5 rounded-2xl border shadow-2xs space-y-4 ${
              isDark ? 'bg-[#151821] border-slate-800' : 'bg-white border-[#E3E5E9]'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#5A4AD2]/10 text-[#5A4AD2] font-black text-xs flex items-center justify-center border border-[#5A4AD2]/20">
                    2
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold tracking-tight">IF</h2>
                    <p className="text-xs text-slate-500">
                      Evaluate filters before executing actions.
                    </p>
                  </div>
                </div>

                {/* Match Mode Selector: ALL vs ANY */}
                <div className="flex items-center gap-2">
                  <div className={`inline-flex rounded-xl p-0.5 border ${
                    isDark ? 'bg-[#1C202B] border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <button
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => setRule(prev => ({ ...prev, matchMode: 'ALL' }))}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        rule.matchMode === 'ALL'
                          ? 'bg-[#5A4AD2] text-white shadow-xs'
                          : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ALL
                    </button>
                    <button
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => setRule(prev => ({ ...prev, matchMode: 'ANY' }))}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        rule.matchMode === 'ANY'
                          ? 'bg-[#5A4AD2] text-white shadow-xs'
                          : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ANY
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    {rule.matchMode === 'ALL' 
                      ? 'Every condition below must match.' 
                      : 'At least one condition below must match.'}
                  </span>
                </div>
              </div>

              {/* Conditions List */}
              {rule.conditions.length === 0 ? (
                <div className={`p-8 text-center rounded-xl border-2 border-dashed ${
                  isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No conditions</p>
                  <p className="text-xs text-slate-400 mt-1 mb-3">
                    This rule will run whenever the trigger occurs.
                  </p>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={handleAddCondition}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5A4AD2] text-white text-xs font-bold rounded-xl"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Condition</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {rule.conditions.map((condition, index) => {
                    const issue = validationIssues.find(i => i.targetId === condition.id);
                    return (
                      <RuleConditionRow
                        key={condition.id}
                        condition={condition}
                        index={index}
                        totalConditions={rule.conditions.length}
                        isReadOnly={isReadOnly}
                        isDark={isDark}
                        hasError={!!issue}
                        errorMessage={issue?.message}
                        onUpdate={(updated) => handleUpdateCondition(index, updated)}
                        onMoveUp={() => handleMoveCondition(index, 'up')}
                        onMoveDown={() => handleMoveCondition(index, 'down')}
                        onDuplicate={() => handleDuplicateCondition(index)}
                        onRemove={() => handleRemoveCondition(index)}
                      />
                    );
                  })}

                  {/* Add Condition Button */}
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={handleAddCondition}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                        isDark
                          ? 'border-slate-800 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 text-[#5A4AD2]" />
                      <span>Add Condition</span>
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* Downward flow indicator */}
            <div className="flex justify-center -my-3">
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-2xs ${
                isDark ? 'bg-[#181B26] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
              }`}>
                ↓ then execute actions
              </div>
            </div>

            {/* ----------------------------------------------------------------------- */}
            {/* SECTION 3: THEN (Actions)                                               */}
            {/* ----------------------------------------------------------------------- */}
            <section className={`p-5 rounded-2xl border shadow-2xs space-y-4 ${
              isDark ? 'bg-[#151821] border-slate-800' : 'bg-white border-[#E3E5E9]'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#5A4AD2]/10 text-[#5A4AD2] font-black text-xs flex items-center justify-center border border-[#5A4AD2]/20">
                    3
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold tracking-tight">THEN</h2>
                    <p className="text-xs text-slate-500">
                      Choose what happens when this rule matches. Executed in sequential order.
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-400">
                  {rule.actions.length} action{rule.actions.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Actions List */}
              {rule.actions.length === 0 ? (
                <div className={`p-8 text-center rounded-xl border-2 border-dashed ${
                  isDark ? 'border-red-900/40 text-red-400' : 'border-red-200 text-red-600'
                }`}>
                  <AlertCircle className="w-6 h-6 mx-auto mb-1 text-red-500" />
                  <p className="text-xs font-bold">No actions configured</p>
                  <p className="text-xs text-slate-500 mt-1 mb-3">
                    At least one action is required for this rule to function.
                  </p>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={handleAddAction}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5A4AD2] text-white text-xs font-bold rounded-xl"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Action</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {rule.actions.map((action, index) => {
                    const issue = validationIssues.find(i => i.targetId === action.id);
                    return (
                      <RuleActionRow
                        key={action.id}
                        action={action}
                        index={index}
                        totalActions={rule.actions.length}
                        isReadOnly={isReadOnly}
                        isDark={isDark}
                        hasError={!!issue}
                        errorMessage={issue?.message}
                        onUpdate={(updated) => handleUpdateAction(index, updated)}
                        onMoveUp={() => handleMoveAction(index, 'up')}
                        onMoveDown={() => handleMoveAction(index, 'down')}
                        onDuplicate={() => handleDuplicateAction(index)}
                        onRemove={() => handleRemoveAction(index)}
                      />
                    );
                  })}

                  {/* Add Action Button */}
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={handleAddAction}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                        isDark
                          ? 'border-slate-800 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 text-[#5A4AD2]" />
                      <span>Add Action</span>
                    </button>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT: LIVE RULE SUMMARY PANEL (Desktop wide >= 1024px)                   */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <RuleSummaryPanel
              rule={rule}
              validationIssues={validationIssues}
              isDark={isDark}
              onSelectIssue={handleSelectIssue}
            />

            {/* Quick Helper Tips */}
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              isDark ? 'bg-[#151821] border-slate-800 text-slate-400' : 'bg-white border-[#E3E5E9] text-slate-500'
            }`}>
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <HelpCircle className="w-3.5 h-3.5 text-[#5A4AD2]" />
                <span>Execution Mechanics</span>
              </div>
              <p className="leading-relaxed">
                Rules execute in real-time when the trigger fires. Conditions are evaluated before any actions run. If conditions match, actions run sequentially in the displayed order.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Mobile Sticky Actions Bar (< 640px) */}
      <div className={`sm:hidden p-3 border-t sticky bottom-0 z-20 flex items-center justify-between gap-2 ${
        isDark ? 'bg-[#151821] border-slate-800' : 'bg-white border-[#E3E5E9]'
      }`}>
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isReadOnly}
          className={`flex-1 py-2 text-xs font-bold rounded-xl border text-center ${
            isDark ? 'border-slate-700 text-slate-200' : 'border-slate-200 text-slate-700'
          }`}
        >
          Save Draft
        </button>

        {rule.status !== 'Enabled' ? (
          <button
            type="button"
            onClick={() => setIsEnableDialogOpen(true)}
            disabled={isReadOnly}
            className="flex-1 py-2 text-xs font-bold rounded-xl bg-[#5A4AD2] text-white text-center shadow-xs"
          >
            Enable Rule
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsDisableDialogOpen(true)}
            disabled={isReadOnly}
            className="flex-1 py-2 text-xs font-bold rounded-xl bg-amber-600 text-white text-center shadow-xs"
          >
            Disable
          </button>
        )}
      </div>

      {/* 4. Confirmation Dialogs */}
      <EnableRuleDialog
        isOpen={isEnableDialogOpen}
        onClose={() => setIsEnableDialogOpen(false)}
        isDark={isDark}
        ruleTitle={rule.name}
        isValid={isValid}
        validationIssues={validationIssues}
        onConfirm={handleConfirmEnable}
        onViewIssues={() => {
          if (validationIssues[0]) handleSelectIssue(validationIssues[0]);
        }}
      />

      <DisableRuleDialog
        isOpen={isDisableDialogOpen}
        onClose={() => setIsDisableDialogOpen(false)}
        isDark={isDark}
        ruleTitle={rule.name}
        onConfirm={handleConfirmDisable}
      />

      <ArchiveRuleDialog
        isOpen={isArchiveDialogOpen}
        onClose={() => setIsArchiveDialogOpen(false)}
        isDark={isDark}
        ruleTitle={rule.name}
        onConfirm={handleConfirmArchive}
      />

      <UnsavedChangesDialog
        isOpen={isUnsavedDialogOpen}
        onClose={() => setIsUnsavedDialogOpen(false)}
        isDark={isDark}
        onDiscard={() => {
          setIsUnsavedDialogOpen(false);
          onBack();
        }}
        onKeepEditing={() => setIsUnsavedDialogOpen(false)}
        onSaveDraft={async () => {
          await handleSaveDraft();
          setIsUnsavedDialogOpen(false);
          onBack();
        }}
      />
    </div>
  );
};
