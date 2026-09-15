import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Sun, 
  Moon, 
  Shield, 
  Lock, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Download,
  Share2,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import { 
  CanonicalRecipientStatus, 
  DateRangePreset, 
  RecipientLedgerItem,
  CanonicalMetrics 
} from './analytics/types';
import { 
  MOCK_CAMPAIGNS, 
  MOCK_INBOXES, 
  MOCK_GLOBAL_METRICS, 
  MOCK_CAMPAIGN_BREAKDOWNS, 
  MOCK_DAILY_OUTCOMES, 
  MOCK_RECIPIENT_LEDGER 
} from './analytics/analyticsMockData';
import { MetricsOverviewCards } from './analytics/MetricsOverviewCards';
import { DeliveryFlowDiagram } from './analytics/DeliveryFlowDiagram';
import { RecipientOutcomesChart } from './analytics/RecipientOutcomesChart';
import { CampaignBreakdownTable } from './analytics/CampaignBreakdownTable';
import { RecipientLedgerTable } from './analytics/RecipientLedgerTable';
import { RecipientDetailDrawer } from './analytics/RecipientDetailDrawer';
import { AnalyticsFilterBar } from './analytics/AnalyticsFilterBar';
import { 
  AnalyticsLoadingSkeleton, 
  AnalyticsErrorState, 
  AnalyticsPermissionState, 
  AnalyticsEmptyState 
} from './analytics/AnalyticsStates';

interface WhatsAppAnalyticsViewProps {
  onSelectConvo?: (convoId: string) => void;
  onOpenContact?: (contact: { id: string; name: string; phone: string }) => void;
}

