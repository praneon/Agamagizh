import React from 'react';
import { 
  AutomationRuleItem, 
  ValidationIssue 
} from './types';
import { 
  AVAILABLE_TRIGGERS, 
  AVAILABLE_FIELDS 
} from './rulesMockData';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Zap, 
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

interface RuleSummaryPanelProps {
  rule: AutomationRuleItem;
  validationIssues: ValidationIssue[];
  isDark?: boolean;
  onSelectIssue?: (issue: ValidationIssue) => void;
}

export const RuleSummaryPanel: React.FC<RuleSummaryPanelProps> = ({
  rule,
  validationIssues,
  isDark = false,
  onSelectIssue
}) => {
  const triggerDef = AVAILABLE_TRIGGERS.find(t => t.type === rule.triggerType) || AVAILABLE_TRIGGERS[0];
  const isValid = validationIssues.length === 0;

  // Format human-readable WHEN description
  const getWhenSummary = () => {
    switch (rule.triggerType) {
      case 'conversation_created':
        return `A new WhatsApp conversation is created in "${rule.triggerConfig.inbox}"`;
      case 'message_received':
        return `An ${rule.triggerConfig.messageDirection || 'incoming'} message is received in "${rule.triggerConfig.inbox}"`;
      case 'conversation_updated':
        return `A conversation is updated in "${rule.triggerConfig.inbox}"`;
      case 'contact_updated':
        return `Contact details are updated`;
      case 'label_added':
        return `A label is attached to a conversation`;
      default:
        return triggerDef.label;
    }
  };

  // Format human-readable IF descriptions
  const getConditionsSummary = () => {
    if (rule.conditions.length === 0) {
      return ['No conditions (runs unconditionally whenever triggered)'];
    }

    return rule.conditions.map(c => {
      const fieldDef = AVAILABLE_FIELDS.find(f => f.id === c.field);
      const fieldLabel = fieldDef ? fieldDef.label : c.field;
      if (c.operator === 'is_true') {
        return `${fieldLabel} is TRUE`;
      }
      if (c.operator === 'is_false') {
        return `${fieldLabel} is FALSE`;
      }
      return `${fieldLabel} ${c.operator} "${c.value || '...'}"`;
    });
  };

  // Format human-readable THEN actions
  const getActionsSummary = () => {
    if (rule.actions.length === 0) {
      return ['No actions configured'];
    }

    return rule.actions.map((act) => {
      switch (act.type) {
        case 'assign_conversation': {
          const type = act.params.targetType === 'agent' ? 'Agent' : 'Team';
          return `Assign to ${type} "${act.params.targetValue || 'Unspecified'}"`;
        }
        case 'add_label':
          return `Add label "${act.params.label || 'Unspecified'}"`;
        case 'remove_label':
          return `Remove label "${act.params.label || 'Unspecified'}"`;
        case 'change_status':
          return `Change status to "${act.params.status || 'open'}"`;
        case 'send_message': {
          const preview = act.params.messageText ? `"${act.params.messageText.slice(0, 35)}..."` : 'empty text';
          return `Send message: ${preview}`;
        }
        default:
          return act.type;
      }
    });
  };

  return (
    <div className={`p-4 rounded-2xl border space-y-4 ${
      isDark ? 'bg-[#151821] border-slate-800' : 'bg-white border-[#E3E5E9]'
    }`}>
      {/* 1. Header with Validation Status */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Rule Summary</h3>
          <p className="text-xs font-extrabold truncate max-w-[200px] mt-0.5">
            {rule.name || 'Untitled Rule'}
          </p>
        </div>

        {/* Validation Status Badge */}
        {isValid ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Rule is valid</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{validationIssues.length} issue{validationIssues.length > 1 ? 's' : ''}</span>
          </span>
        )}
      </div>

      {/* 2. Structured Natural Language Overview */}
      <div className="space-y-3 text-xs">
        {/* WHEN Block */}
        <div className={`p-3 rounded-xl border ${
          isDark ? 'bg-[#1C202B] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            WHEN
          </span>
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            {getWhenSummary()}
          </p>
        </div>

        {/* IF Block */}
        <div className={`p-3 rounded-xl border ${
          isDark ? 'bg-[#1C202B] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              IF {rule.conditions.length > 1 ? `(${rule.matchMode})` : ''}
            </span>
            {rule.conditions.length > 1 && (
              <span className="text-[10px] text-slate-400">
                {rule.matchMode === 'ALL' ? 'All must match' : 'At least one matches'}
              </span>
            )}
          </div>
          <ul className="space-y-1 mt-1">
            {getConditionsSummary().map((condStr, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                <span className="text-[#5A4AD2] font-bold shrink-0">•</span>
                <span className="font-mono text-[11px]">{condStr}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* THEN Block */}
        <div className={`p-3 rounded-xl border ${
          isDark ? 'bg-[#1C202B] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            THEN (Execution Order)
          </span>
          <ol className="space-y-1 mt-1">
            {getActionsSummary().map((actStr, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                <span className="font-bold text-[#5A4AD2] text-[11px] shrink-0">{idx + 1}.</span>
                <span className="font-semibold text-[11px]">{actStr}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* 3. Clickable Validation Issues List (if any) */}
      {!isValid && (
        <div className={`p-3 rounded-xl border ${
          isDark ? 'bg-red-950/20 border-red-900/40 text-red-300' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-1.5 font-bold text-xs mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            <span>Action required ({validationIssues.length}):</span>
          </div>
          <ul className="space-y-1.5 text-[11px]">
            {validationIssues.map((issue) => (
              <li key={issue.id}>
                <button
                  type="button"
                  onClick={() => onSelectIssue && onSelectIssue(issue)}
                  className="text-left font-medium hover:underline text-red-600 dark:text-red-400 block"
                >
                  • {issue.message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Metadata footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>Lifecycle Status: <strong className="text-slate-600 dark:text-slate-300">{rule.status}</strong></span>
        <span>{rule.executionCount.toLocaleString()} runs</span>
      </div>
    </div>
  );
};
