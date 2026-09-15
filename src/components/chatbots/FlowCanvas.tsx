import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Trash2, 
  Plus, 
  Check,
  AlertCircle
} from 'lucide-react';
import { FlowNode, FlowEdge, BuilderNodeType, ValidationIssue } from './types';
import { FlowCanvasNode } from './FlowCanvasNode';

interface FlowCanvasProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onSelectEdge: (edgeId: string | null) => void;
  onUpdateNodePosition: (nodeId: string, x: number, y: number) => void;
  onConnect: (source: string, sourceHandle: string, target: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  onAddNodeAtPosition: (type: BuilderNodeType, x: number, y: number) => void;
  onDuplicateNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  validationIssues: ValidationIssue[];
  theme: 'dark' | 'light';
  previewActiveNodeId?: string | null;
}

interface ActiveConnection {
  sourceNodeId: string;
  sourceHandle: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  selectedEdgeId,
  onSelectNode,
  onSelectEdge,
  onUpdateNodePosition,
  onConnect,
  onDeleteEdge,
  onAddNodeAtPosition,
  onDuplicateNode,
  onDeleteNode,
  validationIssues,
  theme,
  previewActiveNodeId
}) => {
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);

  // Viewport Pan & Zoom state
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 60, y: 60 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Node Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Active Connection line state
  const [activeConnection, setActiveConnection] = useState<ActiveConnection | null>(null);

  // Re-render tick to synchronize SVG lines to exact DOM handle element centers
  const [, setDomTick] = useState(0);
  useLayoutEffect(() => {
    setDomTick((t) => t + 1);
  }, [nodes, edges]);

  // Helper: screen coordinates to canvas world coordinates
  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom
    };
  }, [pan, zoom]);

  // Helper to query the exact DOM center of a handle in canvas world coordinates
  const getHandlePosition = useCallback(
    (handleId: string, fallbackX: number, fallbackY: number) => {
      const el = document.getElementById(handleId);
      const container = containerRef.current;
      if (!el || !container) {
        return { x: fallbackX, y: fallbackY };
      }
      const elRect = el.getBoundingClientRect();
      const cRect = container.getBoundingClientRect();

      const screenX = elRect.left + elRect.width / 2 - cRect.left;
      const screenY = elRect.top + elRect.height / 2 - cRect.top;

      return {
        x: (screenX - pan.x) / zoom,
        y: (screenY - pan.y) / zoom
      };
    },
    [pan, zoom]
  );

  // Handle Drag & Drop from left palette
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/reactflow-type') as BuilderNodeType;
    if (type) {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      onAddNodeAtPosition(type, Math.round(worldPos.x - 120), Math.round(worldPos.y - 40));
    }
  };

  // Canvas Mouse Down (Pan)
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking on empty canvas
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      onSelectNode(null);
      onSelectEdge(null);
      if (activeConnection) setActiveConnection(null);
    }
  };

  // Node Mouse Down (Drag)
  const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent) => {
    if (activeConnection) return;
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    const worldPos = screenToWorld(e.clientX, e.clientY);
    dragOffsetRef.current = {
      x: worldPos.x - node.x,
      y: worldPos.y - node.y
    };
    setDraggingNodeId(nodeId);
    onSelectNode(nodeId);
  };

  // Global Mouse Move & Up listeners for smooth pan & drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        setPan({
          x: e.clientX - panStartRef.current.x,
          y: e.clientY - panStartRef.current.y
        });
      } else if (draggingNodeId) {
        const worldPos = screenToWorld(e.clientX, e.clientY);
        const newX = Math.round(worldPos.x - dragOffsetRef.current.x);
        const newY = Math.round(worldPos.y - dragOffsetRef.current.y);
        onUpdateNodePosition(draggingNodeId, newX, newY);
      } else if (activeConnection) {
        const worldPos = screenToWorld(e.clientX, e.clientY);
        setActiveConnection((prev) => prev ? { ...prev, currentX: worldPos.x, currentY: worldPos.y } : null);
      }
    };

    const handleMouseUp = () => {
      if (isPanning) setIsPanning(false);
      if (draggingNodeId) setDraggingNodeId(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isEditingText =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable;
      if (isEditingText) return;

      if (e.key === 'Escape' && activeConnection) {
        setActiveConnection(null);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedEdgeId) {
        onDeleteEdge(selectedEdgeId);
      }
      // Arrow keys pan canvas
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const step = e.shiftKey ? 100 : 40;
        if (e.key === 'ArrowUp') setPan((p) => ({ ...p, y: p.y + step }));
        if (e.key === 'ArrowDown') setPan((p) => ({ ...p, y: p.y - step }));
        if (e.key === 'ArrowLeft') setPan((p) => ({ ...p, x: p.x + step }));
        if (e.key === 'ArrowRight') setPan((p) => ({ ...p, x: p.x - step }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPanning, draggingNodeId, activeConnection, screenToWorld, onUpdateNodePosition, selectedEdgeId, onDeleteEdge]);

  // Start Connection Handle click
  const handleStartConnection = (sourceNodeId: string, sourceHandle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const sourceNode = nodes.find((n) => n.id === sourceNodeId);
    if (!sourceNode) return;

    let startX = sourceNode.x + 250;
    let startY = sourceNode.y + 24;

    if (e.currentTarget && containerRef.current) {
      const elRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const cRect = containerRef.current.getBoundingClientRect();
      startX = (elRect.left + elRect.width / 2 - cRect.left - pan.x) / zoom;
      startY = (elRect.top + elRect.height / 2 - cRect.top - pan.y) / zoom;
    }

    const worldPos = screenToWorld(e.clientX, e.clientY);
    setActiveConnection({
      sourceNodeId,
      sourceHandle,
      startX,
      startY,
      currentX: worldPos.x,
      currentY: worldPos.y
    });
  };

  // Complete Connection when clicking target node input
  const handleConnectToNode = (targetNodeId: string) => {
    if (activeConnection && activeConnection.sourceNodeId !== targetNodeId) {
      onConnect(activeConnection.sourceNodeId, activeConnection.sourceHandle, targetNodeId);
      setActiveConnection(null);
    }
  };

  // Zoom Controls
  const handleZoomIn = () => setZoom((z) => Math.min(1.8, Math.round((z + 0.15) * 100) / 100));
  const handleZoomOut = () => setZoom((z) => Math.max(0.4, Math.round((z - 0.15) * 100) / 100));
  // Dynamic estimate of node height based on node type and sub-elements
  const getNodeHeight = (n: FlowNode) => {
    if (n.type === 'choice') {
      return 110 + (n.data.choices?.length || 0) * 36;
    }
    if (n.type === 'condition') {
      return 195;
    }
    if (n.type === 'message') {
      return 155;
    }
    if (n.type === 'question') {
      return 165;
    }
    if (n.type === 'handoff') {
      return 145;
    }
    return 130;
  };

  const handleFitView = useCallback(() => {
    if (nodes.length === 0) {
      setZoom(1);
      setPan({ x: 60, y: 80 });
      return;
    }
    const xs = nodes.map((n) => n.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...nodes.map((n) => n.x + 220)); // Exact node width
    const minY = Math.min(...nodes.map((n) => n.y));
    const maxY = Math.max(...nodes.map((n) => n.y + getNodeHeight(n)));

    const graphWidth = Math.max(120, maxX - minX);
    const graphHeight = Math.max(120, maxY - minY);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        // Usable rectangle within canvas boundaries (avoiding toolbar clipping or overflow)
        const paddingX = 55;
        const paddingY = 55;
        const availableW = Math.max(100, rect.width - paddingX * 2);
        const availableH = Math.max(100, rect.height - paddingY * 2);

        const scaleX = availableW / graphWidth;
        const scaleY = availableH / graphHeight;
        const optimalZoom = Math.min(1.0, Math.max(0.42, Math.min(scaleX, scaleY)));
        const roundedZoom = Math.round(optimalZoom * 100) / 100;

        const graphCenterX = (minX + maxX) / 2;
        const graphCenterY = (minY + maxY) / 2;

        setZoom(roundedZoom);
        setPan({
          x: Math.round(rect.width / 2 - graphCenterX * roundedZoom),
          y: Math.round(rect.height / 2 - graphCenterY * roundedZoom)
        });
      }
    }
  }, [nodes]);

  // Automatically frame graph when nodes change or on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFitView();
    }, 60);
    return () => clearTimeout(timer);
  }, [nodes, handleFitView]);

  // Keep canvas responsive when container resizes
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      handleFitView();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [handleFitView]);

  // Calculate coordinates of each edge path (Horizontal Left-to-Right Flow)
  const getEdgeCoordinates = (edge: FlowEdge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    if (!sourceNode || !targetNode) return null;

    // Determine source handle ID
    let sourceHandleId = `handle-out-${sourceNode.id}-default`;
    let fallbackSy = sourceNode.y + 24;

    if (sourceNode.type === 'choice' && edge.sourceHandle && edge.sourceHandle !== 'default') {
      const optIdx = (sourceNode.data.choices || []).findIndex(
        (o) => o.id === edge.sourceHandle || o.label === edge.label
      );
      if (optIdx >= 0 && sourceNode.data.choices?.[optIdx]) {
        sourceHandleId = `handle-out-${sourceNode.id}-${sourceNode.data.choices[optIdx].id}`;
      } else {
        sourceHandleId = `handle-out-${sourceNode.id}-${edge.sourceHandle}`;
      }
      fallbackSy = sourceNode.y + 75 + (optIdx >= 0 ? optIdx * 34 : 0);
    } else if (sourceNode.type === 'condition') {
      const isTrue = edge.sourceHandle === 'true' || edge.label === 'True' || edge.label === 'True Branch';
      sourceHandleId = `handle-out-${sourceNode.id}-${isTrue ? 'true' : 'false'}`;
      fallbackSy = sourceNode.y + (isTrue ? 84 : 116);
    }

    // Query exact DOM centers for both handles with reliable mathematical fallbacks (220px node width)
    const sourcePos = getHandlePosition(sourceHandleId, sourceNode.x + 220, fallbackSy);
    const targetPos = getHandlePosition(`handle-in-${targetNode.id}`, targetNode.x, targetNode.y + 24);

    const sx = sourcePos.x;
    const sy = sourcePos.y;
    const tx = targetPos.x;
    const ty = targetPos.y;

    // Horizontal bezier control points
    const dx = Math.max(50, Math.abs(tx - sx) * 0.45);
    const pathD = `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
    const midX = (sx + tx) / 2;
    const midY = (sy + ty) / 2;

    return { sx, sy, tx, ty, pathD, midX, midY };
  };

  // Dynamic Dotted Grid Pattern
  const dotColor = isDark ? '#2D323C' : '#E2E8F0';

  return (
    <div
      ref={containerRef}
      id="chatbot-flow-canvas"
      onMouseDown={handleCanvasMouseDown}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative flex-1 h-full overflow-hidden select-none cursor-grab active:cursor-grabbing transition-colors ${
        isDark ? 'bg-[#181A1F]' : 'bg-[#F8F9FA]'
      }`}
    >
      {/* SVG Background Grid & Bezier Edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <pattern
            id="canvas-grid-pattern"
            width={24 * zoom}
            height={24 * zoom}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${pan.x % (24 * zoom)}, ${pan.y % (24 * zoom)})`}
          >
            <circle cx="1.5" cy="1.5" r="1.2" fill={dotColor} />
          </pattern>

          {/* Arrow markers for each edge type */}
          <marker
            id="edge-arrow-slate"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill={isDark ? '#64748B' : '#94A3B8'} />
          </marker>

          <marker
            id="edge-arrow-purple"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#5A4AD2" />
          </marker>

          <marker
            id="edge-arrow-amber"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#F59E0B" />
          </marker>

          <marker
            id="edge-arrow-emerald"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#10B981" />
          </marker>

          <marker
            id="edge-arrow-rose"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#F43F5E" />
          </marker>
        </defs>

        {/* Crisp dotted background grid */}
        <rect width="100%" height="100%" fill="url(#canvas-grid-pattern)" />
      </svg>

      {/* World Container transformed by Pan and Zoom */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
        className="absolute inset-0 pointer-events-auto"
      >
        {/* SVG Edges Layer */}
        <svg className="absolute top-0 left-0 w-[5000px] h-[5000px] overflow-visible pointer-events-none">
          {/* Render Existing Edges */}
          {edges.map((edge) => {
            const coords = getEdgeCoordinates(edge);
            if (!coords) return null;
            const isSelected = selectedEdgeId === edge.id;
            const isChoiceEdge = edge.sourceHandle && edge.sourceHandle.startsWith('opt');
            const isTrueEdge = edge.sourceHandle === 'true' || edge.label === 'True' || edge.label === 'True Branch';
            const isFalseEdge = edge.sourceHandle === 'false' || edge.label === 'False' || edge.label === 'False Branch';

            let strokeColor = isDark ? '#64748B' : '#94A3B8';
            let markerId = 'edge-arrow-slate';

            if (isSelected) {
              strokeColor = '#5A4AD2';
              markerId = 'edge-arrow-purple';
            } else if (isChoiceEdge) {
              strokeColor = '#F59E0B';
              markerId = 'edge-arrow-amber';
            } else if (isTrueEdge) {
              strokeColor = '#10B981';
              markerId = 'edge-arrow-emerald';
            } else if (isFalseEdge) {
              strokeColor = '#F43F5E';
              markerId = 'edge-arrow-rose';
            }

            return (
              <g key={edge.id} className="pointer-events-auto cursor-pointer group">
                {/* Thick transparent hit target */}
                <path
                  d={coords.pathD}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEdge(edge.id);
                  }}
                />

                {/* Visible Glow Halo when Selected */}
                {isSelected && (
                  <path
                    d={coords.pathD}
                    fill="none"
                    stroke="#5A4AD2"
                    strokeWidth="8"
                    opacity="0.3"
                    className="pointer-events-none"
                  />
                )}

                {/* Visible Edge Line */}
                <path
                  d={coords.pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 3 : 2}
                  strokeDasharray={isSelected ? '6 4' : undefined}
                  markerEnd={`url(#${markerId})`}
                  className="transition-colors group-hover:stroke-[#5A4AD2]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEdge(edge.id);
                  }}
                />

                {/* Visible Distinct Source and Target Endpoint Circles when Selected */}
                {isSelected && (
                  <>
                    <circle
                      cx={coords.sx}
                      cy={coords.sy}
                      r="6"
                      fill="#5A4AD2"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <circle
                      cx={coords.tx}
                      cy={coords.ty}
                      r="6"
                      fill="#5A4AD2"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </>
                )}

                {/* Edge Label / Disconnect Pill */}
                {(edge.label || isSelected) && (
                  <foreignObject
                    x={coords.midX - 75}
                    y={coords.midY - 14}
                    width={150}
                    height={28}
                    className="overflow-visible pointer-events-auto"
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEdge(edge.id);
                      }}
                      className={`mx-auto w-fit max-w-[145px] px-2.5 py-0.5 rounded-full text-[10px] font-semibold truncate border shadow-sm transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#5A4AD2] text-white border-transparent ring-2 ring-[#5A4AD2]/40'
                          : isDark
                          ? 'bg-[#21252B] border-slate-700 text-slate-300 hover:border-slate-500'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <span className="truncate">{edge.label || 'Connection'}</span>
                      {isSelected && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEdge(edge.id);
                          }}
                          className="hover:text-rose-200 transition-colors flex items-center gap-0.5 font-bold pl-1 border-l border-white/30"
                          title="Disconnect connection"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span className="text-[9px]">Disconnect</span>
                        </button>
                      )}
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}

          {/* Active Pending Connection Line */}
          {activeConnection && (() => {
            const dx = Math.max(40, Math.abs(activeConnection.currentX - activeConnection.startX) * 0.5);
            return (
              <path
                d={`M ${activeConnection.startX} ${activeConnection.startY} C ${activeConnection.startX + dx} ${
                  activeConnection.startY
                }, ${activeConnection.currentX - dx} ${activeConnection.currentY}, ${
                  activeConnection.currentX
                } ${activeConnection.currentY}`}
                fill="none"
                stroke="#5A4AD2"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
            );
          })()}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node) => (
          <div
            key={node.id}
            onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
            className="pointer-events-auto"
          >
            <FlowCanvasNode
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={onSelectNode}
              onStartConnection={handleStartConnection}
              onConnectToNode={handleConnectToNode}
              onDuplicate={onDuplicateNode}
              onDelete={onDeleteNode}
              validationIssues={validationIssues}
              theme={theme}
              isConnecting={!!activeConnection}
              isActivePreview={node.id === previewActiveNodeId}
            />
          </div>
        ))}

        {/* Canvas Empty State */}
        {nodes.length === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center p-8 rounded-2xl border max-w-sm">
            <h3 className="font-bold text-sm text-slate-300 mb-1">Canvas is empty</h3>
            <p className="text-xs text-slate-500 mb-4">
              Build your chatbot. Add a step from Building Blocks to begin.
            </p>
            <button
              type="button"
              onClick={() => onAddNodeAtPosition('start', 200, 150)}
              className="px-4 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl"
            >
              + Add Start Trigger
            </button>
          </div>
        )}
      </div>

      {/* Floating Canvas Controls (Bottom-Left) */}
      <div 
        id="canvas-zoom-controls"
        className={`absolute bottom-5 left-5 rounded-2xl border shadow-lg flex items-center p-1 gap-1 z-20 ${
          isDark ? 'bg-[#21252B] border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
        }`}
      >
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom in"
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono font-bold px-2 select-none min-w-[42px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className={`h-4 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        <button
          type="button"
          onClick={handleFitView}
          aria-label="Fit view to graph"
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-xs flex items-center gap-1 font-semibold"
          title="Fit View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Fit</span>
        </button>
      </div>

      {/* Minimap (Bottom-Right) */}
      <div 
        id="canvas-minimap"
        className={`absolute bottom-5 right-5 w-40 h-28 rounded-2xl border shadow-lg overflow-hidden p-1.5 z-20 transition-colors hidden sm:block ${
          isDark ? 'bg-[#21252B]/90 border-slate-700' : 'bg-white/90 border-slate-200'
        }`}
      >
        <div className="relative w-full h-full bg-black/10 rounded-xl overflow-hidden">
          {/* Tiny node blocks */}
          {nodes.map((n) => {
            // Map coordinates into 0..1 range for horizontal graph
            const normX = Math.min(Math.max(n.x / 2000, 0), 0.9);
            const normY = Math.min(Math.max(n.y / 700, 0), 0.85);
            return (
              <div
                key={n.id}
                style={{
                  left: `${normX * 100}%`,
                  top: `${normY * 100}%`
                }}
                className={`absolute w-3 h-2 rounded-xs ${
                  n.id === selectedNodeId ? 'bg-[#5A4AD2]' : isDark ? 'bg-slate-500' : 'bg-slate-400'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
