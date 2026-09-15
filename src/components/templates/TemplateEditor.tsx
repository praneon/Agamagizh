import React, { useRef } from 'react';
import { 
  FileText, 
  HelpCircle, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  AlertTriangle, 
  CheckCircle2, 
  Tag, 
  Globe, 
  FolderKanban, 
  MessageSquare, 
  Sliders, 
  Smile, 
  CornerDownLeft, 
  ExternalLink, 
  Phone, 
  ShieldAlert, 
  Info,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  TemplateDraft, 
  ValidationIssue, 
  TemplateCategory, 
  SUPPORTED_LANGUAGES, 
  HeaderType, 
  TemplateButtonType 
} from './types';
import { extractVariablesFromText, syncVariables } from './templateUtils';

interface TemplateEditorProps {
  draft: TemplateDraft;
  onChange: (updated: TemplateDraft) => void;
  validationIssues: ValidationIssue[];
  activeSection: string;
  onSelectSection: (section: string) => void;
  theme: 'dark' | 'light';
  onOpenReviewPayload: () => void;
}

const SECTIONS = [
  { id: 'basics', label: '1. Basics', icon: Sliders },
  { id: 'header', label: '2. Header', icon: Layers },
  { id: 'body', label: '3. Message Body', icon: MessageSquare },
  { id: 'variables', label: '4. Variables & Examples', icon: Tag },
  { id: 'footer', label: '5. Footer', icon: FileText },
  { id: 'buttons', label: '6. Interactive Buttons', icon: CornerDownLeft }
];

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  draft,
  onChange,
  validationIssues,
  activeSection,
  onSelectSection,
  theme,
  onOpenReviewPayload
}) => {
  const isDark = theme === 'dark';
  const bodyTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Helper to get errors for a specific field/section
  const getFieldIssues = (section: string, field?: string) => {
    return validationIssues.filter((i) => {
      if (i.section !== section) return false;
      if (field && i.field !== field) return false;
      return true;
    });
  };

  // 1. Update Body Text & auto-sync variables
  const handleBodyChange = (newBody: string) => {
    const updatedVariables = syncVariables(newBody, draft.header.text || '', draft.variables);
    onChange({
      ...draft,
      body: newBody,
      variables: updatedVariables,
      updatedAt: 'Just now'
    });
  };

  // Insert variable token into body at cursor
  const handleInsertVariable = () => {
    const detected = extractVariablesFromText(`${draft.header.text || ''} ${draft.body || ''}`);
    const nextIndex = detected.length > 0 ? Math.max(...detected) + 1 : 1;
    const token = `{{${nextIndex}}}`;

    const textarea = bodyTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = draft.body;
      const newText = currentText.substring(0, start) + token + currentText.substring(end);
      handleBodyChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + token.length, start + token.length);
      }, 50);
    } else {
      handleBodyChange(`${draft.body} ${token}`);
    }
  };

  // Insert emoji
  const handleInsertEmoji = (emoji: string) => {
    const textarea = bodyTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = draft.body;
      const newText = currentText.substring(0, start) + emoji + currentText.substring(end);
      handleBodyChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 50);
    } else {
      handleBodyChange(`${draft.body} ${emoji}`);
    }
  };

  // 2. Buttons management
  const handleAddButton = (type: TemplateButtonType) => {
    const newBtn = {
      id: `btn-${Date.now()}`,
      type,
      text: type === 'QUICK_REPLY' ? 'Quick Reply' : type === 'URL' ? 'Visit Website' : 'Call Center',
      value: type === 'URL' ? 'https://agamagizh.org' : undefined,
      phoneNumber: type === 'PHONE_NUMBER' ? '+914424450099' : undefined
    };

    onChange({
      ...draft,
      buttons: [...(draft.buttons || []), newBtn],
      updatedAt: 'Just now'
    });
  };

  const handleUpdateButton = (id: string, updates: Partial<any>) => {
    onChange({
      ...draft,
      buttons: draft.buttons.map((b) => (b.id === id ? { ...b, ...updates } : b)),
      updatedAt: 'Just now'
    });
  };

  const handleDeleteButton = (id: string) => {
    onChange({
      ...draft,
      buttons: draft.buttons.filter((b) => b.id !== id),
      updatedAt: 'Just now'
    });
  };

  const handleMoveButton = (index: number, direction: 'up' | 'down') => {
    const newButtons = [...draft.buttons];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newButtons.length) return;
    const temp = newButtons[index];
    newButtons[index] = newButtons[targetIndex];
    newButtons[targetIndex] = temp;
    onChange({
      ...draft,
      buttons: newButtons,
      updatedAt: 'Just now'
    });
  };

  // Variable examples update
  const handleUpdateVariable = (index: number, example: string, description: string) => {
    onChange({
      ...draft,
      variables: draft.variables.map((v) =>
        v.index === index ? { ...v, example, description } : v
      ),
      updatedAt: 'Just now'
    });
  };

  return (
    <div id="template-builder-editor-container" className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* SECTION NAVIGATION RAIL (Compact Left Rail on Desktop) */}
      <nav 
        aria-label="Template builder sections"
        className={`w-full lg:w-48 lg:border-r border-b lg:border-b-0 p-2 sm:p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-y-auto shrink-0 transition-colors ${
          isDark ? 'bg-[#181A1F] border-[#2C313C]' : 'bg-[#F8F9FA] border-[#E3E5E9]'
        }`}
      >
        <div className="hidden lg:block px-2 py-1 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Editor Sections
          </span>
        </div>

        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const issues = getFieldIssues(sec.id);
          const hasErrors = issues.some((i) => i.severity === 'error');
          const hasWarnings = issues.some((i) => i.severity === 'warning');
          const isActive = activeSection === sec.id;

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onSelectSection(sec.id)}
              className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#5A4AD2] text-white shadow-xs font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{sec.label}</span>
              </div>

              {issues.length > 0 && (
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ml-1.5 ${
                    isActive
                      ? 'bg-white text-[#5A4AD2]'
                      : hasErrors
                      ? 'bg-rose-500 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {issues.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* MAIN SCROLLABLE FORM WORKSPACE */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* ========================================================= */}
        {/* 1. BASICS */}
        {/* ========================================================= */}
        <section
          id="sec-basics"
          className={`p-5 rounded-2xl border transition-all ${
            activeSection === 'basics' ? 'ring-2 ring-[#5A4AD2]/20' : ''
          } ${
            isDark ? 'bg-[#21252B] border-slate-700/80' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#5A4AD2]/10 text-[#5A4AD2] flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Template Basics</h3>
                <p className="text-[11px] text-slate-400">Core identifier, language, and WhatsApp approved category</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Required</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Template Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Template Identifier Name *
                </label>
                <span className="text-[10px] text-slate-400">Lowercase letters, numbers, and underscores</span>
              </div>
              <input
                type="text"
                value={draft.name}
                onChange={(e) => {
                  const cleaned = e.target.value.toLowerCase().replace(/\s+/g, '_');
                  onChange({ ...draft, name: cleaned, updatedAt: 'Just now' });
                }}
                placeholder="e.g. appointment_reminder_adyar"
                className={`w-full font-mono text-xs px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-[#181A1F] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
              {getFieldIssues('basics', 'name').map((err) => (
                <p key={err.id} className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{err.message}</span>
                </p>
              ))}
            </div>

            {/* Category & Language Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={draft.category}
                  onChange={(e) =>
                    onChange({
                      ...draft,
                      category: e.target.value as TemplateCategory,
                      updatedAt: 'Just now'
                    })
                  }
                  className={`w-full text-xs px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                    isDark ? 'bg-[#181A1F] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="UTILITY">Utility (Account alerts, appointment reminders, orders)</option>
                  <option value="MARKETING">Marketing (Offers, updates, announcements)</option>
                  <option value="AUTHENTICATION">Authentication (One-time passcodes, verification)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  {draft.category === 'UTILITY' && 'Strictly transactional notifications triggered by user action.'}
                  {draft.category === 'MARKETING' && 'Promotional and engagement messages to opt-in contacts.'}
                  {draft.category === 'AUTHENTICATION' && 'Security verification codes with strict OTP guidelines.'}
                </p>
              </div>

              {/* Language */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Language *
                </label>
                <select
                  value={draft.language}
                  onChange={(e) => onChange({ ...draft, language: e.target.value, updatedAt: 'Just now' })}
                  className={`w-full text-xs px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                    isDark ? 'bg-[#181A1F] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name} ({lang.code}) {lang.nativeName ? `• ${lang.nativeName}` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Draft content should match this language. No automated AI translation is applied.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. HEADER */}
        {/* ========================================================= */}
        <section
          id="sec-header"
          className={`p-5 rounded-2xl border transition-all ${
            activeSection === 'header' ? 'ring-2 ring-[#5A4AD2]/20' : ''
          } ${
            isDark ? 'bg-[#21252B] border-slate-700/80' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Header (Optional)</h3>
                <p className="text-[11px] text-slate-400">Add a title or media banner to the top of your message</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Optional</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Header Type Selector */}
            <div className="grid grid-cols-3 gap-2">
              {(['none', 'text', 'image', 'document'] as HeaderType[]).map((ht) => (
                <button
                  key={ht}
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...draft,
                      header: {
                        ...draft.header,
                        type: ht
                      },
                      updatedAt: 'Just now'
                    };
                    onChange(updated);
                  }}
                  className={`py-2 px-3 rounded-xl border font-bold capitalize transition-all ${
                    draft.header.type === ht
                      ? 'bg-[#5A4AD2] border-[#5A4AD2] text-white shadow-2xs'
                      : isDark
                      ? 'bg-[#181A1F] border-slate-700 text-slate-300 hover:border-slate-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {ht === 'none' ? 'None' : ht === 'text' ? 'Text Header' : `${ht.charAt(0).toUpperCase() + ht.slice(1)}`}
                </button>
              ))}
            </div>

            {/* Text Header Input */}
            {draft.header.type === 'text' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Header Text (Max 60 characters) *
                  </label>
                  <span className={`text-[10px] ${
                    (draft.header.text?.length || 0) > 60 ? 'text-rose-500 font-bold' : 'text-slate-400'
                  }`}>
                    {draft.header.text?.length || 0} / 60
                  </span>
                </div>
                <input
                  type="text"
                  value={draft.header.text || ''}
                  onChange={(e) => {
                    const text = e.target.value;
                    const updatedVariables = syncVariables(draft.body, text, draft.variables);
                    onChange({
                      ...draft,
                      header: { ...draft.header, text },
                      variables: updatedVariables,
                      updatedAt: 'Just now'
                    });
                  }}
                  placeholder="e.g. Agamagizh Center Appointment Notice"
                  className={`w-full text-xs px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                    isDark ? 'bg-[#181A1F] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                {getFieldIssues('header', 'headerText').map((err) => (
                  <p key={err.id} className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{err.message}</span>
                  </p>
                ))}
              </div>
            )}

            {/* Media Attachment Guidance */}
            {(draft.header.type === 'image' || draft.header.type === 'document') && (
              <div
                className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                  isDark ? 'bg-[#181A1F] border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <Info className="w-4 h-4 text-[#5A4AD2] shrink-0" />
                <p className="text-[11px] leading-relaxed">
                  Meta templates define the media slot ({draft.header.type.toUpperCase()}). The actual image or PDF link is supplied dynamically when dispatching campaigns or API calls.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. BODY — PRIMARY EDITOR */}
        {/* ========================================================= */}
        <section
          id="sec-body"
          className={`p-5 rounded-2xl border transition-all ${
            activeSection === 'body' ? 'ring-2 ring-[#5A4AD2]/20' : ''
          } ${
            isDark ? 'bg-[#21252B] border-slate-700/80' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. Message Body *</h3>
                <p className="text-[11px] text-slate-400">Primary template message content with positional variables</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-rose-400">Required</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Editor Toolbar: + Add Variable, Quick Emojis, Character Count */}
            <div
              className={`p-2 rounded-xl border flex flex-wrap items-center justify-between gap-2 ${
                isDark ? 'bg-[#181A1F] border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleInsertVariable}
                  className="px-2.5 py-1 rounded-lg bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                  title="Insert next variable token (e.g. {{1}}, {{2}})"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Variable</span>
                </button>

                <div className={`h-4 w-px mx-1 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

                {/* Quick Emojis */}
                <div className="flex items-center gap-0.5">
                  {['👋', '📅', '⏰', '📍', '🏥', '⭐', '📋'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => handleInsertEmoji(em)}
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs hover:scale-110 transition-transform ${
                        isDark ? 'hover:bg-white/10' : 'hover:bg-slate-200'
                      }`}
                      title={`Insert ${em}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Character Limit Counter */}
              <div className="flex items-center gap-2 text-[11px]">
                <span
                  className={
                    draft.body.length > 1024
                      ? 'text-rose-500 font-bold'
                      : draft.body.length > 900
                      ? 'text-amber-500'
                      : 'text-slate-400'
                  }
                >
                  {draft.body.length} / 1024 chars
                </span>
              </div>
            </div>

            {/* Multiline Body Textarea */}
            <div>
              <textarea
                ref={bodyTextareaRef}
                rows={6}
                value={draft.body}
                onChange={(e) => handleBodyChange(e.target.value)}
                placeholder="Hello {{1}},\nYour appointment is confirmed for {{2}} at {{3}}."
                className={`w-full font-sans text-xs sm:text-[13px] leading-relaxed p-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-[#181A1F] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
              {getFieldIssues('body', 'body').map((err) => (
                <p key={err.id} className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{err.message}</span>
                </p>
              ))}
            </div>

            {/* Quick Variable Chips Indicator */}
            {draft.variables.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] font-bold text-slate-400">Detected Variables:</span>
                {draft.variables.map((v) => (
                  <span
                    key={v.token}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#5A4AD2]/15 text-[#8B7FF5] border border-[#5A4AD2]/30"
                  >
                    <span>{v.token}</span>
                    <span className="text-slate-400 font-sans font-normal truncate max-w-[120px]">
                      {v.example ? `(${v.example})` : '(missing example)'}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. VARIABLES & EXAMPLES */}
        {/* ========================================================= */}
        <section
          id="sec-variables"
          className={`p-5 rounded-2xl border transition-all ${
            activeSection === 'variables' ? 'ring-2 ring-[#5A4AD2]/20' : ''
          } ${
            isDark ? 'bg-[#21252B] border-slate-700/80' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">4. Variables & Sample Values</h3>
                <p className="text-[11px] text-slate-400">Meta requires realistic example values for all variables during payload review</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleInsertVariable}
              className="text-xs font-bold text-[#5A4AD2] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert Variable</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {draft.variables.length === 0 ? (
              <div
                className={`p-6 rounded-xl border text-center ${
                  isDark ? 'bg-[#181A1F] border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <Tag className="w-6 h-6 mx-auto mb-1 text-slate-400 opacity-60" />
                <p className="font-semibold text-xs">No variables in message body yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click &quot;Add Variable&quot; above to insert tokens like {"{{1}}"} or {"{{2}}"}.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {draft.variables.map((v) => {
                  const issue = getFieldIssues('variables', `var_${v.index}`)[0];
                  return (
                    <div
                      key={v.token}
                      className={`p-3.5 rounded-xl border transition-all ${
                        issue
                          ? 'border-rose-500/50 bg-rose-500/5'
                          : isDark
                          ? 'bg-[#181A1F] border-slate-700/80'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        {/* Token pill */}
                        <div className="sm:col-span-2">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-[#5A4AD2] text-white font-mono font-bold text-xs shadow-2xs">
                            {v.token}
                          </span>
                        </div>

                        {/* Example Value */}
                        <div className="sm:col-span-5">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Sample Value *
                          </label>
                          <input
                            type="text"
                            value={v.example}
                            onChange={(e) => handleUpdateVariable(v.index, e.target.value, v.description)}
                            placeholder="e.g. Meera Sundaram"
                            className={`w-full text-xs px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#5A4AD2] ${
                              isDark ? 'bg-[#21252B] border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>

                        {/* Description / Mapping */}
                        <div className="sm:col-span-5">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Field Mapping Description
                          </label>
                          <input
                            type="text"
                            value={v.description}
                            onChange={(e) => handleUpdateVariable(v.index, v.example, e.target.value)}
                            placeholder="e.g. Patient full name"
                            className={`w-full text-xs px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#5A4AD2] ${
                              isDark ? 'bg-[#21252B] border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>

                      {issue && (
                        <p className="text-[11px] text-rose-400 mt-2 flex items-center gap-1 font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{issue.message}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. FOOTER */}
        {/* ========================================================= */}
        <section
          id="sec-footer"
          className={`p-5 rounded-2xl border transition-all ${
            activeSection === 'footer' ? 'ring-2 ring-[#5A4AD2]/20' : ''
          } ${
            isDark ? 'bg-[#21252B] border-slate-700/80' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">5. Footer Text (Optional)</h3>
                <p className="text-[11px] text-slate-400">Subtle muted line displayed at the bottom of the WhatsApp bubble</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Optional</span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Footer Line (Max 60 characters)
              </label>
              <span className={`text-[10px] ${
                draft.footer.length > 60 ? 'text-rose-500 font-bold' : 'text-slate-400'
              }`}>
                {draft.footer.length} / 60
              </span>
            </div>
            <input
              type="text"
              value={draft.footer}
              onChange={(e) => onChange({ ...draft, footer: e.target.value, updatedAt: 'Just now' })}
              placeholder="e.g. Agamagizh Center • Reply STOP to unsubscribe"
              className={`w-full text-xs px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark ? 'bg-[#181A1F] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
            {getFieldIssues('footer', 'footer').map((err) => (
              <p key={err.id} className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3 h-3" />
                <span>{err.message}</span>
              </p>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. BUTTONS */}
        {/* ========================================================= */}
        <section
          id="sec-buttons"
          className={`p-5 rounded-2xl border transition-all ${
            activeSection === 'buttons' ? 'ring-2 ring-[#5A4AD2]/20' : ''
          } ${
            isDark ? 'bg-[#21252B] border-slate-700/80' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
                <CornerDownLeft className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">6. Interactive Buttons</h3>
                <p className="text-[11px] text-slate-400">Quick replies or action buttons (URL / Phone)</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleAddButton('QUICK_REPLY')}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                  isDark ? 'bg-[#181A1F] border-slate-700 text-slate-300 hover:bg-white/5' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Plus className="w-3 h-3 text-[#5A4AD2]" />
                <span>+ Quick Reply</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddButton('URL')}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                  isDark ? 'bg-[#181A1F] border-slate-700 text-slate-300 hover:bg-white/5' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Plus className="w-3 h-3 text-[#5A4AD2]" />
                <span>+ URL</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddButton('PHONE_NUMBER')}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                  isDark ? 'bg-[#181A1F] border-slate-700 text-slate-300 hover:bg-white/5' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Plus className="w-3 h-3 text-[#5A4AD2]" />
                <span>+ Call</span>
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {(!draft.buttons || draft.buttons.length === 0) ? (
              <div
                className={`p-6 rounded-xl border text-center ${
                  isDark ? 'bg-[#181A1F] border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <CornerDownLeft className="w-6 h-6 mx-auto mb-1 text-slate-400 opacity-60" />
                <p className="font-semibold text-xs">No interactive buttons configured</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click a button above to add Quick Replies (e.g. &quot;Confirm&quot;) or Call-to-Action buttons.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {draft.buttons.map((btn, idx) => (
                  <div
                    key={btn.id || idx}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isDark ? 'bg-[#181A1F] border-slate-700/80' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#5A4AD2]/15 text-[#A094F7] border border-[#5A4AD2]/30 shrink-0">
                        {btn.type === 'QUICK_REPLY' ? 'Quick Reply' : btn.type === 'URL' ? 'Website URL' : 'Call Phone'}
                      </span>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                      {/* Label Input */}
                      <div>
                        <input
                          type="text"
                          value={btn.text}
                          onChange={(e) => handleUpdateButton(btn.id, { text: e.target.value })}
                          placeholder="Button Label (Max 25)"
                          className={`w-full text-xs px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#5A4AD2] ${
                            isDark ? 'bg-[#21252B] border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      {/* URL or Phone Input */}
                      {btn.type === 'URL' && (
                        <div>
                          <input
                            type="text"
                            value={btn.value || ''}
                            onChange={(e) => handleUpdateButton(btn.id, { value: e.target.value })}
                            placeholder="https://example.com/..."
                            className={`w-full text-xs px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#5A4AD2] ${
                              isDark ? 'bg-[#21252B] border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>
                      )}

                      {btn.type === 'PHONE_NUMBER' && (
                        <div>
                          <input
                            type="text"
                            value={btn.phoneNumber || ''}
                            onChange={(e) => handleUpdateButton(btn.id, { phoneNumber: e.target.value })}
                            placeholder="+91 44 2445 0099"
                            className={`w-full text-xs px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#5A4AD2] ${
                              isDark ? 'bg-[#21252B] border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Actions: Reorder, Delete */}
                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveButton(idx, 'up')}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 ${
                          isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
                        }`}
                        title="Move button up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === draft.buttons.length - 1}
                        onClick={() => handleMoveButton(idx, 'down')}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 ${
                          isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
                        }`}
                        title="Move button down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteButton(btn.id)}
                        className={`p-1.5 rounded-lg transition-colors hover:text-rose-400 ${
                          isDark ? 'hover:bg-rose-500/20 text-slate-400' : 'hover:bg-rose-50 text-slate-500'
                        }`}
                        title="Delete button"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* BOTTOM CALLOUT: Review / Prepare Payload Forward Action */}
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isDark ? 'bg-[#181A1F] border-[#2C313C]' : 'bg-[#F8F9FA] border-[#E3E5E9]'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Draft Readiness & Payload Inspection</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5A4AD2]/15 text-[#8B7FF5]">
                Local Draft Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Review your template configuration and inspect the provider-ready Meta Cloud API payload.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenReviewPayload}
            className="px-4 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all self-stretch sm:self-auto justify-center"
          >
            <span>Review / Prepare Payload</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
