export type ViewId = 'gallery' | 'scanner' | 'devotees' | 'boutique' | 'v1' | 'ending';

export type OrganKey = 'eye' | 'heart' | 'skin' | 'voice';

export interface TerminalEntry {
  kind: 'system' | 'input' | 'output' | 'error' | 'alert';
  text: string;
}

export interface SideQuestState {
  verify: boolean;
  v1: boolean;
  sleepFormula: boolean;
  donorRoom: boolean;
  handFile: boolean;
  eyeFile: boolean;
  eye094Confirmed: boolean;
  handBuyerConfirmed: boolean;
  donorB2Confirmed: boolean;
}

export interface GameState {
  triggeredHotspots: Record<string, boolean>;
  mirroredPhotoIds: string[];
  zoomedProducts: string[];
  terminalUnlocked: boolean;
  sideQuests: SideQuestState;
  v1Unlocked: boolean;
  invalidTerminalInputs: number;
  weights: Record<OrganKey, number>;
  endingStarted: boolean;
  endingType: OrganKey | null;
  terminalHistory: TerminalEntry[];
}

export interface GalleryHotspot {
  id: string;
  label: string;
  code: string;
  organ: OrganKey;
  weight: number;
  style: Record<string, string>;
  mirrorOnly?: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  image: string;
  shape: 'portrait' | 'tall' | 'square' | 'wide';
  hotspots: GalleryHotspot[];
}

export interface ProductItem {
  id: string;
  name: string;
  price: string;
  sold: string;
  description: string;
  image: string;
  clue: string;
  microLabel: string;
  lockedNote?: string;
}

export interface Devotee {
  rank: number;
  id: string;
  score: string;
  status: '活跃' | '离线' | '已收割' | '已沉睡';
  signature: string;
}

export interface EndingContent {
  title: string;
  label: string;
  body: string;
}

export interface ContextMenuState {
  open: boolean;
  x: number;
  y: number;
  photoId: string;
  targetLabel: string;
}
