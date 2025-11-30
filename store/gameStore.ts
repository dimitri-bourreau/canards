'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  GameState, 
  INITIAL_STATE, 
  ACTION_COSTS,
  Notification,
  HistoryPoint
} from '@/types/game';

interface GameStore extends GameState {
  // Actions
  feedDucks: () => void;
  cleanLake: () => void;
  buildNestingArea: () => void;
  researchMedicine: () => void;
  heal: () => void;
  upgradeFiltration: () => void;
  plantVegetation: () => void;
  stockFish: () => void;
  
  // Game loop
  gameTick: () => void;
  
  // Utilities
  addNotification: (message: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;
  triggerEffect: (effect: string) => void;
  clearEffect: (effect: string) => void;
  resetGame: () => void;
  
  // Computed values
  getMetrics: () => {
    averageWelfare: number;
    biodiversityScore: number;
    pollutionLevel: number;
    ecosystemHealth: number;
  };
}

const clamp = (value: number, min: number, max: number) => 
  Math.min(Math.max(value, min), max);

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      
      // Feed Ducks Action
      feedDucks: () => {
        const state = get();
        const { energy, budget } = ACTION_COSTS.feedDucks;
        
        if (state.resources.energy < energy || state.resources.budget < budget) {
          get().addNotification('Pas assez de ressources pour nourrir les canards !', 'warning');
          return;
        }
        
        set((s) => ({
          ducks: {
            ...s.ducks,
            happiness: clamp(s.ducks.happiness + 15, 0, 100),
            health: clamp(s.ducks.health + 5, 0, 100),
          },
          resources: {
            ...s.resources,
            energy: s.resources.energy - energy,
            budget: s.resources.budget - budget,
          },
        }));
        
        get().triggerEffect('feeding');
        get().addNotification('Canards nourris ! Ils ont l\'air plus heureux ! 🦆', 'success');
        setTimeout(() => get().clearEffect('feeding'), 2000);
      },
      
      // Clean Lake Action
      cleanLake: () => {
        const state = get();
        const { energy, budget } = ACTION_COSTS.cleanLake;
        
        if (state.resources.energy < energy || state.resources.budget < budget) {
          get().addNotification('Pas assez de ressources pour nettoyer le lac !', 'warning');
          return;
        }
        
        set((s) => ({
          pollution: {
            plastic: clamp(s.pollution.plastic - 15, 0, 100),
            waste: clamp(s.pollution.waste - 10, 0, 100),
            overall: clamp(s.pollution.overall - 12.5, 0, 100),
          },
          dragonflies: {
            ...s.dragonflies,
            waterPurity: clamp(s.dragonflies.waterPurity + 10, 0, 100),
          },
          resources: {
            ...s.resources,
            energy: s.resources.energy - energy,
            budget: s.resources.budget - budget,
          },
        }));
        
        get().triggerEffect('cleaning');
        get().addNotification('Lac nettoyé ! Qualité de l\'eau améliorée ! 🌊', 'success');
        setTimeout(() => get().clearEffect('cleaning'), 3000);
      },
      
      // Build Nesting Area Action
      buildNestingArea: () => {
        const state = get();
        const { energy, budget } = ACTION_COSTS.buildNestingArea;
        
        if (state.resources.energy < energy || state.resources.budget < budget) {
          get().addNotification('Pas assez de ressources pour construire un nichoir !', 'warning');
          return;
        }
        
        set((s) => ({
          ducks: {
            ...s.ducks,
            nestingAreas: s.ducks.nestingAreas + 1,
            population: s.ducks.population + 2,
            happiness: clamp(s.ducks.happiness + 10, 0, 100),
          },
          resources: {
            ...s.resources,
            energy: s.resources.energy - energy,
            budget: s.resources.budget - budget,
          },
        }));
        
        get().triggerEffect('building');
        get().addNotification('Nouveau nichoir construit ! Population de canards en croissance ! 🏠', 'success');
        setTimeout(() => get().clearEffect('building'), 2500);
      },
      
      // Research Medicine Action
      researchMedicine: () => {
        const state = get();
        const { energy, budget } = ACTION_COSTS.researchMedicine;
        
        if (state.research.medicine) {
          get().addNotification('Médecine déjà recherchée !', 'info');
          return;
        }
        
        if (state.resources.energy < energy || state.resources.budget < budget) {
          get().addNotification('Pas assez de ressources pour la recherche !', 'warning');
          return;
        }
        
        set((s) => ({
          research: {
            ...s.research,
            medicine: true,
          },
          resources: {
            ...s.resources,
            energy: s.resources.energy - energy,
            budget: s.resources.budget - budget,
          },
        }));
        
        get().addNotification('Médecine recherchée ! Vous pouvez maintenant soigner les animaux ! 💊', 'success');
      },
      
