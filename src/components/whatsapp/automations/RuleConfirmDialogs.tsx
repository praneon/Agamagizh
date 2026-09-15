import React from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  Archive, 
  Power, 
  X 
} from 'lucide-react';
import { ValidationIssue } from './types';

interface ConfirmationModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

// 1. Enable Rule Dialog
interface EnableDialogProps extends ConfirmationModalBaseProps {
  ruleTitle: string;
  isValid: boolean;
  validationIssues: ValidationIssue[];
  onConfirm: () => void;
  onViewIssues?: () => void;
}

export const EnableRuleDialog: React.FC<EnableDialogProps> = ({
  isOpen,
  onClose,
  isDark = false,
  ruleTitle,
  isValid,
  validationIssues,
  onConfirm,
  onViewIssues
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enable-dialog-title"
    >
      <div className={`w-full max-w-md rounded-2xl shadow-2xl border p-6 animate-in zoom-in-95 ${
        isDark ? 'bg-[#181B26] border-slate-700 text-slate-100' : 'bg-white border-[#E3E5E9] text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${
              isValid ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600' : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600'
            }`}>
              {isValid ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <h3 id="enable-dialog-title" className="text-sm font-bold">
              {isValid ? 'Enable this rule?' : 'Rule Has Validation Issues'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isValid ? (
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              <strong>"{ruleTitle}"</strong> will begin running automatically when its trigger matches incoming events.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white shadow-xs transition-colors"
              >
                Enable Rule
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              This rule has <strong>{validationIssues.length} issue{validationIssues.length > 1 ? 's' : ''}</strong> that must be fixed before it can be enabled:
            </p>
            <ul className="space-y-1.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-900 dark:text-amber-300 text-xs mb-4">
              {validationIssues.map(i => (
                <li key={i.id} className="flex items-start gap-1.5 font-medium">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{i.message}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onViewIssues) onViewIssues();
                }}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#5A4AD2] text-white hover:bg-[#4C3DC2]"
              >
                View Issues
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Disable Rule Dialog
interface DisableDialogProps extends ConfirmationModalBaseProps {
  ruleTitle: string;
  onConfirm: () => void;
}

export const DisableRuleDialog: React.FC<DisableDialogProps> = ({
  isOpen,
  onClose,
  isDark = false,
  ruleTitle,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disable-dialog-title"
    >
      <div className={`w-full max-w-md rounded-2xl shadow-2xl border p-6 animate-in zoom-in-95 ${
        isDark ? 'bg-[#181B26] border-slate-700 text-slate-100' : 'bg-white border-[#E3E5E9] text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-600">
              <Power className="w-5 h-5" />
            </div>
            <h3 id="disable-dialog-title" className="text-sm font-bold">
              Disable this rule?
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
          <strong>"{ruleTitle}"</strong> will stop running until enabled again. It will not be deleted.
        </p>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-1.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
          >
            Disable Rule
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Archive Rule Dialog
interface ArchiveDialogProps extends ConfirmationModalBaseProps {
  ruleTitle: string;
  onConfirm: () => void;
}

export const ArchiveRuleDialog: React.FC<ArchiveDialogProps> = ({
  isOpen,
  onClose,
  isDark = false,
  ruleTitle,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="archive-dialog-title"
    >
      <div className={`w-full max-w-md rounded-2xl shadow-2xl border p-6 animate-in zoom-in-95 ${
        isDark ? 'bg-[#181B26] border-slate-700 text-slate-100' : 'bg-white border-[#E3E5E9] text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Archive className="w-5 h-5" />
            </div>
            <h3 id="archive-dialog-title" className="text-sm font-bold">
              Archive this rule?
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
          Archived rules do not run but remain available for reference and can be restored at any time.
        </p>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 shadow-xs transition-colors"
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Unsaved Changes Dialog
interface UnsavedDialogProps extends ConfirmationModalBaseProps {
  onDiscard: () => void;
  onSaveDraft: () => void;
  onKeepEditing: () => void;
}

export const UnsavedChangesDialog: React.FC<UnsavedDialogProps> = ({
  isOpen,
  onClose,
  isDark = false,
  onDiscard,
  onSaveDraft,
  onKeepEditing
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-dialog-title"
    >
      <div className={`w-full max-w-md rounded-2xl shadow-2xl border p-6 animate-in zoom-in-95 ${
        isDark ? 'bg-[#181B26] border-slate-700 text-slate-100' : 'bg-white border-[#E3E5E9] text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 id="unsaved-dialog-title" className="text-sm font-bold">
              You have unsaved changes
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
          You have modified this automation rule. Leaving now without saving will discard your latest adjustments.
        </p>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onDiscard}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={onKeepEditing}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Keep Editing
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white shadow-xs"
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
};
