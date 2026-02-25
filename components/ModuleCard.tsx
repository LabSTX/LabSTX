import React from 'react';
import { CanvasModule, ModuleType } from '../types';
import { X, RefreshCcw, ArrowRight, Wallet, Activity, Box } from 'lucide-react';
import { NeoButton } from './NeoButton';

interface ModuleCardProps {
  module: CanvasModule;
  onDelete: (id: string) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onConnectStart: (moduleId: string, type: 'source' | 'target') => void;
  onConnectEnd: (moduleId: string) => void;
  isInputConnected: boolean;
  isOutputConnected: boolean;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ 
  module, 
  onDelete, 
  onMouseDown,
  onConnectStart,
  onConnectEnd,
  isInputConnected,
  isOutputConnected
}) => {

  const handlePortMouseDown = (e: React.MouseEvent, type: 'source' | 'target') => {
    e.stopPropagation(); // Prevent module drag
    onConnectStart(module.id, type);
  };

  const handlePortMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConnectEnd(module.id);
  };

  const renderContent = () => {
    switch (module.type) {
      case ModuleType.NFT:
        return (
          <div className="space-y-3">
            <div className="aspect-video w-full bg-gray-50 border-2 border-casper-red flex items-center justify-center overflow-hidden relative group">
              <img 
                src="https://picsum.photos/400/200?random=1" 
                alt="NFT Preview" 
                className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase font-display text-casper-red">Collection Name</label>
              <input type="text" placeholder="Casper Punks" className="border-2 border-casper-red p-1.5 text-xs outline-none focus:bg-casper-red/5 font-mono w-full" />
              <NeoButton variant="primary" fullWidth className="!py-2 !text-xs">Mint</NeoButton>
            </div>
          </div>
        );

      case ModuleType.SWAP:
        return (
          <div className="space-y-2">
            <div className="bg-gray-50 p-2 border-2 border-casper-red">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] font-bold font-display text-casper-red">FROM</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="0.0" className="w-full bg-transparent text-sm font-mono outline-none" />
                <span className="font-bold border border-casper-red px-1 bg-white text-[10px]">CSPR</span>
              </div>
            </div>

            <div className="flex justify-center -my-2 relative z-10">
              <div className="bg-white border-2 border-casper-red p-0.5 shadow-neo-sm">
                <RefreshCcw size={12} className="text-casper-red" />
              </div>
            </div>

            <div className="bg-gray-50 p-2 border-2 border-casper-red">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] font-bold font-display text-casper-red">TO</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="0.0" className="w-full bg-transparent text-sm font-mono outline-none" disabled />
                <span className="font-bold border border-casper-red px-1 bg-white text-[10px]">USDT</span>
              </div>
            </div>
          </div>
        );

      case ModuleType.BRIDGE:
        return (
          <div className="space-y-3">
             <div className="flex items-center justify-between gap-2 p-2 border-2 border-casper-red bg-gray-50">
                <div className="w-6 h-6 border-2 border-casper-red bg-blue-500 flex items-center justify-center text-white text-[8px] font-bold">ETH</div>
                <ArrowRight size={12} className="text-casper-red" />
                <div className="w-6 h-6 border-2 border-casper-red bg-casper-red flex items-center justify-center text-white text-[8px] font-bold">CSPR</div>
             </div>
             <div>
                <label className="text-[10px] font-bold uppercase mb-1 block font-display text-casper-red">Amount</label>
                <input type="text" className="w-full border-2 border-casper-red p-1.5 font-mono text-xs" placeholder="0.00" />
             </div>
          </div>
        );

      case ModuleType.INTENT:
        return (
          <div className="space-y-2">
             <div className="p-2 border-2 border-casper-red bg-yellow-50">
                <label className="text-[10px] font-bold uppercase block mb-1 font-display text-casper-red">If Condition</label>
                <select className="w-full border-2 border-casper-red bg-white p-1 text-[10px] font-mono">
                    <option>Price &gt; Target</option>
                    <option>Balance &gt; Amount</option>
                </select>
             </div>
             <div className="p-2 border-2 border-casper-red bg-green-50">
                <label className="text-[10px] font-bold uppercase block mb-1 font-display text-casper-red">Then Action</label>
                <select className="w-full border-2 border-casper-red bg-white p-1 text-[10px] font-mono">
                    <option>Execute</option>
                    <option>Notify</option>
                </select>
             </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getIcon = () => {
    switch(module.type) {
        case ModuleType.NFT: return <Box size={14} />;
        case ModuleType.SWAP: return <RefreshCcw size={14} />;
        case ModuleType.BRIDGE: return <Wallet size={14} />;
        case ModuleType.INTENT: return <Activity size={14} />;
    }
  };

  return (
    <div 
      className="absolute bg-white border-2 border-casper-red shadow-neo w-64 select-none hover:shadow-neo-hover hover:z-50 transition-shadow"
      style={{
        left: module.x,
        top: module.y,
        cursor: 'grab'
      }}
      onMouseDown={onMouseDown}
    >
      {/* Input Port (Left) */}
      <div 
        className={`absolute -left-3 top-8 w-6 h-6 flex items-center justify-center z-50 group 
            ${isInputConnected ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
        onMouseDown={!isInputConnected ? (e) => handlePortMouseDown(e, 'target') : undefined}
        onMouseUp={handlePortMouseUp}
        title={isInputConnected ? "Port occupied" : "Connect Input"}
      >
        <div className={`w-3 h-3 border-2 border-casper-red rounded-full transition-colors
             ${isInputConnected ? 'bg-casper-red' : 'bg-white group-hover:bg-casper-red'}`}></div>
      </div>

      {/* Output Port (Right) */}
      <div 
        className={`absolute -right-3 top-8 w-6 h-6 flex items-center justify-center z-50 group 
            ${isOutputConnected ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
        onMouseDown={!isOutputConnected ? (e) => handlePortMouseDown(e, 'source') : undefined}
        onMouseUp={handlePortMouseUp}
        title={isOutputConnected ? "Port occupied" : "Connect Output"}
      >
        <div className={`w-3 h-3 border-2 border-casper-red rounded-full transition-transform
             ${isOutputConnected ? 'bg-casper-red' : 'bg-casper-red group-hover:scale-125'}`}></div>
      </div>

      <div className="flex justify-between items-center p-2 border-b-2 border-casper-red bg-gray-50 active:cursor-grabbing">
        <div className="flex items-center gap-2 pointer-events-none">
            <div className="bg-casper-red text-white p-1 border border-casper-red shadow-[1px_1px_0px_0px_#ffffff]">
                {getIcon()}
            </div>
            <h3 className="font-display font-bold uppercase text-xs tracking-tight text-casper-black">{module.title}</h3>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(module.id); }}
          className="p-0.5 hover:bg-casper-red hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>
      <div className="p-3" onMouseDown={(e) => e.stopPropagation()}>
        {renderContent()}
      </div>
    </div>
  );
};