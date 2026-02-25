import React from 'react';

export enum ModuleType {
  NFT = 'NFT',
  SWAP = 'SWAP',
  INTENT = 'INTENT',
  BRIDGE = 'BRIDGE',
}

export interface CanvasModule {
  id: string;
  type: ModuleType;
  title: string;
  x: number;
  y: number;
  data?: Record<string, any>;
}

export interface Connection {
  id: string;
  fromModuleId: string;
  toModuleId: string;
}

export interface DraggableItemProps {
  type: ModuleType;
  label: string;
  icon: React.ReactNode;
  description: string;
}


