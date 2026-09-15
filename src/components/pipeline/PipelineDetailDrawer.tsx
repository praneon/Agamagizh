import React, { useState, useEffect, useRef } from 'react';
import { PipelineItem, PipelineStage } from './types';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Tag, 
  Clock, 
  MessageSquare, 
  ExternalLink, 
  ArrowRight, 
  Loader2, 
  Check, 
  AlertCircle,
  Building2,
  ShieldCheck,
  Send
} from 'lucide-react';

interface PipelineDetailDrawerProps {
  item: PipelineItem | null;
  stages: PipelineStage[];
  onClose: () => void;
  onMoveStage: (itemId: string, newStageId: string) => Promise<boolean> | void;
  onOpenConversation?: (item: PipelineItem) => void;
  onOpenContact?: (item: PipelineItem) => void;
  isReadOnly?: boolean;
  theme?: 'light' | 'dark';
}

export const PipelineDetailDrawer: React.FC<PipelineDetailDrawerProps> = ({
  item,
  stages,
  onClose,
  onMoveStage,
  onOpenConversation,
  onOpenContact,
  isReadOnly = false,
  theme = 'light'
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>('');
  const [isMoving, setIsMoving] = useState(false);
  const [moveStatusMessage, setMoveStatusMessage] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    if (item) {
      setSelectedStageId(item.stageId);
      setMoveStatusMessage(null);
      setIsMoving(false);
      // Focus close button on open
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
  }, [item]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const currentStage = stages.find(s => s.id === item.stageId) || stages[0];

  const handleStageSelectChange = async (newStageId: string) => {
    if (newStageId === item.stageId || isReadOnly) return;

    setSelectedStageId(newStageId);
    setIsMoving(true);
    setMoveStatusMessage('Moving…');

    try {
      const res = onMoveStage(item.id, newStageId);
      if (res instanceof Promise) {
        const success = await res;
        if (success) {
          const targetStage = stages.find(s => s.id === newStageId);
          setMoveStatusMessage(`Moved to ${targetStage?.title || 'stage'}`);
        } else {
          // Revert back
          setSelectedStageId(item.stageId);
          setMoveStatusMessage('Move failed. Returned to previous stage.');
        }
      } else {
        const targetStage = stages.find(s => s.id === newStageId);
        setMoveStatusMessage(`Moved to ${targetStage?.title || 'stage'}`);
      }
    } catch {
      setSelectedStageId(item.stageId);
      setMoveStatusMessage('Error moving stage. Reverted.');
    } finally {
      setIsMoving(false);
      setTimeout(() => {
        setMoveStatusMessage(null);
      }, 3500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200 border-l ${
          isDark
            ? 'bg-[#181B26] border-slate-800 text-slate-200'
            : 'bg-white border-[#E3E5E9] text-slate-800'
        }`}
      >
        {/* Drawer Header */}
        <div className={`p-5 border-b flex items-start justify-between sticky top-0 z-20 backdrop-blur-md ${
          isDark ? 'border-slate-800 bg-[#181B26]/95' : 'border-slate-100 bg-white/95'
        }`}>
          <div className="space-y-1.5 pr-3">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: currentStage.color }}
              />
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                  isDark
                    ? 'bg-slate-800 text-slate-300 border-slate-700'
                    : 'bg-[#EEECFB] text-[#5A4AD2] border-[#5A4AD2]/20'
                }`}
              >
                {currentStage.title}
              </span>
            </div>
            <h2 id="drawer-title" className={`text-base font-extrabold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {item.title}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className={`p-1.5 rounded-xl transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Move Status Banner */}
        {moveStatusMessage && (
          <div className={`px-5 py-2.5 text-xs font-semibold flex items-center gap-2 border-b animate-in fade-in ${
            moveStatusMessage.includes('failed') || moveStatusMessage.includes('Reverted') || moveStatusMessage.includes('Error')
              ? 'bg-red-50 text-red-700 border-red-200'
              : moveStatusMessage.includes('Moving')
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            {isMoving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : moveStatusMessage.includes('failed') ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>{moveStatusMessage}</span>
          </div>
        )}

        {/* Drawer Content */}
        <div className="p-5 space-y-6 flex-1 text-xs">
          {/* SECTION 1: CONTACT */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Contact Information
            </h3>
            <div className={`p-4 rounded-2xl border space-y-3 ${
              isDark ? 'bg-[#1E222D] border-slate-800' : 'bg-slate-50 border-slate-200/80'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Name</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.contactName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phone</span>
                <span className="font-mono font-medium">{item.contactPhone}</span>
              </div>
              {item.contactEmail && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium truncate max-w-[200px]">{item.contactEmail}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Channel / Inbox</span>
                <span className="font-medium flex items-center gap-1.5 text-slate-600">
                  <Send className="w-3 h-3 text-[#5A4AD2]" />
                  <span>{item.inbox}</span>
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: PIPELINE */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pipeline Stage & Ownership
            </h3>
            <div className={`p-4 rounded-2xl border space-y-3.5 ${
              isDark ? 'bg-[#1E222D] border-slate-800' : 'bg-slate-50 border-slate-200/80'
            }`}>
              {/* Stage Selector */}
              <div>
                <label className="block text-slate-500 mb-1.5 font-medium">Move to Stage</label>
                <div className="relative">
                  <select
                    value={selectedStageId}
                    disabled={isReadOnly || isMoving}
                    onChange={(e) => handleStageSelectChange(e.target.value)}
                    className={`w-full py-2 px-3 pr-8 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] transition-colors ${
                      isDark
                        ? 'bg-[#181B26] border-slate-700 text-slate-100'
                        : 'bg-white border-slate-200 text-slate-900'
                    } ${isReadOnly ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {stages.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.title} {st.id === item.stageId ? '(Current)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                {isReadOnly && (
                  <p className="text-[10px] text-amber-600 mt-1">
                    You don't have permission to move pipeline items.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/40">
                <span className="text-slate-500">Assigned Agent</span>
                <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {item.assignedAgent}
                </span>
              </div>

              {item.assignedTeam && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Assigned Team</span>
                  <span className="font-semibold text-slate-600">{item.assignedTeam}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Last Activity</span>
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <Clock className="w-3 h-3 opacity-60" />
                  <span>{item.lastActivity}</span>
                </span>
              </div>

              {item.labels && item.labels.length > 0 && (
                <div>
                  <span className="text-slate-500 block mb-1.5">Labels</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.labels.map((lbl, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-slate-300'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {lbl}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: RELATED ACTIVITY */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Related Activity Summary
            </h3>
            <div className={`p-4 rounded-2xl border space-y-3 ${
              isDark ? 'bg-[#1E222D] border-slate-800' : 'bg-slate-50 border-slate-200/80'
            }`}>
              {item.recentMessageSnippet && (
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold block">
                    Latest Inbound Message:
                  </span>
                  <p className={`italic text-xs p-2.5 rounded-xl border ${
                    isDark ? 'bg-[#181B26] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    "{item.recentMessageSnippet}"
                  </p>
                </div>
              )}

              {item.recentNote && (
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold block">
                    Internal Operational Note:
                  </span>
                  <p className="text-xs text-slate-600">
                    {item.recentNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className={`p-5 border-t sticky bottom-0 z-20 backdrop-blur-md space-y-2.5 ${
          isDark ? 'border-slate-800 bg-[#181B26]/95' : 'border-slate-100 bg-white/95'
        }`}>
          <div className="grid grid-cols-2 gap-2">
            {onOpenConversation && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenConversation(item);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Conversation</span>
              </button>
            )}

            {onOpenContact && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenContact(item);
                }}
                className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Contact</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
