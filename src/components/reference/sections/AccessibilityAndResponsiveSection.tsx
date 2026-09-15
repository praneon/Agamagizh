import React from 'react';
import { 
  CheckCheck, 
  Eye, 
  Smartphone, 
  Laptop, 
  Monitor, 
  Sparkles, 
  Keyboard, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface AccessibilityAndResponsiveSectionProps {
  isDark?: boolean;
}

export const AccessibilityAndResponsiveSection: React.FC<AccessibilityAndResponsiveSectionProps> = ({ isDark = false }) => {
  const viewports = [
    {
      name: 'Mobile (~390×844)',
      icon: Smartphone,
      density: 'Padded Touch Targets (≥44px)',
      tableBehavior: 'Intentional Card / Row Stack',
      drawerBehavior: 'Near/Full-Height Sheet (Slide-Up)',
      filterBehavior: 'Expandable Filters Sheet',
      spec: 'iOS Safari, Android Chrome viewport'
    },
    {
      name: 'Standard Laptop (1366×768)',
      icon: Laptop,
      density: 'Compact Operational Density',
      tableBehavior: 'Dense Multi-Column Grid (py-2.5 px-3)',
      drawerBehavior: '420px Fixed Right Slide-Over',
      filterBehavior: 'Horizontal Inline Toolbar',
      spec: 'Enterprise clinic reception workstations'
    },
    {
      name: 'Full HD Desktop (1920×1080)',
      icon: Monitor,
      density: 'Standard Balanced Density (max-w-7xl)',
      tableBehavior: 'Multi-Column with Reason & Actions',
      drawerBehavior: '460px Slide-Over with Focus Lock',
      filterBehavior: 'Full Inline Filter Toolbar',
      spec: 'Default console desktop presentation'
    },
    {
      name: 'High-Res / Ultra-wide (2560×1600)',
      icon: Sparkles,
      density: 'Constrained Canvas (max-w-7xl mx-auto)',
      tableBehavior: 'Auto-Spaced Balanced Columns',
      drawerBehavior: '500px Right Slide-Over',
      filterBehavior: 'Spacious Filter Toolbar with Direct Reset',
      spec: 'Executive monitoring & analytical dashboards'
    }
  ];

  const accessibilityStandards = [
    {
      title: 'Explicit Associated Labels',
      rule: 'All inputs require <label htmlFor="id"> or aria-label.',
      example: '<label htmlFor="phone">Destination</label>',
      benefit: 'Screen reader accessibility and reliable click hit targets.'
    },
    {
      title: 'Visible Intentional Focus Rings',
      rule: 'focus:ring-2 focus:ring-[#5A4AD2] focus:ring-offset-2',
      example: 'focus:outline-none focus:ring-2 focus:ring-[#5A4AD2]',
      benefit: 'Clear keyboard navigation path for power operators.'
    },
    {
      title: 'Dual-Cue Badges (Text + Color)',
      rule: 'Never communicate status via color alone.',
      example: 'Failed (Red text + Alert icon + "Failed" string)',
      benefit: 'WCAG AA compliance for color-blind operators.'
    },
    {
      title: 'Descriptive Error Associations',
      rule: 'Use aria-invalid="true" and aria-describedby="err-id".',
      example: '<input aria-invalid="true" aria-describedby="err-zip" />',
      benefit: 'Screen readers immediately read the specific validation cause.'
    },
    {
      title: 'Touch Target Minimums (≥44px)',
      rule: 'Mobile interactive buttons maintain 44×44px hit bounds.',
      example: 'min-h-[44px] min-w-[44px] on primary mobile controls',
      benefit: 'Prevents accidental taps on dense reception tablets.'
    },
    {
      title: 'Accessible Modal & Drawer Traps',
      rule: 'Trap Tab focus, listen to Escape key, restore trigger focus.',
      example: 'document.addEventListener("keydown", handleEscape)',
      benefit: 'Keyboard users never get stuck in orphaned overlay layers.'
    }
  ];

  return (
    <section id="accessibility" className="space-y-8">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#5A4AD2]" />
          <span>Accessibility Standards & Responsive Viewport Rules</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Engineering guidelines for universal device scaling and WCAG AA accessibility compliance.
        </p>
      </div>

      {/* 1. Responsive Viewport Behavior Reference */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Cross-Viewport Behavior Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {viewports.map((vp, i) => {
            const Icon = vp.icon;
            return (
              <div
                key={i}
                className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-violet-100 text-[#5A4AD2] dark:bg-violet-950 dark:text-violet-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {vp.name}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Density:</span>
                      <span className="text-slate-700 dark:text-slate-300">{vp.density}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tables:</span>
                      <span className="text-slate-700 dark:text-slate-300">{vp.tableBehavior}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Drawers:</span>
                      <span className="text-slate-700 dark:text-slate-300">{vp.drawerBehavior}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                  {vp.spec}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Accessibility Compliance Reference */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Keyboard className="w-3.5 h-3.5 text-[#5A4AD2]" />
          <span>Core WCAG AA Accessibility Checklist</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {accessibilityStandards.map((std, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border space-y-2 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5A4AD2]" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{std.title}</h4>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {std.rule}
              </p>
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 font-mono text-[10px] text-[#5A4AD2] dark:text-violet-300 truncate">
                {std.example}
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Benefit: {std.benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
