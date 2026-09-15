import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Check, 
  AlertTriangle, 
  Eye, 
  Send, 
  Undo2, 
  Redo2, 
  Save, 
  Moon, 
  Sun, 
  Edit2, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { ValidationIssue } from './types';

interface ChatbotToolbarProps {
  botName: string;
  onUpdateBotName: (name: string) => void;
  status: 'draft' | 'published';
  saveStatus: 'saved' | 'unsaved' | 'saving';
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSaveDraft: () => void;
  onOpenValidate: () => void;
  onOpenPreview: () => void;
  onOpenPublish: () => void;
  onBackToLibrary: () => void;
  validationIssues: ValidationIssue[];
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onSelectPresetFlow?: (preset: 'simple' | 'complex' | 'all-nodes' | 'invalid' | 'blank') => void;
}

export const ChatbotToolbar: React.FC<ChatbotToolbarProps> = ({
  botName,
  onUpdateBotName,
  status,
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSaveDraft,
  onOpenValidate,
  onOpenPreview,
  onOpenPublish,
  onBackToLibrary,
  validationIssues,
  theme,
  onToggleTheme,
  onSelectPresetFlow
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(botName);
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);

  const errorsCount = validationIssues.filter((i) => i.severity === 'error').length;
  const warningsCount = validationIssues.filter((i) => i.severity === 'warning').length;
  const totalIssues = validationIssues.length;

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateBotName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const isDark = theme === 'dark';

  return (
    <div 
      id="chatbot-workspace-toolbar"
      className={`h-14 px-4 sm:px-6 flex items-center justify-between border-b shrink-0 transition-colors ${
        isDark 
          ? 'bg-[#181A1F] border-[#2C313C] text-white' 
          : 'bg-white border-[#E3E5E9] text-slate-800'
      }`}
    >
      {/* LEFT: Breadcrumb, Bot Name, Status, Save State */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onBackToLibrary}
          className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-2 rounded-lg transition-colors ${
            isDark 
              ? 'text-slate-400 hover:text-white hover:bg-white/5' 
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Return to Chatbot Library"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">WhatsApp / Chatbots</span>
        </button>

        <div className={`h-4 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

        {/* Bot Name (Inline Editable) */}
        <div className="flex items-center gap-2 min-w-0">
          {isEditingName ? (
            <input
              type="text"
              autoFocus
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') {
                  setTempName(botName);
                  setIsEditingName(false);
                }
              }}
              className={`text-xs font-bold px-2 py-0.5 rounded border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark 
                  ? 'bg-[#21252B] border-slate-600 text-white' 
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setTempName(botName);
                setIsEditingName(true);
              }}
              className="flex items-center gap-1.5 group min-w-0"
              title="Click to edit bot title"
            >
              <h2 className="text-xs sm:text-sm font-bold truncate tracking-tight">
                {botName}
              </h2>
              <Edit2 className={`w-3 h-3 opacity-0 group-hover:opacity-70 transition-opacity ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`} />
            </button>
          )}

          {/* Status Badge */}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            status === 'published'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : isDark
              ? 'bg-slate-800 text-slate-300 border border-slate-700'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}>
            {status === 'published' ? 'Published' : 'Draft'}
          </span>

          {/* Save Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-medium ml-1">
            <span className={`w-1.5 h-1.5 rounded-full ${
              saveStatus === 'saved' 
                ? 'bg-emerald-500' 
                : saveStatus === 'saving'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-amber-500'
            }`} />
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving…' : 'Unsaved changes'}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: Flow Switcher, Theme, Undo/Redo, Save Draft, Validate, Preview, Publish */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Flow Presets Dropdown */}
        {onSelectPresetFlow && (
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setShowPresetDropdown(!showPresetDropdown)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                isDark 
                  ? 'bg-[#21252B] hover:bg-[#282C34] border-slate-700 text-slate-300' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Switch demo graph layout"
            >
              <Layers className="w-3.5 h-3.5 text-[#5A4AD2]" />
              <span>Demo Presets</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showPresetDropdown && (
              <div className={`absolute right-0 mt-1 w-56 rounded-xl shadow-xl border py-1.5 z-50 text-xs ${
                isDark ? 'bg-[#21252B] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Demo Graph
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPresetFlow('simple');
                    setShowPresetDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <span>Simple Demo (Branching)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPresetFlow('all-nodes');
                    setShowPresetDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold text-[#8B7FF5] flex items-center justify-between ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <span>All Nodes (Every Step Type)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#5A4AD2]/20 font-mono">Full</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPresetFlow('complex');
                    setShowPresetDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <span>Complex Multi-Branch Graph</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPresetFlow('invalid');
                    setShowPresetDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between text-amber-500 ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <span>Invalid Flow (Validation Demo)</span>
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                </button>
                <div className={`my-1 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`} />
                <button
                  type="button"
                  onClick={() => {
                    onSelectPresetFlow('blank');
                    setShowPresetDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between text-rose-500 ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <span>Blank Canvas</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} canvas theme`}
          className={`p-1.5 sm:p-2 rounded-xl border text-xs font-semibold transition-colors ${
            isDark 
              ? 'bg-[#21252B] border-slate-700 hover:bg-[#282C34] text-slate-300' 
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
          }`}
          title={isDark ? 'Switch to Light Workspace' : 'Switch to Dark Workspace (Flagship)'}
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
        </button>

        {/* Undo / Redo Controls */}
        <div className={`hidden sm:flex items-center rounded-xl border p-0.5 ${
          isDark ? 'bg-[#21252B] border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            aria-label="Undo canvas change"
            className={`p-1.5 rounded-lg transition-colors ${
              canUndo 
                ? isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
                : 'opacity-30 cursor-not-allowed text-slate-400'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            aria-label="Redo canvas change"
            className={`p-1.5 rounded-lg transition-colors ${
              canRedo 
                ? isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
                : 'opacity-30 cursor-not-allowed text-slate-400'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Save Draft (Secondary) */}
        <button
          type="button"
          onClick={onSaveDraft}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
            isDark
              ? 'bg-[#21252B] hover:bg-[#282C34] border-slate-700 text-slate-200'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
          }`}
          title="Save draft version"
        >
          <Save className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Save Draft</span>
        </button>

        {/* Validate (Secondary with status pill) */}
        <button
          type="button"
          onClick={onOpenValidate}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
            totalIssues > 0
              ? isDark
                ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
              : isDark
              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
              : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
          }`}
          title="Validate flow for issues"
        >
          {totalIssues > 0 ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          )}
          <span className="hidden sm:inline">
            {totalIssues > 0 ? `${totalIssues} issues` : 'Flow is valid'}
          </span>
        </button>

        {/* Safe Preview (Secondary) */}
        <button
          type="button"
          onClick={onOpenPreview}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
            isDark
              ? 'bg-[#21252B] hover:bg-[#282C34] border-slate-700 text-white'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
          }`}
          title="Test chatbot interactively in Safe Test Mode"
        >
          <Eye className="w-3.5 h-3.5 text-[#5A4AD2]" />
          <span>Preview</span>
        </button>

        {/* Publish Version (Primary = Agamagizh violet #5A4AD2) */}
        <button
          type="button"
          onClick={onOpenPublish}
          className="px-3.5 py-1.5 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#5A4AD2]"
          title="Publish this validated chatbot version"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Publish Version</span>
          <span className="sm:hidden">Publish</span>
        </button>
      </div>
    </div>
  );
};
