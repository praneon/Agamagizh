import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  ShieldAlert, 
  Info 
} from 'lucide-react';
import { ValidationIssue, FlowNode } from './types';

interface ValidationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  issues: ValidationIssue[];
  nodes: FlowNode[];
  onSelectNode: (nodeId: string) => void;
  theme: 'dark' | 'light';
}

export const ValidationDrawer: React.FC<ValidationDrawerProps> = ({
  isOpen,
  onClose,
  issues,
  nodes,
  onSelectNode,
  theme
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');

  const handleIssueClick = (nodeId: string) => {
    onSelectNode(nodeId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="chatbot-validation-drawer"
        className={`w-full max-w-lg rounded-3xl shadow-2xl border flex flex-col overflow-hidden ${
          isDark ? 'bg-[#181A1F] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              issues.length > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {issues.length > 0 ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-sm">Flow Validation Engine</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {issues.length === 0 
                  ? 'All automated integrity checks passed.' 
                  : `${errors.length} errors, ${warnings.length} warnings detected.`}
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

        {/* Content */}
        <div className="p-4 max-h-[420px] overflow-y-auto space-y-4 text-xs">
          {issues.length === 0 ? (
            <div className={`p-6 text-center rounded-2xl border ${
              isDark ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              <div className="font-bold text-sm mb-1">Flow is valid and ready to publish</div>
              <p className="text-xs opacity-80 max-w-xs mx-auto">
                No disconnected branches, empty messages, or unconfigured variables were found in this chatbot.
              </p>
            </div>
          ) : (
            <>
              {/* Errors Section */}
              {errors.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Blocking Errors ({errors.length})</span>
                  </div>
                  <div className="space-y-2">
                    {errors.map((issue) => {
                      const node = nodes.find((n) => n.id === issue.nodeId);
                      return (
                        <div
                          key={issue.id}
                          onClick={() => handleIssueClick(issue.nodeId)}
                          className={`p-3 rounded-xl border cursor-pointer group transition-all flex items-center justify-between ${
                            isDark 
                              ? 'bg-[#21252B] hover:bg-[#282C34] border-rose-500/30' 
                              : 'bg-rose-50/50 hover:bg-rose-50 border-rose-200'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-semibold text-xs text-rose-400">
                                {issue.message}
                              </div>
                              <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Step: <span className="font-medium text-slate-300 dark:text-slate-200">{node?.data.title || issue.nodeId}</span> ({node?.type})
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-[#5A4AD2] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <span>Locate</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Warnings Section */}
              {warnings.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Suggestions & Unconnected Paths ({warnings.length})</span>
                  </div>
                  <div className="space-y-2">
                    {warnings.map((issue) => {
                      const node = nodes.find((n) => n.id === issue.nodeId);
                      return (
                        <div
                          key={issue.id}
                          onClick={() => handleIssueClick(issue.nodeId)}
                          className={`p-3 rounded-xl border cursor-pointer group transition-all flex items-center justify-between ${
                            isDark 
                              ? 'bg-[#21252B] hover:bg-[#282C34] border-amber-500/30' 
                              : 'bg-amber-50/50 hover:bg-amber-50 border-amber-200'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-semibold text-xs text-amber-400">
                                {issue.message}
                              </div>
                              <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Step: <span className="font-medium text-slate-300 dark:text-slate-200">{node?.data.title || issue.nodeId}</span> ({node?.type})
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-[#5A4AD2] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <span>Locate</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-end ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
