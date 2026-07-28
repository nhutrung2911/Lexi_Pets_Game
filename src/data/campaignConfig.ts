export type NodeType = 'normal' | 'elite' | 'boss' | 'chest' | 'merchant' | 'camp' | 'shrine' | 'event';

export interface LevelNode {
  id: number;
  type: NodeType;
  worldId: string;
}

export interface WorldInfo {
  id: string;
  name: string;
  bgClass: string;
}

export const WORLDS: Record<string, WorldInfo> = {
  world1: {
    id: 'world1',
    name: 'Green Meadow',
    bgClass: 'from-green-400 to-emerald-600',
  },
  world2: {
    id: 'world2',
    name: 'Mystic Forest',
    bgClass: 'from-teal-700 to-indigo-900',
  },
  world3: {
    id: 'world3',
    name: 'Frozen Valley',
    bgClass: 'from-cyan-300 to-blue-500',
  }
};

export function generateCampaignNodes(totalStages: number = 50): LevelNode[] {
  const nodes: LevelNode[] = [];
  
  for (let i = 1; i <= totalStages; i++) {
    let type: NodeType = 'normal';
    
    // Pattern generation
    if (i % 10 === 0) {
      type = 'boss';
    } else if (i % 5 === 0) {
      type = 'chest';
    } else if (i % 7 === 0) {
      type = 'elite';
    }

    let worldId = 'world1';
    if (i > 20) worldId = 'world2';
    if (i > 40) worldId = 'world3';

    nodes.push({
      id: i,
      type,
      worldId
    });
  }
  
  return nodes;
}
