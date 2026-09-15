import React, { useState } from 'react';
import { 
  CampaignAudienceType, 
  CsvParsedData, 
  CsvState 
} from '../types';
import { 
  AVAILABLE_CRM_LABELS, 
  SAVED_CONTACT_FILTERS, 
  MOCK_DEFAULT_CSV 
} from '../campaignMockData';
import { INITIAL_CONTACTS } from '../../../data/mockData';
import { 
  Tag, 
  FileSpreadsheet, 
  Filter, 
  Users, 
  Check, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  X, 
  AlertCircle, 
  Info,
  Phone,
  RefreshCw
} from 'lucide-react';

interface Step2AudienceProps {
  audienceType: CampaignAudienceType;
  onChangeAudienceType: (type: CampaignAudienceType) => void;
  // Labels
  selectedLabels: string[];
  onChangeSelectedLabels: (labels: string[]) => void;
  // CSV
  csvData?: CsvParsedData;
  onChangeCsvData: (data?: CsvParsedData) => void;
  csvMapping: { nameCol: string; phoneCol: string };
  onChangeCsvMapping: (mapping: { nameCol: string; phoneCol: string }) => void;
  // Saved filter
  savedFilterId: string;
  onChangeSavedFilterId: (id: string) => void;
  // Manual contacts
  selectedContactIds: string[];
  onChangeSelectedContactIds: (ids: string[]) => void;
  // Calculated candidate count
  candidateCount: number;
}

