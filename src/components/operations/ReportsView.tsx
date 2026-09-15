import React, { useState } from 'react';
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Calendar, 
  Download,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { OPERATIONAL_ANALYTICS_DATA, AGENTS_LIST } from '../../data/mockData';

export const ReportsView: React.FC = () => {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');

  const channelStats = [
    { name: 'WhatsApp Official', count: 18420, percent: '76%', color: 'bg-emerald-500' },
    { name: 'Live Chat Website', count: 3240, percent: '14%', color: 'bg-blue-500' },
    { name: 'Direct Email', count: 1610, percent: '7%', color: 'bg-[#5A4AD2]' },
    { name: 'SMS Notifications', count: 720, percent: '3%', color: 'bg-amber-500' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Operational Reports & CSAT</h1>
          <p className="text-xs text-[#6E737F]">
            Communication SLA metrics, resolution velocity, and team performance indicators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range picker */}
          <div className="bg-white border border-[#E3E5E9] rounded-xl p-1 flex items-center gap-1 text-xs font-semibold shadow-2xs">
            {(['7d', '30d', '90d'] as const).map((rng) => (
              <button
                key={rng}
                onClick={() => setDateRange(rng)}
                className={`px-3 py-1 rounded-lg uppercase ${
                  dateRange === rng ? 'bg-[#5A4AD2] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {rng}
              </button>
            ))}
          </div>

          <button className="px-3 py-1.5 bg-white border border-[#E3E5E9] text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">First Response Time</span>
            <Clock className="w-4 h-4 text-[#5A4AD2]" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{OPERATIONAL_ANALYTICS_DATA.firstResponseTime}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>22% faster than last week</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg. Resolution Time</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{OPERATIONAL_ANALYTICS_DATA.averageResponseTime}</div>
          <div className="text-[11px] text-slate-500 font-medium">Target: under 20m</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Customer CSAT Score</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{OPERATIONAL_ANALYTICS_DATA.csatScore}</div>
          <div className="text-[11px] text-amber-700 font-semibold">⭐⭐⭐⭐⭐ from 480 ratings</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Conversations</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">23,990</div>
          <div className="text-[11px] text-emerald-700 font-semibold">+14% month-over-month</div>
        </div>
      </div>

      {/* Inbound Volume Chart & Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Daily volume bar visualization */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Inbound Conversation Volume</h3>
              <p className="text-xs text-slate-500">Distribution over the selected period</p>
            </div>
            <span className="text-xs font-semibold text-[#5A4AD2] bg-[#EEECFB] px-2.5 py-1 rounded-lg">
              98.4% SLA Compliance
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-100">
            {[
              { day: 'Mon', height: '65%', val: 410 },
              { day: 'Tue', height: '78%', val: 490 },
              { day: 'Wed', height: '90%', val: 560 },
              { day: 'Thu', height: '85%', val: 530 },
              { day: 'Fri', height: '95%', val: 620 },
              { day: 'Sat', height: '100%', val: 680 },
              { day: 'Sun', height: '50%', val: 320 },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {col.val}
                </span>
                <div
                  style={{ height: col.height }}
                  className="w-full bg-[#EEECFB] group-hover:bg-[#5A4AD2] rounded-t-lg transition-colors cursor-pointer"
                />
                <span className="text-[11px] font-semibold text-slate-600">{col.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Channel Share</h3>
          <div className="space-y-3 pt-2">
            {channelStats.map((ch, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{ch.name}</span>
                  <span className="text-slate-500">{ch.percent} ({ch.count.toLocaleString()})</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${ch.color}`} style={{ width: ch.percent }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Performance Leaderboard */}
      <div className="bg-white rounded-2xl border border-[#E3E5E9] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E3E5E9] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Agent Performance & Roster</h3>
            <p className="text-xs text-slate-500">Individual workload, response speeds, and resolved tickets</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-[#6E737F] font-bold border-b border-[#E3E5E9] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Agent Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Active Inboxes</th>
                <th className="py-3 px-4">Avg. Response Time</th>
                <th className="py-3 px-4 text-right">CSAT Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {AGENTS_LIST.map((ag) => (
                <tr key={ag.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#5A4AD2] text-white flex items-center justify-center font-bold text-xs">
                      {ag.avatar}
                    </div>
                    <span>{ag.name}</span>
                  </td>
                  <td className="py-3 px-4 capitalize">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ag.status === 'online' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${ag.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {ag.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{ag.role}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{ag.assignedInboxCount} chats</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">4m 12s</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-700">96.4%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
