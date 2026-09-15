import React from 'react';
import { Type, Move, Columns } from 'lucide-react';

interface TypographyAndSpacingSectionProps {
  isDark?: boolean;
}

export const TypographyAndSpacingSection: React.FC<TypographyAndSpacingSectionProps> = ({ isDark = false }) => {
  const typographyHierarchy = [
    {
      level: 'Page Title',
      spec: 'text-xl font-extrabold tracking-tight',
      size: '20px / 1.25rem',
      weight: '800 (ExtraBold)',
      sample: 'WhatsApp Analytics & Operational Hub',
      usage: 'Top-level view header across consoles'
    },
    {
      level: 'Section Title',
      spec: 'text-base font-bold text-slate-900 dark:text-slate-100',
      size: '16px / 1.0rem',
      weight: '700 (Bold)',
      sample: 'Campaign Delivery Breakdown & Ledger',
      usage: 'Card group headers, drawer section headings, modal titles'
    },
    {
      level: 'Card / Table Title',
      spec: 'text-sm font-bold text-slate-800 dark:text-slate-200',
      size: '14px / 0.875rem',
      weight: '700 (Bold)',
      sample: 'Recent Broadcast Dispatches (24h)',
      usage: 'Table column group header, kanban stage title, card titles'
    },
    {
      level: 'Body Text',
      spec: 'text-xs text-slate-700 dark:text-slate-300 leading-relaxed',
      size: '12px / 0.75rem',
      weight: '400 (Regular) / 500 (Medium)',
      sample: 'Candidates were verified against Agamagizh pre-flight opt-in rules before dispatch.',
      usage: 'Primary conversational text, descriptions, table body content'
    },
    {
      level: 'Secondary Text',
      spec: 'text-xs text-slate-500 dark:text-slate-400',
      size: '12px / 0.75rem',
      weight: '400 (Regular)',
      sample: 'Last synchronized with Cloud API 3 minutes ago',
      usage: 'Timestamps, secondary explanations, inactive list states'
    },
    {
      level: 'Caption / Metadata',
      spec: 'text-[11px] font-medium text-slate-400 dark:text-slate-500',
      size: '11px / 0.6875rem',
      weight: '500 (Medium)',
      sample: 'ID: waba-msg-99482 • Latency: 42ms',
      usage: 'Footers, technical audit details, count indicators'
    },
    {
      level: 'Field / Section Label',
      spec: 'text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500',
      size: '11px / 0.6875rem',
      weight: '700 (Bold Uppercase)',
      sample: 'INBOX ROUTING CHANNEL',
      usage: 'Form field headers, filter category headers, drawer group labels'
    }
  ];

  const spacingDensities = [
    { label: 'Page Padding', desktop: 'p-6 (24px)', mobile: 'p-4 (16px)', target: 'View canvases, Shell content area' },
    { label: 'Section Spacing', desktop: 'space-y-6 (24px)', mobile: 'space-y-4 (16px)', target: 'Between cards, filter bars, tables' },
    { label: 'Card Outer Padding', desktop: 'p-4 to p-5 (16–20px)', mobile: 'p-3.5 (14px)', target: 'Metric cards, summaries, widgets' },
    { label: 'Form Control Spacing', desktop: 'gap-3 (12px)', mobile: 'gap-2.5 (10px)', target: 'Inputs, dropdowns, checkbox groups' },
    { label: 'Dense Table Spacing', desktop: 'py-2.5 px-3 (10×12px)', mobile: 'Mobile Card Transformation', target: 'Operational tables, campaign ledgers' },
    { label: 'Drawer Panel Padding', desktop: 'p-5 (20px)', mobile: 'p-4 (16px)', target: 'Slide-over drawers, recipient details' },
    { label: 'Modal Dialog Spacing', desktop: 'p-6 (24px)', mobile: 'p-4 (16px)', target: 'Confirmations, preflight alerts, compose' }
  ];

  return (
    <section id="typography" className="space-y-6">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Type className="w-5 h-5 text-[#5A4AD2]" />
          <span>Typography Scale & Operational Spacing</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Functional typography hierarchy and calibrated spacing guidelines. Dense operational layout without bloated SaaS margins.
        </p>
      </div>

      {/* Typography Hierarchy Demo */}
      <div className={`p-4 sm:p-5 rounded-2xl border divide-y ${
        isDark ? 'bg-slate-900 border-slate-800 divide-slate-800' : 'bg-white border-slate-200 divide-slate-100'
      }`}>
        {typographyHierarchy.map((item, index) => (
          <div key={index} className="py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-baseline justify-between gap-3">
            <div className="w-48 shrink-0">
              <span className="text-xs font-bold text-[#5A4AD2] dark:text-violet-400 block">
                {item.level}
              </span>
              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                {item.size} • {item.weight}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                {item.usage}
              </span>
            </div>
            <div className="flex-1">
              <div className={item.spec}>
                {item.sample}
              </div>
            </div>
            <div className="text-right shrink-0 hidden lg:block">
              <code className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                {item.spec.split(' ')[0]}
              </code>
            </div>
          </div>
        ))}
      </div>

      {/* Spacing & Surface Hierarchy Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Move className="w-3.5 h-3.5 text-[#5A4AD2]" />
          <span>Operational Spacing & Density Specifications</span>
        </h3>
        <div className={`rounded-2xl border overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                  isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  <th className="py-2.5 px-4">Surface / Scope</th>
                  <th className="py-2.5 px-4">Desktop Scale</th>
                  <th className="py-2.5 px-4">Mobile Scale (≤640px)</th>
                  <th className="py-2.5 px-4">Standard Usage</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-xs ${
                isDark ? 'divide-slate-800 text-slate-300' : 'divide-slate-100 text-slate-700'
              }`}>
                {spacingDensities.map((row, idx) => (
                  <tr key={idx} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/70'}>
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {row.label}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-[#5A4AD2] dark:text-violet-400">
                      {row.desktop}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {row.mobile}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                      {row.target}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
