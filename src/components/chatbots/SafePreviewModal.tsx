import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  RotateCcw, 
  Send, 
  ShieldCheck, 
  CheckCheck, 
  Bot, 
  User, 
  Clock, 
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { FlowNode, FlowEdge } from './types';

interface SafePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: FlowNode[];
  edges: FlowEdge[];
  botName: string;
  onActiveNodeChange?: (nodeId: string | null) => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text: string;
  time: string;
  choices?: { id: string; label: string }[];
  isQuestionInput?: boolean;
  mediaAttachment?: 'none' | 'image' | 'document';
}

export const SafePreviewModal: React.FC<SafePreviewModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  botName,
  onActiveNodeChange
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [storedVariables, setStoredVariables] = useState<Record<string, string>>({
    'contact.name': 'Deepak Kumar',
    'contact.phone': '+91 98401 23456',
    'clinic.name': 'Agamagizh Health Center',
    'appointment.date': 'Tomorrow 10:30 AM',
    'doctor.name': 'Dr. S. Kulanthaivel'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen) {
      onActiveNodeChange?.(null);
    } else {
      onActiveNodeChange?.(currentNodeId);
    }
  }, [isOpen, currentNodeId, onActiveNodeChange]);

  // Interpolate variables like {{contact.name}} or {{support_topic}}
  const interpolate = (text: string = '') => {
    return text.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
      const trimmed = key.trim();
      return storedVariables[trimmed] || `{{${trimmed}}}`;
    });
  };

  const getTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Reset & Start simulation
  const restartSimulation = () => {
    const startNode = nodes.find((n) => n.type === 'start') || nodes[0];
    if (!startNode) {
      setMessages([{
        id: 'msg-empty',
        sender: 'system',
        text: 'Flow has no Start trigger node to begin.',
        time: getTimeString()
      }]);
      return;
    }

    setMessages([]);
    setCurrentNodeId(startNode.id);
    executeNode(startNode.id, [{
      id: 'msg-start-sys',
      sender: 'system',
      text: 'Simulation started. Trigger: Inbound WhatsApp message.',
      time: getTimeString()
    }]);
  };

  // Execute a specific node in sequence
  const executeNode = (nodeId: string, currentHistory: ChatMessage[]) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    setCurrentNodeId(node.id);

    // 1. START NODE -> Immediately follow outgoing edge
    if (node.type === 'start') {
      const nextEdge = edges.find((e) => e.source === node.id);
      if (nextEdge) {
        setTimeout(() => executeNode(nextEdge.target, currentHistory), 400);
      }
      return;
    }

    // 2. MESSAGE NODE
    if (node.type === 'message') {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random()}`,
        sender: 'bot',
        text: interpolate(node.data.messageText || 'Hello!'),
        time: getTimeString(),
        mediaAttachment: node.data.mediaAttachment || 'none'
      };
      const updatedHistory = [...currentHistory, newMsg];
      setMessages(updatedHistory);

      const nextEdge = edges.find((e) => e.source === node.id);
      if (nextEdge) {
        setTimeout(() => executeNode(nextEdge.target, updatedHistory), 650);
      }
      return;
    }

    // 3. CHOICE NODE -> Render buttons for user to click
    if (node.type === 'choice') {
      const choices = (node.data.choices || []).map((c) => ({
        id: c.id,
        label: c.label
      }));

      const choiceMsg: ChatMessage = {
        id: `choice-${Date.now()}`,
        sender: 'bot',
        text: interpolate(node.data.questionText || 'Please select an option:'),
        time: getTimeString(),
        choices
      };
      setMessages([...currentHistory, choiceMsg]);
      return;
    }

    // 4. QUESTION NODE -> Wait for user input
    if (node.type === 'question') {
      const qMsg: ChatMessage = {
        id: `q-${Date.now()}`,
        sender: 'bot',
        text: interpolate(node.data.questionText || 'Please reply below:'),
        time: getTimeString(),
        isQuestionInput: true
      };
      setMessages([...currentHistory, qMsg]);
      return;
    }

    // 5. CONDITION NODE
    if (node.type === 'condition') {
      const cond = node.data.condition;
      let outcome = false;

      if (cond) {
        // Check stored variable or default
        const fieldKey = cond.field.toLowerCase();
        let testVal = '';
        if (fieldKey.includes('label')) {
          testVal = (storedVariables['contact.label'] || 'VIP').toLowerCase();
        } else if (fieldKey.includes('hour')) {
          testVal = '14'; // 2 PM
        } else if (storedVariables[cond.field]) {
          testVal = storedVariables[cond.field].toLowerCase();
        } else {
          testVal = (storedVariables['contact.name'] || 'VIP').toLowerCase();
        }

        const expected = (cond.value || '').toLowerCase();
        if (cond.operator === 'equals') outcome = testVal === expected;
        else if (cond.operator === 'contains') outcome = testVal.includes(expected);
        else if (cond.operator === 'is_present') outcome = Boolean(testVal);
        else outcome = testVal !== expected;
      }

      const branchHandle = outcome ? 'true' : 'false';
      const edge = edges.find(
        (e) => e.source === node.id && (e.sourceHandle === branchHandle || e.label?.toLowerCase() === branchHandle)
      );

      const sysMsg: ChatMessage = {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: `Branch evaluated: ${cond?.field || 'Rule'} ${cond?.operator || '='} "${cond?.value || ''}" → ${outcome ? 'TRUE' : 'FALSE'}`,
        time: getTimeString()
      };
      const updated = [...currentHistory, sysMsg];
      setMessages(updated);

      if (edge) {
        setTimeout(() => executeNode(edge.target, updated), 500);
      }
      return;
    }

    // 6. WAIT NODE
    if (node.type === 'wait') {
      const waitMsg: ChatMessage = {
        id: `wait-${Date.now()}`,
        sender: 'system',
        text: `⏳ Paused for ${node.data.wait?.duration || 10} ${node.data.wait?.unit || 'minutes'} (simulated pass-through)`,
        time: getTimeString()
      };
      const updated = [...currentHistory, waitMsg];
      setMessages(updated);

      const nextEdge = edges.find((e) => e.source === node.id);
      if (nextEdge) {
        setTimeout(() => executeNode(nextEdge.target, updated), 800);
      }
      return;
    }

    // 7. HANDOFF NODE
    if (node.type === 'handoff') {
      const handoffMsg: ChatMessage = {
        id: `handoff-${Date.now()}`,
        sender: 'system',
        text: `Conversation handed off to ${node.data.handoff?.target || 'Reception Team'}`,
        time: getTimeString()
      };
      const updated = [...currentHistory, handoffMsg];
      setMessages(updated);

      const nextEdge = edges.find((e) => e.source === node.id);
      if (nextEdge) {
        setTimeout(() => executeNode(nextEdge.target, updated), 600);
      }
      return;
    }

    // 8. END NODE
    if (node.type === 'end') {
      const endMsg: ChatMessage = {
        id: `end-${Date.now()}`,
        sender: 'system',
        text: `Flow complete: ${node.data.endSummary || 'Conversation finished.'}`,
        time: getTimeString()
      };
      setMessages([...currentHistory, endMsg]);
    }
  };

  // User selects an option button from Choice node
  const handleSelectChoice = (choiceId: string, choiceLabel: string) => {
    if (!currentNodeId) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: choiceLabel,
      time: getTimeString()
    };
    const updated = [...messages, userMsg];
    setMessages(updated);

    // Find the edge originating from this choice option
    const edge = edges.find(
      (e) => e.source === currentNodeId && (e.sourceHandle === choiceId || e.label === choiceLabel)
    );

    if (edge) {
      setTimeout(() => executeNode(edge.target, updated), 500);
    } else {
      setMessages([
        ...updated,
        {
          id: `err-${Date.now()}`,
          sender: 'system',
          text: `Option "${choiceLabel}" has no downstream connection in this flow.`,
          time: getTimeString()
        }
      ]);
    }
  };

  // User submits answer to Question node
  const handleSendUserInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !currentNodeId) return;

    const val = userInput.trim();
    setUserInput('');

    const currentNode = nodes.find((n) => n.id === currentNodeId);

    // Validation for question expected answer type
    if (currentNode?.type === 'question') {
      const answerType = currentNode.data.answerType;
      if (answerType === 'number' && isNaN(Number(val))) {
        const userMsg: ChatMessage = {
          id: `u-${Date.now()}`,
          sender: 'user',
          text: val,
          time: getTimeString()
        };
        setMessages([
          ...messages,
          userMsg,
          {
            id: `fb-${Date.now()}`,
            sender: 'bot',
            text: currentNode.data.fallbackPrompt || 'Please enter a valid numeric value to continue.',
            time: getTimeString(),
            isQuestionInput: true
          }
        ]);
        return;
      }
      if (answerType === 'phone' && !/^[0-9+\s-]{8,15}$/.test(val)) {
        const userMsg: ChatMessage = {
          id: `u-${Date.now()}`,
          sender: 'user',
          text: val,
          time: getTimeString()
        };
        setMessages([
          ...messages,
          userMsg,
          {
            id: `fb-${Date.now()}`,
            sender: 'bot',
            text: currentNode.data.fallbackPrompt || 'Please enter a valid phone number (e.g. +91 98401 23456).',
            time: getTimeString(),
            isQuestionInput: true
          }
        ]);
        return;
      }
    }

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: val,
      time: getTimeString()
    };
    const updated = [...messages, userMsg];
    setMessages(updated);

    if (currentNode?.data.saveResponseAs) {
      setStoredVariables((prev) => ({
        ...prev,
        [currentNode.data.saveResponseAs!]: val
      }));
    }

    const nextEdge = edges.find((e) => e.source === currentNodeId);
    if (nextEdge) {
      setTimeout(() => executeNode(nextEdge.target, updated), 500);
    } else {
      setMessages([
        ...updated,
        {
          id: `err-${Date.now()}`,
          sender: 'system',
          text: 'This step has no subsequent connection.',
          time: getTimeString()
        }
      ]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      restartSimulation();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentNode = nodes.find((n) => n.id === currentNodeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="chatbot-safe-preview-drawer"
        className="w-full max-w-md h-[680px] bg-[#0C1317] rounded-3xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <div className="bg-[#202C33] px-4 py-3 border-b border-slate-700 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5A4AD2] flex items-center justify-center font-bold text-sm shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm truncate max-w-[170px]">{botName}</h3>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> WhatsApp Flow Simulator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={restartSimulation}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Restart Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Safe Test Mode Banner */}
        <div className="bg-[#182229] px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-amber-300">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Safe Test Mode — No real WhatsApp message is sent</span>
          </div>
          {currentNode && (
            <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
              Step: {currentNode.data.title}
            </span>
          )}
        </div>

        {/* Simulated WhatsApp Wallpaper & Chat Transcript */}
        <div 
          className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0B141A] bg-opacity-95"
          style={{
            backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        >
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="bg-[#182229] text-slate-300 text-[10px] px-3 py-1 rounded-lg border border-slate-800 shadow-xs text-center max-w-[85%]">
                    {msg.text}
                  </div>
                </div>
              );
            }

            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs shadow-md leading-relaxed whitespace-pre-wrap relative ${
                    isUser
                      ? 'bg-[#005C4B] text-white rounded-tr-xs'
                      : 'bg-[#202C33] text-slate-100 rounded-tl-xs'
                  }`}
                >
                  {/* Media Attachment Simulation */}
                  {msg.mediaAttachment === 'image' && (
                    <div className="mb-2 rounded-lg overflow-hidden bg-black/40 border border-white/10 p-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="text-[10px] text-slate-300 font-medium">Attachment: clinic_banner.jpg</span>
                    </div>
                  )}
                  {msg.mediaAttachment === 'document' && (
                    <div className="mb-2 rounded-lg overflow-hidden bg-black/40 border border-white/10 p-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-[10px] text-slate-300 font-medium">Document: patient_instructions.pdf</span>
                    </div>
                  )}

                  <p>{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                    <span>{msg.time}</span>
                    {isUser && <CheckCheck className="w-3 h-3 text-[#53BDEB]" />}
                  </div>
                </div>

                {/* Choice Option Buttons */}
                {msg.choices && msg.choices.length > 0 && (
                  <div className="mt-2 space-y-1.5 w-[80%]">
                    {msg.choices.map((choice) => (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => handleSelectChoice(choice.id, choice.label)}
                        className="w-full text-left py-2 px-3 rounded-xl bg-[#202C33] hover:bg-[#2A3942] border border-[#5A4AD2]/40 hover:border-[#5A4AD2] text-xs font-semibold text-[#8B7FF5] transition-all flex items-center justify-between group shadow-sm"
                      >
                        <span className="truncate">{choice.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar (WhatsApp Style) */}
        <form
          onSubmit={handleSendUserInput}
          className="bg-[#202C33] p-2.5 flex items-center gap-2 border-t border-slate-700"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type a message or response…"
            className="flex-1 bg-[#2A3942] text-white placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-2xl border border-transparent focus:border-[#5A4AD2] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!userInput.trim()}
            className="w-9 h-9 rounded-full bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white flex items-center justify-center disabled:opacity-40 transition-opacity shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