      // Heal Action (requires medicine research)
      heal: () => {
        const state = get();
        const { energy, budget } = ACTION_COSTS.heal;
        
        if (!state.research.medicine) {
          get().addNotification('Recherchez d\'abord la médecine !', 'warning');
          return;
        }
        
        if (state.resources.energy < energy || state.resources.budget < budget) {
          get().addNotification('Pas assez de ressources pour soigner !', 'warning');
          return;
        }
        
        set((s) => ({
          ducks: { ...s.ducks, health: clamp(s.ducks.health + 20, 0, 100) },
          fish: { ...s.fish, health: clamp(s.fish.health + 20, 0, 100) },
          dragonflies: { ...s.dragonflies, health: clamp(s.dragonflies.health + 20, 0, 100) },
          resources: {
            ...s.resources,
            energy: s.resources.energy - energy,
            budget: s.resources.budget - budget,
          },
        }));
        
        get().triggerEffect('healing');
        get().addNotification('Tous les animaux soignés ! 💚', 'success');
        setTimeout(() => get().clearEffect('healing'), 2000);
      },
      
      // Upgrade Filtration Action
      upgradeFiltration: () => {
        const state = get();
        const { energy, budget } = ACTION_COSTS.upgradeFiltration;
        
        if (state.filtrationLevel >= 5) {
          get().addNotification('Système de filtration au niveau maximum !', 'info');
          return;
        }
        
        if (state.resources.energy < energy || state.resources.budget < budget) {
          get().addNotification('Pas assez de ressources pour améliorer !', 'warning');
          return;
        }
        
        set((s) => ({
          filtrationLevel: s.filtrationLevel + 1,
          resources: {
            ...s.resources,
            energy: s.resources.energy - energy,
            budget: s.resources.budget - budget,
          },
        }));
        
        get().addNotification(`Filtration améliorée au niveau ${state.filtrationLevel + 1} ! 🔧`, 'success');
      },
      
      // Plant Vegetation Action
      plantVegetation: () => {
        const state = get();
        const { energy, budget } = ACTION_COSTS.plantVegetation;
        
        if (state.resources.energy < energy || state.resources.budget < budget) {
          get().addNotification('Pas assez de ressources pour planter !', 'warning');
          return;
        }
        
        set((s) => ({
          plants: {
            ...s.plants,
            coverage: clamp(s.plants.coverage + 10, 0, 100),
            oxygenProduction: clamp(s.plants.oxygenProduction + 8, 0, 100),
          },
          resources: {
            ...s.resources,
            energy: s.resources.energy - energy,
            budget: s.resources.budget - budget,
          },
        }));
        
        get().triggerEffect('planting');
        get().addNotification('Nouvelle végétation plantée ! 🌿', 'success');
        setTimeout(() => get().clearEffect('planting'), 2000);
      },
      
      // Stock Fish Action
      stockFish: () => {
        const state = get();
        const { energy, budget } = ACTION_COSTS.stockFish;
        
        if (state.resources.energy < energy || state.resources.budget < budget) {
          get().addNotification('Pas assez de ressources pour introduire des poissons !', 'warning');
          return;
        }
        
        set((s) => ({
          fish: {
            ...s.fish,
            population: s.fish.population + 5,
            diversity: Math.min(s.fish.diversity + 1, 10),
          },
          resources: {
            ...s.resources,
            energy: s.resources.energy - energy,
            budget: s.resources.budget - budget,
          },
        }));
        
        get().triggerEffect('stocking');
        get().addNotification('Nouvelles espèces de poissons ajoutées ! 🐟', 'success');
        setTimeout(() => get().clearEffect('stocking'), 2000);
      },
      
