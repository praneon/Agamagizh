import React, { useState } from 'react';
import { Calendar, Filter, ChevronDown, Check, X, RefreshCw } from 'lucide-react';
import { DateRangePreset, CampaignOption } from './types';

interface AnalyticsFilterBarProps {
  campaigns: CampaignOption[];
  inboxes: string[];
  selectedCampaignId: string;
  onSelectCampaign: (id: string) => void;
  selectedInbox: string;
  onSelectInbox: (inbox: string) => void;
  dateRange: DateRangePreset;
  onSelectDateRange: (preset: DateRangePreset) => void;
  customStartDate: string;
  onCustomStartDateChange: (val: string) => void;
  customEndDate: string;
  onCustomEndDateChange: (val: string) => void;
  onResetAllFilters: () => void;
  onRefresh?: () => void;
  isDark?: boolean;
}

export const AnalyticsFilterBar: React.FC<AnalyticsFilterBarProps> = ({
  campaigns,
  inboxes,
  selectedCampaignId,
  onSelectCampaign,
  selectedInbox,
  onSelectInbox,
  dateRange,
  onSelectDateRange,
  customStartDate,
  onCustomStartDateChange,
  customEndDate,
  onCustomEndDateChange,
  onResetAllFilters,
  onRefresh,
  isDark = false
}) => {
  const [showMobileFilterSheet, setShowMobileFilterSheet] = useState(false);

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'today':
        return 'Today (14 Sep 2026)';
      case 'last_7_days':
        return 'Last 7 Days (08 Sep – 14 Sep 2026)';
      case 'last_30_days':
        return 'Last 30 Days (15 Aug – 14 Sep 2026)';
      case 'custom':
        return `${customStartDate || 'Start'} to ${customEndDate || 'End'}`;
      default:
        return 'Last 30 Days';
    }
  };

  const hasActiveCustomFilters = selectedCampaignId !== 'all' || selectedInbox !== 'all' || dateRange !== 'last_30_days';

  return (
    <div className={`p-3.5 sm:p-4 rounded-2xl border transition-colors ${
      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#E3E5E9]'
    }`}>
      {/* Desktop Filter Row */}
      <div className="hidden lg:flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Campaign Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-campaign" className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Campaign:
            </label>
            <select
              id="filter-campaign"
              value={selectedCampaignId}
              onChange={e => onSelectCampaign(e.target.value)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-200' 
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="all">All Campaigns</option>
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Inbox Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-inbox" className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Inbox:
            </label>
            <select
              id="filter-inbox"
              value={selectedInbox}
              onChange={e => onSelectInbox(e.target.value)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-200' 
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="all">All Inboxes</option>
              {inboxes.map(inbox => (
                <option key={inbox} value={inbox}>{inbox}</option>
              ))}
            </select>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-daterange" className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Date Range:
            </label>
            <select
              id="filter-daterange"
              value={dateRange}
              onChange={e => onSelectDateRange(e.target.value as DateRangePreset)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-200' 
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="today">Today</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Inputs if Custom Selected */}
          {dateRange === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={e => onCustomStartDateChange(e.target.value)}
                className={`text-xs px-2.5 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={e => onCustomEndDateChange(e.target.value)}
                className={`text-xs px-2.5 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
          )}
        </div>

        {/* Right side: Active date badge & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#5A4AD2]" />
            <span>{getDateRangeLabel()}</span>
          </div>

          {hasActiveCustomFilters && (
            <button
              type="button"
              onClick={onResetAllFilters}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                isDark 
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Reset Filters
            </button>
          )}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              title="Refresh operational data"
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark 
                  ? 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200' 
                  : 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile / Tablet Filter Controls (~390x844 responsive) */}
      <div className="lg:hidden space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#5A4AD2]" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[210px]">
              {getDateRangeLabel()}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {hasActiveCustomFilters && (
              <button
                type="button"
                onClick={onResetAllFilters}
                className="text-[11px] font-bold text-[#5A4AD2] dark:text-violet-300 px-2 py-1 rounded hover:bg-violet-50 dark:hover:bg-slate-800"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowMobileFilterSheet(!showMobileFilterSheet)}
              className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                showMobileFilterSheet
                  ? 'bg-[#5A4AD2] text-white border-[#5A4AD2]'
                  : isDark 
                    ? 'bg-slate-800 border-slate-700 text-slate-200' 
                    : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveCustomFilters && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Mobile Filters Sheet */}
        {showMobileFilterSheet && (
          <div className={`pt-3 border-t space-y-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Campaign
              </label>
              <select
                value={selectedCampaignId}
                onChange={e => onSelectCampaign(e.target.value)}
                className={`w-full text-xs font-medium p-2 rounded-xl border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="all">All Campaigns</option>
                {campaigns.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Inbox
              </label>
              <select
                value={selectedInbox}
                onChange={e => onSelectInbox(e.target.value)}
                className={`w-full text-xs font-medium p-2 rounded-xl border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="all">All Inboxes</option>
                {inboxes.map(inbox => (
                  <option key={inbox} value={inbox}>{inbox}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={e => onSelectDateRange(e.target.value as DateRangePreset)}
                className={`w-full text-xs font-medium p-2 rounded-xl border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="today">Today</option>
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={e => onCustomStartDateChange(e.target.value)}
                  className={`text-xs p-2 rounded-xl border ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
                <input
                  type="date"
                  value={customEndDate}
                  onChange={e => onCustomEndDateChange(e.target.value)}
                  className={`text-xs p-2 rounded-xl border ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