export const WhatsAppAnalyticsView: React.FC<WhatsAppAnalyticsViewProps> = ({
  onSelectConvo,
  onOpenContact
}) => {
  // Filter States
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all');
  const [selectedInbox, setSelectedInbox] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRangePreset>('last_30_days');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-08-15');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-09-14');
  
  // Interactive Metric / Status Filter
  const [selectedStatus, setSelectedStatus] = useState<CanonicalRecipientStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Recipient for Detail Drawer
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientLedgerItem | null>(null);

  // Prototype Evaluation Toggles (Theme, Permission, Loading, Error Simulation)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLoadError, setHasLoadError] = useState<boolean>(false);

  const isDark = theme === 'dark';

  // Compute Aggregated Metrics based on active Campaign & Inbox filters
  const currentMetrics: CanonicalMetrics = useMemo(() => {
    if (selectedCampaignId !== 'all') {
      const matched = MOCK_CAMPAIGN_BREAKDOWNS.find(c => c.campaignId === selectedCampaignId);
      if (matched) return matched.metrics;
    }

    if (selectedInbox !== 'all') {
      const inboxCampaigns = MOCK_CAMPAIGN_BREAKDOWNS.filter(c => c.inbox === selectedInbox);
      if (inboxCampaigns.length > 0) {
        return inboxCampaigns.reduce(
          (acc, c) => ({
            sent: acc.sent + c.metrics.sent,
            delivered: acc.delivered + c.metrics.delivered,
            read: acc.read + c.metrics.read,
            replied: acc.replied + c.metrics.replied,
            failed: acc.failed + c.metrics.failed,
            excluded: acc.excluded + c.metrics.excluded
          }),
          { sent: 0, delivered: 0, read: 0, replied: 0, failed: 0, excluded: 0 }
        );
      }
    }

    return MOCK_GLOBAL_METRICS;
  }, [selectedCampaignId, selectedInbox]);

  // Filter Recipient Ledger items
  const filteredRecipients = useMemo(() => {
    return MOCK_RECIPIENT_LEDGER.filter(item => {
      // Campaign filter
      if (selectedCampaignId !== 'all' && item.campaignId !== selectedCampaignId) {
        return false;
      }
      // Inbox filter
      if (selectedInbox !== 'all' && item.inbox !== selectedInbox) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.contactName.toLowerCase().includes(q);
        const matchesPhone = item.destination.toLowerCase().includes(q);
        const matchesCampaign = item.campaignName.toLowerCase().includes(q);
        const matchesReason = item.reason ? item.reason.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesPhone && !matchesCampaign && !matchesReason) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCampaignId, selectedInbox, selectedStatus, searchQuery]);

  // Handlers
  const handleResetAllFilters = () => {
    setSelectedCampaignId('all');
    setSelectedInbox('all');
    setDateRange('last_30_days');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  const handleSelectStatusFromMetric = (status: CanonicalRecipientStatus | 'all') => {
    setSelectedStatus(prev => prev === status ? 'all' : status);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasLoadError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className={`min-h-full transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F4F5F7] text-slate-900'
    }`}>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight">
                WhatsApp Analytics
              </h1>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                isDark ? 'bg-violet-900/60 text-violet-300' : 'bg-violet-100 text-[#5A4AD2]'
              }`}>
                Canonical Delivery Data
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Campaign and recipient delivery performance
            </p>
          </div>

          {/* Prototype Testing Controls */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-colors ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
              <span className="font-semibold">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {/* Permission Toggle */}
            <button
              type="button"
              onClick={() => setHasPermission(prev => !prev)}
              title="Toggle view permissions"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-colors ${
                hasPermission
                  ? isDark ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-white border-slate-200 text-emerald-700'
                  : 'bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300'
              }`}
            >
              {hasPermission ? <Shield className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span className="font-semibold">{hasPermission ? 'Full Access' : 'No Permission'}</span>
            </button>

            {/* Simulated Error Toggle */}
            <button
              type="button"
              onClick={() => setHasLoadError(prev => !prev)}
              title="Simulate API Load Error"
              className={`px-2 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${
                hasLoadError
                  ? 'bg-rose-600 text-white border-rose-600'
                  : isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              Error Test
            </button>

            {/* Simulated Loading Skeleton Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1200);
              }}
              title="Simulate Loading Skeleton"
              className={`px-2 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              Loading Test
            </button>
          </div>
        </div>

        {/* Permission State Barrier */}
        {!hasPermission ? (
          <AnalyticsPermissionState isDark={isDark} />
        ) : hasLoadError ? (
          <div className="space-y-4">
            <AnalyticsFilterBar
              campaigns={MOCK_CAMPAIGNS}
              inboxes={MOCK_INBOXES}
              selectedCampaignId={selectedCampaignId}
              onSelectCampaign={setSelectedCampaignId}
              selectedInbox={selectedInbox}
              onSelectInbox={setSelectedInbox}
              dateRange={dateRange}
              onSelectDateRange={setDateRange}
              customStartDate={customStartDate}
              onCustomStartDateChange={setCustomStartDate}
              customEndDate={customEndDate}
              onCustomEndDateChange={setCustomEndDate}
              onResetAllFilters={handleResetAllFilters}
              onRefresh={handleRetry}
              isDark={isDark}
            />
            <AnalyticsErrorState onRetry={handleRetry} isDark={isDark} />
          </div>
        ) : (
          <>
            {/* Primary Filter Bar */}
            <AnalyticsFilterBar
              campaigns={MOCK_CAMPAIGNS}
              inboxes={MOCK_INBOXES}
              selectedCampaignId={selectedCampaignId}
              onSelectCampaign={setSelectedCampaignId}
              selectedInbox={selectedInbox}
              onSelectInbox={setSelectedInbox}
              dateRange={dateRange}
              onSelectDateRange={setDateRange}
              customStartDate={customStartDate}
              onCustomStartDateChange={setCustomStartDate}
              customEndDate={customEndDate}
              onCustomEndDateChange={setCustomEndDate}
              onResetAllFilters={handleResetAllFilters}
              onRefresh={handleRetry}
              isDark={isDark}
            />

            {isLoading ? (
              <AnalyticsLoadingSkeleton isDark={isDark} />
            ) : currentMetrics.sent === 0 && currentMetrics.excluded === 0 ? (
              <AnalyticsEmptyState onResetFilters={handleResetAllFilters} isDark={isDark} />
            ) : (
              <div className="space-y-6">
                {/* Active Filter Notification Ribbon if filtered */}
                {selectedStatus !== 'all' && (
                  <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                    isDark ? 'bg-violet-950/40 border-violet-900/60 text-violet-200' : 'bg-violet-50 border-violet-200 text-[#5A4AD2]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase tracking-wide">
                        Filtered View:
                      </span>
                      <span>
                        Showing {filteredRecipients.length} recipients with status{' '}
                        <strong className="capitalize underline">{selectedStatus}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedStatus('all')}
                      className={`text-xs font-bold px-2.5 py-1 rounded transition-colors ${
                        isDark ? 'bg-violet-900/60 hover:bg-violet-900' : 'bg-violet-200/80 hover:bg-violet-200 text-[#5A4AD2]'
                      }`}
                    >
                      Show All Recipients
                    </button>
                  </div>
                )}

                {/* Canonical Operational Metrics Cards (Interactive drilldown) */}
                <MetricsOverviewCards
                  metrics={currentMetrics}
                  selectedStatus={selectedStatus}
                  onSelectStatus={handleSelectStatusFromMetric}
                  isDark={isDark}
                />

                {/* Restrained Operational Delivery Pipeline Flow */}
                <DeliveryFlowDiagram
                  metrics={currentMetrics}
                  onSelectStatus={handleSelectStatusFromMetric}
                  isDark={isDark}
                />

                {/* Grid: Trend Visualization + Campaign Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recipient Outcomes Over Time Chart */}
                  <RecipientOutcomesChart
                    data={MOCK_DAILY_OUTCOMES}
                    isDark={isDark}
                  />

                  {/* Campaign Breakdown Table */}
                  <CampaignBreakdownTable
                    campaigns={MOCK_CAMPAIGN_BREAKDOWNS}
                    selectedCampaignId={selectedCampaignId}
                    onSelectCampaign={setSelectedCampaignId}
                    isDark={isDark}
                  />
                </div>

                {/* Recipient Ledger (Core Ledger Table + Mobile Cards) */}
                <RecipientLedgerTable
                  recipients={filteredRecipients}
                  selectedStatus={selectedStatus}
                  onSelectStatus={setSelectedStatus}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onViewDetails={setSelectedRecipient}
                  onClearFilters={handleResetAllFilters}
                  isDark={isDark}
                />
              </div>
            )}
          </>
        )}

        {/* Recipient Detail Drawer */}
        <RecipientDetailDrawer
          recipient={selectedRecipient}
          onClose={() => setSelectedRecipient(null)}
          onOpenConversation={(convoId) => {
            setSelectedRecipient(null);
            onSelectConvo?.(convoId);
          }}
          onOpenContact={(contactId, name, phone) => {
            setSelectedRecipient(null);
            onOpenContact?.({ id: contactId, name, phone });
          }}
          isDark={isDark}
        />
      </div>
    </div>
  );
};
