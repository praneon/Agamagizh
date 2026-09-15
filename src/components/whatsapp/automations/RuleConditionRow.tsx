import React from 'react';
import { 
  RuleConditionItem, 
  FieldDefinition 
} from './types';
import { 
  AVAILABLE_FIELDS, 
  OPERATORS_BY_DATA_TYPE 
} from './rulesMockData';
import { 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Trash2,
  AlertCircle
} from 'lucide-react';

interface RuleConditionRowProps {
  condition: RuleConditionItem;
  index: number;
  totalConditions: number;
  isReadOnly?: boolean;
  isDark?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  onUpdate: (updated: RuleConditionItem) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
}

export const RuleConditionRow: React.FC<RuleConditionRowProps> = ({
  condition,
  index,
  totalConditions,
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
  const currentFieldDef = AVAILABLE_FIELDS.find(f => f.id === condition.field) || AVAILABLE_FIELDS[0];
  const operators = OPERATORS_BY_DATA_TYPE[currentFieldDef.dataType] || OPERATORS_BY_DATA_TYPE.text;

  const handleFieldChange = (newFieldId: string) => {
    const nextFieldDef = AVAILABLE_FIELDS.find(f => f.id === newFieldId) || AVAILABLE_FIELDS[0];
    const validOperators = OPERATORS_BY_DATA_TYPE[nextFieldDef.dataType] || OPERATORS_BY_DATA_TYPE.text;
    const defaultOp = validOperators[0].value;
    let defaultValue = '';
    if (nextFieldDef.dataType === 'boolean') {
      defaultValue = 'true';
    } else if (nextFieldDef.options && nextFieldDef.options.length > 0) {
      defaultValue = nextFieldDef.options[0].value;
    }

    onUpdate({
      ...condition,
      field: newFieldId,
      operator: defaultOp,
      value: defaultValue
    });
  };

  const handleOperatorChange = (newOp: string) => {
    onUpdate({
      ...condition,
      operator: newOp
    });
  };

  const handleValueChange = (newVal: string) => {
    onUpdate({
      ...condition,
      value: newVal
    });
  };

  const isBoolean = currentFieldDef.dataType === 'boolean';

  return (
    <div 
      id={`condition-row-${condition.id}`}
      className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
        hasError 
          ? isDark ? 'border-red-500/80 bg-red-950/20' : 'border-red-400 bg-red-50/50' 
          : isDark ? 'border-slate-800 bg-[#161922]' : 'border-slate-200 bg-white'
      }`}
    >
      {/* Desktop & Mobile Responsive Grid / Stack */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        {/* Row Index Indicator */}
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
            isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
          }`}>
            #{index + 1}
          </span>
          <span className="sm:hidden text-xs font-semibold text-slate-400">Condition</span>

          {/* Mobile Reorder & Actions */}
          <div className="flex items-center gap-1 sm:hidden">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={index === 0 || isReadOnly}
              aria-label={`Move condition #${index + 1} up`}
              className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={index === totalConditions - 1 || isReadOnly}
              aria-label={`Move condition #${index + 1} down`}
              className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onDuplicate}
              disabled={isReadOnly}
              aria-label="Duplicate condition"
              className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={isReadOnly}
              aria-label="Remove condition"
              className="p-1 rounded text-red-400 hover:text-red-600 disabled:opacity-30"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. Field Selector */}
        <div className="flex-1 min-w-[160px]">
          <label className="sr-only" htmlFor={`field-${condition.id}`}>Field</label>
          <select
            id={`field-${condition.id}`}
            value={condition.field}
            disabled={isReadOnly}
            onChange={(e) => handleFieldChange(e.target.value)}
            className={`w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
              isDark 
                ? 'bg-[#1E222D] border-slate-700 text-slate-200' 
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {AVAILABLE_FIELDS.map(f => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* 2. Operator Selector */}
        <div className="w-full sm:w-36">
          <label className="sr-only" htmlFor={`operator-${condition.id}`}>Operator</label>
          <select
            id={`operator-${condition.id}`}
            value={condition.operator}
            disabled={isReadOnly}
            onChange={(e) => handleOperatorChange(e.target.value)}
            className={`w-full text-xs py-1.5 px-2.5 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
              isDark 
                ? 'bg-[#1E222D] border-slate-700 text-slate-300' 
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            {operators.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        </div>

        {/* 3. Value Input (Dependent on Field Type) */}
        <div className="flex-1 min-w-[180px]">
          <label className="sr-only" htmlFor={`value-${condition.id}`}>Value</label>
          {isBoolean ? (
            <div className={`text-xs py-1.5 px-3 rounded-lg border font-mono ${
              isDark ? 'bg-[#1E222D] border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              {condition.operator === 'is_true' ? 'Evaluates to TRUE' : 'Evaluates to FALSE'}
            </div>
          ) : currentFieldDef.options && currentFieldDef.options.length > 0 ? (
            <select
              id={`value-${condition.id}`}
              value={condition.value}
              disabled={isReadOnly}
              onChange={(e) => handleValueChange(e.target.value)}
              className={`w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark 
                  ? 'bg-[#1E222D] border-slate-700 text-slate-200' 
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              {currentFieldDef.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              id={`value-${condition.id}`}
              type="text"
              value={condition.value}
              disabled={isReadOnly}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder={currentFieldDef.placeholder || 'Enter value...'}
              className={`w-full text-xs py-1.5 px-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                hasError
                  ? isDark ? 'border-red-500 bg-red-950/30 text-white' : 'border-red-400 bg-white text-slate-900'
                  : isDark ? 'bg-[#1E222D] border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
          )}
        </div>

        {/* Desktop Controls (Up/Down, Duplicate, Remove) */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0 || isReadOnly}
            title="Move condition up"
            aria-label={`Move condition #${index + 1} up`}
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
            disabled={index === totalConditions - 1 || isReadOnly}
            title="Move condition down"
            aria-label={`Move condition #${index + 1} down`}
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
            title="Duplicate condition"
            aria-label={`Duplicate condition #${index + 1}`}
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
            title="Remove condition"
            aria-label={`Remove condition #${index + 1}`}
            className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inline validation error display if any */}
      {hasError && errorMessage && (
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-red-600 dark:text-red-400 font-semibold">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
