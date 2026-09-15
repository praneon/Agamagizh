import React, { useState, useEffect, useCallback } from 'react';
import { 
  FlowNode, 
  FlowEdge, 
  BuilderNodeType, 
  ChatbotProject, 
  StarterTemplate 
} from '../chatbots/types';
import { 
  INITIAL_BOT_PROJECTS, 
  STARTER_TEMPLATES, 
  SIMPLE_DEMO_NODES, 
  SIMPLE_DEMO_EDGES,
  COMPLEX_DEMO_NODES,
  COMPLEX_DEMO_EDGES,
  ALL_NODES_DEMO_NODES,
  ALL_NODES_DEMO_EDGES,
  INVALID_DEMO_NODES,
  INVALID_DEMO_EDGES
} from '../chatbots/initialFlows';
import { validateFlow } from '../chatbots/validation';
import { ChatbotToolbar } from '../chatbots/ChatbotToolbar';
import { NodePalette } from '../chatbots/NodePalette';
import { FlowCanvas } from '../chatbots/FlowCanvas';
import { NodeInspector } from '../chatbots/NodeInspector';
import { SafePreviewModal } from '../chatbots/SafePreviewModal';
import { PublishModal } from '../chatbots/PublishModal';
import { ValidationDrawer } from '../chatbots/ValidationDrawer';
import { MobileFlowOutline } from '../chatbots/MobileFlowOutline';
import { ChatbotLibrary } from '../chatbots/ChatbotLibrary';

interface HistoryState {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export const WhatsAppChatbotsView: React.FC = () => {
  // Navigation: 'builder' | 'library'
  const [viewMode, setViewMode] = useState<'builder' | 'library'>('builder');

  // Projects & Templates
  const [projects, setProjects] = useState<ChatbotProject[]>(INITIAL_BOT_PROJECTS);
  const [currentProject, setCurrentProject] = useState<ChatbotProject>(INITIAL_BOT_PROJECTS[0]);

  // Visual Graph State
  const [nodes, setNodes] = useState<FlowNode[]>(INITIAL_BOT_PROJECTS[0].nodes);
  const [edges, setEdges] = useState<FlowEdge[]>(INITIAL_BOT_PROJECTS[0].edges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-welcome');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Undo / Redo History Stacks
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryState[]>([]);

  // Workspace Theme: 'dark' (flagship default) | 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Save State: 'saved' | 'saving' | 'unsaved'
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');

  // Active step highlight during Safe Preview simulation
  const [previewActiveNodeId, setPreviewActiveNodeId] = useState<string | null>(null);

  // Modals & Drawers
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);

  // Push current graph state to Undo stack before changes
  const recordHistory = useCallback(() => {
    setHistory((prev) => [...prev.slice(-30), { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }]);
    setRedoStack([]);
    setSaveStatus('unsaved');
  }, [nodes, edges]);

