import React from 'react';
import { 
  BadgeCheck, 
  Send, 
  CheckCheck, 
  Eye, 
  MessageSquareReply, 
  AlertCircle, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  User, 
  Phone, 
  Tag, 
  Calendar,
  Layers,
  CheckCircle2,
  Pause,
  Play,
  FileText
} from 'lucide-react';

interface BadgesAndCardsSectionProps {
  isDark?: boolean;
}

export const BadgesAndCardsSection: React.FC<BadgesAndCardsSectionProps> = ({ isDark = false }) => {
  return (
    <section id="badges" className="space-y-8">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <BadgeCheck className="w-5 h-5 text-[#5A4AD2]" />
          <span>Status Badges & Structured Card Patterns</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Canonical badge vocabulary combining clear text plus restrained semantic cues. Purposeful card layouts without arbitrary nested boxes.
        </p>
      </div>

      {/* 1. Canonical Status Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Canonical Status Badges (Text + Restrained Accent)
        </h3>

        <div className={`p-4 sm:p-5 rounded-2xl border space-y-6 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Category A: Campaign / Lifecycle */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
              1. Campaign & Workflow Lifecycle
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Draft */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-700'
              }`}>
                <FileText className="w-3 h-3" />
                Draft
              </span>

              {/* Scheduled */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-sky-950 text-sky-300 border border-sky-800' : 'bg-sky-100 text-sky-800'
              }`}>
                <Clock className="w-3 h-3" />
                Scheduled
              </span>

              {/* Running */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                <Play className="w-3 h-3" />
                Running
              </span>

              {/* Paused */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-amber-100 text-amber-800'
              }`}>
                <Pause className="w-3 h-3" />
                Paused
              </span>

              {/* Completed */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-teal-950 text-teal-300 border border-teal-800' : 'bg-teal-100 text-teal-800'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                Completed
              </span>

              {/* Cancelled */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-rose-100 text-rose-800'
              }`}>
                <AlertCircle className="w-3 h-3" />
                Cancelled
              </span>
            </div>
          </div>

          {/* Category B: Provider & Template Verification */}
          <div className="space-y-2 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
              2. Provider & Template Verification States
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Local Draft */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
              }`}>
                Local Draft
              </span>

              {/* Pending */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-amber-100 text-amber-800'
              }`}>
                <Clock className="w-3 h-3" />
                Pending Provider
              </span>

              {/* Approved */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                <CheckCheck className="w-3 h-3" />
                Approved
              </span>

              {/* Rejected */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-rose-100 text-rose-800'
              }`}>
                <AlertCircle className="w-3 h-3" />
                Rejected
              </span>
            </div>
          </div>

          {/* Category C: Canonical Recipient Outcomes */}
          <div className="space-y-2 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
              3. Canonical Recipient Delivery Outcomes
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Queued */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
              }`}>
                <Clock className="w-3 h-3" />
                Queued
              </span>

              {/* Sent */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-sky-950 text-sky-300 border border-sky-800' : 'bg-sky-100 text-sky-800'
              }`}>
                <Send className="w-3 h-3" />
                Sent
              </span>

              {/* Delivered */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                <CheckCheck className="w-3 h-3" />
                Delivered
              </span>

              {/* Read */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-indigo-100 text-indigo-800'
              }`}>
                <Eye className="w-3 h-3" />
                Read
              </span>

              {/* Replied */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-teal-950 text-teal-300 border border-teal-800' : 'bg-teal-100 text-teal-800'
              }`}>
                <MessageSquareReply className="w-3 h-3" />
                Replied
              </span>

              {/* Failed */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-rose-100 text-rose-800'
              }`}>
                <AlertCircle className="w-3 h-3" />
                Failed
              </span>

              {/* Excluded */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-amber-100 text-amber-800'
              }`}>
                <ShieldAlert className="w-3 h-3" />
                Excluded
              </span>
            </div>
          </div>

          {/* Category D: Automation Rules States */}
          <div className="space-y-2 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
              4. Automation Rules Lifecycle
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Enabled */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                Enabled
              </span>

              {/* Disabled */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
              }`}>
                Disabled
              </span>

              {/* Archived */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isDark ? 'bg-slate-800/80 text-slate-500' : 'bg-slate-100 text-slate-500'
              }`}>
                Archived
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Card Types */}
      <div id="cards" className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Essential Card Types (Operational Patterns)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Operational Summary Card */}
          <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Broadcast Overview
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Completed
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                September Patient Follow-up
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Dispatched to 580 checked recipients via Agamagizh WhatsApp Main.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
              <span>Delivery Rate: <strong>96.4%</strong></span>
              <span>14 Sep, 10:30 AM</span>
            </div>
          </div>

          {/* Card 2: Interactive Metric Card */}
          <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer hover:shadow-xs ${
            isDark ? 'bg-slate-900 border-slate-800 hover:border-violet-700' : 'bg-white border-slate-200 hover:border-[#5A4AD2]'
          }`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Delivered Handsets
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 mt-2">
                1,192
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                95.5% delivery rate
              </span>
            </div>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              Click to drill down into ledger
            </div>
          </div>

          {/* Card 3: Contact / List Item Card */}
          <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-100 text-[#5A4AD2] dark:bg-violet-950 dark:text-violet-300 flex items-center justify-center font-bold text-xs shrink-0">
                RK
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  Rajesh Kumar
                </h4>
                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>+91 98401 98765</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                Intake Pending
              </span>
              <span className="text-slate-400">Active today</span>
            </div>
          </div>

          {/* Card 4: Clinic Pipeline Kanban Card */}
          <div className={`p-3.5 rounded-xl border space-y-2.5 shadow-2xs ${
            isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Dr. Swaminathan
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                High Priority
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
              Pediatric speech therapy consultation request.
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Tomorrow 10:30 AM
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Adyar
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
