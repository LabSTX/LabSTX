import React from 'react';
import { ModuleType, DraggableItemProps } from '../types';
import { Box, RefreshCcw, Wallet, Activity, GripVertical, ChevronRight, ChevronLeft, Menu } from 'lucide-react';
import { NeoButton } from './NeoButton';

interface SidebarProps {
  usedTypes: ModuleType[];
  width: number;
  onToggleCollapse: () => void;
}

const DraggableItem: React.FC<DraggableItemProps & { isCompact: boolean }> = ({ type, label, icon, description, isCompact }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/react-dnd-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`bg-white border-2 border-casper-red mb-4 cursor-grab active:cursor-grabbing shadow-neo-sm hover:shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all group select-none ${isCompact ? 'p-2 flex justify-center' : 'p-4'}`}
      title={isCompact ? label : undefined}
    >
      <div className={`flex items-start pointer-events-none ${isCompact ? 'justify-center' : 'gap-3'}`}>
        <div className={`text-casper-red border-2 border-casper-red p-1 bg-gray-50 group-hover:bg-casper-red group-hover:text-white transition-colors ${isCompact ? 'mt-0' : 'mt-1'}`}>
            {icon}
        </div>
        {!isCompact && (
          <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                  <h4 className="font-display font-bold uppercase tracking-wide text-sm truncate">{label}</h4>
                  <GripVertical size={16} className="text-gray-300 group-hover:text-casper-red shrink-0" />
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ usedTypes, width, onToggleCollapse }) => {
  // Determine if we are in compact mode based on width
  const isCompact = width < 180;

  // Define available modules
  const availableModules = [
    {
        type: ModuleType.NFT,
        label: "NFT Minter",
        icon: <Box size={18} />,
        description: "Deploy CSPR-721 collections."
    },
    {
        type: ModuleType.SWAP,
        label: "Token Swap",
        icon: <RefreshCcw size={18} />,
        description: "Exchange CEP-18 tokens."
    },
    {
        type: ModuleType.BRIDGE,
        label: "Cross-Chain",
        icon: <Wallet size={18} />,
        description: "Bridge ETH to CSPR assets."
    },
    {
        type: ModuleType.INTENT,
        label: "Smart Intent",
        icon: <Activity size={18} />,
        description: "Automate based on triggers."
    }
  ];

  // Filter modules that are already on the canvas
  const displayedModules = availableModules.filter(m => !usedTypes.includes(m.type));

  return (
    <aside 
      className="bg-white border-r-2 border-casper-red flex flex-col h-full overflow-hidden relative z-20 transition-all duration-75"
      style={{ width: width }}
    >
      {/* Header */}
      <div className={`border-b-2 border-casper-red bg-gray-50 flex items-center ${isCompact ? 'justify-center p-2' : 'justify-between p-4 lg:p-6'}`}>
        {!isCompact && (
          <div className="overflow-hidden whitespace-nowrap">
            <h2 className="text-xl font-display font-black uppercase mb-1">Modules</h2>
            <p className="text-xs text-gray-500 font-mono">Drag blocks to build dApp</p>
          </div>
        )}
        <button 
          onClick={onToggleCollapse}
          className="p-1 hover:bg-casper-red hover:text-white transition-colors rounded-sm"
          title={isCompact ? "Expand" : "Collapse"}
        >
          {isCompact ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Modules List */}
      <div className={`overflow-y-auto no-scrollbar flex-1 ${isCompact ? 'p-2' : 'p-4 lg:p-6'} space-y-2`}>
        {displayedModules.length > 0 ? (
          displayedModules.map(item => (
              <DraggableItem 
                  key={item.type}
                  type={item.type} 
                  label={item.label} 
                  icon={item.icon} 
                  description={item.description}
                  isCompact={isCompact}
              />
          ))
        ) : (
          <div className={`text-center border-2 border-dashed border-gray-200 text-gray-400 font-mono text-xs ${isCompact ? 'p-2 text-[10px]' : 'p-4'}`}>
            {isCompact ? 'Empty' : 'All modules used'}
          </div>
        )}
      </div>

      {/* Footer / Docs */}
      <div className={`border-t-2 border-casper-red bg-gray-50 ${isCompact ? 'p-2 hidden' : 'p-4 lg:p-6 block'}`}>
        <div className="bg-casper-red text-white border-2 border-casper-red p-4 shadow-neo-black-sm">
            <h5 className="font-display font-bold text-sm mb-1 uppercase">Documentation</h5>
            <p className="text-xs mb-3 opacity-90">Master the Casper ecosystem modules.</p>
            <a href="#" className="text-xs font-bold uppercase flex items-center gap-1 hover:underline">
                Read Docs <ChevronRight size={12}/>
            </a>
        </div>
      </div>
    </aside>
  );
};