  // Undo
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack((prev) => [...prev, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }]);
    setHistory((prev) => prev.slice(0, -1));
    setNodes(previous.nodes);
    setEdges(previous.edges);
    setSaveStatus('unsaved');
  }, [history, nodes, edges]);

  // Redo
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory((prev) => [...prev, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }]);
    setRedoStack((prev) => prev.slice(0, -1));
    setNodes(next.nodes);
    setEdges(next.edges);
    setSaveStatus('unsaved');
  }, [redoStack, nodes, edges]);

  // Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveDraft();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Compute real-time validation issues
  const validationIssues = validateFlow(nodes, edges);

  // Update Bot Name
  const handleUpdateBotName = (name: string) => {
    recordHistory();
    setCurrentProject((prev) => ({ ...prev, name }));
  };

  // Node position update from canvas dragging
  const handleUpdateNodePosition = (nodeId: string, x: number, y: number) => {
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, x, y } : n)));
    setSaveStatus('unsaved');
  };

  // Node data update from Inspector or Mobile Sheet
  const handleUpdateNodeData = (nodeId: string, updates: Partial<FlowNode['data']>) => {
    recordHistory();
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n))
    );
  };

  // Add new node from palette
  const handleAddNode = (type: BuilderNodeType) => {
    recordHistory();
    const newId = `node-${type}-${Date.now()}`;
    const defaultTitles: Record<BuilderNodeType, string> = {
      start: 'Start Trigger',
      message: 'Send Message',
      question: 'Ask Question',
      choice: 'Choice',
      condition: 'Condition',
      wait: 'Wait',
      handoff: 'Handoff',
      end: 'End Flow'
    };

    // Calculate intelligent horizontal position to the right of the last node
    const lastNode = nodes[nodes.length - 1];
    const newX = lastNode ? lastNode.x + 320 : 60;
    const newY = lastNode ? lastNode.y : 240;

    const newNode: FlowNode = {
      id: newId,
      type,
      x: newX,
      y: newY,
      data: {
        title: defaultTitles[type],
        messageText: type === 'message' ? 'Type your message…' : undefined,
        questionText: type === 'question' ? 'What would you like assistance with?' : undefined,
        saveResponseAs: type === 'question' ? 'response_var' : undefined,
        answerType: 'text',
        choices: type === 'choice' ? [
          { id: `opt-1-${Date.now()}`, label: 'Option 1' },
          { id: `opt-2-${Date.now()}`, label: 'Option 2' }
        ] : undefined,
        condition: type === 'condition' ? { field: 'Contact label', operator: 'equals', value: 'VIP' } : undefined,
        wait: type === 'wait' ? { duration: 10, unit: 'minutes' } : undefined,
        handoff: type === 'handoff' ? { destinationType: 'team', target: 'Reception Team' } : undefined,
        endSummary: type === 'end' ? 'Finish this path' : undefined
      }
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);
  };

  // Add node at exact drop position
  const handleAddNodeAtPosition = (type: BuilderNodeType, x: number, y: number) => {
    recordHistory();
    const newId = `node-${type}-${Date.now()}`;
    const newNode: FlowNode = {
      id: newId,
      type,
      x,
      y,
      data: {
        title: type.charAt(0).toUpperCase() + type.slice(1),
        messageText: type === 'message' ? 'Hello!' : undefined,
        choices: type === 'choice' ? [{ id: `opt-${Date.now()}`, label: 'Option 1' }] : undefined,
        condition: type === 'condition' ? { field: 'Contact label', operator: 'equals', value: 'VIP' } : undefined,
        wait: type === 'wait' ? { duration: 10, unit: 'minutes' } : undefined,
        handoff: type === 'handoff' ? { destinationType: 'team', target: 'Reception Team' } : undefined,
        endSummary: type === 'end' ? 'Finish this path' : undefined
      }
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);
  };

  // Duplicate node
  const handleDuplicateNode = (nodeId: string) => {
    const original = nodes.find((n) => n.id === nodeId);
    if (!original) return;
    recordHistory();

    const newId = `node-${original.type}-${Date.now()}`;
    const clonedNode: FlowNode = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId,
      x: original.x + 60,
      y: original.y + 60,
      data: {
        ...original.data,
        title: `${original.data.title} (Copy)`
      }
    };

    setNodes((prev) => [...prev, clonedNode]);
    setSelectedNodeId(newId);
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    if (nodeId.includes('start')) return; // keep at least start
    recordHistory();
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) => prev.filter((e) => e.source !== nodeId && e.target !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  // Connect two nodes
  const handleConnect = (source: string, sourceHandle: string, target: string) => {
    if (source === target) return;
    recordHistory();

    const sourceNode = nodes.find((n) => n.id === source);
    let label = 'Next';

    if (sourceNode?.type === 'choice') {
      const opt = sourceNode.data.choices?.find((o) => o.id === sourceHandle);
      if (opt) label = opt.label;
    } else if (sourceNode?.type === 'condition') {
      label = sourceHandle === 'true' ? 'True' : 'False';
    }

    // Filter out existing edge with the exact same source and handle
    const updatedEdges = edges.filter(
      (e) => !(e.source === source && e.sourceHandle === sourceHandle)
    );

    const newEdge: FlowEdge = {
      id: `edge-${Date.now()}-${Math.random()}`,
      source,
      sourceHandle,
      target,
      label
    };

    setEdges([...updatedEdges, newEdge]);
  };

  // Delete an edge
  const handleDeleteEdge = (edgeId: string) => {
    recordHistory();
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
    if (selectedEdgeId === edgeId) setSelectedEdgeId(null);
  };

  // Save Draft
  const handleSaveDraft = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === currentProject.id
            ? { ...p, nodes, edges, lastUpdated: 'Just now' }
            : p
        )
      );
      setSaveStatus('saved');
    }, 400);
  };

  // Confirm Publish
  const handleConfirmPublish = () => {
    setCurrentProject((prev) => ({ ...prev, status: 'published', lastUpdated: 'Just now' }));
    setProjects((prev) =>
      prev.map((p) =>
        p.id === currentProject.id
          ? { ...p, status: 'published', nodes, edges, lastUpdated: 'Just now' }
          : p
      )
    );
    setSaveStatus('saved');
  };

  // Preset Selector: Switch between Simple Demo, All Nodes Demo, Complex Demo, Invalid Demo, or Blank
  const handleSelectPresetFlow = (preset: 'simple' | 'complex' | 'all-nodes' | 'invalid' | 'blank') => {
    recordHistory();
    if (preset === 'simple') {
      setNodes(SIMPLE_DEMO_NODES);
      setEdges(SIMPLE_DEMO_EDGES);
      setCurrentProject((prev) => ({ ...prev, name: 'Front Desk Reception Bot' }));
      setSelectedNodeId('node-welcome');
    } else if (preset === 'all-nodes') {
      setNodes(ALL_NODES_DEMO_NODES);
      setEdges(ALL_NODES_DEMO_EDGES);
      setCurrentProject((prev) => ({ ...prev, name: 'Comprehensive Hospital Bot (All Nodes)' }));
      setSelectedNodeId('an-welcome');
    } else if (preset === 'complex') {
      setNodes(COMPLEX_DEMO_NODES);
      setEdges(COMPLEX_DEMO_EDGES);
      setCurrentProject((prev) => ({ ...prev, name: 'Patient Intake & Triage Flow' }));
      setSelectedNodeId('c-welcome');
    } else if (preset === 'invalid') {
      setNodes(INVALID_DEMO_NODES);
      setEdges(INVALID_DEMO_EDGES);
      setCurrentProject((prev) => ({ ...prev, name: 'Incomplete Triage Draft (Validation Demo)' }));
      setSelectedNodeId('inv-empty-msg');
      setIsValidationOpen(true);
    } else {
      setNodes([
        {
          id: 'b-start',
          type: 'start',
          x: 60,
          y: 240,
          data: { title: 'Start', messageText: 'Inbound WhatsApp conversation' }
        }
      ]);
      setEdges([]);
      setCurrentProject((prev) => ({ ...prev, name: 'Untitled Flow' }));
      setSelectedNodeId('b-start');
    }
  };

  // Open Project from Library
  const handleSelectProjectFromLibrary = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    setCurrentProject(project);
    setNodes(project.nodes);
    setEdges(project.edges);
    setHistory([]);
    setRedoStack([]);
    setSelectedNodeId(project.nodes[0]?.id || null);
    setViewMode('builder');
  };

  // Open Template from Library
  const handleSelectTemplateFromLibrary = (templateId: string) => {
    const tpl = STARTER_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    const newProject: ChatbotProject = {
      id: `bot-${Date.now()}`,
      name: tpl.name,
      description: tpl.description,
      status: 'draft',
      version: 'v1.0',
      lastUpdated: 'Just now',
      nodesCount: tpl.nodeCount,
      triggersCount: 0,
      inbox: 'Agamagizh WhatsApp Main',
      nodes: tpl.nodes,
      edges: tpl.edges
    };
    setCurrentProject(newProject);
    setNodes(tpl.nodes);
    setEdges(tpl.edges);
    setProjects((prev) => [newProject, ...prev]);
    setHistory([]);
    setRedoStack([]);
    setSelectedNodeId(tpl.nodes[0]?.id || null);
    setViewMode('builder');
  };

  // Create brand new project from Library
  const handleCreateNewProject = () => {
    handleSelectPresetFlow('blank');
    setViewMode('builder');
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  // Render Chatbot Library if viewMode === 'library'
  if (viewMode === 'library') {
    return (
      <ChatbotLibrary
        projects={projects}
        templates={STARTER_TEMPLATES}
        onSelectProject={handleSelectProjectFromLibrary}
        onSelectTemplate={handleSelectTemplateFromLibrary}
        onCreateNewProject={handleCreateNewProject}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 1. TOP WORKSPACE TOOLBAR */}
      <ChatbotToolbar
        botName={currentProject.name}
        onUpdateBotName={handleUpdateBotName}
        status={currentProject.status}
        saveStatus={saveStatus}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSaveDraft={handleSaveDraft}
        onOpenValidate={() => setIsValidationOpen(true)}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onOpenPublish={() => setIsPublishOpen(true)}
        onBackToLibrary={() => setViewMode('library')}
        validationIssues={validationIssues}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onSelectPresetFlow={handleSelectPresetFlow}
      />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      {/* DESKTOP (≥768px): 3-Area Builder (Palette + Dominant Canvas + Inspector) */}
      <div className="hidden md:flex flex-1 overflow-hidden relative">
        {/* Left: Building Blocks Palette (~230px) */}
        <NodePalette
          onAddNode={handleAddNode}
          theme={theme}
        />

        {/* Center: Dominant Visual Flow Canvas */}
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          selectedNodeId={selectedNodeId}
          selectedEdgeId={selectedEdgeId}
          onSelectNode={(id) => {
            setSelectedNodeId(id);
            setSelectedEdgeId(null);
          }}
          onSelectEdge={(id) => {
            setSelectedEdgeId(id);
            setSelectedNodeId(null);
          }}
          onUpdateNodePosition={handleUpdateNodePosition}
          onConnect={handleConnect}
          onDeleteEdge={handleDeleteEdge}
          onAddNodeAtPosition={handleAddNodeAtPosition}
          onDuplicateNode={handleDuplicateNode}
          onDeleteNode={handleDeleteNode}
          validationIssues={validationIssues}
          theme={theme}
          previewActiveNodeId={previewActiveNodeId}
        />

        {/* Right: Step Properties Inspector (~320px) */}
        <NodeInspector
          selectedNode={selectedNode}
          nodes={nodes}
          edges={edges}
          onUpdateNodeData={handleUpdateNodeData}
          onDuplicateNode={handleDuplicateNode}
          onDeleteNode={handleDeleteNode}
          onSelectNode={(id) => {
            setSelectedNodeId(id);
            setSelectedEdgeId(null);
          }}
          validationIssues={validationIssues}
          theme={theme}
          botName={currentProject.name}
          botVersion={currentProject.version}
        />
      </div>

      {/* MOBILE (<768px): Flow Outline View (Prompt constraint: no miniature cramped canvas on mobile) */}
      <div className="flex md:hidden flex-1 overflow-hidden">
        <MobileFlowOutline
          nodes={nodes}
          edges={edges}
          botName={currentProject.name}
          status={currentProject.status}
          onUpdateNodeData={handleUpdateNodeData}
          onAddNode={handleAddNode}
          onDeleteNode={handleDeleteNode}
          onOpenPreview={() => setIsPreviewOpen(true)}
          validationIssues={validationIssues}
          theme={theme}
        />
      </div>

      {/* Safe Preview WhatsApp Simulator Drawer */}
      <SafePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        nodes={nodes}
        edges={edges}
        botName={currentProject.name}
        onActiveNodeChange={setPreviewActiveNodeId}
      />

      {/* Publish Confirmation Modal */}
      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        onConfirmPublish={handleConfirmPublish}
        botName={currentProject.name}
        version={currentProject.version}
        nodesCount={nodes.length}
        validationIssues={validationIssues}
        theme={theme}
      />

      {/* Validation Issues Drawer */}
      <ValidationDrawer
        isOpen={isValidationOpen}
        onClose={() => setIsValidationOpen(false)}
        issues={validationIssues}
        nodes={nodes}
        onSelectNode={(id) => {
          setSelectedNodeId(id);
          setSelectedEdgeId(null);
        }}
        theme={theme}
      />
    </div>
  );
};
