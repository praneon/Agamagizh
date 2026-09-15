import React, { useState } from 'react';
import { 
  SquareAsterisk, 
  Search, 
  Calendar, 
  Clock, 
  Phone, 
  Trash2, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  X,
  Loader2,
  ChevronDown,
  Info
} from 'lucide-react';

interface ButtonsAndInputsSectionProps {
  isDark?: boolean;
}

export const ButtonsAndInputsSection: React.FC<ButtonsAndInputsSectionProps> = ({ isDark = false }) => {
  // Input states
  const [textVal, setTextVal] = useState('Dr. Priya Swaminathan');
  const [textareaVal, setTextareaVal] = useState('Please confirm your appointment tomorrow at 10:30 AM at the Adyar Wellness Clinic.');
  const [searchVal, setSearchVal] = useState('Campaign: Follow-up');
  const [numVal, setNumVal] = useState(250);
  const [dateVal, setDateVal] = useState('2026-09-14');
  const [timeVal, setTimeVal] = useState('14:30');
  const [phoneVal, setPhoneVal] = useState('+91 98401 23456');

  // Select states
  const [singleSelect, setSingleSelect] = useState('reception');
  const [searchableSelect, setSearchableSelect] = useState('tamil_nadu');
  const [selectedChips, setSelectedChips] = useState(['Appointment', 'VIP', 'Adyar']);
  const [chipInput, setChipInput] = useState('');

  // Checkbox / Radio / Toggle states
  const [chk1, setChk1] = useState(true);
  const [chk2, setChk2] = useState(false);
  const [radioVal, setRadioVal] = useState('opt1');
  const [toggleVal, setToggleVal] = useState(true);
  const [toggleVal2, setToggleVal2] = useState(false);

  // Button loading simulator
  const [loadingBtn, setLoadingBtn] = useState(false);

  const handleSimulateLoading = () => {
    setLoadingBtn(true);
    setTimeout(() => setLoadingBtn(false), 1500);
  };

  const removeChip = (chip: string) => {
    setSelectedChips(prev => prev.filter(c => c !== chip));
  };

  return (
    <section id="buttons" className="space-y-8">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <SquareAsterisk className="w-5 h-5 text-[#5A4AD2]" />
          <span>Buttons, Form Inputs & Selection Controls</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Canonical interactive controls, accessibility focus rings, and explicit state matrices.
        </p>
      </div>

      {/* Button Rule Callout Banner */}
      <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
        isDark ? 'bg-violet-950/40 border-violet-900/60 text-violet-200' : 'bg-violet-50 border-violet-200 text-[#5A4AD2]'
      }`}>
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <span className="font-bold">Agamagizh Primary Action Rule:</span>
          <p className="opacity-90">
            <strong>Agamagizh Violet (`#5A4AD2`)</strong> is the canonical primary action color across all consoles. <strong>Green is NOT the global primary button color</strong>; green is reserved for positive lifecycle statuses and success toasts.
          </p>
        </div>
      </div>

      {/* 1. Buttons Matrix */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Button Variants & Interaction States
        </h3>
        
        <div className={`p-4 sm:p-5 rounded-2xl border space-y-6 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Default State Row */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 block mb-2">Default Action Examples</span>
            <div className="flex flex-wrap items-center gap-3">
              {/* Primary */}
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5A4AD2] text-white hover:bg-[#4838B8] focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:ring-offset-2 transition-colors shadow-2xs"
              >
                Save Draft
              </button>

              {/* Primary with Icon */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#5A4AD2] text-white hover:bg-[#4838B8] focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:ring-offset-2 transition-colors shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Validate & Launch</span>
              </button>

              {/* Secondary */}
              <button
                type="button"
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                Cancel
              </button>

              {/* Ghost / Tertiary */}
              <button
                type="button"
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isDark 
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Reset All
              </button>

              {/* Danger */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Rule</span>
              </button>

              {/* Icon Button */}
              <button
                type="button"
                aria-label="Refresh operational sync"
                className={`p-2 rounded-xl border transition-colors ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive States Demonstration */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 block mb-2">System States: Disabled, Loading & Focus</span>
            <div className="flex flex-wrap items-center gap-3">
              {/* Disabled Primary */}
              <button
                type="button"
                disabled
                title="Requires verified audience selection"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5A4AD2]/40 text-white/70 cursor-not-allowed"
              >
                Save Draft (Disabled)
              </button>

              {/* Disabled Secondary */}
              <button
                type="button"
                disabled
                className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-not-allowed opacity-50 ${
                  isDark ? 'border-slate-800 text-slate-600' : 'border-slate-200 text-slate-400'
                }`}
              >
                Validate (Disabled)
              </button>

              {/* Loading State Button */}
              <button
                type="button"
                onClick={handleSimulateLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#5A4AD2] text-white hover:bg-[#4838B8] transition-colors"
              >
                {loadingBtn ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Draft…</span>
                  </>
                ) : (
                  <span>Click to Test Loading</span>
                )}
              </button>

              {/* Explicit Focused State Sample */}
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5A4AD2] text-white ring-2 ring-[#5A4AD2] ring-offset-2"
              >
                Focused Action Ring
              </button>

              {/* Pressed / Active State */}
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#4838B8] text-white scale-95 shadow-inner"
              >
                Active / Pressed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Inputs Matrix */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Form Input Types & State Spectrum
        </h3>

        <div className={`p-4 sm:p-5 rounded-2xl border space-y-5 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Row 1: Text, Search, Phone */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Standard Text Input */}
            <div className="space-y-1.5">
              <label htmlFor="ref-text-input" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Text Input (Filled)
              </label>
              <input
                id="ref-text-input"
                type="text"
                value={textVal}
                onChange={e => setTextVal(e.target.value)}
                className={`w-full text-xs font-medium px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
              <span className="text-[10px] text-slate-400">Default filled form input</span>
            </div>

            {/* Search Input */}
            <div className="space-y-1.5">
              <label htmlFor="ref-search-input" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Search Input
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="ref-search-input"
                  type="text"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search campaigns, contacts, templates…"
                  className={`w-full text-xs font-medium pl-8 pr-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
              </div>
              <span className="text-[10px] text-slate-400">Instant filter with search icon</span>
            </div>

            {/* Phone Input */}
            <div className="space-y-1.5">
              <label htmlFor="ref-phone-input" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Phone Number (E.164)
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="ref-phone-input"
                  type="tel"
                  value={phoneVal}
                  onChange={e => setPhoneVal(e.target.value)}
                  className={`w-full text-xs font-mono pl-8 pr-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
              </div>
              <span className="text-[10px] text-slate-400">Formatted destination recipient</span>
            </div>
          </div>

          {/* Row 2: Date, Time, Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Input */}
            <div className="space-y-1.5">
              <label htmlFor="ref-date-input" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Date Input
              </label>
              <div className="relative">
                <input
                  id="ref-date-input"
                  type="date"
                  value={dateVal}
                  onChange={e => setDateVal(e.target.value)}
                  className={`w-full text-xs font-medium px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
              </div>
              <span className="text-[10px] text-slate-400">Broadcast schedule window</span>
            </div>

            {/* Time Input */}
            <div className="space-y-1.5">
              <label htmlFor="ref-time-input" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Time Input
              </label>
              <div className="relative">
                <input
                  id="ref-time-input"
                  type="time"
                  value={timeVal}
                  onChange={e => setTimeVal(e.target.value)}
                  className={`w-full text-xs font-medium px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
              </div>
              <span className="text-[10px] text-slate-400">Exact hour dispatch lock</span>
            </div>

            {/* Number Input */}
            <div className="space-y-1.5">
              <label htmlFor="ref-num-input" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Number / Quota
              </label>
              <input
                id="ref-num-input"
                type="number"
                value={numVal}
                onChange={e => setNumVal(Number(e.target.value))}
                className={`w-full text-xs font-medium px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
              <span className="text-[10px] text-slate-400">Batch size & audience limits</span>
            </div>
          </div>

          {/* Row 3: States: Error, Disabled, Read-only */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Error Input */}
            <div className="space-y-1.5">
              <label htmlFor="ref-err-input" className="text-[11px] font-bold uppercase tracking-wider text-rose-500 flex items-center justify-between">
                <span>Input (Validation Error)</span>
                <AlertCircle className="w-3.5 h-3.5" />
              </label>
              <input
                id="ref-err-input"
                type="text"
                defaultValue="invalid-template-token"
                aria-invalid="true"
                aria-describedby="ref-err-msg"
                className={`w-full text-xs font-medium px-3 py-2 rounded-xl border border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500`}
              />
              <span id="ref-err-msg" className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                Variable {`{{2}}`} needs an approved example value.
              </span>
            </div>

            {/* Disabled Input */}
            <div className="space-y-1.5">
              <label htmlFor="ref-disabled-input" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Input (Disabled)
              </label>
              <input
                id="ref-disabled-input"
                type="text"
                disabled
                defaultValue="Meta WABA Account: Locked by Admin"
                className={`w-full text-xs font-medium px-3 py-2 rounded-xl border cursor-not-allowed opacity-60 ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
              />
              <span className="text-[10px] text-slate-400">Requires Organization Administrator role</span>
            </div>

            {/* Read-Only Input */}
            <div className="space-y-1.5">
              <label htmlFor="ref-readonly-input" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Input (Read-Only)
              </label>
              <input
                id="ref-readonly-input"
                type="text"
                readOnly
                defaultValue="waba_tenant_chennai_994"
                className={`w-full text-xs font-mono px-3 py-2 rounded-xl border select-all ${
                  isDark ? 'bg-slate-800/50 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              />
              <span className="text-[10px] text-slate-400">Selectable for copying technical ID</span>
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-1.5 pt-2">
            <label htmlFor="ref-textarea" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Textarea (Message Body / Rule Description)
            </label>
            <textarea
              id="ref-textarea"
              rows={2}
              value={textareaVal}
              onChange={e => setTextareaVal(e.target.value)}
              className={`w-full text-xs font-medium p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Standard multi-line operational composer</span>
              <span>{textareaVal.length} / 1024 characters</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Select / Combobox & Multi-Select with Chips */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Select & Multi-Select with Chips
        </h3>

        <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Standard Single Select */}
            <div className="space-y-1.5">
              <label htmlFor="ref-single-select" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Single Select
              </label>
              <select
                id="ref-single-select"
                value={singleSelect}
                onChange={e => setSingleSelect(e.target.value)}
                className={`w-full text-xs font-medium px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <option value="reception">Agamagizh Reception Desk</option>
                <option value="support">Anna Nagar Center Support</option>
                <option value="intake">Pediatric Intake Pipeline</option>
                <option value="disabled_option" disabled>Adyar Branch (Maintenance)</option>
              </select>
              <span className="text-[10px] text-slate-400">Standard system dropdown with disabled option</span>
            </div>

            {/* Select with Error State */}
            <div className="space-y-1.5">
              <label htmlFor="ref-select-err" className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
                Select (Error State)
              </label>
              <select
                id="ref-select-err"
                defaultValue=""
                aria-invalid="true"
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="" disabled>Select an approved template…</option>
                <option value="t1">Appointment Confirmation</option>
              </select>
              <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                A template selection is required to proceed.
              </span>
            </div>

            {/* Select with Loading / Empty Options */}
            <div className="space-y-1.5">
              <label htmlFor="ref-select-loading" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Select (Loading / Empty)
              </label>
              <select
                id="ref-select-loading"
                disabled
                className={`w-full text-xs font-medium px-3 py-2 rounded-xl border opacity-70 ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
              >
                <option>Loading inboxes from Meta Cloud…</option>
              </select>
              <span className="text-[10px] text-slate-400">Demonstrates loading options indicator</span>
            </div>
          </div>

          {/* Multi-Select with Chips */}
          <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Multi-Select with Chips (Audience Tags)
            </label>
            <div className={`p-2.5 rounded-xl border flex flex-wrap items-center gap-2 ${
              isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              {selectedChips.map(chip => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-violet-100 text-[#5A4AD2] dark:bg-violet-950 dark:text-violet-300"
                >
                  <span>{chip}</span>
                  <button
                    type="button"
                    onClick={() => removeChip(chip)}
                    className="hover:text-violet-900 dark:hover:text-white"
                    aria-label={`Remove tag ${chip}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Type tag and press Enter…"
                value={chipInput}
                onChange={e => setChipInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && chipInput.trim()) {
                    e.preventDefault();
                    if (!selectedChips.includes(chipInput.trim())) {
                      setSelectedChips([...selectedChips, chipInput.trim()]);
                    }
                    setChipInput('');
                  }
                }}
                className={`text-xs px-2 py-1 bg-transparent focus:outline-none flex-1 min-w-[140px] ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Checkboxes, Radios & Toggles */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Checkbox, Radio & Toggle Controls (Accessible Dual-Cue States)
        </h3>

        <div className={`p-4 sm:p-5 rounded-2xl border grid grid-cols-1 md:grid-cols-3 gap-6 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Checkbox Group */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-slate-500 block">Checkboxes</span>
            
            <label className="flex items-start gap-2.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={chk1}
                onChange={e => setChk1(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#5A4AD2] focus:ring-[#5A4AD2] border-slate-300 dark:border-slate-700"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Enforce Pre-Flight Verification
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Withhold unverified recipients automatically.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={chk2}
                onChange={e => setChk2(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#5A4AD2] focus:ring-[#5A4AD2] border-slate-300 dark:border-slate-700"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Send Fallback SMS
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Optional channel retry if WhatsApp delivery fails.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-not-allowed opacity-60 text-xs">
              <input
                type="checkbox"
                disabled
                checked
                className="mt-0.5 w-4 h-4 rounded text-slate-400 border-slate-300"
              />
              <div>
                <span className="font-bold text-slate-500 block">
                  HIPAA & DPDP Compliance Log (Locked)
                </span>
                <span className="text-[11px] text-slate-400">
                  Always active for healthcare organization tenants.
                </span>
              </div>
            </label>
          </div>

          {/* Radio Group */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-slate-500 block">Radio Selection</span>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs">
              <input
                type="radio"
                name="ref-radio"
                value="opt1"
                checked={radioVal === 'opt1'}
                onChange={() => setRadioVal('opt1')}
                className="mt-0.5 text-[#5A4AD2] focus:ring-[#5A4AD2]"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Immediate Broadcast Dispatch
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Send upon preflight confirmation approval.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs">
              <input
                type="radio"
                name="ref-radio"
                value="opt2"
                checked={radioVal === 'opt2'}
                onChange={() => setRadioVal('opt2')}
                className="mt-0.5 text-[#5A4AD2] focus:ring-[#5A4AD2]"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Schedule for Specific Window
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Target local working hours (10:00 AM – 6:00 PM).
                </span>
              </div>
            </label>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-slate-500 block">Toggle Switches</span>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Automation Rule Active
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Status: {toggleVal ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={toggleVal}
                onClick={() => setToggleVal(!toggleVal)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  toggleVal ? 'bg-[#5A4AD2]' : isDark ? 'bg-slate-700' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    toggleVal ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Auto-Assign to Agent
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Status: {toggleVal2 ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={toggleVal2}
                onClick={() => setToggleVal2(!toggleVal2)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  toggleVal2 ? 'bg-[#5A4AD2]' : isDark ? 'bg-slate-700' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    toggleVal2 ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
