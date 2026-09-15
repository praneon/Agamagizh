import React from 'react';
import { Send, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { ValidationIssue } from './types';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: () => void;
  botName: string;
  version: string;
  nodesCount: number;
  validationIssues: ValidationIssue[];
  theme: 'dark' | 'light';
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  onConfirmPublish,
  botName,
  version,
  nodesCount,
  validationIssues,
  theme
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const hasErrors = validationIssues.some((i) => i.severity === 'error');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="chatbot-publish-modal"
        className={`w-full max-w-md rounded-3xl shadow-2xl border p-6 space-y-5 ${
          isDark ? 'bg-[#181A1F] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A4AD2]/20 text-[#8B7FF5] flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Publish Chatbot Version</h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Promote draft flow to live WhatsApp routing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1 rounded-lg ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
          isDark ? 'bg-[#21252B] border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Bot Name</span>
            <span className="font-bold">{botName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Target Version</span>
            <span className="font-mono font-bold text-[#8B7FF5]">{version}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total Steps</span>
            <span className="font-bold">{nodesCount} nodes</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-inherit">
            <span className="text-slate-400">Validation Status</span>
            {hasErrors ? (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Errors Detected
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Validated
              </span>
            )}
          </div>
        </div>

        {hasErrors && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Cannot publish while blocking validation errors remain. Please resolve errors first.</span>
          </div>
        )}

        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Publishing this chatbot will deploy the flow configuration to the designated WhatsApp channel inbox. Any inbound conversations matching the trigger will be processed immediately.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
              isDark ? 'bg-[#21252B] border-slate-700 hover:bg-[#282C34] text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={hasErrors}
            onClick={() => {
              onConfirmPublish();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white disabled:opacity-40 transition-opacity shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Confirm & Publish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
