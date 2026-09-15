import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Type, 
  SquareAsterisk, 
  BadgeCheck, 
  Table as TableIcon, 
  AppWindow, 
  Bell, 
  ShieldAlert, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Monitor, 
  Laptop, 
  Smartphone, 
  ArrowLeft, 
  Sparkles,
  ExternalLink,
  Code
} from 'lucide-react';
import { ReferenceViewport, ReferenceSectionId } from './types';
import { BrandTokensSection } from './sections/BrandTokensSection';
import { TypographyAndSpacingSection } from './sections/TypographyAndSpacingSection';
import { ButtonsAndInputsSection } from './sections/ButtonsAndInputsSection';
import { BadgesAndCardsSection } from './sections/BadgesAndCardsSection';
import { TablesAndToolbarSection } from './sections/TablesAndToolbarSection';
import { OverlaysAndModalsSection } from './sections/OverlaysAndModalsSection';
import { FeedbackAndToastsSection } from './sections/FeedbackAndToastsSection';
import { SystemStatesSection } from './sections/SystemStatesSection';
import { AccessibilityAndResponsiveSection } from './sections/AccessibilityAndResponsiveSection';

interface UIReferenceViewProps {
  onBackToConsole?: () => void;
}

export const UIReferenceView: React.FC<UIReferenceViewProps> = ({ onBackToConsole }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [viewport, setViewport] = useState<ReferenceViewport>('fluid');
  const [activeSection, setActiveSection] = useState<ReferenceSectionId>('brand');

  const isDark = theme === 'dark';

  // Navigation Links
  const navSections = [
    { id: 'brand', label: 'Brand Tokens', icon: Palette },
    { id: 'typography', label: 'Typography & Spacing', icon: Type },
    { id: 'buttons', label: 'Buttons & Inputs', icon: SquareAsterisk },
    { id: 'badges', label: 'Badges & Cards', icon: BadgeCheck },
    { id: 'tables', label: 'Tables & Ledger', icon: TableIcon },
    { id: 'overlays', label: 'Drawers & Modals', icon: AppWindow },
    { id: 'feedback', label: 'Feedback & Toasts', icon: Bell },
    { id: 'states', label: 'System States', icon: ShieldAlert },
    { id: 'accessibility', label: 'Accessibility & Viewports', icon: ShieldCheck }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id as ReferenceSectionId);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getViewportContainerStyles = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[390px] mx-auto border-x shadow-2xl transition-all duration-300 min-h-screen bg-transparent';
      case 'laptop':
        return 'max-w-[1366px] mx-auto border-x shadow-2xl transition-all duration-300';
      case 'desktop':
        return 'max-w-[1920px] mx-auto transition-all duration-300';
      case 'fluid':
      default:
        return 'w-full transition-all duration-300';
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F4F5F7] text-slate-900'
    }`}>
      {/* 1. Developer Reference Top Navigation Bar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 sm:px-6 py-3 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: App Title & Return */}
          <div className="flex items-center gap-3">
            {onBackToConsole && (
              <button
                type="button"
                onClick={onBackToConsole}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Console</span>
              </button>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight">
                  Agamagizh Console — Universal UI Reference
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-violet-100 text-[#5A4AD2] dark:bg-violet-950 dark:text-violet-300">
                  /ui-reference
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Shared Visual Tokens, System States & Reusable Pattern Canonical Guide
              </p>
            </div>
          </div>

          {/* Right: State Preview Switchers (Dev Tooling) */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-colors ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
              <span className="font-semibold">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </button>

            {/* Viewport Simulation Controls */}
            <div className={`hidden sm:flex items-center p-0.5 rounded-xl border ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setViewport('fluid')}
                title="Fluid Width"
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  viewport === 'fluid' ? 'bg-[#5A4AD2] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Fluid
              </button>
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                title="Desktop 1920×1080"
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  viewport === 'desktop' ? 'bg-[#5A4AD2] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>1920</span>
              </button>
              <button
                type="button"
                onClick={() => setViewport('laptop')}
                title="Laptop 1366×768"
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  viewport === 'laptop' ? 'bg-[#5A4AD2] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Laptop className="w-3 h-3" />
                <span>1366</span>
              </button>
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                title="Mobile 390×844"
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  viewport === 'mobile' ? 'bg-[#5A4AD2] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>390px</span>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Sticky Subnav Pills */}
        <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 pb-1">
            {navSections.map((sec) => {
              const Icon = sec.icon;
              const isSelected = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-[#5A4AD2] text-white shadow-2xs'
                      : isDark
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 2. Main Content Canvas */}
      <main className={`p-4 sm:p-6 transition-all duration-300 ${getViewportContainerStyles()}`}>
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section 1: Brand Tokens */}
          <BrandTokensSection isDark={isDark} />

          {/* Section 2: Typography & Spacing */}
          <TypographyAndSpacingSection isDark={isDark} />

          {/* Section 3: Buttons & Inputs */}
          <ButtonsAndInputsSection isDark={isDark} />

          {/* Section 4: Badges & Cards */}
          <BadgesAndCardsSection isDark={isDark} />

          {/* Section 5: Tables & Toolbar */}
          <TablesAndToolbarSection isDark={isDark} />

          {/* Section 6: Overlays & Modals */}
          <OverlaysAndModalsSection isDark={isDark} />

          {/* Section 7: Feedback & Toasts */}
          <FeedbackAndToastsSection isDark={isDark} />

          {/* Section 8: System States */}
          <SystemStatesSection isDark={isDark} />

          {/* Section 9: Accessibility & Viewports */}
          <AccessibilityAndResponsiveSection isDark={isDark} />

          {/* Footer note for Production Engineers */}
          <footer className={`p-6 rounded-2xl border text-center space-y-2 text-xs ${
            isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <div className="flex items-center justify-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-[#5A4AD2]" />
              <span>Agamagizh Console Production Architecture Approved</span>
            </div>
            <p className="max-w-2xl mx-auto leading-relaxed">
              This reference surface extracts and consolidates the visual tokens, interaction models, and state handling patterns approved for Rails/Vue production integration. All primary modules remain visually authoritative.
            </p>
            <div className="text-[11px] font-mono text-slate-400 pt-2">
              Internal Route: /ui-reference • Build: Production Ready 2026.09
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};
