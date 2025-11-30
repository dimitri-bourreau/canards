// Game state types for Sanctuary Lake

export interface AnimalStats {
  health: number; // 0-100
  happiness: number; // 0-100
  population: number;
}

export interface DuckStats extends AnimalStats {
  nestingAreas: number;
}

export interface FishStats extends AnimalStats {
  diversity: number; // number of species
}

export interface DragonflyStats extends AnimalStats {
  waterPurity: number; // 0-100, indicator of water quality
}

export interface PlantStats {
  health: number;
  oxygenProduction: number; // units per tick
  coverage: number; // percentage of lake covered
}

export interface Resources {
  budget: number;
  energy: number;
  maxEnergy: number;
}

export interface Pollution {
  plastic: number; // 0-100
  waste: number; // 0-100
  overall: number; // calculated average
}

export interface Research {
  medicine: boolean;
  advancedFiltration: boolean;
  habitatRestoration: boolean;
  feedingAutomation: boolean;
}

export interface HistoryPoint {
  tick: number;
  welfare: number;
  biodiversity: number;
  pollution: number;
}

export interface GameState {
  // Time
  tick: number;
  day: number;
  
  // Animals
  ducks: DuckStats;
  fish: FishStats;
  dragonflies: DragonflyStats;
  plants: PlantStats;
  
  // Resources
  resources: Resources;
  
  // Environment
  pollution: Pollution;
  
  // Research/Upgrades
  research: Research;
  
  // Filtration system level (reduces pollution over time)
  filtrationLevel: number;
  
  // History for charts (last 20 data points)
  history: HistoryPoint[];
  
  // Visual effects
  activeEffects: string[];
  
  // Notifications
  notifications: Notification[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  timestamp: number;
}

export interface GameAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  energyCost: number;
  budgetCost: number;
  cooldown: number; // ticks
  lastUsed: number;
  requiresResearch?: keyof Research;
  effect: () => void;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
}

// Calculated metrics
export interface Metrics {
  averageWelfare: number;
  biodiversityScore: number;
  pollutionLevel: number;
  ecosystemHealth: number;
}

// Action costs
export const ACTION_COSTS = {
  feedDucks: { energy: 10, budget: 5 },
  cleanLake: { energy: 25, budget: 10 },
  buildNestingArea: { energy: 40, budget: 50 },
  researchMedicine: { energy: 30, budget: 100 },
  heal: { energy: 20, budget: 15 },
  upgradeFiltration: { energy: 50, budget: 75 },
  plantVegetation: { energy: 15, budget: 20 },
  stockFish: { energy: 20, budget: 30 },
} as const;

// Initial game state
export const INITIAL_STATE: GameState = {
  tick: 0,
  day: 1,
  
  ducks: {
    health: 70,
    happiness: 60,
    population: 5,
    nestingAreas: 1,
  },
  
  fish: {
    health: 65,
    happiness: 55,
    population: 20,
    diversity: 3,
  },
  
  dragonflies: {
    health: 60,
    happiness: 50,
    population: 15,
    waterPurity: 60,
  },
  
  plants: {
    health: 70,
    oxygenProduction: 50,
    coverage: 30,
  },
  
  resources: {
    budget: 200,
    energy: 100,
    maxEnergy: 100,
  },
  
  pollution: {
    plastic: 40,
    waste: 35,
    overall: 37.5,
  },
  
  research: {
    medicine: false,
    advancedFiltration: false,
    habitatRestoration: false,
    feedingAutomation: false,
  },
  
  filtrationLevel: 1,
  
  history: [],
  
  activeEffects: [],
  
  notifications: [],
};

