import React from 'react';
import { Palette, Check } from 'lucide-react';

interface BrandTokensSectionProps {
  isDark?: boolean;
}

export const BrandTokensSection: React.FC<BrandTokensSectionProps> = ({ isDark = false }) => {
  const brandPrimary = [
    { name: 'Agamagizh Violet (Primary)', hex: '#5A4AD2', rgb: 'rgb(90, 74, 210)', role: 'Global primary actions, focused outlines, brand identity', lightText: true },
    { name: 'Violet Hover', hex: '#4838B8', rgb: 'rgb(72, 56, 184)', role: 'Primary button hover and pressed interaction state', lightText: true },
    { name: 'Violet Tint / Surface', hex: '#EDE9FE', rgb: 'rgb(237, 233, 254)', role: 'Active pill backgrounds, selection badges, condition highlights', lightText: false }
  ];

  const structuralColors = [
    { name: 'Canvas Cool Neutral', hex: isDark ? '#020617' : '#F4F5F7', role: 'Default background canvas for page views' },
    { name: 'Card / Panel Surface', hex: isDark ? '#0F172A' : '#FFFFFF', role: 'Containers, cards, drawers, dialog panels' },
    { name: 'Charcoal Text Primary', hex: isDark ? '#F8FAFC' : '#0F172A', role: 'Headings, labels, high-emphasis body text' },
    { name: 'Slate Text Secondary', hex: isDark ? '#94A3B8' : '#64748B', role: 'Metadata, helper captions, inactive labels' },
    { name: 'Cool Slate Border', hex: isDark ? '#1E293B' : '#E2E8F0', role: 'Dividers, table borders, input field containers' }
  ];

  const semanticTokens = [
    { name: 'Aqua / Blue', hex: '#0284C7', role: 'Communication', usage: 'Sent messages, inbound sync, chat triggers' },
    { name: 'Green', hex: '#16A34A', role: 'Success', usage: 'Delivered receipts, approved status, active rules' },
    { name: 'Amber', hex: '#D97706', role: 'Attention / Choice', usage: 'Excluded candidates, pending approval, warnings' },
    { name: 'Violet', hex: '#7C3AED', role: 'Selection / Conditions', usage: 'Read acknowledgment, active filters, logic rules' },
    { name: 'Teal', hex: '#0D9488', role: 'Handoff / Delivery', usage: 'Replied messages, bot-to-agent transfer, clinic intake' },
    { name: 'Slate', hex: '#64748B', role: 'Neutral / Waiting', usage: 'Queued dispatches, drafts, paused flows' },
    { name: 'Coral / Red', hex: '#E11D48', role: 'Danger / Failure', usage: 'Delivery failed, delete confirmation, validation error' }
  ];

  return (
    <section id="brand" className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#5A4AD2]" />
            <span>Brand Tokens & Color Architecture</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Strict palette distribution: 70% Neutral, 20% Structural Brand, 10% Semantic Accents.
          </p>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-violet-100 text-[#5A4AD2] dark:bg-violet-950 dark:text-violet-300">
          Agamagizh Design Tokens v2.4
        </span>
      </div>

      {/* Color Distribution Ratio Visual Bar */}
      <div className={`p-4 rounded-2xl border space-y-3 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-slate-700 dark:text-slate-300">Target Visual Distribution Ratio</span>
          <span className="text-slate-400 font-mono text-[11px]">70% / 20% / 10%</span>
        </div>
        <div className="h-4 w-full rounded-lg overflow-hidden flex shadow-inner">
          <div className="h-full bg-slate-200 dark:bg-slate-700 w-[70%] flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300">
            70% Neutral Surfaces & Text
          </div>
          <div className="h-full bg-[#5A4AD2] w-[20%] flex items-center justify-center text-[10px] font-bold text-white">
            20% Brand
          </div>
          <div className="h-full bg-emerald-500 w-[10%] flex items-center justify-center text-[10px] font-bold text-white">
            10% Semantic
          </div>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          *Rule of craftsmanship: Surfaces remain calm and neutral. Brand violet establishes focal primary actions and selection. Semantic colors are reserved purely for state, alerts, and outcomes.
        </p>
      </div>

      {/* Primary Brand Tokens */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Primary Brand & Action Colors
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {brandPrimary.map((token) => (
            <div
              key={token.name}
              className={`p-3.5 rounded-xl border flex flex-col justify-between h-28 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div 
                  className="w-8 h-8 rounded-lg shadow-2xs border border-white/20"
                  style={{ backgroundColor: token.hex }}
                />
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                  {token.hex}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{token.name}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{token.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Structural Colors */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Structural Surface & Typography Colors
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {structuralColors.map((token) => (
            <div
              key={token.name}
              className={`p-3 rounded-xl border flex flex-col justify-between h-24 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div 
                  className="w-6 h-6 rounded border border-slate-300 dark:border-slate-700" 
                  style={{ backgroundColor: token.hex }}
                />
                <span className="text-[10px] font-mono font-bold text-slate-400">{token.hex}</span>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{token.name}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{token.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Semantic Accents */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Semantic Status Accents (Restrained 10% Usage)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {semanticTokens.map((token) => (
            <div
              key={token.name}
              className={`p-3 rounded-xl border flex flex-col justify-between ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="w-5 h-5 rounded" 
                  style={{ backgroundColor: token.hex }}
                />
                <span className="text-[10px] font-mono font-bold text-slate-400">{token.hex}</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{token.name}</h4>
                <span className="text-[10px] font-semibold text-[#5A4AD2] dark:text-violet-400 block mt-0.5">
                  {token.role}
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                  {token.usage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
