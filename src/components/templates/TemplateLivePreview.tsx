import React from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  ExternalLink, 
  Phone, 
  CornerDownLeft, 
  CheckCheck, 
  ShieldCheck, 
  Info,
  Sparkles
} from 'lucide-react';
import { TemplateDraft } from './types';
import { interpolateText } from './templateUtils';

interface TemplateLivePreviewProps {
  draft: TemplateDraft;
  theme: 'dark' | 'light';
}

export const TemplateLivePreview: React.FC<TemplateLivePreviewProps> = ({ draft, theme }) => {
  const isDark = theme === 'dark';

  const interpolatedHeader = draft.header.type === 'text' && draft.header.text
    ? interpolateText(draft.header.text, draft.variables)
    : '';

  const interpolatedBody = interpolateText(draft.body, draft.variables);
  const hasContent = Boolean(interpolatedBody.trim() || interpolatedHeader || draft.header.type !== 'none');

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      id="template-live-preview-container"
      className="w-full flex flex-col items-center select-none"
    >
      {/* Device / Chat Container */}
      <div
        className={`w-full max-w-[360px] rounded-3xl overflow-hidden border shadow-xl flex flex-col transition-all ${
          isDark
            ? 'bg-[#1F232B] border-slate-700/80 shadow-black/40'
            : 'bg-white border-slate-200 shadow-slate-200/80'
        }`}
      >
        {/* WhatsApp Business Header Simulation */}
        <div className="bg-[#075E54] text-white px-3.5 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-xs text-white shrink-0">
              A
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold truncate">Agamagizh Center</span>
                <span className="w-3.5 h-3.5 rounded-full bg-white text-[#075E54] flex items-center justify-center text-[9px] font-black shrink-0">
                  ✓
                </span>
              </div>
              <span className="text-[10px] text-emerald-200 block truncate">
                Verified Business Account
              </span>
            </div>
          </div>

          <div className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-100 border border-emerald-400/20">
            {draft.language}
          </div>
        </div>

        {/* WhatsApp Chat Canvas */}
        <div
          className={`p-3.5 min-h-[380px] max-h-[580px] overflow-y-auto flex flex-col justify-end relative transition-colors ${
            isDark ? 'bg-[#111317]' : 'bg-[#EFEAE2]'
          }`}
          style={{
            backgroundImage: `radial-gradient(${isDark ? '#22262F' : '#DFD7CA'} 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        >
          {/* Subtle Security Notice Pill */}
          <div className="mb-3 text-center">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[9px] font-medium shadow-2xs ${
                isDark ? 'bg-[#1E222A] text-slate-400 border border-slate-700' : 'bg-[#FFFBEA] text-[#78611F] border border-[#F0E5BA]'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-amber-500" />
              <span>Official WhatsApp Business Message</span>
            </span>
          </div>

          {/* Chat Bubble or Empty State */}
          {!hasContent ? (
            <div
              className={`p-6 rounded-2xl border text-center my-auto space-y-2 transition-all ${
                isDark
                  ? 'bg-[#181A1F]/80 border-dashed border-slate-700 text-slate-400'
                  : 'bg-white/80 border-dashed border-slate-300 text-slate-500'
              }`}
            >
              <div className="w-9 h-9 rounded-2xl bg-[#5A4AD2]/10 text-[#5A4AD2] mx-auto flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-300 dark:text-slate-200">
                Your template preview will appear here
              </div>
              <p className="text-[11px] opacity-75 max-w-[220px] mx-auto leading-relaxed">
                Add a body message in the editor on the left. Variables will be interpolated with live examples.
              </p>
            </div>
          ) : (
            <div
              className={`rounded-2xl p-3 shadow-md text-xs space-y-2.5 max-w-full animate-in fade-in duration-200 ${
                isDark
                  ? 'bg-[#21252B] border border-slate-700/80 text-white'
                  : 'bg-white border border-slate-200/80 text-slate-900'
              }`}
            >
              {/* Header Preview */}
              {draft.header.type === 'text' && interpolatedHeader && (
                <div className="font-extrabold text-xs tracking-tight pb-1 border-b border-slate-100 dark:border-slate-800">
                  {interpolatedHeader}
                </div>
              )}

              {draft.header.type === 'image' && (
                <div
                  className={`h-32 rounded-xl border flex flex-col items-center justify-center gap-1.5 overflow-hidden ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <ImageIcon className="w-6 h-6 text-[#5A4AD2] opacity-80" />
                  <span className="text-[10px] font-semibold">Image Header Preview</span>
                  <span className="text-[9px] text-slate-400">Dynamic image asset attached at dispatch</span>
                </div>
              )}

              {draft.header.type === 'document' && (
                <div
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-[11px] block truncate">Document Attachment</span>
                    <span className="text-[9px] text-slate-400 block">PDF / Document placeholder</span>
                  </div>
                </div>
              )}

              {/* Message Body with live variable interpolation */}
              <div className="whitespace-pre-wrap text-[11.5px] leading-relaxed font-sans">
                {interpolatedBody || (
                  <span className="italic text-slate-400">Empty body text…</span>
                )}
              </div>

              {/* Footer Preview & Timestamp Row */}
              <div className="flex items-end justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60 gap-2">
                <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium block truncate">
                  {draft.footer || ''}
                </span>
                <div className="flex items-center gap-1 text-[9px] text-slate-400 shrink-0 ml-auto">
                  <span>{currentTime}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                </div>
              </div>

              {/* WhatsApp Buttons Preview */}
              {draft.buttons && draft.buttons.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  {draft.buttons.map((btn, idx) => (
                    <div
                      key={btn.id || idx}
                      className={`py-2 px-3 rounded-xl border font-bold text-center text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
                        isDark
                          ? 'bg-[#181A1F] hover:bg-[#252A33] border-slate-700 text-[#72C7B8]'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-[#00A884]'
                      }`}
                    >
                      {btn.type === 'QUICK_REPLY' && (
                        <CornerDownLeft className="w-3 h-3 opacity-70" />
                      )}
                      {btn.type === 'URL' && (
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      )}
                      {btn.type === 'PHONE_NUMBER' && (
                        <Phone className="w-3 h-3 opacity-70" />
                      )}
                      <span className="truncate">{btn.text || 'Button'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Device Footer Note */}
        <div
          className={`px-4 py-2 border-t text-[10px] text-center font-medium ${
            isDark
              ? 'bg-[#181A1F] border-slate-800 text-slate-400'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <span>Live rendering with interpolated sample values</span>
        </div>
      </div>
    </div>
  );
};
