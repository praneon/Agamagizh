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
  AlertTriangle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { FlowNode, BuilderNodeType, ValidationIssue } from './types';

interface FlowCanvasNodeProps {
  node: FlowNode;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  onStartConnection: (sourceNodeId: string, sourceHandle: string, e: React.MouseEvent) => void;
  onConnectToNode: (targetNodeId: string) => void;
  onDuplicate: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  validationIssues: ValidationIssue[];
  theme: 'dark' | 'light';
  isConnecting: boolean;
  isActivePreview?: boolean;
}

const NODE_CONFIG: Record<
  BuilderNodeType, 
  { 
    label: string; 
    icon: React.ElementType; 
    accent: string; 
    borderActive: string; 
    badgeBg: string; 
    badgeText: string;
  }
> = {
  start: {
    label: 'Start Trigger',
    icon: Play,
    accent: '#10B981', // emerald-500
    borderActive: 'border-emerald-500',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400'
  },
  message: {
    label: 'Send Message',
    icon: MessageSquare,
    accent: '#38BDF8', // sky-400
    borderActive: 'border-sky-500',
    badgeBg: 'bg-sky-500/15',
    badgeText: 'text-sky-400'
  },
  question: {
    label: 'Ask Question',
    icon: HelpCircle,
    accent: '#8B7FF5', // violet
    borderActive: 'border-[#5A4AD2]',
    badgeBg: 'bg-[#5A4AD2]/20',
    badgeText: 'text-[#A094F7]'
  },
  choice: {
    label: 'Choice',
    icon: GitBranch,
    accent: '#FBBF24', // amber-400
    borderActive: 'border-amber-500',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-400'
  },
  condition: {
    label: 'Condition',
    icon: GitFork,
    accent: '#818CF8', // indigo-400
    borderActive: 'border-indigo-500',
    badgeBg: 'bg-indigo-500/15',
    badgeText: 'text-indigo-400'
  },
  wait: {
    label: 'Wait',
    icon: Clock,
    accent: '#94A3B8', // slate-400
    borderActive: 'border-slate-500',
    badgeBg: 'bg-slate-500/15',
    badgeText: 'text-slate-400'
  },
  handoff: {
    label: 'Handoff',
    icon: UserCheck,
    accent: '#2DD4BF', // teal-400
    borderActive: 'border-teal-500',
    badgeBg: 'bg-teal-500/15',
    badgeText: 'text-teal-400'
  },
  end: {
    label: 'End Flow',
    icon: CheckCircle2,
    accent: '#F87171', // rose-400
    borderActive: 'border-rose-500',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-400'
  }
};

