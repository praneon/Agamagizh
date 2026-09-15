import React, { useState } from 'react';
import { DailyOutcomeDataPoint } from './types';

interface RecipientOutcomesChartProps {
  data: DailyOutcomeDataPoint[];
  isDark?: boolean;
}

export const RecipientOutcomesChart: React.FC<RecipientOutcomesChartProps> = ({
  data,
  isDark = false
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(data.length - 1);

  if (!data || data.length === 0) return null;

  // Compute maximum sent value for SVG scaling
  const maxVal = Math.max(...data.map(d => d.sent), 100);

  // Palette matching canonical accents
  const seriesConfig = [
    { key: 'sent' as const, label: 'Sent', color: '#0284c7', darkColor: '#38bdf8' },
    { key: 'delivered' as const, label: 'Delivered', color: '#059669', darkColor: '#34d399' },
    { key: 'read' as const, label: 'Read', color: '#6366f1', darkColor: '#818cf8' },
    { key: 'replied' as const, label: 'Replied', color: '#0d9488', darkColor: '#2dd4bf' },
    { key: 'failed' as const, label: 'Failed', color: '#e11d48', darkColor: '#fb7185' }
  ];

  const activePoint = activeIdx !== null ? data[activeIdx] : data[data.length - 1];

  return (
    <div className={`p-4 rounded-2xl border transition-colors ${
      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#E3E5E9]'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Recipient Outcomes Over Time
          </h3>
          <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Daily progression across canonical statuses throughout the active date window
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {seriesConfig.map(s => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: isDark ? s.darkColor : s.color }} 
              />
              <span className={`text-[11px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Bar Chart Representation */}
      <div className="pt-2">
        <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-200 dark:border-slate-800">
          {data.map((item, idx) => {
            const isHovered = activeIdx === idx;
            const sentHeightPercent = Math.max((item.sent / maxVal) * 100, 4);
            const deliveredHeightPercent = Math.max((item.delivered / maxVal) * 100, 3);
            const readHeightPercent = Math.max((item.read / maxVal) * 100, 2);
            const repliedHeightPercent = Math.max((item.replied / maxVal) * 100, 1.5);
            const failedHeightPercent = Math.max((item.failed / maxVal) * 100, 1.5);

            return (
              <div 
                key={item.date} 
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx(idx)}
              >
                {/* Visual Bars Container */}
                <div className="w-full flex items-end justify-center gap-1 h-36 px-0.5 relative">
                  {/* Sent Bar */}
                  <div 
                    style={{ height: `${sentHeightPercent}%` }}
                    className={`w-2 sm:w-3 rounded-t-sm transition-all ${
                      isDark ? 'bg-sky-500/80 group-hover:bg-sky-400' : 'bg-sky-500 group-hover:bg-sky-600'
                    }`}
                  />
                  {/* Delivered Bar */}
                  <div 
                    style={{ height: `${deliveredHeightPercent}%` }}
                    className={`w-2 sm:w-3 rounded-t-sm transition-all ${
                      isDark ? 'bg-emerald-500/80 group-hover:bg-emerald-400' : 'bg-emerald-500 group-hover:bg-emerald-600'
                    }`}
                  />
                  {/* Read Bar */}
                  <div 
                    style={{ height: `${readHeightPercent}%` }}
                    className={`w-2 sm:w-3 rounded-t-sm transition-all ${
                      isDark ? 'bg-indigo-500/80 group-hover:bg-indigo-400' : 'bg-indigo-500 group-hover:bg-indigo-600'
                    }`}
                  />
                  {/* Replied Bar */}
                  <div 
                    style={{ height: `${repliedHeightPercent}%` }}
                    className={`w-1.5 sm:w-2.5 rounded-t-sm transition-all ${
                      isDark ? 'bg-teal-500/80 group-hover:bg-teal-400' : 'bg-teal-500 group-hover:bg-teal-600'
                    }`}
                  />
                  {/* Failed Bar */}
                  <div 
                    style={{ height: `${failedHeightPercent}%` }}
                    className={`w-1.5 sm:w-2 rounded-t-sm transition-all ${
                      isDark ? 'bg-rose-500/80 group-hover:bg-rose-400' : 'bg-rose-500 group-hover:bg-rose-600'
                    }`}
                  />
                </div>

                {/* X-axis date */}
                <div className={`mt-2 text-[10px] font-semibold tracking-tight transition-colors ${
                  isHovered 
                    ? isDark ? 'text-violet-300 font-bold' : 'text-[#5A4AD2] font-bold' 
                    : isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {item.displayDate}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Data Point Inspector Strip */}
        {activePoint && (
          <div className={`mt-3 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'bg-slate-800/80 border border-slate-700/80' : 'bg-slate-50 border border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {activePoint.displayDate} Summary:
              </span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                ({activePoint.date})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <span className="text-sky-600 dark:text-sky-400">
                Sent: <span className="font-bold">{activePoint.sent}</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">
                Delivered: <span className="font-bold">{activePoint.delivered}</span>
              </span>
              <span className="text-indigo-600 dark:text-indigo-400">
                Read: <span className="font-bold">{activePoint.read}</span>
              </span>
              <span className="text-teal-600 dark:text-teal-400">
                Replied: <span className="font-bold">{activePoint.replied}</span>
              </span>
              <span className="text-rose-600 dark:text-rose-400">
                Failed: <span className="font-bold">{activePoint.failed}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
