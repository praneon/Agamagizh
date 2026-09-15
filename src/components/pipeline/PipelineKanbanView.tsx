import React, { useState, useMemo } from 'react';
import { 
  PipelineItem, 
  PipelineStage, 
  PipelineDefinition, 
  PipelineFilters,
  MoveFailureInfo 
} from './types';
import { 
  PIPELINE_DEFINITIONS, 
  INITIAL_PIPELINE_ITEMS, 
  AVAILABLE_AGENTS, 
  AVAILABLE_PIPELINE_LABELS 
} from './pipelineMockData';
import { PipelineStageColumn } from './PipelineStageColumn';
import { PipelineDetailDrawer } from './PipelineDetailDrawer';
import { 
  Kanban, 
  Search, 
  Plus, 
  Filter, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Moon, 
  Sun, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw, 
  X, 
  ChevronDown,
  Layers,
  Phone,
  User,
  SlidersHorizontal
} from 'lucide-react';

interface PipelineKanbanViewProps {
  initialItems?: PipelineItem[];
  context?: 'clinic' | 'whatsapp';
  onOpenConversation?: (item: PipelineItem) => void;
  onOpenContact?: (item: PipelineItem) => void;
}

export const PipelineKanbanView: React.FC<PipelineKanbanViewProps> = ({
  initialItems,
  context = 'clinic',
  onOpenConversation,
  onOpenContact
}) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Selected Pipeline definition
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('general_enquiries');
  const currentPipelineDef = useMemo(() => {
    return PIPELINE_DEFINITIONS.find(p => p.id === selectedPipelineId) || PIPELINE_DEFINITIONS[0];
  }, [selectedPipelineId]);

  // Main items state
  const [items, setItems] = useState<PipelineItem[]>(() => {
    if (initialItems && initialItems.length > 0) return initialItems;
    return INITIAL_PIPELINE_ITEMS;
  });

  // Selected Card for Drawer
  const [selectedCard, setSelectedCard] = useState<PipelineItem | null>(null);

  // Filters State
  const [filters, setFilters] = useState<PipelineFilters>({
    search: '',
    assignee: 'All Assignees',
    label: 'All Labels',
    channel: 'All Channels',
    stage: 'All Stages'
  });
  const [showFilterBar, setShowFilterBar] = useState(false);

  // Mobile selected stage (One stage at a time on mobile!)
  const [mobileActiveStageId, setMobileActiveStageId] = useState<string>(
    currentPipelineDef.stages[0]?.id || 'new_enquiry'
  );

  // Optimistic Move States
  const [savingCardIds, setSavingCardIds] = useState<Set<string>>(new Set());
  const [justSavedCardIds, setJustSavedCardIds] = useState<Set<string>>(new Set());

  // Demonstrable failure & permission modes (interactive for prototype evaluation)
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  // Last Move Failure banner
  const [moveFailureInfo, setMoveFailureInfo] = useState<MoveFailureInfo | null>(null);

  // Add Item Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemContact, setNewItemContact] = useState('');
  const [newItemPhone, setNewItemPhone] = useState('');
  const [newItemEmail, setNewItemEmail] = useState('');
  const [newItemStage, setNewItemStage] = useState(currentPipelineDef.stages[0]?.id || 'new_enquiry');
  const [newItemAgent, setNewItemAgent] = useState('Kavitha Sundaram');

  const isDark = theme === 'dark';

  // Contextual Channel Filter
  const contextFilteredItems = useMemo(() => {
    if (context === 'whatsapp') {
      return items.filter(item => item.channel === 'whatsapp');
    }
    return items;
  }, [items, context]);

  // Apply Search & User Filters
  const filteredItems = useMemo(() => {
    return contextFilteredItems.filter(item => {
      // Search
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = item.contactName.toLowerCase().includes(query);
        const matchesPhone = item.contactPhone.toLowerCase().includes(query);
        const matchesTitle = item.title.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesTitle) return false;
      }

      // Assignee
      if (filters.assignee !== 'All Assignees' && item.assignedAgent !== filters.assignee) {
        return false;
      }

      // Label
      if (filters.label !== 'All Labels' && !item.labels.includes(filters.label)) {
        return false;
      }

      // Channel
      if (filters.channel !== 'All Channels') {
        if (filters.channel === 'WhatsApp' && item.channel !== 'whatsapp') return false;
        if (filters.channel === 'Live Chat' && item.channel !== 'live_chat') return false;
      }

      // Stage
      if (filters.stage !== 'All Stages' && item.stageId !== filters.stage) {
        return false;
      }

      return true;
    });
  }, [contextFilteredItems, filters]);

  // Card Movement Logic (Optimistic Move + Rollback)
  const handleMoveStage = async (itemId: string, newStageId: string): Promise<boolean> => {
    const itemToMove = items.find(i => i.id === itemId);
    if (!itemToMove || itemToMove.stageId === newStageId) return false;

    if (isReadOnly) {
      return false;
    }

    const previousStageId = itemToMove.stageId;
    const previousStage = currentPipelineDef.stages.find(s => s.id === previousStageId);
    const targetStage = currentPipelineDef.stages.find(s => s.id === newStageId);

    // 1. Optimistic update immediately
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, stageId: newStageId } : item
    ));

    // Update selected card if drawer is open
    if (selectedCard && selectedCard.id === itemId) {
      setSelectedCard(prev => prev ? { ...prev, stageId: newStageId } : null);
    }

    // Set Saving status indicator
    setSavingCardIds(prev => new Set(prev).add(itemId));
    setMoveFailureInfo(null);

    // Simulate backend network roundtrip
    await new Promise(resolve => setTimeout(resolve, 600));

    // 2. Failure check
    if (simulateFailure) {
      // ROLLBACK!
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, stageId: previousStageId } : item
      ));

      if (selectedCard && selectedCard.id === itemId) {
        setSelectedCard(prev => prev ? { ...prev, stageId: previousStageId } : null);
      }

      setSavingCardIds(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });

      // Set demonstrable failure notice
      setMoveFailureInfo({
        itemId,
        itemTitle: itemToMove.title,
        fromStageId: previousStageId,
        fromStageTitle: previousStage?.title || 'previous stage',
        toStageId: newStageId,
        errorMessage: `Couldn't move this item. It was returned to ${previousStage?.title || 'Follow-up'}.`
      });

      return false;
    }

    // 3. Success
    setSavingCardIds(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });

    setJustSavedCardIds(prev => new Set(prev).add(itemId));
    setTimeout(() => {
      setJustSavedCardIds(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }, 2500);

    return true;
  };

  // Quick Add Item
  const handleQuickAddItem = (stageId: string) => {
    setNewItemStage(stageId);
    setIsAddModalOpen(true);
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle || !newItemContact || !newItemPhone) return;

    const newItem: PipelineItem = {
      id: `item-${Date.now()}`,
      stageId: newItemStage,
      title: newItemTitle,
      contactName: newItemContact,
      contactPhone: newItemPhone,
      contactEmail: newItemEmail || undefined,
      assignedAgent: newItemAgent,
      assignedTeam: 'Reception Team',
      labels: ['Inbound Inquiry'],
      lastActivity: 'Just now',
      channel: context === 'whatsapp' ? 'whatsapp' : 'whatsapp',
      inbox: 'Agamagizh WhatsApp Main',
      recentNote: 'Directly registered in pipeline.'
    };

    setItems([newItem, ...items]);
    setIsAddModalOpen(false);
    setNewItemTitle('');
    setNewItemContact('');
    setNewItemPhone('');
    setNewItemEmail('');
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      assignee: 'All Assignees',
      label: 'All Labels',
      channel: 'All Channels',
      stage: 'All Stages'
    });
  };

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.assignee !== 'All Assignees' ||
    filters.label !== 'All Labels' ||
    filters.channel !== 'All Channels' ||
    filters.stage !== 'All Stages';

  return (
    <div className={`min-h-full flex flex-col font-sans transition-colors duration-150 ${
      isDark ? 'bg-[#0F1117] text-slate-100' : 'bg-[#F4F5F7] text-[#323739]'
    }`}>
      {/* 1. Header Toolbar */}
      <header className={`p-4 sm:px-6 border-b transition-colors ${
        isDark ? 'bg-[#151821] border-slate-800' : 'bg-white border-[#E3E5E9]'
      }`}>
        <div className="max-w-[1920px] mx-auto space-y-3.5">
          {/* Top Row: Title, Pipeline Selector, and Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl border ${
                isDark ? 'bg-[#1E222D] border-slate-700 text-[#7C6EE6]' : 'bg-[#EEECFB] border-[#5A4AD2]/20 text-[#5A4AD2]'
              }`}>
                <Kanban className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`text-lg sm:text-xl font-extrabold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {context === 'whatsapp' ? 'WhatsApp Pipeline' : 'Clinic Pipeline'}
                  </h1>

                  {/* Pipeline Selector */}
                  <div className="relative inline-block ml-1">
                    <select
                      value={selectedPipelineId}
                      onChange={(e) => {
                        setSelectedPipelineId(e.target.value);
                        setMobileActiveStageId(
                          PIPELINE_DEFINITIONS.find(p => p.id === e.target.value)?.stages[0]?.id || 'new_enquiry'
                        );
                      }}
                      className={`text-xs font-bold py-1 px-2.5 rounded-lg border appearance-none pr-7 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                        isDark 
                          ? 'bg-[#1E222D] border-slate-700 text-slate-200' 
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {PIPELINE_DEFINITIONS.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 pointer-events-none text-slate-400" />
                  </div>
                </div>

                <p className={`text-xs mt-0.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-[#6E737F]'}`}>
                  {currentPipelineDef.description}
                </p>
              </div>
            </div>

            {/* Controls Strip: Theme, Simulation Toggles, Add Button */}
            <div className="flex items-center flex-wrap gap-2">
              {/* Prototype Simulation Toggles */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold ${
                isDark ? 'bg-[#1A1D27] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-slate-400 hidden sm:inline">Prototype:</span>
                
                {/* Failure Toggle */}
                <button
                  type="button"
                  onClick={() => setSimulateFailure(!simulateFailure)}
                  title="Toggle move failure to demonstrate automatic rollback"
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    simulateFailure 
                      ? 'bg-red-500 text-white font-bold' 
                      : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {simulateFailure ? 'Failure: ON (Rollback)' : 'Failure: OFF'}
                </button>

                {/* Read Only Toggle */}
                <button
                  type="button"
                  onClick={() => setIsReadOnly(!isReadOnly)}
                  title="Toggle read-only permissions state"
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    isReadOnly 
                      ? 'bg-amber-500 text-white font-bold' 
                      : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isReadOnly ? 'Read-only: Active' : 'Read-only: OFF'}
                </button>

                {/* Loading State Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 800);
                  }}
                  title="Test skeleton loading state"
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Skeleton
                </button>
              </div>

              {/* Theme Switcher */}
              <button
                type="button"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                className={`p-2 rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-[#1E222D] border-slate-700 text-amber-400 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Add Item Button */}
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => {
                    setNewItemStage(currentPipelineDef.stages[0]?.id || 'new_enquiry');
                    setIsAddModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              )}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search by contact name, phone, or title..."
                className={`w-full text-xs pl-9 pr-8 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] transition-colors ${
                  isDark
                    ? 'bg-[#1E222D] border-slate-700 text-slate-100 placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
              />
              {filters.search && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {/* Assignee Filter */}
              <select
                value={filters.assignee}
                onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
                className={`text-xs py-2 px-2.5 rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-[#1E222D] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                {AVAILABLE_AGENTS.map(agent => (
                  <option key={agent} value={agent}>{agent}</option>
                ))}
              </select>

              {/* Label Filter */}
              <select
                value={filters.label}
                onChange={(e) => setFilters(prev => ({ ...prev, label: e.target.value }))}
                className={`text-xs py-2 px-2.5 rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-[#1E222D] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                {AVAILABLE_PIPELINE_LABELS.map(lbl => (
                  <option key={lbl} value={lbl}>{lbl}</option>
                ))}
              </select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className={`inline-flex items-center gap-1 px-2.5 py-2 text-xs font-bold rounded-xl border transition-colors ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Permission Banner (if in Read-Only state) */}
      {isReadOnly && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-[1920px] mx-auto w-full">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Read-only Mode:</strong> You don't have permission to move pipeline items. Stage modifications and drag-and-drop are currently disabled.
            </span>
          </div>
        </div>
      )}

      {/* 3. Move Failure Feedback Banner (Demonstrable Rollback Notification) */}
      {moveFailureInfo && (
        <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-2.5 text-xs text-red-800 dark:text-red-300 animate-in fade-in">
          <div className="max-w-[1920px] mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>
                <strong>Move Failed:</strong> Couldn't move this item. It was returned to <strong>{moveFailureInfo.fromStageTitle}</strong>.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSimulateFailure(false);
                  handleMoveStage(moveFailureInfo.itemId, moveFailureInfo.toStageId);
                }}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors"
              >
                Retry Move
              </button>
              <button
                type="button"
                onClick={() => setMoveFailureInfo(null)}
                className="p-1 text-red-700 dark:text-red-300 hover:opacity-75"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Load Failure State (Demonstrable) */}
      {hasLoadError ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="p-3 bg-red-100 dark:bg-red-950/40 rounded-2xl text-red-600 mb-3">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold mb-1">We couldn't load this pipeline.</h2>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            A temporary connection issue prevented loading the pipeline items.
          </p>
          <button
            type="button"
            onClick={() => setHasLoadError(false)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5A4AD2] text-white text-xs font-bold rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Loading</span>
          </button>
        </div>
      ) : isLoading ? (
        /* 5. Skeleton Loading State */
        <div className="p-4 sm:p-6 flex gap-4 overflow-x-auto flex-1">
          {[1, 2, 3, 4].map(idx => (
            <div
              key={idx}
              className={`w-80 shrink-0 rounded-2xl p-3.5 border animate-pulse space-y-3 ${
                isDark ? 'bg-[#161922] border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/40">
                <div className="w-24 h-4 bg-slate-300 dark:bg-slate-700 rounded" />
                <div className="w-6 h-4 bg-slate-300 dark:bg-slate-700 rounded-full" />
              </div>
              <div className="space-y-3">
                <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 6. Main Pipeline Views (Mobile One-Stage vs Desktop Horizontal Kanban) */
        <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
          {/* ========================================================================= */}
          {/* MOBILE VIEW (< 768px): Stage-based view (ONE STAGE AT A TIME)             */}
          {/* ========================================================================= */}
          <div className="block md:hidden flex-1 flex flex-col space-y-4">
            {/* Mobile Stage Selector Pill Strip */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Current Stage
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {currentPipelineDef.stages.map((st) => {
                  const stageCount = filteredItems.filter(i => i.stageId === st.id).length;
                  const isActive = mobileActiveStageId === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setMobileActiveStageId(st.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 border transition-all ${
                        isActive
                          ? 'bg-[#5A4AD2] text-white border-[#5A4AD2] shadow-xs'
                          : isDark
                          ? 'bg-[#1E222D] border-slate-800 text-slate-300'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: st.color }}
                      />
                      <span>{st.title}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {stageCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Cards for the single active stage */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
              {(() => {
                const activeStageObj = currentPipelineDef.stages.find(s => s.id === mobileActiveStageId) || currentPipelineDef.stages[0];
                const stageCards = filteredItems.filter(i => i.stageId === mobileActiveStageId);

                if (stageCards.length === 0) {
                  return (
                    <div className={`p-8 text-center rounded-2xl border-2 border-dashed ${
                      isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
                    }`}>
                      <p className="text-xs font-semibold">No items in this stage.</p>
                      <p className="text-[11px] mt-1">Select another stage above or add a new enquiry.</p>
                    </div>
                  );
                }

                return stageCards.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCard(item)}
                    className={`p-4 rounded-2xl border shadow-2xs space-y-2.5 transition-all active:scale-[0.99] ${
                      isDark ? 'bg-[#1E222D] border-slate-800 text-slate-200' : 'bg-white border-[#E3E5E9] text-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs leading-snug">{item.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {activeStageObj.title}
                      </span>
                    </div>

                    <div className="text-xs space-y-0.5">
                      <div className="font-bold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#5A4AD2]" />
                        <span>{item.contactName}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 pl-5">
                        {item.contactPhone}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                      <span>{item.assignedAgent.split(' ')[0]}</span>
                      <span>{item.lastActivity}</span>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DESKTOP VIEW (>= 768px): Horizontal Kanban Board                          */}
          {/* ========================================================================= */}
          <div className="hidden md:flex flex-1 gap-4 overflow-x-auto pb-4 items-start select-none">
            {currentPipelineDef.stages.map((stage) => {
              const stageCards = filteredItems.filter(c => c.stageId === stage.id);
              return (
                <PipelineStageColumn
                  key={stage.id}
                  stage={stage}
                  cards={stageCards}
                  allStages={currentPipelineDef.stages}
                  onSelectCard={(card) => setSelectedCard(card)}
                  onMoveStage={handleMoveStage}
                  onOpenConversation={onOpenConversation}
                  onOpenContact={onOpenContact}
                  onQuickAddItem={handleQuickAddItem}
                  savingCardIds={savingCardIds}
                  justSavedCardIds={justSavedCardIds}
                  isReadOnly={isReadOnly}
                  theme={theme}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Card Detail Drawer */}
      <PipelineDetailDrawer
        item={selectedCard}
        stages={currentPipelineDef.stages}
        onClose={() => setSelectedCard(null)}
        onMoveStage={handleMoveStage}
        onOpenConversation={onOpenConversation}
        onOpenContact={onOpenContact}
        isReadOnly={isReadOnly}
        theme={theme}
      />

      {/* 8. Add Item Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-item-title"
        >
          <div className={`w-full max-w-md rounded-2xl shadow-2xl border p-6 animate-in zoom-in-95 ${
            isDark ? 'bg-[#181B26] border-slate-700 text-slate-100' : 'bg-white border-[#E3E5E9] text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 id="add-item-title" className="text-sm font-bold">Add Pipeline Item</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">
                  Item / Enquiry Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Center Consultation Inquiry"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                    isDark ? 'bg-[#1E222D] border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Suresh Ramanathan"
                    value={newItemContact}
                    onChange={(e) => setNewItemContact(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                      isDark ? 'bg-[#1E222D] border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98401 23456"
                    value={newItemPhone}
                    onChange={(e) => setNewItemPhone(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                      isDark ? 'bg-[#1E222D] border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="contact@example.com"
                  value={newItemEmail}
                  onChange={(e) => setNewItemEmail(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                    isDark ? 'bg-[#1E222D] border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Initial Stage
                  </label>
                  <select
                    value={newItemStage}
                    onChange={(e) => setNewItemStage(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                      isDark ? 'bg-[#1E222D] border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {currentPipelineDef.stages.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Assigned Agent
                  </label>
                  <select
                    value={newItemAgent}
                    onChange={(e) => setNewItemAgent(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                      isDark ? 'bg-[#1E222D] border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {AVAILABLE_AGENTS.filter(a => a !== 'All Assignees').map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white font-bold rounded-xl shadow-xs"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
