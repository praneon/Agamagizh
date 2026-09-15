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
  Plus,
  GripVertical
} from 'lucide-react';
import { BuilderNodeType } from './types';

interface NodePaletteProps {
  onAddNode: (type: BuilderNodeType) => void;
  theme: 'dark' | 'light';
}

interface PaletteItem {
  type: BuilderNodeType;
  title: string;
  description: string;
  icon: React.ElementType;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export const PALETTE_ITEMS: Record<'messaging' | 'logic' | 'flowControl', PaletteItem[]> = {
  messaging: [
    {
      type: 'message',
      title: 'Message',
      description: 'Send a WhatsApp message.',
      icon: MessageSquare,
      accentColor: '#38BDF8', // sky-400
      badgeBg: 'bg-sky-500/10',
      badgeText: 'text-sky-400',
      borderColor: 'border-sky-500/30'
    },
    {
      type: 'question',
      title: 'Question',
      description: 'Ask something and save the response.',
      icon: HelpCircle,
      accentColor: '#8B7FF5', // Agamagizh violet
      badgeBg: 'bg-[#5A4AD2]/15',
      badgeText: 'text-[#A094F7]',
      borderColor: 'border-[#5A4AD2]/40'
    },
    {
      type: 'choice',
      title: 'Choice',
      description: 'Let the user choose a path.',
      icon: GitBranch,
      accentColor: '#FBBF24', // amber-400
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-400',
      borderColor: 'border-amber-500/30'
    }
  ],
  logic: [
    {
      type: 'condition',
      title: 'Condition',
      description: 'Branch based on a rule.',
      icon: GitFork,
      accentColor: '#818CF8', // indigo-400
      badgeBg: 'bg-indigo-500/10',
      badgeText: 'text-indigo-400',
      borderColor: 'border-indigo-500/30'
    }
  ],
  flowControl: [
    {
      type: 'wait',
      title: 'Wait',
      description: 'Pause before continuing.',
      icon: Clock,
      accentColor: '#94A3B8', // slate-400
      badgeBg: 'bg-slate-500/10',
      badgeText: 'text-slate-400',
      borderColor: 'border-slate-500/30'
    },
    {
      type: 'handoff',
      title: 'Handoff',
      description: 'Transfer the conversation.',
      icon: UserCheck,
      accentColor: '#2DD4BF', // teal-400
      badgeBg: 'bg-teal-500/10',
      badgeText: 'text-teal-400',
      borderColor: 'border-teal-500/30'
    },
    {
      type: 'end',
      title: 'End',
      description: 'Finish this path.',
      icon: CheckCircle2,
      accentColor: '#F87171', // coral/rose-400
      badgeBg: 'bg-rose-500/10',
      badgeText: 'text-rose-400',
      borderColor: 'border-rose-500/30'
    }
  ]
};

export const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode, theme }) => {
  const isDark = theme === 'dark';

  const handleDragStart = (e: React.DragEvent, type: BuilderNodeType) => {
    e.dataTransfer.setData('application/reactflow-type', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  const renderGroup = (label: string, items: PaletteItem[]) => (
    <div className="mb-5">
      <div className={`px-1 mb-2 text-[10px] font-bold uppercase tracking-wider ${
        isDark ? 'text-slate-400' : 'text-slate-400'
      }`}>
        {label}
      </div>
      <div className="space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => handleDragStart(e, item.type)}
              onClick={() => onAddNode(item.type)}
              className={`group flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                isDark
                  ? 'bg-[#21252B] border-slate-700/70 hover:border-slate-500 hover:bg-[#282C34] text-slate-200'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 text-slate-800 shadow-2xs'
              }`}
              title={`Click or drag to add ${item.title} step to canvas`}
            >
              <div 
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${item.badgeBg} ${item.borderColor}`}
                style={{ color: item.accentColor }}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold truncate leading-tight group-hover:text-[#5A4AD2] transition-colors">
                    {item.title}
                  </h4>
                  <Plus className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                </div>
                <p className={`text-[11px] leading-tight line-clamp-1 mt-0.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      id="chatbot-node-palette"
      className={`w-[230px] shrink-0 border-r flex flex-col h-full overflow-y-auto transition-colors ${
        isDark 
          ? 'bg-[#181A1F] border-[#2C313C] text-slate-200' 
          : 'bg-[#F9FAFB] border-[#E5E7EB] text-slate-800'
      }`}
    >
      <div className="p-4 border-b border-inherit">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A4AD2]">
          Building Blocks
        </h3>
        <p className={`text-[11px] mt-1 leading-snug ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Add a supported step to your chatbot. Click or drag onto the canvas.
        </p>
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        {renderGroup('Messaging', PALETTE_ITEMS.messaging)}
        {renderGroup('Logic', PALETTE_ITEMS.logic)}
        {renderGroup('Flow Control', PALETTE_ITEMS.flowControl)}
      </div>

      <div className={`p-3 border-t text-[10px] ${
        isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
      }`}>
        Tip: Drag or click to insert. Connect outputs to inputs.
      </div>
    </div>
  );
};
