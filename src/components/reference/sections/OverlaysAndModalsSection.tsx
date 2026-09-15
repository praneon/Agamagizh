import React, { useState, useEffect, useRef } from 'react';
import { 
  AppWindow, 
  X, 
  AlertTriangle, 
  AlertCircle,
  Check, 
  Trash2, 
  Info, 
  Loader2, 
  Clock, 
  Send, 
  Eye, 
  CheckCheck, 
  User, 
  Phone 
} from 'lucide-react';

interface OverlaysAndModalsSectionProps {
  isDark?: boolean;
}

export const OverlaysAndModalsSection: React.FC<OverlaysAndModalsSectionProps> = ({ isDark = false }) => {
  // Overlays state
  const [activeDrawer, setActiveDrawer] = useState(false);
  const [activeModal, setActiveModal] = useState<'standard' | 'confirm' | 'destructive' | 'large_preview' | null>(null);
  const [modalState, setModalState] = useState<'normal' | 'loading' | 'error'>('normal');

  // Drawer trigger ref for focus return
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const modalCloseBtnRef = useRef<HTMLButtonElement>(null);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeDrawer) {
          setActiveDrawer(false);
          drawerTriggerRef.current?.focus();
        }
        if (activeModal) {
          setActiveModal(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDrawer, activeModal]);

  const handleCloseDrawer = () => {
    setActiveDrawer(false);
    drawerTriggerRef.current?.focus();
  };

  return (
    <section id="overlays" className="space-y-6">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <AppWindow className="w-5 h-5 text-[#5A4AD2]" />
          <span>Drawers, Modals & Explicit Confirmation Dialogs</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Accessible right-side inspection drawers, standard modals, and explicit confirmation dialogues avoiding vague "Are you sure?" phrases.
        </p>
      </div>

      {/* Trigger Buttons Matrix */}
      <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-wrap items-center gap-3">
          {/* Drawer Trigger */}
          <button
            ref={drawerTriggerRef}
            type="button"
            onClick={() => setActiveDrawer(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5A4AD2] text-white hover:bg-[#4838B8] focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] transition-colors"
          >
            Open Canonical Right Drawer
          </button>

          {/* Standard Modal Trigger */}
          <button
            type="button"
            onClick={() => {
              setModalState('normal');
              setActiveModal('standard');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Standard Form Modal
          </button>

          {/* Explicit Confirmation Modal Trigger */}
          <button
            type="button"
            onClick={() => {
              setModalState('normal');
              setActiveModal('confirm');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Explicit Confirmation Modal
          </button>

          {/* Destructive Confirmation Trigger */}
          <button
            type="button"
            onClick={() => {
              setModalState('normal');
              setActiveModal('destructive');
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
          >
            Destructive Confirmation
          </button>

          {/* Large Preview / Review Modal */}
          <button
            type="button"
            onClick={() => {
              setModalState('normal');
              setActiveModal('large_preview');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Large Preflight Review Modal
          </button>
        </div>

        {/* Modal Internal State Controller */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-500">
          <span className="font-bold">Active Modal State:</span>
          <div className="flex gap-2">
            {(['normal', 'loading', 'error'] as const).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setModalState(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize ${
                  modalState === s
                    ? 'bg-[#5A4AD2] text-white'
                    : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Language Standard Callout */}
      <div className={`p-4 rounded-xl border space-y-2 text-xs ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Confirmation Language Standard
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
            <span className="font-bold text-rose-700 dark:text-rose-400 block mb-1">❌ Anti-Pattern (Vague):</span>
            <p className="text-[11px] leading-relaxed italic">
              "Are you sure? This action cannot be undone. [OK] [Cancel]"
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">✓ Canonical Approved:</span>
            <p className="text-[11px] leading-relaxed">
              <strong>"Enable this rule?"</strong> or <strong>"Archive this rule?"</strong> or <strong>"Cancel this campaign?"</strong> with explicit consequences described.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Interactive Drawer Demonstration */}
      {activeDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={handleCloseDrawer}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Slide-over Panel (Desktop 420px, Mobile ~390px sheet) */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div 
              role="dialog"
              aria-modal="true"
              aria-label="Recipient Details Drawer"
              className={`w-screen max-w-md shadow-2xl flex flex-col h-full overflow-hidden transition-colors ${
                isDark ? 'bg-slate-900 text-slate-100 border-l border-slate-800' : 'bg-white text-slate-900 border-l border-slate-200'
              }`}
            >
              {/* Drawer Header */}
              <div className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
                isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50/50'
              }`}>
                <div>
                  <h3 className="text-base font-bold">Recipient Details</h3>
                  <p className="text-xs text-slate-400">Canonical slide-over inspection pattern</p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
                {/* Contact Section */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Contact Information
                  </span>
                  <div className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                    isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">Dr. Priya Swaminathan</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
                        cnt-992
                      </span>
                    </div>
                    <div className="text-slate-500 font-mono">+91 98401 23456</div>
                  </div>
                </div>

                {/* Status & Lifecycle Timeline */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Lifecycle Events
                  </span>
                  <div className={`p-3.5 rounded-xl border space-y-3 ${
                    isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="relative pl-5 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500">
                      <div className="relative">
                        <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <div className="text-xs font-bold">Delivered</div>
                        <div className="text-[10px] text-slate-400">14 Sep, 10:48 AM</div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <div className="text-xs font-bold">Dispatched (Cloud API)</div>
                        <div className="text-[10px] text-slate-400">14 Sep, 10:48 AM</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Drawer Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseDrawer}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-[#5A4AD2] text-white hover:bg-[#4838B8]"
                  >
                    Open Full Conversation
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseDrawer}
                    className="w-full py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Close Inspection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modals Dialog Demonstration */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            role="dialog"
            aria-modal="true"
            className={`w-full ${activeModal === 'large_preview' ? 'max-w-2xl' : 'max-w-md'} rounded-2xl border shadow-2xl p-5 space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeModal === 'destructive' && (
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                )}
                <h3 className="text-base font-bold">
                  {activeModal === 'standard' && 'Create Clinic Automation Rule'}
                  {activeModal === 'confirm' && 'Enable this rule?'}
                  {activeModal === 'destructive' && 'Archive this rule?'}
                  {activeModal === 'large_preview' && 'Pre-Flight Campaign Review (1,248 Candidates)'}
                </h3>
              </div>
              <button
                ref={modalCloseBtnRef}
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Loading / Error */}
            {modalState === 'loading' ? (
              <div className="py-8 text-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#5A4AD2] mx-auto" />
                <p className="text-xs text-slate-400">Processing operation…</p>
              </div>
            ) : modalState === 'error' ? (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Operation Failed</span>
                </div>
                The backend service encountered a concurrency lock. Please try again.
              </div>
            ) : (
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3">
                {activeModal === 'standard' && (
                  <div className="space-y-3">
                    <p>Configure a linear automation rule triggered on inbound WhatsApp messages.</p>
                    <input
                      type="text"
                      placeholder="Rule Title (e.g. Appointment Followup)"
                      defaultValue="Dr. Swaminathan Intake Route"
                      className={`w-full p-2.5 rounded-xl border text-xs ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                )}

                {activeModal === 'confirm' && (
                  <p className="leading-relaxed">
                    Enabling <strong>"Pediatric Speech Therapy Intake"</strong> will immediately evaluate all inbound messages against its conditions. Any existing active triage rules on this channel will remain unaffected.
                  </p>
                )}

                {activeModal === 'destructive' && (
                  <div className="space-y-2">
                    <p className="leading-relaxed">
                      Are you sure you want to archive <strong>"Emergency Clinic Route"</strong>?
                    </p>
                    <p className="text-rose-600 dark:text-rose-400 font-medium">
                      Inbound messages will no longer trigger automatic handoffs for this condition.
                    </p>
                  </div>
                )}

                {activeModal === 'large_preview' && (
                  <div className="space-y-3">
                    <p>Pre-Flight verified 1,161 eligible candidates. 87 candidates were excluded due to missing opt-in consent.</p>
                    <div className="p-3 rounded-xl border grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="text-[10px] text-slate-400 font-bold">TOTAL AUDIENCE</div>
                        <div className="text-sm font-bold">1,248</div>
                      </div>
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                        <div className="text-[10px] text-emerald-600 font-bold">ELIGIBLE</div>
                        <div className="text-sm font-bold text-emerald-600">1,161</div>
                      </div>
                      <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-lg">
                        <div className="text-[10px] text-amber-600 font-bold">EXCLUDED</div>
                        <div className="text-sm font-bold text-amber-600">87</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              {activeModal === 'destructive' ? (
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
                >
                  Archive Rule
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5A4AD2] text-white hover:bg-[#4838B8]"
                >
                  {activeModal === 'confirm' ? 'Enable Rule' : activeModal === 'large_preview' ? 'Confirm Dispatch' : 'Save Rule'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
