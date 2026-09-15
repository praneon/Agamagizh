import React, { useState } from 'react';
import { PipelineItem, PipelineStage } from './types';
import { PipelineCard } from './PipelineCard';
import { Plus, MoreHorizontal, ArrowUpDown, ChevronDown } from 'lucide-react';

interface PipelineStageColumnProps {
  stage: PipelineStage;
  cards: PipelineItem[];
  allStages: PipelineStage[];
  onSelectCard: (item: PipelineItem) => void;
  onMoveStage: (itemId: string, newStageId: string) => void;
  onOpenConversation?: (item: PipelineItem) => void;
  onOpenContact?: (item: PipelineItem) => void;
  onQuickAddItem?: (stageId: string) => void;
  savingCardIds: Set<string>;
  justSavedCardIds: Set<string>;
  isReadOnly?: boolean;
  theme?: 'light' | 'dark';
}

export const PipelineStageColumn: React.FC<PipelineStageColumnProps> = ({
  stage,
  cards,
  allStages,
  onSelectCard,
  onMoveStage,
  onOpenConversation,
  onOpenContact,
  onQuickAddItem,
  savingCardIds,
  justSavedCardIds,
  isReadOnly = false,
  theme = 'light'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'default' | 'activity'>('default');

  const isDark = theme === 'dark';

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    // Only leave if exiting the column boundary
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    e.preventDefault();
    setIsDragOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data && data.itemId && data.fromStageId !== stage.id) {
        onMoveStage(data.itemId, stage.id);
      }
    } catch (err) {
      console.error('Failed to parse dropped card data', err);
    }
  };

  // Optional sort
  const sortedCards = [...cards].sort((a, b) => {
    if (sortOrder === 'activity') {
      return a.lastActivity.localeCompare(b.lastActivity);
    }
    return 0;
  });

  return (
    <div
      id={`stage-column-${stage.id}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-80 shrink-0 flex flex-col rounded-2xl p-3 border transition-all duration-150 ${
        isDark
          ? 'bg-[#161922] border-slate-800/80 shadow-2xs'
          : 'bg-[#F3F4F7] border-[#E3E5E9] shadow-2xs'
      } ${
        isDragOver
          ? 'ring-2 ring-[#5A4AD2] border-[#5A4AD2] bg-[#EEECFB]/20'
          : ''
      }`}
    >
      {/* Column Header */}
      <div className={`flex items-center justify-between pb-2.5 mb-2.5 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200/80'
      }`}>
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: stage.color }}
            aria-hidden="true"
          />
          <h3 className={`text-xs font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {stage.title}
          </h3>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              isDark
                ? 'bg-[#1E222D] text-slate-300 border-slate-700'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
            aria-label={`${cards.length} items`}
          >
            {cards.length}
          </span>
        </div>

        {/* Column Actions */}
        <div className="flex items-center gap-1 relative">
          {onQuickAddItem && !isReadOnly && (
            <button
              type="button"
              onClick={() => onQuickAddItem(stage.id)}
              aria-label={`Quick add item to ${stage.title}`}
              title={`Quick add item to ${stage.title}`}
              className={`p-1 rounded-lg transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={`Options for ${stage.title}`}
            className={`p-1 rounded-lg transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
            }`}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {isMenuOpen && (
            <div
              className={`absolute right-0 top-full mt-1 w-44 rounded-xl shadow-xl border py-1 z-30 text-xs animate-in fade-in zoom-in-95 ${
                isDark ? 'bg-[#252A38] border-slate-700 text-slate-200' : 'bg-white border-[#E3E5E9] text-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setSortOrder(sortOrder === 'default' ? 'activity' : 'default');
                  setIsMenuOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left flex items-center gap-2 ${
                  isDark ? 'hover:bg-slate-700/60' : 'hover:bg-slate-50'
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>{sortOrder === 'default' ? 'Sort by activity' : 'Default order'}</span>
              </button>
              {onQuickAddItem && !isReadOnly && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onQuickAddItem(stage.id);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center gap-2 ${
                    isDark ? 'hover:bg-slate-700/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                  <span>Add card here</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cards Container with internal scrolling */}
      <div
        className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-17rem)] pr-0.5 flex-1 min-h-[140px]"
        tabIndex={0}
        aria-label={`${stage.title} cards list`}
      >
        {sortedCards.length === 0 ? (
          <div
            className={`p-6 text-center text-xs rounded-xl border-2 border-dashed flex flex-col items-center justify-center min-h-[120px] transition-colors ${
              isDark
                ? 'border-slate-800 text-slate-500 bg-[#1A1D27]/40'
                : 'border-slate-200/80 text-slate-400 bg-white/40'
            } ${
              isDragOver
                ? 'border-[#5A4AD2] bg-[#EEECFB]/30 text-[#5A4AD2]'
                : ''
            }`}
          >
            <p className="font-medium">No items in this stage.</p>
            {!isReadOnly && (
              <p className="text-[10px] mt-1 opacity-75">Drag items here or use card menu</p>
            )}
          </div>
        ) : (
          sortedCards.map((item) => (
            <PipelineCard
              key={item.id}
              item={item}
              stages={allStages}
              onSelectCard={onSelectCard}
              onMoveStage={onMoveStage}
              onOpenConversation={onOpenConversation}
              onOpenContact={onOpenContact}
              isSaving={savingCardIds.has(item.id)}
              justSaved={justSavedCardIds.has(item.id)}
              isReadOnly={isReadOnly}
              theme={theme}
            />
          ))
        )}
      </div>
    </div>
  );
};
