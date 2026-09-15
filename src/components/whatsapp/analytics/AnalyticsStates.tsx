import React from 'react';
import { AlertTriangle, Lock, RefreshCw, Filter } from 'lucide-react';

export const AnalyticsLoadingSkeleton: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading analytics data">
      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className={`p-3.5 rounded-xl border h-28 ${
              isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <div className={`h-3 w-16 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
            <div className={`h-8 w-20 rounded mt-3 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
            <div className={`h-2.5 w-28 rounded mt-2 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className={`p-5 rounded-2xl border h-52 ${
        isDark ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className={`h-4 w-48 rounded mb-4 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
        <div className="h-32 flex items-end gap-3 justify-around pt-6">
          {[40, 65, 80, 50, 95, 70, 85].map((h, i) => (
            <div 
              key={i} 
              style={{ height: `${h}%` }}
              className={`w-10 rounded-t ${isDark ? 'bg-slate-700/60' : 'bg-slate-200'}`} 
            />
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className={`p-5 rounded-2xl border space-y-3 ${
        isDark ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className={`h-4 w-52 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
        <div className="space-y-2 pt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-10 rounded-lg ${isDark ? 'bg-slate-800/80' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const AnalyticsErrorState: React.FC<{ 
  onRetry: () => void; 
  isDark?: boolean;
}> = ({ onRetry, isDark = false }) => {
  return (
    <div className={`p-8 rounded-2xl border text-center my-6 ${
      isDark ? 'bg-slate-900/60 border-rose-900/50' : 'bg-white border-rose-200'
    }`}>
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        We couldn't load WhatsApp analytics.
      </h3>
      <p className={`text-xs mt-1.5 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        The analytics service encountered a transient network issue or the campaign aggregation endpoint timed out. Filter controls remain usable.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#5A4AD2] text-white hover:bg-[#4838b8] transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Retry Loading</span>
      </button>
    </div>
  );
};

export const AnalyticsPermissionState: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  return (
    <div className={`p-10 rounded-2xl border text-center my-6 ${
      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
        isDark ? 'bg-slate-800 text-amber-400' : 'bg-amber-50 text-amber-600'
      }`}>
        <Lock className="w-6 h-6" />
      </div>
      <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        You don't have permission to view WhatsApp analytics.
      </h3>
      <p className={`text-xs mt-1.5 max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Your current workspace role does not include permissions for Campaign & Recipient Performance reports. Please contact an organization administrator to request access.
      </p>
    </div>
  );
};

export const AnalyticsEmptyState: React.FC<{ 
  onResetFilters: () => void; 
  isDark?: boolean;
}> = ({ onResetFilters, isDark = false }) => {
  return (
    <div className={`p-10 rounded-2xl border text-center my-6 ${
      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
        isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
      }`}>
        <Filter className="w-6 h-6" />
      </div>
      <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        No analytics data for this selection.
      </h3>
      <p className={`text-xs mt-1.5 max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Try another campaign, inbox, or date range to inspect recipient performance records.
      </p>
      <button
        type="button"
        onClick={onResetFilters}
        className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-[#5A4AD2] text-white hover:bg-[#4838b8] transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
};
