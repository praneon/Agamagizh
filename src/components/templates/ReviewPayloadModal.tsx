import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  FileCode, 
  ShieldCheck, 
  AlertCircle, 
  Download, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers,
  MessageSquare,
  Tag
} from 'lucide-react';
import { TemplateDraft, ValidationIssue } from './types';
import { generateMetaPayload } from './templateUtils';

interface ReviewPayloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: TemplateDraft;
  validationIssues: ValidationIssue[];
  theme: 'dark' | 'light';
}

export const ReviewPayloadModal: React.FC<ReviewPayloadModalProps> = ({
  isOpen,
  onClose,
  draft,
  validationIssues,
  theme
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'payload'>('summary');

  const errors = validationIssues.filter((i) => i.severity === 'error');
  const isDraftValid = errors.length === 0;

  const payload = generateMetaPayload(draft);
  const payloadString = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([payloadString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.name || 'template'}_meta_payload.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-payload-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all ${
          isDark
            ? 'bg-[#181A1F] border-[#2C313C] text-white'
            : 'bg-white border-[#E3E5E9] text-slate-900'
        }`}
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5A4AD2]/10 text-[#5A4AD2] flex items-center justify-center">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 id="review-payload-modal-title" className="text-base font-bold tracking-tight">
                Review & Provider Payload Inspection
              </h2>
              <p className="text-xs text-slate-400">
                Inspect local draft readiness and Meta WhatsApp Cloud API formatted JSON
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STATE PROGRESSION BANNER: CRITICAL PRODUCT MODEL */}
        <div
          className={`px-6 py-3 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs ${
            isDark ? 'bg-[#1F232B] border-[#2C313C]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
              Lifecycle Model:
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold">
              <span className="px-2 py-0.5 rounded-md bg-[#5A4AD2] text-white">
                Local Draft
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span
                className={`px-2 py-0.5 rounded-md ${
                  isDraftValid
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-500/20 text-slate-400'
                }`}
              >
                Locally Valid
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Payload Ready
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-400 border border-slate-500/20">
                Provider Sync (Pending/Approved)
              </span>
            </div>
          </div>

          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              isDraftValid
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {isDraftValid ? 'Ready for Provider Preparation' : `${errors.length} Fixes Needed`}
          </span>
        </div>

        {/* TAB TOGGLE: DRAFT SUMMARY vs JSON PAYLOAD */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`pb-2 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'summary'
                ? 'border-[#5A4AD2] text-[#5A4AD2]'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Template Summary & Specs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('payload')}
            className={`pb-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'payload'
                ? 'border-[#5A4AD2] text-[#5A4AD2]'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Meta Cloud API JSON</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'summary' ? (
            <div className="space-y-4 text-xs">
              {/* Basics Grid */}
              <div
                className={`p-4 rounded-xl border grid grid-cols-2 sm:grid-cols-4 gap-3 ${
                  isDark ? 'bg-[#21252B] border-slate-700/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Template Name</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                    {draft.name || 'unnamed'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Category</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {draft.category}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Language</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {draft.language}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Campaign Eligibility</span>
                  <p className="font-bold text-amber-500 mt-0.5">
                    No (Local Draft Only)
                  </p>
                </div>
              </div>

              {/* Message Structure */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isDark ? 'bg-[#21252B] border-slate-700/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#5A4AD2]" />
                  <span className="font-bold text-slate-900 dark:text-white">Message Components</span>
                </div>

                {draft.header.type !== 'none' && (
                  <div className="pl-6 border-l-2 border-[#5A4AD2]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Header ({draft.header.type})
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 mt-0.5 font-bold">
                      {draft.header.text || `[Dynamic ${draft.header.type} attachment]`}
                    </p>
                  </div>
                )}

                <div className="pl-6 border-l-2 border-emerald-500">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Body Content</span>
                  <p className="text-slate-800 dark:text-slate-200 mt-0.5 whitespace-pre-wrap leading-relaxed font-sans">
                    {draft.body}
                  </p>
                </div>

                {draft.footer && (
                  <div className="pl-6 border-l-2 border-amber-500">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Footer</span>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {draft.footer}
                    </p>
                  </div>
                )}

                {draft.buttons && draft.buttons.length > 0 && (
                  <div className="pl-6 border-l-2 border-teal-500">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Action Buttons ({draft.buttons.length})
                    </span>
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                      {draft.buttons.map((b, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#5A4AD2]/10 text-[#8B7FF5] border border-[#5A4AD2]/20"
                        >
                          <span>[{b.type}]</span>
                          <span>{b.text}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Variable Mappings Table */}
              {draft.variables.length > 0 && (
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    isDark ? 'bg-[#21252B] border-slate-700/80' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-slate-900 dark:text-white">
                      Variable Examples Provided ({draft.variables.length})
                    </span>
                  </div>
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {draft.variables.map((v) => (
                      <div key={v.token} className="py-1.5 flex items-center justify-between gap-4">
                        <span className="font-mono font-bold text-[#5A4AD2]">{v.token}</span>
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">{v.example || '—'}</span>
                        <span className="text-slate-400 text-[11px]">{v.description || 'Parameter'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Meta WhatsApp Business Management API Payload Schema
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      copied
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : isDark
                        ? 'bg-[#21252B] border-slate-700 text-slate-300 hover:bg-white/5'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isDark
                        ? 'bg-[#21252B] border-slate-700 text-slate-300 hover:bg-white/5'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <pre
                className={`p-4 rounded-xl font-mono text-xs overflow-x-auto border max-h-[380px] leading-relaxed ${
                  isDark
                    ? 'bg-[#111317] border-slate-800 text-emerald-400'
                    : 'bg-slate-900 border-slate-800 text-emerald-400'
                }`}
              >
                <code>{payloadString}</code>
              </pre>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div
          className={`px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 ${
            isDark ? 'bg-[#181A1F] border-[#2C313C]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#5A4AD2]" />
            <span>
              Authoritative provider sync occurs when submitted through your registered Business Manager.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                isDark
                  ? 'border-slate-700 hover:bg-white/5 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              Close Review
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Payload JSON'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
