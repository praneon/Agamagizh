import React from 'react';
import { Filter, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { CampaignBreakdownRow } from './types';

interface CampaignBreakdownTableProps {
  campaigns: CampaignBreakdownRow[];
  selectedCampaignId: string;
  onSelectCampaign: (campaignId: string) => void;
  isDark?: boolean;
}

export const CampaignBreakdownTable: React.FC<CampaignBreakdownTableProps> = ({
  campaigns,
  selectedCampaignId,
  onSelectCampaign,
  isDark = false
}) => {
  return (
    <div className={`rounded-2xl border overflow-hidden transition-colors ${
      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#E3E5E9]'
    }`}>
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Campaign Performance Breakdown
          </h3>
          <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Aggregate recipient progression across active and completed broadcasts (click to isolate campaign)
          </p>
        </div>

        {selectedCampaignId !== 'all' && (
          <button
            onClick={() => onSelectCampaign('all')}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-violet-300 hover:bg-slate-700' 
                : 'bg-violet-50 border-violet-200 text-[#5A4AD2] hover:bg-violet-100'
            }`}
          >
            Show All Campaigns
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
              isDark ? 'bg-slate-800/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <th className="py-3 px-4">Campaign</th>
              <th className="py-3 px-3">Inbox</th>
              <th className="py-3 px-3 text-right">Sent</th>
              <th className="py-3 px-3 text-right">Delivered</th>
              <th className="py-3 px-3 text-right">Read</th>
              <th className="py-3 px-3 text-right">Replied</th>
              <th className="py-3 px-3 text-right">Failed</th>
              <th className="py-3 px-3 text-right">Excluded</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
            {campaigns.map(camp => {
              const isSelected = selectedCampaignId === camp.campaignId;

              return (
                <tr 
                  key={camp.campaignId}
                  onClick={() => onSelectCampaign(isSelected ? 'all' : camp.campaignId)}
                  className={`transition-colors cursor-pointer ${
                    isSelected 
                      ? isDark ? 'bg-violet-950/30' : 'bg-violet-50/70'
                      : isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className={isSelected ? 'text-[#5A4AD2] font-bold' : isDark ? 'text-slate-200' : 'text-slate-900'}>
                        {camp.campaignName}
                      </span>
                      {isSelected && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isDark ? 'bg-violet-900/60 text-violet-200' : 'bg-violet-100 text-[#5A4AD2]'
                        }`}>
                          Filtered
                        </span>
                      )}
                    </div>
                    <div className={`text-[11px] font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {camp.scheduledAt}
                    </div>
                  </td>

                  <td className={`py-3 px-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="truncate max-w-[140px] block text-[11px]">
                      {camp.inbox}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-semibold text-sky-600 dark:text-sky-400">
                    {camp.metrics.sent.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    {camp.metrics.delivered.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-right font-semibold text-indigo-600 dark:text-indigo-400">
                    {camp.metrics.read.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-right font-semibold text-teal-600 dark:text-teal-400">
                    {camp.metrics.replied.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-right font-semibold text-rose-600 dark:text-rose-400">
                    {camp.metrics.failed > 0 ? camp.metrics.failed.toLocaleString() : '0'}
                  </td>

                  <td className="py-3 px-3 text-right font-semibold text-amber-600 dark:text-amber-400">
                    {camp.metrics.excluded > 0 ? camp.metrics.excluded.toLocaleString() : '0'}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCampaign(isSelected ? 'all' : camp.campaignId);
                      }}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded transition-colors ${
                        isSelected
                          ? isDark ? 'bg-violet-800 text-white' : 'bg-[#5A4AD2] text-white'
                          : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Filter className="w-3 h-3" />
                      <span>{isSelected ? 'Reset' : 'Filter'}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
