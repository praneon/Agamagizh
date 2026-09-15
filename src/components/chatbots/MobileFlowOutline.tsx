import React, { useState } from 'react';
import { 
  Play, 
  MessageSquare, 
  HelpCircle, 
  GitBranch, 
  GitFork, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  Eye, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowRight, 
  Check, 
  AlertTriangle,
  X,
  ChevronRight
} from 'lucide-react';
import { FlowNode, FlowEdge, BuilderNodeType, ValidationIssue } from './types';
import { PALETTE_ITEMS } from './NodePalette';

interface MobileFlowOutlineProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  botName: string;
  status: 'draft' | 'published';
  onUpdateNodeData: (nodeId: string, updates: Partial<FlowNode['data']>) => void;
  onAddNode: (type: BuilderNodeType) => void;
  onDeleteNode: (nodeId: string) => void;
  onOpenPreview: () => void;
  validationIssues: ValidationIssue[];
  theme: 'dark' | 'light';
}

export const MobileFlowOutline: React.FC<MobileFlowOutlineProps> = ({
  nodes,
  edges,
  botName,
  status,
  onUpdateNodeData,
  onAddNode,
  onDeleteNode,
  onOpenPreview,
  validationIssues,
  theme
}) => {
  const isDark = theme === 'dark';
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

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

  return (
    <div 
      id="chatbot-mobile-outline-view"
      className={`flex flex-col h-full overflow-hidden ${
        isDark ? 'bg-[#181A1F] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Mobile Header */}
      <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
        isDark ? 'border-slate-800 bg-[#21252B]' : 'border-slate-200 bg-white'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm truncate max-w-[190px]">{botName}</h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
            }`}>
              {status}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Flow Outline • {nodes.length} Steps</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPreview}
            className="p-2 rounded-xl bg-[#5A4AD2] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Test</span>
          </button>
        </div>
      </div>

      {/* Structured Hierarchical List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {nodes.map((node, index) => {
          const outgoingEdges = edges.filter((e) => e.source === node.id);
          const nodeIssues = validationIssues.filter((i) => i.nodeId === node.id);

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-[#21252B] border-slate-700 hover:border-slate-500' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-black/20 flex items-center justify-center">
                    {getNodeIcon(node.type)}
                  </div>
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span>{node.data.title}</span>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">({node.type})</span>
                    </div>
                    <p className={`text-[11px] line-clamp-1 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {node.type === 'message' && (node.data.messageText || 'Empty message')}
                      {node.type === 'question' && (node.data.questionText || 'Enter prompt')}
                      {node.type === 'choice' && `${(node.data.choices || []).length} choices configured`}
                      {node.type === 'condition' && `${node.data.condition?.field || 'Condition'}`}
                      {node.type === 'start' && 'Inbound WhatsApp trigger'}
                      {node.type === 'wait' && `Wait ${node.data.wait?.duration || 10}m`}
                      {node.type === 'handoff' && `Assign to ${node.data.handoff?.target || 'Team'}`}
                      {node.type === 'end' && 'Finish path'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {nodeIssues.length > 0 && (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Branch indicators for Choice or Condition */}
              {outgoingEdges.length > 0 && (
                <div className="mt-2 pt-2 border-t border-inherit flex flex-wrap gap-1.5">
                  {outgoingEdges.map((e) => (
                    <span
                      key={e.id}
                      className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${
                        isDark ? 'bg-[#181A1F] border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      → {e.label || 'Next'}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Add Step Button */}
        <button
          type="button"
          onClick={() => setIsAddSheetOpen(true)}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-[#5A4AD2]/40 hover:border-[#5A4AD2] text-[#8B7FF5] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Step to Flow</span>
        </button>
      </div>

      {/* Node Edit Sheet (Bottom Modal) */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60">
          <div className={`w-full max-h-[85vh] rounded-t-3xl p-5 overflow-y-auto ${
            isDark ? 'bg-[#21252B] text-white' : 'bg-white text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
              <div className="flex items-center gap-2">
                {getNodeIcon(selectedNode.type)}
                <h3 className="font-bold text-sm">{selectedNode.data.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNodeId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Field Editors */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={selectedNode.data.title}
                  onChange={(e) => onUpdateNodeData(selectedNode.id, { title: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-xs ${
                    isDark ? 'bg-[#181A1F] border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              {selectedNode.type === 'message' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Message Content
                  </label>
                  <textarea
                    rows={4}
                    value={selectedNode.data.messageText || ''}
                    onChange={(e) => onUpdateNodeData(selectedNode.id, { messageText: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs ${
                      isDark ? 'bg-[#181A1F] border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              )}

              {selectedNode.type === 'question' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={selectedNode.data.questionText || ''}
                    onChange={(e) => onUpdateNodeData(selectedNode.id, { questionText: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs ${
                      isDark ? 'bg-[#181A1F] border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              {selectedNode.type !== 'start' && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteNode(selectedNode.id);
                    setSelectedNodeId(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedNodeId(null)}
                className="flex-1 py-2 rounded-xl bg-[#5A4AD2] text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Step Bottom Sheet */}
      {isAddSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60">
          <div className={`w-full max-h-[75vh] rounded-t-3xl p-5 overflow-y-auto ${
            isDark ? 'bg-[#21252B] text-white' : 'bg-white text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-3">
              <h3 className="font-bold text-sm">Add Step to Chatbot</h3>
              <button
                type="button"
                onClick={() => setIsAddSheetOpen(false)}
                className="p-1 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {(['messaging', 'logic', 'flowControl'] as const).map((groupKey) => (
                <div key={groupKey}>
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-2">
                    {groupKey}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {PALETTE_ITEMS[groupKey].map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => {
                          onAddNode(item.type);
                          setIsAddSheetOpen(false);
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 ${
                          isDark ? 'bg-[#181A1F] border-slate-700' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <item.icon className="w-4 h-4 text-[#8B7FF5]" />
                        <span className="text-xs font-bold">{item.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
