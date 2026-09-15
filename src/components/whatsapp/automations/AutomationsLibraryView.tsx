import React, { useState, useMemo } from 'react';
import { 
  AutomationRuleItem, 
  RuleLifecycleStatus, 
  RuleTriggerType 
} from './types';
import { 
  AVAILABLE_TRIGGERS, 
  AVAILABLE_INBOXES 
} from './rulesMockData';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Play, 
  Power, 
  Archive, 
  Copy, 
  Edit3, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Zap, 
  ShieldAlert, 
  Sun, 
  Moon, 
  RefreshCw,
  Eye,
  Lock,
  ArrowUpDown
} from 'lucide-react';
import { 
  EnableRuleDialog, 
  DisableRuleDialog, 
  ArchiveRuleDialog 
} from './RuleConfirmDialogs';

interface AutomationsLibraryViewProps {
  rules: AutomationRuleItem[];
  theme: 'light' | 'dark';
  isReadOnly: boolean;
  onSelectRule: (rule: AutomationRuleItem) => void;
  onCreateRule: () => void;
  onUpdateRules: (rules: AutomationRuleItem[]) => void;
  onToggleTheme: () => void;
  onTogglePermission: () => void;
}

export const AutomationsLibraryView: React.FC<AutomationsLibraryViewProps> = ({
  rules,
  theme,
  isReadOnly,
  onSelectRule,
  onCreateRule,
  onUpdateRules,
  onToggleTheme,
  onTogglePermission
}) => {
  const isDark = theme === 'dark';

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RuleLifecycleStatus>('All');
  const [triggerFilter, setTriggerFilter] = useState<string>('All');

  // Interactive prototype states for testability
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(false);
  const [simulateLoadError, setSimulateLoadError] = useState(false);

  // Contextual modal actions
  const [activeDialog, setActiveDialog] = useState<{
    type: 'enable' | 'disable' | 'archive';
    rule: AutomationRuleItem;
  } | null>(null);

  // Open context menu per rule
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filtered rules
  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      // Status filter
      if (statusFilter !== 'All' && rule.status !== statusFilter) {
        return false;
      }
      // Trigger filter
      if (triggerFilter !== 'All' && rule.triggerType !== triggerFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = rule.name.toLowerCase().includes(q);
        const matchesDesc = rule.description.toLowerCase().includes(q);
        const matchesTrigger = rule.triggerType.toLowerCase().includes(q);
        const matchesInbox = rule.triggerConfig.inbox.toLowerCase().includes(q);
        const matchesActions = rule.actions.some(a => 
          a.type.toLowerCase().includes(q) || 
          Object.values(a.params).some(v => String(v).toLowerCase().includes(q))
        );
        if (!matchesName && !matchesDesc && !matchesTrigger && !matchesInbox && !matchesActions) {
          return false;
        }
      }
      return true;
    });
  }, [rules, statusFilter, triggerFilter, searchQuery]);

  // Counts for status badges
  const statusCounts = useMemo(() => {
    return {
      All: rules.length,
      Enabled: rules.filter(r => r.status === 'Enabled').length,
      Draft: rules.filter(r => r.status === 'Draft').length,
      Disabled: rules.filter(r => r.status === 'Disabled').length,
      Archived: rules.filter(r => r.status === 'Archived').length
    };
  }, [rules]);

  // Action helpers
  const handleDuplicate = (rule: AutomationRuleItem) => {
    const duplicated: AutomationRuleItem = {
      ...rule,
      id: `rule-${Date.now()}`,
      name: `${rule.name} (Copy)`,
      status: 'Draft',
      executionCount: 0,
      lastUpdated: 'Just now'
    };
    onUpdateRules([duplicated, ...rules]);
    setOpenMenuId(null);
  };

  const handleToggleStatusQuick = (rule: AutomationRuleItem) => {
    if (isReadOnly) return;
    if (rule.status === 'Enabled') {
      setActiveDialog({ type: 'disable', rule });
    } else {
      setActiveDialog({ type: 'enable', rule });
    }
  };

  const handleConfirmEnable = (rule: AutomationRuleItem) => {
    const updated = rules.map(r => r.id === rule.id ? { ...r, status: 'Enabled' as RuleLifecycleStatus, lastUpdated: 'Just now' } : r);
    onUpdateRules(updated);
  };

  const handleConfirmDisable = (rule: AutomationRuleItem) => {
    const updated = rules.map(r => r.id === rule.id ? { ...r, status: 'Disabled' as RuleLifecycleStatus, lastUpdated: 'Just now' } : r);
    onUpdateRules(updated);
  };

  const handleConfirmArchive = (rule: AutomationRuleItem) => {
    const updated = rules.map(r => r.id === rule.id ? { ...r, status: 'Archived' as RuleLifecycleStatus, lastUpdated: 'Just now' } : r);
    onUpdateRules(updated);
  };

  const handleRestore = (rule: AutomationRuleItem, newStatus: 'Draft' | 'Disabled') => {
    const updated = rules.map(r => r.id === rule.id ? { ...r, status: newStatus, lastUpdated: 'Just now' } : r);
    onUpdateRules(updated);
    setOpenMenuId(null);
  };

  // Helper for human-readable trigger label
  const getTriggerLabel = (type: RuleTriggerType) => {
    const def = AVAILABLE_TRIGGERS.find(t => t.type === type);
    return def ? def.label : type;
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-[1920px] mx-auto font-sans transition-colors duration-150 ${
      isDark ? 'text-slate-100' : 'text-[#323739]'
    }`}>
      {/* 1. Header with Evaluation & Test Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Automations</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#5A4AD2]/10 text-[#5A4AD2]">
              WhatsApp Rules
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Configure structured event-driven rules with linear WHEN → IF ALL/ANY → THEN execution for WhatsApp channels.
          </p>
        </div>

        {/* Prototype Evaluation Controls & Create Rule Button */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Permission Mode Toggle */}
          <button
            type="button"
            onClick={onTogglePermission}
            title="Toggle permission simulation"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
              isReadOnly
                ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isReadOnly ? <Lock className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isReadOnly ? 'Role: View-Only' : 'Role: Admin'}</span>
          </button>

          {/* Skeleton loading toggle for QA */}
          <button
            type="button"
            onClick={() => setIsLoadingSkeleton(!isLoadingSkeleton)}
            title="Test skeleton loading state"
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-colors hidden sm:inline-flex ${
              isLoadingSkeleton
                ? 'bg-blue-600 text-white border-blue-600'
                : isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}
          >
            Skeleton
          </button>

          {/* Error toggle for QA */}
          <button
            type="button"
            onClick={() => setSimulateLoadError(!simulateLoadError)}
            title="Test network error state"
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-colors hidden sm:inline-flex ${
              simulateLoadError
                ? 'bg-red-600 text-white border-red-600'
                : isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}
          >
            {simulateLoadError ? 'Error: ON' : 'Error: OFF'}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className={`p-2 rounded-xl border transition-colors ${
              isDark 
                ? 'border-slate-800 text-amber-400 hover:bg-slate-800' 
                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Create Rule CTA */}
          <button
            type="button"
            onClick={onCreateRule}
            disabled={isReadOnly}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Create Rule</span>
          </button>
        </div>
      </div>

      {/* Permission banner if view-only */}
      {isReadOnly && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>View-only Permission:</strong> You do not have permission to modify or create automation rules. You can click any rule to view its linear form configuration.
            </span>
          </div>
          <button
            type="button"
            onClick={onTogglePermission}
            className="underline font-bold hover:text-amber-900 shrink-0"
          >
            Switch to Admin
          </button>
        </div>
      )}

      {/* Load Error State Test Simulator */}
      {simulateLoadError ? (
        <div className={`p-8 text-center rounded-2xl border ${
          isDark ? 'bg-red-950/20 border-red-900/40 text-red-300' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <h3 className="text-sm font-extrabold">Failed to load automation rules</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            A network timeout occurred while fetching the automation rules directory.
          </p>
          <button
            type="button"
            onClick={() => setSimulateLoadError(false)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : isLoadingSkeleton ? (
        /* Loading Skeleton view */
        <div className="space-y-4">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 animate-pulse bg-white dark:bg-slate-900">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* 2. Filter Toolbar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className={`flex items-center gap-1 p-1 rounded-xl border overflow-x-auto ${
              isDark ? 'bg-[#151821] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {(['All', 'Enabled', 'Draft', 'Disabled', 'Archived'] as const).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    statusFilter === st
                      ? 'bg-[#5A4AD2] text-white shadow-xs'
                      : isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{st === 'All' ? 'All Rules' : st}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    statusFilter === st 
                      ? 'bg-white/20 text-white' 
                      : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {statusCounts[st]}
                  </span>
                </button>
              ))}
            </div>

            {/* Search & Trigger selector */}
            <div className="flex items-center gap-2">
              {/* Trigger filter */}
              <div className="relative">
                <select
                  value={triggerFilter}
                  onChange={(e) => setTriggerFilter(e.target.value)}
                  className={`text-xs font-semibold py-2 px-3 rounded-xl border appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                    isDark ? 'bg-[#151821] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="All">All Triggers</option>
                  {AVAILABLE_TRIGGERS.map(t => (
                    <option key={t.type} value={t.type}>{t.label}</option>
                  ))}
                </select>
                <Filter className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>

              {/* Search input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rules, triggers, labels..."
                  className={`w-full text-xs py-2 pl-8 pr-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                    isDark 
                      ? 'bg-[#151821] border-slate-800 text-slate-200 placeholder-slate-500' 
                      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 3. Rules List View */}
          {filteredRules.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border-2 border-dashed ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              <Zap className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No matching rules found</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Try adjusting your search query or status filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setTriggerFilter('All');
                }}
                className="px-3.5 py-1.5 rounded-xl border text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredRules.map((rule) => {
                const isMenuOpen = openMenuId === rule.id;

                return (
                  <div
                    key={rule.id}
                    className={`p-4 rounded-2xl border transition-all hover:shadow-xs group relative ${
                      isDark ? 'bg-[#151821] border-slate-800 hover:border-slate-700' : 'bg-white border-[#E3E5E9] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Rule Identity, Trigger, Summary */}
                      <div className="flex-1 min-w-0">
                        {/* Title & Status badge */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => onSelectRule(rule)}
                            className="text-sm sm:text-base font-extrabold hover:text-[#5A4AD2] transition-colors text-left truncate"
                          >
                            {rule.name}
                          </button>

                          {/* Lifecycle status badge */}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            rule.status === 'Enabled'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : rule.status === 'Draft'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                              : rule.status === 'Disabled'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {rule.status}
                          </span>

                          <span className="text-[11px] text-slate-400 hidden sm:inline">
                            {rule.lastUpdated}
                          </span>
                        </div>

                        {/* Description */}
                        {rule.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {rule.description}
                          </p>
                        )}

                        {/* Linear Architecture Summary Badges: WHEN -> IF -> THEN */}
                        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                          {/* WHEN pill */}
                          <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                            isDark ? 'bg-[#1C202B] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}>
                            <span className="font-bold text-[10px] text-[#5A4AD2] uppercase">WHEN</span>
                            <span className="font-semibold text-[11px]">{getTriggerLabel(rule.triggerType)}</span>
                          </div>

                          {/* IF pill */}
                          <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                            isDark ? 'bg-[#1C202B] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}>
                            <span className="font-bold text-[10px] text-slate-400 uppercase">
                              IF ({rule.matchMode})
                            </span>
                            <span className="font-semibold text-[11px]">
                              {rule.conditions.length} condition{rule.conditions.length !== 1 ? 's' : ''}
                            </span>
                          </div>

                          {/* THEN pill */}
                          <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                            isDark ? 'bg-[#1C202B] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}>
                            <span className="font-bold text-[10px] text-emerald-500 uppercase">THEN</span>
                            <span className="font-semibold text-[11px]">
                              {rule.actions.length} action{rule.actions.length !== 1 ? 's' : ''}
                            </span>
                          </div>

                          {/* Inbox pill */}
                          <div className="text-[11px] text-slate-400 font-medium">
                            Inbox: <span className="font-semibold text-slate-600 dark:text-slate-300">{rule.triggerConfig.inbox}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Execution count, Quick Toggle, Context Menu */}
                      <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                        {/* Executions */}
                        <div className="text-right">
                          <span className="text-xs font-extrabold font-mono text-slate-800 dark:text-slate-200">
                            {rule.executionCount.toLocaleString()}
                          </span>
                          <span className="block text-[10px] text-slate-400">runs</span>
                        </div>

                        {/* Quick Enable/Disable Switch (if not archived) */}
                        {rule.status !== 'Archived' && (
                          <button
                            type="button"
                            disabled={isReadOnly}
                            onClick={() => handleToggleStatusQuick(rule)}
                            title={rule.status === 'Enabled' ? 'Disable rule' : 'Enable rule'}
                            className={`p-1.5 rounded-xl border transition-colors ${
                              rule.status === 'Enabled'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400'
                                : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                            } disabled:opacity-40`}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        )}

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => onSelectRule(rule)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                            isDark 
                              ? 'border-slate-700 text-slate-200 hover:bg-slate-800' 
                              : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Edit
                        </button>

                        {/* Context Menu Dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setOpenMenuId(isMenuOpen ? null : rule.id)}
                            className={`p-1.5 rounded-xl border transition-colors ${
                              isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Context Menu Items */}
                          {isMenuOpen && (
                            <div 
                              className={`absolute right-0 top-full mt-1.5 w-44 rounded-xl shadow-xl border p-1 z-30 animate-in fade-in zoom-in-95 ${
                                isDark ? 'bg-[#1C202B] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                              }`}
                              onMouseLeave={() => setOpenMenuId(null)}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectRule(rule);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Edit Rule</span>
                              </button>

                              <button
                                type="button"
                                disabled={isReadOnly}
                                onClick={() => handleDuplicate(rule)}
                                className="w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 disabled:opacity-40"
                              >
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Duplicate</span>
                              </button>

                              {rule.status === 'Enabled' && (
                                <button
                                  type="button"
                                  disabled={isReadOnly}
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setActiveDialog({ type: 'disable', rule });
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-600 flex items-center gap-2 disabled:opacity-40"
                                >
                                  <Power className="w-3.5 h-3.5" />
                                  <span>Disable</span>
                                </button>
                              )}

                              {rule.status !== 'Enabled' && rule.status !== 'Archived' && (
                                <button
                                  type="button"
                                  disabled={isReadOnly}
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setActiveDialog({ type: 'enable', rule });
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 flex items-center gap-2 disabled:opacity-40"
                                >
                                  <Zap className="w-3.5 h-3.5" />
                                  <span>Enable</span>
                                </button>
                              )}

                              {rule.status !== 'Archived' && (
                                <button
                                  type="button"
                                  disabled={isReadOnly}
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setActiveDialog({ type: 'archive', rule });
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-2 disabled:opacity-40"
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                  <span>Archive</span>
                                </button>
                              )}

                              {rule.status === 'Archived' && (
                                <>
                                  <button
                                    type="button"
                                    disabled={isReadOnly}
                                    onClick={() => handleRestore(rule, 'Draft')}
                                    className="w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 flex items-center gap-2 disabled:opacity-40"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Restore as Draft</span>
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isReadOnly}
                                    onClick={() => handleRestore(rule, 'Disabled')}
                                    className="w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 flex items-center gap-2 disabled:opacity-40"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Restore as Disabled</span>
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Confirmation Dialogs from Context Actions */}
      {activeDialog?.type === 'enable' && (
        <EnableRuleDialog
          isOpen={true}
          onClose={() => setActiveDialog(null)}
          isDark={isDark}
          ruleTitle={activeDialog.rule.name}
          isValid={true}
          validationIssues={[]}
          onConfirm={() => {
            handleConfirmEnable(activeDialog.rule);
            setActiveDialog(null);
          }}
        />
      )}

      {activeDialog?.type === 'disable' && (
        <DisableRuleDialog
          isOpen={true}
          onClose={() => setActiveDialog(null)}
          isDark={isDark}
          ruleTitle={activeDialog.rule.name}
          onConfirm={() => {
            handleConfirmDisable(activeDialog.rule);
            setActiveDialog(null);
          }}
        />
      )}

      {activeDialog?.type === 'archive' && (
        <ArchiveRuleDialog
          isOpen={true}
          onClose={() => setActiveDialog(null)}
          isDark={isDark}
          ruleTitle={activeDialog.rule.name}
          onConfirm={() => {
            handleConfirmArchive(activeDialog.rule);
            setActiveDialog(null);
          }}
        />
      )}
    </div>
  );
};
