import React, { useState, useRef, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ModuleCard } from './ModuleCard';
import { CanvasModule, ModuleType, Connection } from '../types';
import { NeoButton } from './NeoButton';
import { Trash2, Play, Loader2, CheckCircle2, XCircle, Terminal, ChevronDown, ChevronUp, Copy, Clock, Hash, Box } from 'lucide-react';

// Execution Step Interface
interface ExecutionStep {
  moduleId: string;
  moduleTitle: string;
  status: 'pending' | 'running' | 'success' | 'error';
  logs: string[];
  txHash?: string;
  timestamp?: string;
  gasFee?: string;
  blockNumber?: string;
}

export const WorkflowBuilder: React.FC = () => {
  const [modules, setModules] = useState<CanvasModule[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  
  // Layout State
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  
  const [workflowHeight, setWorkflowHeight] = useState(300);
  const [isWorkflowCollapsed, setIsWorkflowCollapsed] = useState(false);
  const [isResizingWorkflow, setIsResizingWorkflow] = useState(false);

  // Dragging State
  const [draggingModuleId, setDraggingModuleId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Connection State
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Execution State
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Constants
  const MODULE_WIDTH = 256; 
  const MODULE_GAP = 80;
  const FIXED_Y = 120; // Fixed vertical position for pipeline view
  const MIN_SIDEBAR_WIDTH = 80;
  const MAX_SIDEBAR_WIDTH = 480;
  const MIN_WORKFLOW_HEIGHT = 48; // Header only
  const MAX_WORKFLOW_HEIGHT = 800;

  // Derived State for UI
  const inputConnections = new Set(connections.map(c => c.toModuleId));
  const outputConnections = new Set(connections.map(c => c.fromModuleId));
  const usedTypes = modules.map(m => m.type);

  // Progress calculation
  const totalSteps = executionSteps.length;
  const completedSteps = executionSteps.filter(s => s.status === 'success').length;
  const progressPercentage = totalSteps === 0 ? 0 : (completedSteps / totalSteps) * 100;

  // --- LAYOUT RESIZING HANDLERS ---
  
  const startResizingSidebar = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingSidebar(true);
  };

  const startResizingWorkflow = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingWorkflow(true);
  };

  const toggleSidebarCollapse = () => {
    if (sidebarWidth <= MIN_SIDEBAR_WIDTH) {
        setSidebarWidth(320); // Expand
    } else {
        setSidebarWidth(MIN_SIDEBAR_WIDTH); // Collapse
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (isResizingSidebar) {
            const newWidth = Math.min(Math.max(e.clientX, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH);
            setSidebarWidth(newWidth);
        }
        if (isResizingWorkflow) {
            // Calculate height from bottom
            const newHeight = Math.min(Math.max(window.innerHeight - e.clientY, MIN_WORKFLOW_HEIGHT), MAX_WORKFLOW_HEIGHT);
            setWorkflowHeight(newHeight);
            if (newHeight > MIN_WORKFLOW_HEIGHT + 20) setIsWorkflowCollapsed(false);
        }
    };

    const handleMouseUp = () => {
        setIsResizingSidebar(false);
        setIsResizingWorkflow(false);
    };

    if (isResizingSidebar || isResizingWorkflow) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = isResizingSidebar ? 'col-resize' : 'row-resize';
    } else {
        document.body.style.cursor = 'default';
    }

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
    };
  }, [isResizingSidebar, isResizingWorkflow]);

  // Auto-scroll logs
  useEffect(() => {
    if (expandedStepId && logsEndRef.current) {
        logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [executionSteps, expandedStepId]);


  // --- HELPERS ---

  // Convert screen coordinates to canvas coordinates (taking horizontal scroll into account)
  const screenToCanvas = (sx: number, sy: number) => {
    if (!scrollContainerRef.current) return { x: 0, y: 0 };
    const rect = scrollContainerRef.current.getBoundingClientRect();
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    
    return {
      x: sx - rect.left + scrollLeft,
      y: sy - rect.top, // Vertical scroll is hidden/locked relative to this container
    };
  };

  const getModuleCenter = (id: string, type: 'source' | 'target') => {
    const mod = modules.find(m => m.id === id);
    if (!mod) return { x: 0, y: 0 };
    // Source (output) is on right side: x + 256 (width) + 12 (offset) = x + 268
    // Target (input) is on left side: x - 12 (offset)
    // Port vertical center is approx 44px (32px top + 12px center)
    if (type === 'source') {
        return { x: mod.x + 268, y: mod.y + 44 }; 
    } else {
        return { x: mod.x - 12, y: mod.y + 44 };
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // --- HANDLERS ---

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/react-dnd-type') as ModuleType;
    
    if (type) {
      // Logic for Auto-Appending to the end of the pipeline
      let newX = 50; // Default start position
      let snapSourceId: string | null = null;

      if (modules.length > 0) {
        // Find the right-most module
        const rightMostModule = modules.reduce((prev, current) => (prev.x > current.x) ? prev : current);
        
        newX = rightMostModule.x + MODULE_WIDTH + MODULE_GAP;
        snapSourceId = rightMostModule.id;
      }

      const newModule: CanvasModule = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        title: getTitleForType(type),
        x: newX,
        y: FIXED_Y, // Enforce fixed Y alignment
      };
      
      setModules((prev) => [...prev, newModule]);

      // Auto-connect if appending
      if (snapSourceId) {
          const isSourceOccupied = connections.some(c => c.fromModuleId === snapSourceId);
          if (!isSourceOccupied) {
              const newConnection: Connection = {
                  id: Math.random().toString(36).substr(2, 9),
                  fromModuleId: snapSourceId,
                  toModuleId: newModule.id
              };
              setConnections(prev => [...prev, newConnection]);
          }
      }
    }
  };

  const getTitleForType = (type: ModuleType) => {
    switch (type) {
      case ModuleType.NFT: return 'NFT Minter';
      case ModuleType.SWAP: return 'Token Swap';
      case ModuleType.BRIDGE: return 'Bridge';
      case ModuleType.INTENT: return 'Intent';
      default: return 'Module';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvasPos = screenToCanvas(e.clientX, e.clientY);
    setMousePos(canvasPos);

    if (draggingModuleId) {
        // Drag logic
        const rawX = canvasPos.x - dragOffset.x;
        
        // Lock Y axis to FIXED_Y, allow X movement with 20px grid snap
        const newX = Math.max(0, Math.round(rawX / 20) * 20);
        
        setModules(prev => prev.map(m => m.id === draggingModuleId ? { ...m, x: newX, y: FIXED_Y } : m));
    }
  };

  const handleMouseUp = () => {
    setDraggingModuleId(null);
    setConnectingSourceId(null);
  };

  const handleModuleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const pos = screenToCanvas(e.clientX, e.clientY);
    const mod = modules.find(m => m.id === id);
    if (mod) {
        setDragOffset({ x: pos.x - mod.x, y: pos.y - mod.y });
        setDraggingModuleId(id);
    }
  };

  const handleConnectStart = (moduleId: string, type: 'source' | 'target') => {
    if (type === 'source') {
        if (outputConnections.has(moduleId)) return;
        setConnectingSourceId(moduleId);
    }
  };

  const handleConnectEnd = (targetModuleId: string) => {
    if (connectingSourceId && connectingSourceId !== targetModuleId) {
        const isSourceOccupied = connections.some(c => c.fromModuleId === connectingSourceId);
        const isTargetOccupied = connections.some(c => c.toModuleId === targetModuleId);

        if (!isSourceOccupied && !isTargetOccupied) {
            setConnections(prev => [...prev, {
                id: Math.random().toString(36).substr(2, 9),
                fromModuleId: connectingSourceId,
                toModuleId: targetModuleId
            }]);
        }
    }
    setConnectingSourceId(null);
  };

  const handleDelete = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
    setConnections(prev => prev.filter(c => c.fromModuleId !== id && c.toModuleId !== id));
  };

  // --- WORKFLOW SIMULATION ---

  const runSimulation = async () => {
    if (modules.length === 0) return;
    if (isWorkflowCollapsed) setIsWorkflowCollapsed(false); // Auto open
    
    setIsRunning(true);
    setExecutionSteps([]);

    // Sort modules by X position for execution order since it's linear
    const sortedModules = [...modules].sort((a, b) => a.x - b.x);

    const steps: ExecutionStep[] = sortedModules.map(m => ({
        moduleId: m.id,
        moduleTitle: m.title,
        status: 'pending',
        logs: [],
    }));
    setExecutionSteps(steps);

    // Simulate Execution
    for (let i = 0; i < steps.length; i++) {
        const currentStep = steps[i];
        
        // Update to Running
        setExecutionSteps(prev => prev.map(s => s.moduleId === currentStep.moduleId ? { 
            ...s, 
            status: 'running', 
            logs: ['Initiating transaction...', 'Signing payload...'] 
        } : s));
        
        setExpandedStepId(currentStep.moduleId); // Auto expand current

        // Random delay 1-2s
        await new Promise(r => setTimeout(r, 800));
        
        // Add more logs
        setExecutionSteps(prev => prev.map(s => s.moduleId === currentStep.moduleId ? { 
            ...s, 
            logs: [...s.logs, 'Broadcasting to network...', 'Waiting for consensus...'] 
        } : s));

        await new Promise(r => setTimeout(r, 800));

        // Generate mock data
        const mockHash = "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
        const gasFee = (Math.random() * 5 + 0.1).toFixed(4) + " CSPR";
        const blockNum = Math.floor(Math.random() * 1000000 + 2000000).toString();
        
        // Update to Success
        setExecutionSteps(prev => prev.map(s => s.moduleId === currentStep.moduleId ? { 
            ...s, 
            status: 'success', 
            logs: [...s.logs, 'Transaction confirmed on-chain.'],
            txHash: mockHash,
            timestamp: new Date().toLocaleTimeString(),
            gasFee,
            blockNumber: blockNum
        } : s));
    }
    
    setIsRunning(false);
  };

  // --- RENDER HELPERS ---

  const renderConnection = (from: {x: number, y: number}, to: {x: number, y: number}, connection: Connection) => {
    const horizontalDist = Math.abs(to.x - from.x);
    // Use a smoother control point distance logic
    // Minimum 60px handle ensures line comes out straight even if modules are close
    const controlDist = Math.max(horizontalDist * 0.5, 60);
    
    const path = `M ${from.x} ${from.y} C ${from.x + controlDist} ${from.y}, ${to.x - controlDist} ${to.y}, ${to.x} ${to.y}`;
    
    // Check if data is flowing (Source module executed successfully)
    const sourceStep = executionSteps.find(s => s.moduleId === connection.fromModuleId);
    const isFlowing = sourceStep?.status === 'success';

    const strokeColor = isFlowing ? "#ff2d2e" : "#9ca3af"; // Gray-400 for default

    return (
        <g key={connection.id} className="connection-group cursor-pointer group">
            {/* Visual Anchor Circle at Source (Removes gap) */}
            <circle cx={from.x} cy={from.y} r="6" fill={strokeColor} className="transition-colors duration-300" />
            
             {/* Visual Anchor Circle at Target */}
             <circle cx={to.x} cy={to.y} r="6" fill={strokeColor} className="transition-colors duration-300" />

            {/* Hover Target / Glow Area */}
            <path 
                d={path} 
                className="connection-path-outline transition-all duration-300"
                stroke={isFlowing ? "#ff2d2e" : "transparent"}
                strokeOpacity={isFlowing ? "0.1" : "0"} 
                strokeWidth="20" 
                fill="none" 
            />
            
            {/* Main Line */}
            <path 
                d={path} 
                className="connection-path-main transition-all duration-300"
                stroke={strokeColor} 
                strokeWidth="4" 
                fill="none" 
                strokeLinecap="round"
                style={{ filter: isFlowing ? 'drop-shadow(0px 0px 3px rgba(255, 45, 46, 0.5))' : 'none' }} 
            />
            
            {/* Animated Dash for Active Flow */}
            {isFlowing && (
                <path 
                    d={path} 
                    stroke="#ffffff" 
                    strokeWidth="2" 
                    strokeDasharray="10, 10"
                    fill="none" 
                    className="animate-flow"
                    style={{ opacity: 0.8 }}
                />
            )}

            {/* Arrowhead */}
            <path 
                d={path} 
                stroke="transparent" 
                strokeWidth="1" 
                fill="none" 
                markerEnd={isFlowing ? "url(#arrowhead-red)" : "url(#arrowhead-gray)"} 
            />
        </g>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-[#f3f4f6] overflow-hidden text-casper-black selection:bg-casper-red selection:text-white">
      <Header />
      
      <main className="flex-1 flex overflow-hidden relative">
        {/* RESIZABLE SIDEBAR */}
        <div 
          className="relative flex-shrink-0 transition-none"
          style={{ width: sidebarWidth }}
        >
          <Sidebar usedTypes={usedTypes} width={sidebarWidth} onToggleCollapse={toggleSidebarCollapse} />
          {/* Drag Handle */}
          <div 
            className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-casper-red z-30 transition-colors"
            onMouseDown={startResizingSidebar}
          />
        </div>

        {/* RIGHT SIDE MAIN AREA */}
        <div className="flex-1 flex flex-col h-full border-l-2 border-casper-red relative min-w-0">
            
            {/* TOP SECTION: CANVAS (Flexible Height) */}
            <div className="flex-1 relative flex flex-col border-b-2 border-casper-red bg-gray-50 min-h-0">
                {/* Toolbar */}
                <div className="absolute top-4 right-4 z-40 flex gap-2">
                     <NeoButton 
                        className="!p-2 shadow-neo-sm bg-white" 
                        onClick={() => { setModules([]); setConnections([]); setExecutionSteps([]); }} 
                        title="Clear Canvas"
                     >
                        <Trash2 size={16} />
                     </NeoButton>
                </div>

                {/* Horizontal Scrolling Canvas Container */}
                <div 
                    ref={scrollContainerRef}
                    className="flex-1 overflow-x-auto overflow-y-hidden relative no-scrollbar canvas-bg cursor-crosshair"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{
                        backgroundImage: 'radial-gradient(#ff2d2e 1.5px, transparent 1.5px)',
                        backgroundSize: '20px 20px',
                    }}
                >
                    <div 
                        className="h-full relative min-w-full"
                        style={{ width: Math.max(2000, ...modules.map(m => m.x + 400)) + 'px' }} // Dynamic width
                    >
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible">
                            <defs>
                                <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#ff2d2e" />
                                </marker>
                                <marker id="arrowhead-gray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
                                </marker>
                            </defs>
                            {connections.map(conn => {
                                const source = getModuleCenter(conn.fromModuleId, 'source');
                                const target = getModuleCenter(conn.toModuleId, 'target');
                                return renderConnection(source, target, conn);
                            })}
                            {connectingSourceId && (
                                <path 
                                    d={`M ${getModuleCenter(connectingSourceId, 'source').x} ${getModuleCenter(connectingSourceId, 'source').y} 
                                        C ${getModuleCenter(connectingSourceId, 'source').x + 50} ${getModuleCenter(connectingSourceId, 'source').y}, 
                                        ${mousePos.x - 50} ${mousePos.y}, 
                                        ${mousePos.x} ${mousePos.y}`}
                                    stroke="#ff2d2e" 
                                    strokeWidth="4" 
                                    strokeDasharray="5,5"
                                    className="animate-dash"
                                    fill="none"
                                    markerEnd="url(#arrowhead-red)"
                                />
                            )}
                        </svg>

                        {modules.map(module => (
                            <ModuleCard 
                                key={module.id} 
                                module={module} 
                                onDelete={handleDelete}
                                onMouseDown={(e) => handleModuleMouseDown(e, module.id)}
                                onConnectStart={handleConnectStart}
                                onConnectEnd={handleConnectEnd}
                                isInputConnected={inputConnections.has(module.id)}
                                isOutputConnected={outputConnections.has(module.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION: WORKFLOW EXECUTION (Resizable) */}
            <div 
                className="bg-white flex flex-col relative transition-none border-t-2 border-casper-red shadow-[-4px_-4px_10px_rgba(0,0,0,0.05)]"
                style={{ height: isWorkflowCollapsed ? MIN_WORKFLOW_HEIGHT : workflowHeight }}
            >
                {/* Drag Handle */}
                <div 
                    className="absolute top-0 left-0 w-full h-1.5 cursor-row-resize hover:bg-casper-red z-30 transition-colors"
                    onMouseDown={startResizingWorkflow}
                />

                {/* Header */}
                <div 
                    className="h-12 p-3 border-b border-gray-100 bg-casper-black text-white flex justify-between items-center shrink-0 cursor-pointer hover:bg-gray-900 transition-colors relative"
                    onClick={() => setIsWorkflowCollapsed(!isWorkflowCollapsed)}
                >
                    <div className="flex items-center gap-2">
                        {isWorkflowCollapsed ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                        <Terminal size={16} />
                        <h3 className="font-mono text-sm font-bold uppercase">Workflow Console</h3>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <NeoButton 
                            variant="primary"
                            className="!py-1 !px-3 text-[10px] shadow-none border border-white/20 hover:border-white h-8" 
                            onClick={(e) => { e.stopPropagation(); runSimulation(); }}
                            disabled={isRunning}
                        >
                            {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                            <span className="ml-2">{isRunning ? 'EXECUTING...' : 'RUN'}</span>
                        </NeoButton>
                    </div>

                     {/* Progress Bar (Attached to bottom of header) */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                         <div 
                            className="h-full bg-casper-red transition-all duration-500 ease-out" 
                            style={{ width: `${progressPercentage}%` }} 
                         />
                    </div>
                </div>
                
                {/* Content */}
                <div className={`flex-1 overflow-y-auto p-4 bg-gray-50 ${isWorkflowCollapsed ? 'hidden' : 'block'}`}>
                    {executionSteps.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-40 select-none">
                             <Terminal size={32} className="mb-2" />
                             <p className="font-mono text-xs uppercase">No execution data</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-w-4xl mx-auto pb-8">
                            {executionSteps.map((step) => {
                                const isExpanded = expandedStepId === step.moduleId;
                                return (
                                    <div 
                                        key={step.moduleId} 
                                        className={`bg-white border border-gray-200 shadow-sm transition-all duration-300 overflow-hidden ${step.status === 'running' ? 'border-l-4 border-l-blue-500 shadow-md ring-1 ring-blue-100' : ''} ${step.status === 'success' ? 'border-l-4 border-l-green-500' : ''}`}
                                    >
                                        <div 
                                            className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                                            onClick={() => setExpandedStepId(isExpanded ? null : step.moduleId)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 flex justify-center">
                                                    {step.status === 'pending' && <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>}
                                                    {step.status === 'running' && <Loader2 size={16} className="text-blue-500 animate-spin" />}
                                                    {step.status === 'success' && <CheckCircle2 size={16} className="text-green-500" />}
                                                    {step.status === 'error' && <XCircle size={16} className="text-red-500" />}
                                                </div>
                                                <span className="font-display font-bold uppercase text-sm">{step.moduleTitle}</span>
                                                <span className="font-mono text-[10px] text-gray-400 uppercase">{step.moduleId}</span>
                                            </div>
                                            <div className="flex items-center gap-3 font-mono text-xs">
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border
                                                    ${step.status === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                      step.status === 'running' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                                      'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                    {step.status}
                                                </span>
                                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </div>
                                        </div>

                                        {/* Details Panel */}
                                        {isExpanded && (
                                            <div className="p-4 bg-[#0d0d0d] text-gray-300 font-mono text-xs border-t border-gray-800">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    <div className="group relative">
                                                        <span className="block text-[10px] uppercase text-gray-500 mb-1 tracking-wider flex items-center gap-1"><Hash size={10}/> Transaction Hash</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-casper-red break-all font-bold truncate">{step.txHash || 'Pending...'}</span>
                                                            {step.txHash && (
                                                                <button onClick={(e) => { e.stopPropagation(); copyToClipboard(step.txHash!); }} className="text-gray-600 hover:text-white transition-colors" title="Copy Hash">
                                                                    <Copy size={12} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] uppercase text-gray-500 mb-1 tracking-wider flex items-center gap-1"><Box size={10}/> Block Number</span>
                                                        <span className="text-white font-bold">{step.blockNumber || '---'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] uppercase text-gray-500 mb-1 tracking-wider flex items-center gap-1"><Terminal size={10}/> Gas Fee</span>
                                                        <span className="text-white font-bold">{step.gasFee || '---'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] uppercase text-gray-500 mb-1 tracking-wider flex items-center gap-1"><Clock size={10}/> Timestamp</span>
                                                        <span className="text-white font-bold">{step.timestamp || '---'}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="border-t border-gray-800 pt-3 mt-3">
                                                    <span className="block text-[10px] uppercase text-gray-500 mb-2 tracking-wider">Execution Logs</span>
                                                    <div className="bg-[#1a1a1a] rounded border border-gray-800 p-3 space-y-1 font-mono text-[11px] h-32 overflow-y-auto custom-scrollbar">
                                                        {step.logs.length === 0 ? (
                                                            <span className="opacity-30 italic">Waiting for execution...</span>
                                                        ) : (
                                                            step.logs.map((log, idx) => (
                                                                <div key={idx} className="flex gap-2 animate-fade-in-up">
                                                                    <span className="text-gray-600 select-none w-4 text-right">{(idx + 1)}</span>
                                                                    <span className="text-green-500 opacity-70">➜</span>
                                                                    <span className="text-gray-300">{log}</span>
                                                                </div>
                                                            ))
                                                        )}
                                                        {step.status === 'running' && (
                                                            <div className="animate-pulse text-casper-red mt-1 ml-6">_</div>
                                                        )}
                                                        <div ref={logsEndRef} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}