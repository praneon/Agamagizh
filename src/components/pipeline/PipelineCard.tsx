import React, { useState, useRef, useEffect } from 'react';
import { PipelineItem, PipelineStage } from './types';
import { 
  User, 
  Phone, 
  Clock, 
  MoreVertical, 
  ArrowRight, 
  MessageSquare, 
  ExternalLink, 
  Check, 
  Loader2, 
  Tag,
  Shield,
  Send
} from 'lucide-react';

interface PipelineCardProps {
  item: PipelineItem;
  stages: PipelineStage[];
  onSelectCard: (item: PipelineItem) => void;
  onMoveStage: (itemId: string, newStageId: string) => void;
  onOpenConversation?: (item: PipelineItem) => void;
  onOpenContact?: (item: PipelineItem) => void;
  isSaving?: boolean;
  justSaved?: boolean;
  isReadOnly?: boolean;
  theme?: 'light' | 'dark';
}

export const PipelineCard: React.FC<PipelineCardProps> = ({
  item,
  stages,
  onSelectCard,
  onMoveStage,
  onOpenConversation,
  onOpenContact,
  isSaving = false,
  justSaved = false,
  isReadOnly = false,
  theme = 'light'
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMoveSubmenu, setShowMoveSubmenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setShowMoveSubmenu(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isReadOnly) {
      e.preventDefault();
      return;
    }
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify({
      itemId: item.id,
      fromStageId: item.stageId,
      itemTitle: item.title
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const currentStage = stages.find(s => s.id === item.stageId);
  const otherStages = stages.filter(s => s.id !== item.stageId);

  // Styling based on theme
  const isDark = theme === 'dark';

  return (
    <div
      id={`card-${item.id}`}
      role="button"
      tabIndex={0}
      aria-label={`${item.title}, contact: ${item.contactName}, stage: ${currentStage?.title || 'Unknown'}`}
      draggable={!isReadOnly}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onSelectCard(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectCard(item);
        }
      }}
      className={`relative group rounded-2xl p-3.5 transition-all text-xs outline-none cursor-pointer select-none border ${
        isDark
          ? 'bg-[#1E222D] border-slate-800 hover:border-slate-700 shadow-2xs hover:shadow-md text-slate-200 focus-visible:ring-2 focus-visible:ring-[#5A4AD2]'
          : 'bg-white border-[#E3E5E9] hover:border-slate-300 shadow-2xs hover:shadow-md text-slate-800 focus-visible:ring-2 focus-visible:ring-[#5A4AD2]'
      } ${
        isDragging
          ? 'opacity-40 scale-[0.98] ring-2 ring-[#5A4AD2] border-transparent'
          : ''
      }`}
    >
      {/* Saving / Saved Status Pill */}
      {isSaving && (
        <div className="absolute -top-2 right-3 z-10 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1 animate-pulse">
          <Loader2 className="w-2.5 h-2.5 animate-spin" />
          <span>Saving…</span>
        </div>
      )}
      {justSaved && !isSaving && (
        <div className="absolute -top-2 right-3 z-10 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1">
          <Check className="w-2.5 h-2.5" />
          <span>Saved</span>
        </div>
      )}

      {/* Header: Title & Menu */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className={`font-bold text-xs leading-snug line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {item.title}
        </h4>

        {/* Card Action Menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            aria-label="Card actions"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
              setShowMoveSubmenu(false);
            }}
            className={`p-1 rounded-lg transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {isMenuOpen && (
            <div
              className={`absolute right-0 top-full mt-1 w-48 rounded-xl shadow-xl border py-1.5 z-40 text-xs animate-in fade-in zoom-in-95 ${
                isDark ? 'bg-[#252A38] border-slate-700 text-slate-200' : 'bg-white border-[#E3E5E9] text-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onSelectCard(item);
                }}
                className={`w-full px-3 py-1.5 text-left flex items-center gap-2 font-medium ${
                  isDark ? 'hover:bg-slate-700/60' : 'hover:bg-slate-50'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Open Details</span>
              </button>

              {!isReadOnly && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMoveSubmenu(!showMoveSubmenu);
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between font-medium ${
                      isDark ? 'hover:bg-slate-700/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-[#5A4AD2]" />
                      <span>Move to Stage</span>
                    </div>
                    <span className="text-[10px] text-slate-400">›</span>
                  </button>

                  {/* Move to Stage Submenu */}
                  {showMoveSubmenu && (
                    <div
                      className={`absolute right-full top-0 mr-1 w-44 rounded-xl shadow-xl border py-1 z-50 animate-in fade-in ${
                        isDark ? 'bg-[#2B3142] border-slate-700' : 'bg-white border-[#E3E5E9]'
                      }`}
                    >
                      <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100/10">
                        Select Destination
                      </div>
                      {otherStages.map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(false);
                            setShowMoveSubmenu(false);
                            onMoveStage(item.id, st.id);
                          }}
                          className={`w-full px-3 py-1.5 text-left flex items-center gap-2 font-medium ${
                            isDark ? 'hover:bg-slate-700/80' : 'hover:bg-[#EEECFB] hover:text-[#5A4AD2]'
                          }`}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: st.color }}
                          />
                          <span className="truncate">{st.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {onOpenConversation && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onOpenConversation(item);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center gap-2 font-medium ${
                    isDark ? 'hover:bg-slate-700/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Open Conversation</span>
                </button>
              )}

              {onOpenContact && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onOpenContact(item);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center gap-2 font-medium ${
                    isDark ? 'hover:bg-slate-700/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Open Contact</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contact & Destination Info */}
      <div className="space-y-1 mb-2.5">
        <div className="flex items-center gap-1.5">
          <User className="w-3 h-3 text-[#5A4AD2] shrink-0" />
          <span className={`font-bold truncate ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            {item.contactName}
          </span>
        </div>
        <div className={`text-[11px] font-mono pl-4.5 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {item.contactPhone}
        </div>
      </div>

      {/* Labels Strip */}
      {item.labels && item.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {item.labels.map((lbl, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                isDark
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-slate-100 text-slate-600 border border-slate-200/60'
              }`}
            >
              {lbl}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Assignee & Last Activity */}
      <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${
        isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
      }`}>
        <div className="truncate max-w-[130px]" title={item.assignedAgent}>
          <span className="font-semibold">{item.assignedAgent.split(' ')[0]}</span>
          {item.assignedTeam && (
            <span className="opacity-75"> • {item.assignedTeam}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Clock className="w-3 h-3 opacity-60" />
          <span>{item.lastActivity}</span>
        </div>
      </div>
    </div>
  );
};
