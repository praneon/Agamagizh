import React from 'react';
import { 
  Send, 
  CheckCheck, 
  Eye, 
  MessageSquareReply, 
  AlertCircle, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { CanonicalMetrics, CanonicalRecipientStatus } from './types';

interface MetricsOverviewCardsProps {
  metrics: CanonicalMetrics;
  selectedStatus?: CanonicalRecipientStatus | 'all';
  onSelectStatus: (status: CanonicalRecipientStatus | 'all') => void;
  isDark?: boolean;
}

export const MetricsOverviewCards: React.FC<MetricsOverviewCardsProps> = ({
  metrics,
  selectedStatus,
  onSelectStatus,
  isDark = false
}) => {
  const cards = [
    {
      id: 'sent' as CanonicalRecipientStatus,
      label: 'SENT',
      value: metrics.sent,
      description: 'Dispatched through Meta Cloud API',
      icon: Send,
      accent: 'blue',
      bgColor: isDark ? 'bg-sky-950/30 border-sky-800/60' : 'bg-sky-50/70 border-sky-200',
      activeRing: isDark ? 'ring-2 ring-sky-400 bg-sky-950/60 border-sky-400' : 'ring-2 ring-sky-500 bg-sky-50 border-sky-400 shadow-xs',
      textColor: isDark ? 'text-sky-300' : 'text-sky-900',
      iconColor: isDark ? 'text-sky-400' : 'text-sky-600',
      pillBg: isDark ? 'bg-sky-900/60 text-sky-200' : 'bg-sky-100 text-sky-800',
      percentage: '100% of dispatched'
    },
    {
      id: 'delivered' as CanonicalRecipientStatus,
      label: 'DELIVERED',
      value: metrics.delivered,
      description: 'Confirmed handset delivery',
      icon: CheckCheck,
      accent: 'teal',
      bgColor: isDark ? 'bg-emerald-950/30 border-emerald-800/60' : 'bg-emerald-50/70 border-emerald-200',
      activeRing: isDark ? 'ring-2 ring-emerald-400 bg-emerald-950/60 border-emerald-400' : 'ring-2 ring-emerald-500 bg-emerald-50 border-emerald-400 shadow-xs',
      textColor: isDark ? 'text-emerald-300' : 'text-emerald-900',
      iconColor: isDark ? 'text-emerald-400' : 'text-emerald-600',
      pillBg: isDark ? 'bg-emerald-900/60 text-emerald-200' : 'bg-emerald-100 text-emerald-800',
      percentage: metrics.sent > 0 ? `${((metrics.delivered / metrics.sent) * 100).toFixed(1)}% delivery rate` : '0%'
    },
    {
      id: 'read' as CanonicalRecipientStatus,
      label: 'READ',
      value: metrics.read,
      description: 'Blue tick receipt verified',
      icon: Eye,
      accent: 'violet',
      bgColor: isDark ? 'bg-indigo-950/30 border-indigo-800/60' : 'bg-indigo-50/70 border-indigo-200',
      activeRing: isDark ? 'ring-2 ring-indigo-400 bg-indigo-950/60 border-indigo-400' : 'ring-2 ring-indigo-500 bg-indigo-50 border-indigo-400 shadow-xs',
      textColor: isDark ? 'text-indigo-300' : 'text-indigo-900',
      iconColor: isDark ? 'text-indigo-400' : 'text-indigo-600',
      pillBg: isDark ? 'bg-indigo-900/60 text-indigo-200' : 'bg-indigo-100 text-indigo-800',
      percentage: metrics.delivered > 0 ? `${((metrics.read / metrics.delivered) * 100).toFixed(1)}% of delivered` : '0%'
    },
    {
      id: 'replied' as CanonicalRecipientStatus,
      label: 'REPLIED',
      value: metrics.replied,
      description: 'Direct inbound messages',
      icon: MessageSquareReply,
      accent: 'green',
      bgColor: isDark ? 'bg-teal-950/30 border-teal-800/60' : 'bg-teal-50/70 border-teal-200',
      activeRing: isDark ? 'ring-2 ring-teal-400 bg-teal-950/60 border-teal-400' : 'ring-2 ring-teal-500 bg-teal-50 border-teal-400 shadow-xs',
      textColor: isDark ? 'text-teal-300' : 'text-teal-900',
      iconColor: isDark ? 'text-teal-400' : 'text-teal-600',
      pillBg: isDark ? 'bg-teal-900/60 text-teal-200' : 'bg-teal-100 text-teal-800',
      percentage: metrics.read > 0 ? `${((metrics.replied / metrics.read) * 100).toFixed(1)}% of read` : '0%'
    },
    {
      id: 'failed' as CanonicalRecipientStatus,
      label: 'FAILED',
      value: metrics.failed,
      description: 'Entered dispatch but failed',
      icon: AlertCircle,
      accent: 'coral',
      bgColor: isDark ? 'bg-rose-950/30 border-rose-800/60' : 'bg-rose-50/70 border-rose-200',
      activeRing: isDark ? 'ring-2 ring-rose-400 bg-rose-950/60 border-rose-400' : 'ring-2 ring-rose-500 bg-rose-50 border-rose-400 shadow-xs',
      textColor: isDark ? 'text-rose-300' : 'text-rose-900',
      iconColor: isDark ? 'text-rose-400' : 'text-rose-600',
      pillBg: isDark ? 'bg-rose-900/60 text-rose-200' : 'bg-rose-100 text-rose-800',
      percentage: metrics.sent > 0 ? `${((metrics.failed / metrics.sent) * 100).toFixed(1)}% failure rate` : '0%'
    },
    {
      id: 'excluded' as CanonicalRecipientStatus,
      label: 'EXCLUDED',
      value: metrics.excluded,
      description: 'Pre-send safety / consent exclusion',
      icon: ShieldAlert,
      accent: 'amber',
      bgColor: isDark ? 'bg-amber-950/30 border-amber-800/60' : 'bg-amber-50/70 border-amber-200',
      activeRing: isDark ? 'ring-2 ring-amber-400 bg-amber-950/60 border-amber-400' : 'ring-2 ring-amber-500 bg-amber-50 border-amber-400 shadow-xs',
      textColor: isDark ? 'text-amber-300' : 'text-amber-900',
      iconColor: isDark ? 'text-amber-400' : 'text-amber-600',
      pillBg: isDark ? 'bg-amber-900/60 text-amber-200' : 'bg-amber-100 text-amber-800',
      percentage: 'Preflight safety check'
    }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Campaign Performance Metrics
          </span>
          <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            (Select any card to drill into recipients)
          </span>
        </div>
        {selectedStatus && selectedStatus !== 'all' && (
          <button
            onClick={() => onSelectStatus('all')}
            className={`text-xs font-semibold px-2 py-0.5 rounded transition-colors ${
              isDark 
                ? 'bg-slate-800 text-violet-300 hover:bg-slate-700' 
                : 'bg-violet-50 text-[#5A4AD2] hover:bg-violet-100'
            }`}
          >
            Clear status filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map(card => {
          const isSelected = selectedStatus === card.id;
          const Icon = card.icon;

          return (
            <button
              key={card.id}
              onClick={() => onSelectStatus(isSelected ? 'all' : card.id)}
              aria-pressed={isSelected}
              className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5A4AD2] ${
                isSelected ? card.activeRing : `${card.bgColor} hover:border-slate-400`
              }`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-[11px] font-bold tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {card.label}
                </span>
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-slate-800/80' : 'bg-white/80'} shadow-2xs`}>
                  <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
                </div>
              </div>

              <div className="mt-2 flex items-baseline gap-1.5">
                <span className={`text-2xl font-black tracking-tight ${card.textColor}`}>
                  {card.value.toLocaleString()}
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className={`font-medium ${card.iconColor} truncate`}>
                  {card.percentage}
                </span>
                {isSelected && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${card.pillBg}`}>
                    Active
                  </span>
                )}
              </div>

              {/* Subtitle / definition tooltip hint */}
              <p className={`text-[10px] mt-1.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {card.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
