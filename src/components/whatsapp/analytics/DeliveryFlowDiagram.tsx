import React from 'react';
import { 
  Send, 
  CheckCheck, 
  Eye, 
  MessageSquareReply, 
  ArrowRight, 
  AlertCircle, 
  ShieldAlert 
} from 'lucide-react';
import { CanonicalMetrics, CanonicalRecipientStatus } from './types';

interface DeliveryFlowDiagramProps {
  metrics: CanonicalMetrics;
  onSelectStatus?: (status: CanonicalRecipientStatus) => void;
  isDark?: boolean;
}

export const DeliveryFlowDiagram: React.FC<DeliveryFlowDiagramProps> = ({
  metrics,
  onSelectStatus,
  isDark = false
}) => {
  const deliveryRate = metrics.sent > 0 ? ((metrics.delivered / metrics.sent) * 100).toFixed(1) : '0';
  const readRate = metrics.delivered > 0 ? ((metrics.read / metrics.delivered) * 100).toFixed(1) : '0';
  const replyRate = metrics.read > 0 ? ((metrics.replied / metrics.read) * 100).toFixed(1) : '0';

  return (
    <div className={`p-4 rounded-2xl border transition-colors ${
      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#E3E5E9]'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Operational Delivery Pipeline
          </h3>
          <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Sequential progression of dispatched campaign messages from gateway to read acknowledgment
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Delivery Failure</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Pre-send Exclusion</span>
          </span>
        </div>
      </div>

      {/* Main Delivery Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 relative">
        {/* Step 1: Sent */}
        <div 
          onClick={() => onSelectStatus?.('sent')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            isDark ? 'bg-slate-800/60 border-slate-700/80 hover:border-sky-500' : 'bg-slate-50 border-slate-200 hover:border-sky-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${isDark ? 'bg-sky-950 text-sky-400' : 'bg-sky-100 text-sky-700'}`}>
                <Send className="w-3.5 h-3.5" />
              </div>
              <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Sent</span>
            </div>
            <span className={`text-xs font-extrabold ${isDark ? 'text-sky-400' : 'text-sky-700'}`}>
              {metrics.sent.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500">
            Dispatched from channel inboxes
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 w-full" />
          </div>
        </div>

        {/* Step 2: Delivered */}
        <div 
          onClick={() => onSelectStatus?.('delivered')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            isDark ? 'bg-slate-800/60 border-slate-700/80 hover:border-emerald-500' : 'bg-slate-50 border-slate-200 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${isDark ? 'bg-emerald-950 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                <CheckCheck className="w-3.5 h-3.5" />
              </div>
              <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Delivered</span>
            </div>
            <span className={`text-xs font-extrabold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              {metrics.delivered.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
            <span>Handset confirmed</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{deliveryRate}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${deliveryRate}%` }} />
          </div>
        </div>

        {/* Step 3: Read */}
        <div 
          onClick={() => onSelectStatus?.('read')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            isDark ? 'bg-slate-800/60 border-slate-700/80 hover:border-indigo-500' : 'bg-slate-50 border-slate-200 hover:border-indigo-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${isDark ? 'bg-indigo-950 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                <Eye className="w-3.5 h-3.5" />
              </div>
              <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Read</span>
            </div>
            <span className={`text-xs font-extrabold ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
              {metrics.read.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
            <span>Blue ticks acknowledged</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{readRate}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${readRate}%` }} />
          </div>
        </div>

        {/* Step 4: Replied */}
        <div 
          onClick={() => onSelectStatus?.('replied')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            isDark ? 'bg-slate-800/60 border-slate-700/80 hover:border-teal-500' : 'bg-slate-50 border-slate-200 hover:border-teal-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${isDark ? 'bg-teal-950 text-teal-400' : 'bg-teal-100 text-teal-700'}`}>
                <MessageSquareReply className="w-3.5 h-3.5" />
              </div>
              <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Replied</span>
            </div>
            <span className={`text-xs font-extrabold ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>
              {metrics.replied.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
            <span>Inbound responses</span>
            <span className="font-semibold text-teal-600 dark:text-teal-400">{replyRate}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500" style={{ width: `${replyRate}%` }} />
          </div>
        </div>
      </div>

      {/* Side Outcomes Bar */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Side Outcomes:
          </span>
          <button 
            onClick={() => onSelectStatus?.('failed')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-rose-950/40 border-rose-900/60 text-rose-300 hover:bg-rose-900/50' 
                : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span className="font-bold">{metrics.failed} Failed</span>
            <span className="text-[10px] opacity-80">(Undeliverable after send)</span>
          </button>

          <button 
            onClick={() => onSelectStatus?.('excluded')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-amber-950/40 border-amber-900/60 text-amber-300 hover:bg-amber-900/50' 
                : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold">{metrics.excluded} Excluded</span>
            <span className="text-[10px] opacity-80">(Pre-send safety / consent check)</span>
          </button>
        </div>

        <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'} italic`}>
          * Excluded candidates are filtered prior to dispatch and do not consume provider quota.
        </div>
      </div>
    </div>
  );
};