export const Step2Audience: React.FC<Step2AudienceProps> = ({
  audienceType,
  onChangeAudienceType,
  selectedLabels,
  onChangeSelectedLabels,
  csvData = MOCK_DEFAULT_CSV,
  onChangeCsvData,
  csvMapping,
  onChangeCsvMapping,
  savedFilterId,
  onChangeSavedFilterId,
  selectedContactIds,
  onChangeSelectedContactIds,
  candidateCount
}) => {
  // Label search
  const [labelSearch, setLabelSearch] = useState('');
  
  // CSV UI state
  const [csvState, setCsvState] = useState<CsvState>(csvData ? 'validated_with_issues' : 'empty');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  // Manual Contact search & label filter
  const [contactSearch, setContactSearch] = useState('');
  const [contactLabelFilter, setContactLabelFilter] = useState('all');

  const audienceOptions: { id: CampaignAudienceType; title: string; desc: string; icon: any }[] = [
    {
      id: 'labels',
      title: 'Contact Labels',
      desc: 'Target CRM contacts matching one or more organizational tags.',
      icon: Tag
    },
    {
      id: 'csv',
      title: 'Upload CSV',
      desc: 'Import recipient phone numbers and custom fields from a CSV file.',
      icon: FileSpreadsheet
    },
    {
      id: 'saved_filter',
      title: 'Saved Contact Filter',
      desc: 'Target a pre-configured, dynamic segment saved from CRM queries.',
      icon: Filter
    },
    {
      id: 'manual',
      title: 'Manual Contacts',
      desc: 'Individually pick specific verified contacts from the CRM directory.',
      icon: Users
    }
  ];

  // Label handlers
  const handleToggleLabel = (labelName: string) => {
    if (selectedLabels.includes(labelName)) {
      onChangeSelectedLabels(selectedLabels.filter(l => l !== labelName));
    } else {
      onChangeSelectedLabels([...selectedLabels, labelName]);
    }
  };

  const filteredLabels = AVAILABLE_CRM_LABELS.filter(l => 
    l.name.toLowerCase().includes(labelSearch.toLowerCase())
  );

  // CSV Simulation Handlers
  const handleSimulateUpload = () => {
    setIsParsing(true);
    setCsvState('parsing');
    setTimeout(() => {
      setIsParsing(false);
      setCsvState('validated_with_issues');
      onChangeCsvData(MOCK_DEFAULT_CSV);
    }, 600);
  };

  const handleSimulateFatalError = () => {
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
      setCsvState('fatal_error');
    }, 400);
  };

  const handleClearCsv = () => {
    setCsvState('empty');
    onChangeCsvData(undefined);
  };

  // Manual contacts handlers
  const filteredContacts = INITIAL_CONTACTS.filter(c => {
    if (contactLabelFilter !== 'all' && !c.labels.includes(contactLabelFilter)) {
      return false;
    }
    if (contactSearch.trim()) {
      const q = contactSearch.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.company.toLowerCase().includes(q);
    }
    return true;
  });

  const handleToggleContact = (id: string) => {
    if (selectedContactIds.includes(id)) {
      onChangeSelectedContactIds(selectedContactIds.filter(cid => cid !== id));
    } else {
      onChangeSelectedContactIds([...selectedContactIds, id]);
    }
  };

  const handleSelectAllFiltered = () => {
    const ids = Array.from(new Set([...selectedContactIds, ...filteredContacts.map(c => c.id)]));
    onChangeSelectedContactIds(ids);
  };

  const handleDeselectAll = () => {
    onChangeSelectedContactIds([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Audience Source</h3>
        <p className="text-xs text-slate-500 mt-1">
          Select exactly one of the 4 canonical audience strategies to assemble candidate recipients.
        </p>
      </div>

      {/* 4 Canonical Audience Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {audienceOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = audienceType === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => onChangeAudienceType(opt.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#EEECFB] border-[#5A4AD2] shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#5A4AD2] text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-slate-900">{opt.title}</span>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#5A4AD2] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">{opt.desc}</p>
            </div>
          );
        })}
      </div>

      {/* ================= MODE 1: LABELS ================= */}
      {audienceType === 'labels' && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-900">Select CRM Contact Labels</h4>
            <span className="text-[11px] text-[#5A4AD2] font-bold">
              {selectedLabels.length} {selectedLabels.length === 1 ? 'label' : 'labels'} chosen
            </span>
          </div>

          {/* Search labels */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={labelSearch}
              onChange={(e) => setLabelSearch(e.target.value)}
              placeholder="Search tags (e.g. Adyar, Weekend, Follow-up)..."
              className="w-full text-xs pl-8.5 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white"
            />
          </div>

          {/* Active selection chips */}
          {selectedLabels.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Active Selection
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedLabels.map((lbl) => (
                  <span
                    key={lbl}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEECFB] text-[#5A4AD2] font-bold text-xs rounded-full border border-[#5A4AD2]/30"
                  >
                    <span>{lbl}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleLabel(lbl)}
                      className="hover:text-red-600 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Available label list */}
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Available CRM Tags
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredLabels.map((l) => {
                const isChecked = selectedLabels.includes(l.name);
                return (
                  <div
                    key={l.id}
                    onClick={() => handleToggleLabel(l.name)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-[#EEECFB]/70 border-[#5A4AD2] font-bold text-[#5A4AD2]'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isChecked ? 'bg-[#5A4AD2] border-[#5A4AD2] text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span>{l.name}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-500 font-semibold border border-slate-200">
                      ~{l.count} contacts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODE 2: CSV ================= */}
      {audienceType === 'csv' && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-slate-900">Import Recipient Phone Numbers via CSV</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload a UTF-8 encoded CSV file containing contacts with phone numbers.
              </p>
            </div>
            {csvData && (
              <button
                type="button"
                onClick={handleClearCsv}
                className="text-[11px] text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove File</span>
              </button>
            )}
          </div>

          {/* Upload Dropzone */}
          {(!csvData || csvState === 'empty' || csvState === 'fatal_error') && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleSimulateUpload(); }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                isDragOver 
                  ? 'border-[#5A4AD2] bg-[#EEECFB]/40' 
                  : csvState === 'fatal_error'
                  ? 'border-red-300 bg-red-50/50'
                  : 'border-slate-300 bg-slate-50/60 hover:bg-slate-50'
              }`}
            >
              {isParsing ? (
                <div className="py-4 space-y-2">
                  <RefreshCw className="w-7 h-7 text-[#5A4AD2] animate-spin mx-auto" />
                  <span className="font-bold text-xs text-slate-800 block">Parsing CSV rows and phone formats…</span>
                  <span className="text-[11px] text-slate-400">Verifying column structures and phone prefixes</span>
                </div>
              ) : csvState === 'fatal_error' ? (
                <div className="space-y-3">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                  <div>
                    <span className="font-bold text-xs text-red-700 block">Fatal CSV Parsing Error</span>
                    <span className="text-[11px] text-red-600 block mt-0.5">
                      The uploaded file is corrupt or not valid UTF-8 formatted CSV.
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSimulateUpload}
                      className="px-3 py-1.5 bg-[#5A4AD2] text-white text-xs font-bold rounded-xl"
                    >
                      Retry with Sample CSV
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EEECFB] text-[#5A4AD2] flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">
                      Drag and drop your recipient CSV here
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Supports .csv format up to 5MB (E.164 phone column required)
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleSimulateUpload}
                      className="px-4 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Select CSV File</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSimulateFatalError}
                      className="px-3 py-2 text-[11px] text-slate-500 hover:text-slate-800 font-semibold"
                    >
                      Simulate Error
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Parsed CSV Summary & Mappings */}
          {csvData && csvState !== 'empty' && csvState !== 'fatal_error' && (
            <div className="space-y-4">
              {/* File stats strip */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{csvData.fileName}</span>
                    <span className="text-[11px] text-slate-500">{csvData.fileSize} • {csvData.rowsParsed} total lines</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Valid Rows</span>
                    <span className="font-extrabold text-emerald-700">{csvData.validRows}</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Invalid</span>
                    <span className="font-extrabold text-red-600">{csvData.invalidRows}</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Duplicates</span>
                    <span className="font-extrabold text-amber-600">{csvData.duplicateRows}</span>
                  </div>
                </div>
              </div>

              {/* Column Mapping Selectors */}
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-900 block">Map CSV Columns</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Phone Number Column <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={csvMapping.phoneCol}
                      onChange={(e) => onChangeCsvMapping({ ...csvMapping, phoneCol: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
                    >
                      <option value="phone">Column B: Phone Number (e.g. +91 98401 22345)</option>
                      <option value="mobile">Column C: Mobile Number</option>
                      <option value="contact_num">Column D: Contact Number</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Contact Name Column
                    </label>
                    <select
                      value={csvMapping.nameCol}
                      onChange={(e) => onChangeCsvMapping({ ...csvMapping, nameCol: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
                    >
                      <option value="name">Column A: Contact Name (e.g. Meera Sundaram)</option>
                      <option value="full_name">Column E: Full Name</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Human-readable issues list */}
              {csvData.issues.length > 0 && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{csvData.issues.length} CSV Row Formatting Issues Detected (Ignored during candidate selection)</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1 text-[11px]">
                    {csvData.issues.slice(0, 4).map((iss, idx) => (
                      <div key={idx} className="flex items-center justify-between text-amber-800 bg-white/70 px-2 py-1 rounded">
                        <span>Row #{iss.rowNumber}: <strong className="font-mono">{iss.phone || '(empty)'}</strong></span>
                        <span className="font-semibold text-red-700">{iss.issue}</span>
                      </div>
                    ))}
                    {csvData.issues.length > 4 && (
                      <div className="text-[10px] text-amber-700 font-semibold pt-1">
                        + {csvData.issues.length - 4} additional row issues omitted from preview.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Critical Caveat Callout */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Important Notice:</strong> CSV parsing success is <em>NOT</em> canonical campaign eligibility! 
                  Candidate phone numbers will be checked for opt-in consent, suppression, and Meta delivery validity during Step 6: Canonical Preflight.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= MODE 3: SAVED CONTACT FILTER ================= */}
      {audienceType === 'saved_filter' && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-900">Select Saved CRM Contact Filter</h4>
            <span className="text-[11px] text-slate-500 font-medium">Dynamic segment query</span>
          </div>

          <div className="space-y-2.5">
            {SAVED_CONTACT_FILTERS.map((flt) => {
              const isChosen = savedFilterId === flt.id;
              return (
                <div
                  key={flt.id}
                  onClick={() => onChangeSavedFilterId(flt.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs ${
                    isChosen
                      ? 'bg-[#EEECFB] border-[#5A4AD2] shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isChosen ? 'border-[#5A4AD2] bg-[#5A4AD2] text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChosen && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <span className="font-bold text-slate-900">{flt.name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#5A4AD2] bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      ~{flt.candidateCount} candidates
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-6">{flt.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODE 4: MANUAL CONTACTS ================= */}
      {audienceType === 'manual' && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-slate-900">Manually Pick Verified Contacts</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Select individual contacts from the Agamagizh contact directory.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="text-[#5A4AD2] hover:underline font-bold"
              >
                Select All ({filteredContacts.length})
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="text-slate-500 hover:text-slate-800 font-semibold"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Search & Label Filters for Contacts */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Search contact name, phone, or company..."
                className="w-full text-xs pl-8.5 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white"
              />
            </div>
            <select
              value={contactLabelFilter}
              onChange={(e) => setContactLabelFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2]"
            >
              <option value="all">All CRM Labels</option>
              {AVAILABLE_CRM_LABELS.map(l => (
                <option key={l.id} value={l.name}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* Contacts Table / List */}
          <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold">
                <tr>
                  <th className="py-2 px-3 w-8"></th>
                  <th className="py-2 px-3">Contact</th>
                  <th className="py-2 px-3">Phone</th>
                  <th className="py-2 px-3">Labels</th>
                  <th className="py-2 px-3 text-right">Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContacts.map((c) => {
                  const isChecked = selectedContactIds.includes(c.id);
                  return (
                    <tr
                      key={c.id}
                      onClick={() => handleToggleContact(c.id)}
                      className={`cursor-pointer transition-colors ${
                        isChecked ? 'bg-[#EEECFB]/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2 px-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // Handled by tr onClick
                          className="rounded text-[#5A4AD2] focus:ring-[#5A4AD2]"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-bold text-slate-900 block">{c.name}</span>
                        <span className="text-[10px] text-slate-400">{c.company}</span>
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-700 text-[11px]">
                        {c.phone}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-wrap gap-1">
                          {c.labels.slice(0, 2).map((l) => (
                            <span key={l} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold">
                              {l}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span className="capitalize text-[10px] font-bold text-[#5A4AD2]">
                          {c.channel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Audience Summary Strip */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
            Audience Candidate Pool
          </span>
          <span className="text-slate-700 font-semibold">
            Strategy: <strong className="text-slate-900 capitalize">{audienceType.replace('_', ' ')}</strong>
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Candidates are selected records. Final recipient eligibility will be confirmed in Canonical Preflight.
          </p>
        </div>

        <div className="sm:text-right bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidates Selected</span>
          <span className="text-lg font-extrabold text-[#5A4AD2]">{candidateCount}</span>
        </div>
      </div>
    </div>
  );
};