      // Game Tick - called every interval to progress the game
      gameTick: () => {
        set((s) => {
          // Calculate new tick and day
          const newTick = s.tick + 1;
          const newDay = Math.floor(newTick / 10) + 1;
          
          // Passive resource regeneration
          const newEnergy = clamp(s.resources.energy + 5, 0, s.resources.maxEnergy);
          const newBudget = s.resources.budget + 3; // Donations come in
          
          // Filtration reduces pollution over time
          const filtrationReduction = s.filtrationLevel * 0.5;
          const newPlastic = clamp(s.pollution.plastic - filtrationReduction + Math.random() * 2, 0, 100);
          const newWaste = clamp(s.pollution.waste - filtrationReduction + Math.random() * 1.5, 0, 100);
          const newOverall = (newPlastic + newWaste) / 2;
          
          // Oxygen from plants affects all animals
          const oxygenBonus = s.plants.oxygenProduction / 200;
          
          // Natural changes based on conditions
          const pollutionPenalty = s.pollution.overall / 100;
          
          // Update duck stats
          const duckHealthChange = oxygenBonus - pollutionPenalty * 0.5 + (Math.random() - 0.5) * 2;
          const duckHappinessChange = -0.5 + (s.ducks.nestingAreas * 0.2) + (Math.random() - 0.5);
          
          // Update fish stats
          const fishHealthChange = oxygenBonus - pollutionPenalty * 0.8 + (Math.random() - 0.5) * 2;
          const fishHappinessChange = -0.3 + (Math.random() - 0.5);
          
          // Update dragonfly stats
          const dragonflyHealthChange = -pollutionPenalty * 0.6 + (Math.random() - 0.5) * 2;
          const dragonflyPurityChange = -pollutionPenalty * 0.3 + filtrationReduction * 0.2;
          
          // Update plant stats
          const plantHealthChange = -pollutionPenalty * 0.4 + (Math.random() - 0.5);
          
          // Calculate history point
          const avgWelfare = (
            (s.ducks.health + s.ducks.happiness) / 2 +
            (s.fish.health + s.fish.happiness) / 2 +
            (s.dragonflies.health + s.dragonflies.happiness) / 2
          ) / 3;
          
          const biodiversity = (
            Math.min(s.ducks.population, 20) / 20 * 25 +
            Math.min(s.fish.population, 50) / 50 * 25 +
            Math.min(s.fish.diversity, 10) / 10 * 25 +
            Math.min(s.dragonflies.population, 30) / 30 * 25
          );
          
          const historyPoint: HistoryPoint = {
            tick: newTick,
            welfare: avgWelfare,
            biodiversity: biodiversity,
            pollution: newOverall,
          };
          
          // Keep only last 20 history points
          const newHistory = [...s.history, historyPoint].slice(-20);
          
          return {
            tick: newTick,
            day: newDay,
            resources: {
              ...s.resources,
              energy: newEnergy,
              budget: newBudget,
            },
            pollution: {
              plastic: newPlastic,
              waste: newWaste,
              overall: newOverall,
            },
            ducks: {
              ...s.ducks,
              health: clamp(s.ducks.health + duckHealthChange, 0, 100),
              happiness: clamp(s.ducks.happiness + duckHappinessChange, 0, 100),
            },
            fish: {
              ...s.fish,
              health: clamp(s.fish.health + fishHealthChange, 0, 100),
              happiness: clamp(s.fish.happiness + fishHappinessChange, 0, 100),
            },
            dragonflies: {
              ...s.dragonflies,
              health: clamp(s.dragonflies.health + dragonflyHealthChange, 0, 100),
              waterPurity: clamp(s.dragonflies.waterPurity + dragonflyPurityChange, 0, 100),
            },
            plants: {
              ...s.plants,
              health: clamp(s.plants.health + plantHealthChange, 0, 100),
            },
            history: newHistory,
          };
        });
      },
      
      // Add notification
      addNotification: (message, type) => {
        const notification: Notification = {
          id: generateId(),
          message,
          type,
          timestamp: Date.now(),
        };
        
        set((s) => ({
          notifications: [...s.notifications.slice(-4), notification],
        }));
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
          get().removeNotification(notification.id);
        }, 4000);
      },
      
      // Remove notification
      removeNotification: (id) => {
        set((s) => ({
          notifications: s.notifications.filter((n) => n.id !== id),
        }));
      },
      
      // Trigger visual effect
      triggerEffect: (effect) => {
        set((s) => ({
          activeEffects: [...s.activeEffects, effect],
        }));
      },
      
      // Clear visual effect
      clearEffect: (effect) => {
        set((s) => ({
          activeEffects: s.activeEffects.filter((e) => e !== effect),
        }));
      },
      
      // Reset game
      resetGame: () => {
        set(INITIAL_STATE);
      },
      
      // Get computed metrics
      getMetrics: () => {
        const state = get();
        
        const avgWelfare = (
          (state.ducks.health + state.ducks.happiness) / 2 +
          (state.fish.health + state.fish.happiness) / 2 +
          (state.dragonflies.health + state.dragonflies.happiness) / 2
        ) / 3;
        
        const biodiversity = (
          Math.min(state.ducks.population, 20) / 20 * 25 +
          Math.min(state.fish.population, 50) / 50 * 25 +
          Math.min(state.fish.diversity, 10) / 10 * 25 +
          Math.min(state.dragonflies.population, 30) / 30 * 25
        );
        
        const ecosystemHealth = (
          avgWelfare * 0.4 +
          biodiversity * 0.3 +
          (100 - state.pollution.overall) * 0.3
        );
        
        return {
          averageWelfare: Math.round(avgWelfare),
          biodiversityScore: Math.round(biodiversity),
          pollutionLevel: Math.round(state.pollution.overall),
          ecosystemHealth: Math.round(ecosystemHealth),
        };
      },
    }),
    {
      name: 'canards-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tick: state.tick,
        day: state.day,
        ducks: state.ducks,
        fish: state.fish,
        dragonflies: state.dragonflies,
        plants: state.plants,
        resources: state.resources,
        pollution: state.pollution,
        research: state.research,
        filtrationLevel: state.filtrationLevel,
        history: state.history,
      }),
    }
  )
);