export const FlowCanvasNode: React.FC<FlowCanvasNodeProps> = ({
  node,
  isSelected,
  onSelect,
  onStartConnection,
  onConnectToNode,
  onDuplicate,
  onDelete,
  validationIssues,
  theme,
  isConnecting,
  isActivePreview = false
}) => {
  const isDark = theme === 'dark';
  const config = NODE_CONFIG[node.type];
  const Icon = config.icon;

  const nodeIssues = validationIssues.filter((i) => i.nodeId === node.id);
  const hasErrors = nodeIssues.some((i) => i.severity === 'error');
  const hasWarnings = nodeIssues.some((i) => i.severity === 'warning');

  // Format variable pills like {{contact.name}}
  const renderTextWithVariables = (text?: string) => {
    if (!text) return <span className="italic text-slate-500">Not configured</span>;
    const parts = text.split(/(\{\{[^}]+\}\})/g);
    return (
      <>
        {parts.map((part, idx) => {
          if (part.startsWith('{{') && part.endsWith('}}')) {
            return (
              <span
                key={idx}
                className="inline-block px-1.5 py-0.2 text-[10px] font-mono font-medium rounded bg-[#5A4AD2]/20 text-[#A094F7] border border-[#5A4AD2]/30 mx-0.5"
              >
                {part}
              </span>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </>
    );
  };

  return (
    <div
      id={`canvas-node-${node.id}`}
      style={{
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
        width: '220px'
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (isConnecting && node.type !== 'start') {
          onConnectToNode(node.id);
        } else {
          onSelect(node.id);
        }
      }}
      className={`absolute select-none cursor-pointer rounded-2xl border transition-all ${
        isActivePreview
          ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#181A1F] shadow-xl shadow-emerald-500/25'
          : isSelected
          ? 'ring-2 ring-[#5A4AD2] shadow-xl shadow-[#5A4AD2]/20'
          : hasErrors
          ? 'ring-1 ring-rose-500/80 shadow-md'
          : hasWarnings
          ? 'ring-1 ring-amber-500/70 shadow-md'
          : 'shadow-md hover:shadow-lg'
      } ${
        isDark
          ? 'bg-[#21252B] border-slate-700/80 text-white'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Active in Safe Preview Indicator */}
      {isActivePreview && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1 z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          <span>Active Step</span>
        </div>
      )}
      {/* Left Input Handle (All except 'start') */}
      {node.type !== 'start' && (
        <div
          id={`handle-in-${node.id}`}
          title={isConnecting ? 'Click to connect to this input' : 'Target Input'}
          onClick={(e) => {
            if (isConnecting) {
              e.stopPropagation();
              onConnectToNode(node.id);
            }
          }}
          className={`absolute -left-2 top-[24px] -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center z-10 ${
            isConnecting
              ? 'bg-[#5A4AD2] border-white scale-125 ring-4 ring-[#5A4AD2]/40 animate-pulse'
              : isDark
              ? 'bg-[#181A1F] border-slate-500 hover:border-[#5A4AD2] hover:scale-110'
              : 'bg-white border-slate-400 hover:border-[#5A4AD2] hover:scale-110'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
        </div>
      )}

      {/* Node Header */}
      <div className={`p-3 pb-2 flex items-center justify-between border-b ${
        isDark ? 'border-slate-800/80' : 'border-slate-100'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${config.badgeBg}`}
            style={{ color: config.accent, borderColor: `${config.accent}40` }}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold truncate leading-none">
              {node.data.title || config.label}
            </h4>
            <span className={`text-[9px] font-semibold uppercase tracking-wider ${
              isDark ? 'text-slate-400' : 'text-slate-400'
            }`}>
              {node.type}
            </span>
          </div>
        </div>

        {/* Header Actions & Issues indicator */}
        <div className="flex items-center gap-1 shrink-0">
          {nodeIssues.length > 0 && (
            <div
              title={nodeIssues.map((i) => i.message).join('\n')}
              className={`p-1 rounded-md ${
                hasErrors 
                  ? 'bg-rose-500/20 text-rose-400' 
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
            </div>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(node.id);
            }}
            title="Duplicate node"
            className={`p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity ${
              isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Copy className="w-3 h-3" />
          </button>
          {node.type !== 'start' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
              title="Delete node"
              className={`p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity hover:text-rose-400 ${
                isDark ? 'hover:bg-rose-500/20 text-slate-400' : 'hover:bg-rose-50 text-slate-500'
              }`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Node Body Content Preview */}
      <div className="p-3 text-xs">
        {/* START */}
        {node.type === 'start' && (
          <div className={`p-2 rounded-xl text-[11px] leading-relaxed border ${
            isDark ? 'bg-[#181A1F]/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <span className="font-semibold text-emerald-400 block mb-0.5">Trigger:</span>
            {node.data.messageText || 'Inbound WhatsApp conversation'}
          </div>
        )}

        {/* MESSAGE */}
        {node.type === 'message' && (
          <div className={`p-2.5 rounded-xl text-[11px] leading-relaxed border line-clamp-3 ${
            isDark ? 'bg-[#181A1F]/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            {renderTextWithVariables(node.data.messageText)}
          </div>
        )}

        {/* QUESTION */}
        {node.type === 'question' && (
          <div className="space-y-2">
            <div className={`p-2 rounded-xl text-[11px] leading-relaxed border ${
              isDark ? 'bg-[#181A1F]/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              {node.data.questionText || 'Enter question prompt…'}
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Save to:</span>
              <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-[#5A4AD2]/15 text-[#A094F7] border border-[#5A4AD2]/30">
                {node.data.saveResponseAs ? `{{${node.data.saveResponseAs}}}` : 'unconfigured'}
              </span>
            </div>
          </div>
        )}

        {/* CHOICE with per-option output handles */}
        {node.type === 'choice' && (
          <div className="space-y-2">
            <div className={`text-[11px] font-medium leading-tight ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {node.data.questionText || 'What would you like help with?'}
            </div>
            <div className="space-y-1.5 pt-1">
              {(node.data.choices || []).map((opt) => (
                <div
                  key={opt.id}
                  className={`relative flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-[11px] ${
                    isDark 
                      ? 'bg-[#181A1F] border-slate-700/80 text-slate-200' 
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="truncate pr-4">{opt.label || 'Choice Option'}</span>
                  {/* Individual Output Connector Handle for Choice */}
                  <div
                    id={`handle-out-${node.id}-${opt.id}`}
                    title={`Connect "${opt.label}" branch`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartConnection(node.id, opt.id, e);
                    }}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-xs hover:scale-125 transition-transform flex items-center justify-center cursor-pointer z-10"
                  >
                    <span className="w-1 h-1 rounded-full bg-black/60" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONDITION with True / False distinct outputs */}
        {node.type === 'condition' && (
          <div className="space-y-2">
            <div className={`p-2 rounded-xl text-[11px] border font-mono ${
              isDark ? 'bg-[#181A1F]/60 border-slate-800 text-indigo-300' : 'bg-indigo-50/50 border-indigo-100 text-indigo-900'
            }`}>
              {node.data.condition ? (
                <>
                  <span className="font-semibold text-slate-400">{node.data.condition.field}</span>{' '}
                  <span className="text-amber-400">{node.data.condition.operator}</span>{' '}
                  <span className="font-bold">"{node.data.condition.value}"</span>
                </>
              ) : (
                'No condition set'
              )}
            </div>

            {/* True & False Branch Handles */}
            <div className="space-y-1.5 pt-1">
              <div
                className={`relative px-2.5 py-1.5 rounded-xl border text-[10px] font-bold flex items-center justify-between ${
                  isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
              >
                <span>True Branch</span>
                <div
                  id={`handle-out-${node.id}-true`}
                  title="Connect True branch"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartConnection(node.id, 'true', e);
                  }}
                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-xs hover:scale-125 transition-transform cursor-pointer z-10"
                />
              </div>

              <div
                className={`relative px-2.5 py-1.5 rounded-xl border text-[10px] font-bold flex items-center justify-between ${
                  isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}
              >
                <span>False Branch</span>
                <div
                  id={`handle-out-${node.id}-false`}
                  title="Connect False branch"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartConnection(node.id, 'false', e);
                  }}
                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-rose-400 border-2 border-white shadow-xs hover:scale-125 transition-transform cursor-pointer z-10"
                />
              </div>
            </div>
          </div>
        )}

        {/* WAIT */}
        {node.type === 'wait' && (
          <div className={`p-2 rounded-xl text-[11px] flex items-center gap-2 border ${
            isDark ? 'bg-[#181A1F]/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Wait {node.data.wait?.duration || 10} {node.data.wait?.unit || 'minutes'}
            </span>
          </div>
        )}

        {/* HANDOFF */}
        {node.type === 'handoff' && (
          <div className={`p-2 rounded-xl text-[11px] border ${
            isDark ? 'bg-teal-500/10 border-teal-500/30 text-teal-300' : 'bg-teal-50 border-teal-200 text-teal-800'
          }`}>
            <span className="text-[10px] block opacity-75 uppercase tracking-wider font-semibold">Assign to:</span>
            <span className="font-bold text-xs">{node.data.handoff?.target || 'Reception Team'}</span>
          </div>
        )}

        {/* END */}
        {node.type === 'end' && (
          <div className={`p-2 rounded-xl text-[11px] text-center border ${
            isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-rose-400" />
            <span className="font-semibold text-xs">{node.data.endSummary || 'Finish this path'}</span>
          </div>
        )}
      </div>

      {/* Right Output Handle for regular single-output nodes (Start, Message, Question, Wait, Handoff) */}
      {['start', 'message', 'question', 'wait', 'handoff'].includes(node.type) && (
        <div
          id={`handle-out-${node.id}-default`}
          title="Connect to next step"
          onClick={(e) => {
            e.stopPropagation();
            onStartConnection(node.id, 'default', e);
          }}
          className="absolute -right-2 top-[24px] -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-xs hover:scale-125 transition-transform cursor-pointer flex items-center justify-center z-10"
          style={{ backgroundColor: config.accent }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-black/50" />
        </div>
      )}
    </div>
  );
};
