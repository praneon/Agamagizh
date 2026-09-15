import React from 'react';
import { 
  Play, 
  MessageSquare, 
  HelpCircle, 
  GitBranch, 
  GitFork, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  Copy, 
  Trash2, 
  Plus, 
  X, 
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Check,
  CheckCircle,
  Hash,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { FlowNode, FlowEdge, BuilderNodeType, ValidationIssue } from './types';

interface NodeInspectorProps {
  selectedNode: FlowNode | null;
  nodes: FlowNode[];
  edges: FlowEdge[];
  onUpdateNodeData: (nodeId: string, updates: Partial<FlowNode['data']>) => void;
  onDuplicateNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onSelectNode?: (nodeId: string) => void;
  validationIssues: ValidationIssue[];
  theme: 'dark' | 'light';
  botName: string;
  botVersion: string;
}

const COMMON_VARIABLES = [
  '{{contact.name}}',
  '{{contact.phone}}',
  '{{clinic.name}}',
  '{{appointment.date}}',
  '{{doctor.name}}'
];

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  selectedNode,
  nodes,
  edges,
  onUpdateNodeData,
  onDuplicateNode,
  onDeleteNode,
  onSelectNode,
  validationIssues,
  theme,
  botName,
  botVersion
}) => {
  const isDark = theme === 'dark';

  const getNodeIcon = (type: BuilderNodeType) => {
    switch (type) {
      case 'start': return <Play className="w-3.5 h-3.5 text-emerald-400" />;
      case 'message': return <MessageSquare className="w-3.5 h-3.5 text-sky-400" />;
      case 'question': return <HelpCircle className="w-3.5 h-3.5 text-[#A094F7]" />;
      case 'choice': return <GitBranch className="w-3.5 h-3.5 text-amber-400" />;
      case 'condition': return <GitFork className="w-3.5 h-3.5 text-indigo-400" />;
      case 'wait': return <Clock className="w-3.5 h-3.5 text-slate-400" />;
      case 'handoff': return <UserCheck className="w-3.5 h-3.5 text-teal-400" />;
      case 'end': return <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  // When no node is selected: Overview & Quick Navigator
  if (!selectedNode) {
    const errorCount = validationIssues.filter((i) => i.severity === 'error').length;
    const warningCount = validationIssues.filter((i) => i.severity === 'warning').length;

    return (
      <div 
        id="chatbot-node-inspector"
        className={`w-[320px] shrink-0 border-l flex flex-col h-full overflow-y-auto transition-colors ${
          isDark 
            ? 'bg-[#181A1F] border-[#2C313C] text-slate-300' 
            : 'bg-[#F9FAFB] border-[#E5E7EB] text-slate-700'
        }`}
      >
        <div className="p-4 border-b border-inherit">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A4AD2]">
            Chatbot Properties
          </h3>
          <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Click any step on the canvas or below to configure its settings.
          </p>
        </div>

        <div className="p-4 space-y-4 text-xs">
          {/* Active Flow Overview Card */}
          <div className={`p-3 rounded-2xl border space-y-2.5 ${
            isDark ? 'bg-[#21252B] border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Flow Metadata</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#5A4AD2]/20 text-[#A094F7]">
                {botVersion}
              </span>
            </div>
            <div className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{botName}</div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-inherit text-center">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-[#181A1F]' : 'bg-slate-50'}`}>
                <div className="text-base font-bold text-[#5A4AD2]">{nodes.length}</div>
                <div className="text-[10px] text-slate-400">Total Steps</div>
              </div>
              <div className={`p-2 rounded-xl ${isDark ? 'bg-[#181A1F]' : 'bg-slate-50'}`}>
                <div className="text-base font-bold text-emerald-400">{edges.length}</div>
                <div className="text-[10px] text-slate-400">Connections</div>
              </div>
            </div>

            {/* Validation Health Pill */}
            <div className={`pt-2 border-t border-inherit flex items-center justify-between text-[11px]`}>
              <span className="text-slate-400">Flow Health:</span>
              <span className={`font-semibold flex items-center gap-1 ${
                errorCount > 0 ? 'text-rose-400' : warningCount > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {errorCount > 0 
                  ? `${errorCount} Blocking Errors` 
                  : warningCount > 0 
                  ? `${warningCount} Warnings` 
                  : 'Valid & Ready'}
              </span>
            </div>
          </div>

          {/* Quick Steps Navigator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Steps in this Chatbot ({nodes.length})
              </span>
            </div>
            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {nodes.map((n) => {
                const stepIssues = validationIssues.filter((i) => i.nodeId === n.id);
                return (
                  <div
                    key={n.id}
                    onClick={() => onSelectNode?.(n.id)}
                    className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer group transition-colors ${
                      isDark 
                        ? 'bg-[#21252B] hover:bg-[#282C34] border-slate-700/80 text-slate-200' 
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-md bg-black/20 flex items-center justify-center shrink-0">
                        {getNodeIcon(n.type)}
                      </div>
                      <span className="truncate text-xs font-semibold group-hover:text-[#5A4AD2] transition-colors">
                        {n.data.title || n.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {stepIssues.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-amber-400" title="Has issues" />
                      )}
                      <span className={`text-[9px] uppercase font-mono px-1 rounded ${
                        isDark ? 'bg-[#181A1F] text-slate-400' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {n.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Canvas Navigation Tips */}
          <div className={`p-3 rounded-2xl border text-[11px] space-y-2 ${
            isDark ? 'bg-[#21252B]/60 border-slate-700/60 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <div className="flex items-center gap-1.5 font-semibold text-slate-300 dark:text-slate-200">
              <Info className="w-3.5 h-3.5 text-[#5A4AD2]" />
              <span>Canvas Shortcuts</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Click & drag blank area to pan</li>
              <li>Use arrow keys to pan canvas</li>
              <li>Click output handle to connect nodes</li>
              <li>Click node card to complete connection</li>
              <li>Click edge to select & Disconnect</li>
              <li>Ctrl+Z / Ctrl+Y to Undo/Redo</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const nodeIssues = validationIssues.filter((i) => i.nodeId === selectedNode.id);

  const handleTitleChange = (val: string) => {
    onUpdateNodeData(selectedNode.id, { title: val });
  };

  const handleInsertVariable = (varStr: string) => {
    const current = selectedNode.data.messageText || '';
    onUpdateNodeData(selectedNode.id, { messageText: `${current} ${varStr}`.trim() });
  };

  // Dynamic list of variables available from preceding question nodes
  const availableQuestionVariables = nodes
    .filter((n) => n.type === 'question' && n.data.saveResponseAs)
    .map((n) => n.data.saveResponseAs as string);

  return (
    <div 
      id="chatbot-node-inspector"
      className={`w-[320px] shrink-0 border-l flex flex-col h-full overflow-y-auto transition-colors ${
        isDark 
          ? 'bg-[#181A1F] border-[#2C313C] text-slate-200' 
          : 'bg-white border-[#E5E7EB] text-slate-800'
      }`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center">
              {getNodeIcon(selectedNode.type)}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A4AD2]">
              {selectedNode.type === 'message' && 'MESSAGE PROPERTIES'}
              {selectedNode.type === 'question' && 'QUESTION PROPERTIES'}
              {selectedNode.type === 'choice' && 'CHOICE PROPERTIES'}
              {selectedNode.type === 'condition' && 'CONDITION PROPERTIES'}
              {selectedNode.type === 'handoff' && 'HANDOFF PROPERTIES'}
              {selectedNode.type === 'wait' && 'WAIT PROPERTIES'}
              {selectedNode.type === 'end' && 'END PROPERTIES'}
              {selectedNode.type === 'start' && 'START TRIGGER PROPERTIES'}
            </span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}>
            {selectedNode.type}
          </span>
        </div>

        {/* Node Title input */}
        <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
          Step Title
        </label>
        <input
          type="text"
          value={selectedNode.data.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={`w-full text-xs font-semibold px-2.5 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
            isDark 
              ? 'bg-[#21252B] border-slate-700 text-white' 
              : 'bg-slate-50 border-slate-300 text-slate-800'
          }`}
        />

        {/* Validation issues for this node */}
        {nodeIssues.length > 0 && (
          <div className="mt-3 space-y-1">
            {nodeIssues.map((issue) => (
              <div
                key={issue.id}
                className={`flex items-start gap-1.5 p-2 rounded-xl text-[11px] border leading-tight ${
                  issue.severity === 'error'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                <span>{issue.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Body Controls Tailored per Node Type */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* START */}
        {selectedNode.type === 'start' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Trigger Description
              </label>
              <input
                type="text"
                value={selectedNode.data.messageText || ''}
                onChange={(e) => onUpdateNodeData(selectedNode.id, { messageText: e.target.value })}
                placeholder="Inbound WhatsApp conversation"
                className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-[#21252B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Executes automatically whenever an inbound patient message is received on this WhatsApp channel.
            </p>

            {/* Next Step Connection Status */}
            <div className={`p-2.5 rounded-xl border space-y-1 ${
              isDark ? 'bg-[#21252B] border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">First Conversation Step</span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <ArrowRight className="w-3.5 h-3.5 text-[#5A4AD2] shrink-0" />
                {(() => {
                  const edge = edges.find((e) => e.source === selectedNode.id);
                  const target = edge ? nodes.find((n) => n.id === edge.target) : null;
                  return target ? (
                    <span className="font-semibold truncate text-emerald-400">
                      → {target.data.title || target.type}
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium">
                      Unconnected (connect right handle on canvas)
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* MESSAGE */}
        {selectedNode.type === 'message' && (
          <div className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-semibold text-slate-400 uppercase">
                  WhatsApp Message Content
                </label>
                <span className="text-[10px] text-slate-400">
                  {(selectedNode.data.messageText || '').length} chars
                </span>
              </div>

              <textarea
                rows={4}
                value={selectedNode.data.messageText || ''}
                onChange={(e) => onUpdateNodeData(selectedNode.id, { messageText: e.target.value })}
                placeholder="Type WhatsApp message here…"
                className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] resize-none ${
                  isDark ? 'bg-[#21252B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Supports WhatsApp formatting: <code className="font-mono text-[10px]">*bold*</code>, <code className="font-mono text-[10px]">_italic_</code>.
              </p>
            </div>

            {/* Personalization Variables Chips */}
            <div>
              <span className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">
                Insert Personalization Variable
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[...COMMON_VARIABLES, ...availableQuestionVariables.map((v) => `{{${v}}}`)].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleInsertVariable(v)}
                    className={`text-[10px] font-mono font-medium px-2 py-1 rounded-lg border transition-colors ${
                      isDark 
                        ? 'bg-[#21252B] hover:bg-[#282C34] border-slate-700 text-[#A094F7]' 
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-[#5A4AD2]'
                    }`}
                  >
                    + {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Attachment Simulation */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Media Attachment
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['none', 'image', 'document'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onUpdateNodeData(selectedNode.id, { mediaAttachment: m })}
                    className={`py-1.5 text-[11px] font-semibold rounded-xl border capitalize transition-colors flex items-center justify-center gap-1.5 ${
                      (selectedNode.data.mediaAttachment || 'none') === m
                        ? 'bg-[#5A4AD2] border-[#5A4AD2] text-white'
                        : isDark
                        ? 'bg-[#21252B] border-slate-700 text-slate-300 hover:bg-[#282C34]'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {m === 'image' && <ImageIcon className="w-3 h-3" />}
                    {m === 'document' && <FileText className="w-3 h-3" />}
                    <span>{m}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Next Step Connection Status */}
            <div className={`p-2.5 rounded-xl border space-y-1 ${
              isDark ? 'bg-[#21252B] border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subsequent Step</span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <ArrowRight className="w-3.5 h-3.5 text-[#5A4AD2] shrink-0" />
                {(() => {
                  const edge = edges.find((e) => e.source === selectedNode.id);
                  const target = edge ? nodes.find((n) => n.id === edge.target) : null;
                  return target ? (
                    <span className="font-semibold truncate text-emerald-400">
                      → {target.data.title || target.type}
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium">
                      Unconnected (connect right handle on canvas)
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* QUESTION */}
        {selectedNode.type === 'question' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Question Prompt
              </label>
              <textarea
                rows={3}
                value={selectedNode.data.questionText || ''}
                onChange={(e) => onUpdateNodeData(selectedNode.id, { questionText: e.target.value })}
                placeholder="What would you like help with?"
                className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] resize-none ${
                  isDark ? 'bg-[#21252B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              />
            </div>

            {/* Variable Name */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Save Response As Variable
              </label>
              <input
                type="text"
                value={selectedNode.data.saveResponseAs || ''}
                onChange={(e) => onUpdateNodeData(selectedNode.id, { saveResponseAs: e.target.value })}
                placeholder="e.g. patient_name or support_topic"
                className={`w-full font-mono text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-[#21252B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              />
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Preview tag:</span>
                <span className="px-1.5 py-0.5 rounded bg-[#5A4AD2]/20 text-[#A094F7] font-mono text-[10px] font-bold">
                  {'{{' + (selectedNode.data.saveResponseAs || 'variable') + '}}'}
                </span>
              </div>
            </div>

            {/* Expected Answer Type */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Expected Answer Type
              </label>
              <select
                value={selectedNode.data.answerType || 'text'}
                onChange={(e) => onUpdateNodeData(selectedNode.id, { answerType: e.target.value as any })}
                className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-[#21252B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="text">Free Text</option>
                <option value="phone">Phone Number</option>
                <option value="number">Numeric</option>
                <option value="date">Date (YYYY-MM-DD)</option>
              </select>
            </div>

            {/* Fallback prompt */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Invalid Input Fallback Prompt
              </label>
              <input
                type="text"
                value={selectedNode.data.fallbackPrompt || ''}
                onChange={(e) => onUpdateNodeData(selectedNode.id, { fallbackPrompt: e.target.value })}
                placeholder="e.g. Please enter a valid response to proceed."
                className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-[#21252B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Re-prompt sent if the patient enters text incompatible with expected type.
              </p>
            </div>

            {/* Next Step Connection Status */}
            <div className={`p-2.5 rounded-xl border space-y-1 ${
              isDark ? 'bg-[#21252B] border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subsequent Step</span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <ArrowRight className="w-3.5 h-3.5 text-[#5A4AD2] shrink-0" />
                {(() => {
                  const edge = edges.find((e) => e.source === selectedNode.id);
                  const target = edge ? nodes.find((n) => n.id === edge.target) : null;
                  return target ? (
                    <span className="font-semibold truncate text-emerald-400">
                      → {target.data.title || target.type}
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium">
                      Unconnected (connect right handle on canvas)
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* CHOICE */}
        {selectedNode.type === 'choice' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Question / Prompt
              </label>
              <input
                type="text"
                value={selectedNode.data.questionText || ''}
                onChange={(e) => onUpdateNodeData(selectedNode.id, { questionText: e.target.value })}
                placeholder="Please select an option:"
                className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-[#21252B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              />
            </div>

            {/* Quick Template Presets */}
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Quick Option Presets
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateNodeData(selectedNode.id, {
                      choices: [
                        { id: 'opt-yes', label: 'Yes, proceed' },
                        { id: 'opt-no', label: 'No, cancel' }
                      ]
                    });
                  }}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors ${
                    isDark ? 'bg-[#21252B] hover:bg-[#282C34] border-slate-700' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  Yes / No
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateNodeData(selectedNode.id, {
                      choices: [
                        { id: 'opt-appt', label: 'Book Appointment' },
                        { id: 'opt-hours', label: 'Clinic Timings' },
                        { id: 'opt-agent', label: 'Talk to Agent' }
                      ]
                    });
                  }}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors ${
                    isDark ? 'bg-[#21252B] hover:bg-[#282C34] border-slate-700' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  Clinic Triage
                </button>
              </div>
            </div>

            {/* Choice Option List */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-semibold text-slate-400 uppercase">
                  Option Branches ({(selectedNode.data.choices || []).length})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const existing = selectedNode.data.choices || [];
                    const newId = `opt-${Date.now()}`;
                    onUpdateNodeData(selectedNode.id, {
                      choices: [...existing, { id: newId, label: `Option ${existing.length + 1}` }]
                    });
                  }}
                  className="text-[10px] font-bold text-[#5A4AD2] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Option</span>
                </button>
              </div>

              <div className="space-y-2">
                {(selectedNode.data.choices || []).map((opt, idx) => {
                  const edge = edges.find(
                    (e) => e.source === selectedNode.id && (e.sourceHandle === opt.id || e.label === opt.label)
                  );
                  const targetNode = edge ? nodes.find((n) => n.id === edge.target) : null;

                  return (
                    <div
                      key={opt.id}
                      className={`p-2.5 rounded-xl border space-y-1.5 ${
                        isDark ? 'bg-[#21252B] border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 text-center font-bold text-[10px] text-slate-400">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => {
                            const updated = (selectedNode.data.choices || []).map((o) =>
                              o.id === opt.id ? { ...o, label: e.target.value } : o
                            );
                            onUpdateNodeData(selectedNode.id, { choices: updated });
                          }}
                          className={`flex-1 text-xs px-2 py-1 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#5A4AD2] ${
                            isDark ? 'bg-[#181A1F] border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        />
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const choices = [...(selectedNode.data.choices || [])];
                              const temp = choices[idx - 1];
                              choices[idx - 1] = choices[idx];
                              choices[idx] = temp;
                              onUpdateNodeData(selectedNode.id, { choices });
                            }}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                            title="Move Option Up"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === (selectedNode.data.choices || []).length - 1}
                            onClick={() => {
                              const choices = [...(selectedNode.data.choices || [])];
                              const temp = choices[idx + 1];
                              choices[idx + 1] = choices[idx];
                              choices[idx] = temp;
                              onUpdateNodeData(selectedNode.id, { choices });
                            }}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                            title="Move Option Down"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (selectedNode.data.choices || []).filter((o) => o.id !== opt.id);
                              onUpdateNodeData(selectedNode.id, { choices: updated });
                            }}
                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete Option"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Connection status indicator */}
                      <div className="flex items-center gap-1.5 text-[10px] pl-6">
                        <ArrowRight className="w-3 h-3 text-[#5A4AD2]" />
                        {targetNode ? (
                          <span className="text-emerald-400 font-medium truncate">
                            Connected to: {targetNode.data.title || targetNode.type}
                          </span>
                        ) : (
                          <span className="text-amber-400 font-medium">
                            Unconnected handle (connect dot on canvas)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CONDITION */}
        {selectedNode.type === 'condition' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Field to Evaluate
              </label>
              <select
                value={selectedNode.data.condition?.field || 'Contact label'}
                onChange={(e) => {
                  const current = selectedNode.data.condition || { operator: 'equals', value: '' };
                  onUpdateNodeData(selectedNode.id, {
                    condition: { ...current, field: e.target.value }
                  });
                }}
                className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-[#21252B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <optgroup label="Contact Attributes">
                  <option value="Contact label">Contact label</option>
                  <option value="Contact name">Contact name</option>
                  <option value="Message content">Message content</option>
                  <option value="Inbound hour">Inbound hour</option>
                  <option value="Language">Language</option>
                </optgroup>
                {availableQuestionVariables.length > 0 && (
                  <optgroup label="Captured Variables">
                    {availableQuestionVariables.map((v) => (
                      <option key={v} value={v}>Variable: {v}</option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Comparison Operator
              </label>
              <select
                value={selectedNode.data.condition?.operator || 'equals'}
                onChange={(e) => {
                  const current = selectedNode.data.condition || { field: 'Contact label', value: '' };
                  onUpdateNodeData(selectedNode.id, {
                    condition: { ...current, operator: e.target.value as any }
                  });
                }}
                className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-[#21252B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="equals">equals</option>
                <option value="contains">contains</option>
                <option value="not_equals">not equals</option>
                <option value="is_present">is present (not empty)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Comparison Value
              </label>
              <input
                type="text"
                value={selectedNode.data.condition?.value || ''}
                onChange={(e) => {
                  const current = selectedNode.data.condition || { field: 'Contact label', operator: 'equals' };
                  onUpdateNodeData(selectedNode.id, {
                    condition: { ...current, value: e.target.value }
                  });
                }}
                placeholder="e.g. VIP or Urgent"
                className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-[#21252B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              />
            </div>

            {/* TRUE Output Destination */}
            <div className={`p-2.5 rounded-xl border space-y-1 ${
              isDark ? 'bg-[#21252B] border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">TRUE Output Branch</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {(() => {
                  const trueEdge = edges.find(
                    (e) => e.source === selectedNode.id && (e.sourceHandle === 'true' || e.label === 'True' || e.label === 'True Branch')
                  );
                  const target = trueEdge ? nodes.find((n) => n.id === trueEdge.target) : null;
                  return target ? (
                    <span className="font-semibold truncate text-emerald-400">
                      → {target.data.title || target.type}
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium">
                      Unconnected (connect green handle on canvas)
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* FALSE Output Destination */}
            <div className={`p-2.5 rounded-xl border space-y-1 ${
              isDark ? 'bg-[#21252B] border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">FALSE Output Branch</span>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <ArrowRight className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                {(() => {
                  const falseEdge = edges.find(
                    (e) => e.source === selectedNode.id && (e.sourceHandle === 'false' || e.label === 'False' || e.label === 'False Branch')
                  );
                  const target = falseEdge ? nodes.find((n) => n.id === falseEdge.target) : null;
                  return target ? (
                    <span className="font-semibold truncate text-rose-400">
                      → {target.data.title || target.type}
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium">
                      Unconnected (connect red handle on canvas)
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* WAIT */}
        {selectedNode.type === 'wait' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Pause Duration
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="1"
                  value={selectedNode.data.wait?.duration || 10}
                  onChange={(e) => {
                    const current = selectedNode.data.wait || { unit: 'minutes' };
                    onUpdateNodeData(selectedNode.id, {
                      wait: { ...current, duration: parseInt(e.target.value) || 1 }
                    });
                  }}
                  className={`text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                    isDark ? 'bg-[#21252B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}
                />
                <select
                  value={selectedNode.data.wait?.unit || 'minutes'}
                  onChange={(e) => {
                    const current = selectedNode.data.wait || { duration: 10 };
                    onUpdateNodeData(selectedNode.id, {
                      wait: { ...current, unit: e.target.value as any }
                    });
                  }}
                  className={`text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                    isDark ? 'bg-[#21252B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Note: WhatsApp enforces a 24-hour customer service window from the patient's last inbound message.
            </p>

            {/* Next Step Connection Status */}
            <div className={`p-2.5 rounded-xl border space-y-1 ${
              isDark ? 'bg-[#21252B] border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subsequent Step</span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <ArrowRight className="w-3.5 h-3.5 text-[#5A4AD2] shrink-0" />
                {(() => {
                  const edge = edges.find((e) => e.source === selectedNode.id);
                  const target = edge ? nodes.find((n) => n.id === edge.target) : null;
                  return target ? (
                    <span className="font-semibold truncate text-emerald-400">
                      → {target.data.title || target.type}
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium">
                      Unconnected (connect right handle on canvas)
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* HANDOFF */}
        {selectedNode.type === 'handoff' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Destination Type
              </label>
              <select
                value={selectedNode.data.handoff?.destinationType || 'team'}
                onChange={(e) => {
                  const current = selectedNode.data.handoff || { target: 'Reception Team' };
                  onUpdateNodeData(selectedNode.id, {
                    handoff: { ...current, destinationType: e.target.value as any }
                  });
                }}
                className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-[#21252B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="team">Team Queue</option>
                <option value="agent">Direct Agent</option>
                <option value="inbox">Specific Inbox</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Target Team or Agent
              </label>
              <select
                value={selectedNode.data.handoff?.target || 'Reception Team'}
                onChange={(e) => {
                  const current = selectedNode.data.handoff || { destinationType: 'team' };
                  onUpdateNodeData(selectedNode.id, {
                    handoff: { ...current, target: e.target.value }
                  });
                }}
                className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-[#21252B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="Reception Team">Reception Team</option>
                <option value="Customer Care (Adyar)">Customer Care (Adyar)</option>
                <option value="Anna Nagar Desk">Anna Nagar Desk</option>
                <option value="Kavitha Sundaram">Kavitha Sundaram (Senior Coordinator)</option>
                <option value="Arunmozhi Rajan">Arunmozhi Rajan (Staff Nurse)</option>
              </select>
            </div>

            {/* Next Step Connection Status */}
            <div className={`p-2.5 rounded-xl border space-y-1 ${
              isDark ? 'bg-[#21252B] border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subsequent Step (Optional)</span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <ArrowRight className="w-3.5 h-3.5 text-[#5A4AD2] shrink-0" />
                {(() => {
                  const edge = edges.find((e) => e.source === selectedNode.id);
                  const target = edge ? nodes.find((n) => n.id === edge.target) : null;
                  return target ? (
                    <span className="font-semibold truncate text-emerald-400">
                      → {target.data.title || target.type}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium">
                      None (Handoff stops bot execution)
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* END */}
        {selectedNode.type === 'end' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                End Path Summary Note
              </label>
              <input
                type="text"
                value={selectedNode.data.endSummary || 'Finish this path'}
                onChange={(e) => onUpdateNodeData(selectedNode.id, { endSummary: e.target.value })}
                className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-[#21252B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Terminates the automated bot session gracefully for this conversational branch.
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions: Duplicate, Delete */}
      <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <button
          type="button"
          onClick={() => onDuplicateNode(selectedNode.id)}
          className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
            isDark 
              ? 'bg-[#21252B] hover:bg-[#282C34] border-slate-700 text-slate-200' 
              : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
          }`}
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Duplicate Step</span>
        </button>

        {selectedNode.type !== 'start' && (
          <button
            type="button"
            onClick={() => onDeleteNode(selectedNode.id)}
            className="w-full py-2 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Step</span>
          </button>
        )}
      </div>
    </div>
  );
};
