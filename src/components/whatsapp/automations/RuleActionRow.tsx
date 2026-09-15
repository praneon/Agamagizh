import React from 'react';
import { 
  RuleActionItem, 
  RuleActionType 
} from './types';
import { 
  AVAILABLE_ACTIONS, 
  AVAILABLE_TEAMS, 
  AVAILABLE_AGENTS, 
  AVAILABLE_LABELS 
} from './rulesMockData';
import { 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Trash2, 
  AlertCircle,
  MessageSquare,
  Tag,
  UserCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface RuleActionRowProps {
  action: RuleActionItem;
  index: number;
  totalActions: number;
  isReadOnly?: boolean;
  isDark?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  onUpdate: (updated: RuleActionItem) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
}

export const RuleActionRow: React.FC<RuleActionRowProps> = ({
  action,
  index,
  totalActions,
  isReadOnly = false,
  isDark = false,
  hasError = false,
  errorMessage,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove
}) => {
  const currentActionDef = AVAILABLE_ACTIONS.find(a => a.type === action.type) || AVAILABLE_ACTIONS[0];

  const handleTypeChange = (newType: RuleActionType) => {
    const nextActionDef = AVAILABLE_ACTIONS.find(a => a.type === newType) || AVAILABLE_ACTIONS[0];
    onUpdate({
      ...action,
      type: newType,
      params: { ...nextActionDef.defaultParams }
    });
  };

  const handleParamChange = (paramKey: string, paramValue: string) => {
    onUpdate({
      ...action,
      params: {
        ...action.params,
        [paramKey]: paramValue
      }
    });
  };

  const renderActionConfig = () => {
    switch (action.type) {
      case 'assign_conversation': {
        const targetType = action.params.targetType || 'team';
        const targetValue = action.params.targetValue || (targetType === 'team' ? AVAILABLE_TEAMS[0] : AVAILABLE_AGENTS[0]);

        return (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
            <select
              value={targetType}
              disabled={isReadOnly}
              onChange={(e) => {
                const newTargetType = e.target.value as 'team' | 'agent';
                onUpdate({
                  ...action,
                  params: {
                    targetType: newTargetType,
                    targetValue: newTargetType === 'team' ? AVAILABLE_TEAMS[0] : AVAILABLE_AGENTS[0]
                  }
                });
              }}
              className={`text-xs font-semibold py-1.5 px-2.5 rounded-lg border sm:w-28 focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark ? 'bg-[#1E222D] border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="team">Team</option>
              <option value="agent">Agent</option>
            </select>

            <select
              value={targetValue}
              disabled={isReadOnly}
              onChange={(e) => handleParamChange('targetValue', e.target.value)}
              className={`flex-1 text-xs font-semibold py-1.5 px-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark ? 'bg-[#1E222D] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              {targetType === 'team'
                ? AVAILABLE_TEAMS.map(t => <option key={t} value={t}>{t}</option>)
                : AVAILABLE_AGENTS.map(a => <option key={a} value={a}>{a}</option>)
              }
            </select>
          </div>
        );
      }

      case 'add_label':
      case 'remove_label': {
        const currentLabel = action.params.label || AVAILABLE_LABELS[0];
        return (
          <div className="flex items-center gap-2 flex-1">
            <select
              value={currentLabel}
              disabled={isReadOnly}
              onChange={(e) => handleParamChange('label', e.target.value)}
              className={`w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark ? 'bg-[#1E222D] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              {AVAILABLE_LABELS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        );
      }

      case 'change_status': {
        const currentStatus = action.params.status || 'open';
        return (
          <div className="flex items-center gap-2 flex-1">
            <select
              value={currentStatus}
              disabled={isReadOnly}
              onChange={(e) => handleParamChange('status', e.target.value)}
              className={`w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark ? 'bg-[#1E222D] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
              <option value="snoozed">Snoozed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        );
      }

      case 'send_message': {
        const messageText = action.params.messageText || '';
        return (
          <div className="w-full space-y-1.5 pt-1">
            <textarea
              rows={2}
              value={messageText}
              disabled={isReadOnly}
              onChange={(e) => handleParamChange('messageText', e.target.value)}
              placeholder="Enter message text to dispatch automatically..."
              className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] transition-colors resize-y ${
                hasError && !messageText.trim()
                  ? isDark ? 'border-red-500 bg-red-950/20' : 'border-red-400 bg-red-50/50'
                  : isDark ? 'bg-[#1E222D] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Plaintext operational auto-reply message</span>
              <span>{messageText.length} characters</span>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const getActionIcon = () => {
    switch (action.type) {
      case 'assign_conversation':
        return <UserCheck className="w-3.5 h-3.5 text-[#5A4AD2]" />;
      case 'add_label':
      case 'remove_label':
        return <Tag className="w-3.5 h-3.5 text-blue-500" />;
      case 'change_status':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
      case 'send_message':
        return <MessageSquare className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div 
      id={`action-row-${action.id}`}
      className={`p-3 rounded-xl border transition-all ${
        hasError 
          ? isDark ? 'border-red-500/80 bg-red-950/20' : 'border-red-400 bg-red-50/50' 
          : isDark ? 'border-slate-800 bg-[#161922]' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="space-y-2.5">
        {/* Top bar: Step Label, Action Type, Reorder Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#5A4AD2]/10 text-[#5A4AD2] border border-[#5A4AD2]/20">
              Step {index + 1}
            </span>
            <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800">
              {getActionIcon()}
            </div>
            <select
              value={action.type}
              disabled={isReadOnly}
              onChange={(e) => handleTypeChange(e.target.value as RuleActionType)}
              className={`text-xs font-bold py-1 px-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark ? 'bg-[#1E222D] border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {AVAILABLE_ACTIONS.map(a => (
                <option key={a.type} value={a.type}>{a.label}</option>
              ))}
            </select>
          </div>

          {/* Action Order & Management Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={index === 0 || isReadOnly}
              title="Move step up"
              aria-label={`Move action step ${index + 1} up`}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark 
                  ? 'border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800' 
                  : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              } disabled:opacity-25 disabled:cursor-not-allowed`}
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={index === totalActions - 1 || isReadOnly}
              title="Move step down"
              aria-label={`Move action step ${index + 1} down`}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark 
                  ? 'border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800' 
                  : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              } disabled:opacity-25 disabled:cursor-not-allowed`}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onDuplicate}
              disabled={isReadOnly}
              title="Duplicate step"
              aria-label={`Duplicate step ${index + 1}`}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark 
                  ? 'border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800' 
                  : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              } disabled:opacity-25 disabled:cursor-not-allowed`}
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={isReadOnly}
              title="Remove step"
              aria-label={`Remove step ${index + 1}`}
              className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Configuration Area */}
        <div className="pt-1">
          {renderActionConfig()}
        </div>

        {/* Inline error feedback if any */}
        {hasError && errorMessage && (
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-red-600 dark:text-red-400 font-semibold">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
