import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useGameStore } from './gameStore';

export interface GameEvent {
  id: string;
  type: 'powerBoost' | 'coinRush' | 'efficiency';
  title: string;
  description: string;
  duration: number; // in milliseconds
  multiplier: number;
  startTime: number | null;
  isActive: boolean;
}

interface EventsState {
  events: GameEvent[];
  activeEvent: GameEvent | null;
  lastEventTime: number;
  triggerRandomEvent: () => void;
  completeEvent: () => void;
  getEventMultiplier: (type: GameEvent['type']) => number;
}

const EVENT_COOLDOWN = 5 * 60 * 1000; // 5 minutes
const EVENT_DURATION = 30 * 1000; // 30 seconds

const AVAILABLE_EVENTS: Omit<GameEvent, 'id' | 'startTime' | 'isActive'>[] = [
  {
    type: 'powerBoost',
    title: 'Power Surge',
    description: 'Mining power increased by 2x!',
    duration: EVENT_DURATION,
    multiplier: 2,
  },
  {
    type: 'coinRush',
    title: 'Gold Rush',
    description: 'Coin earnings increased by 3x!',
    duration: EVENT_DURATION,
    multiplier: 3,
  },
  {
    type: 'efficiency',
    title: 'Efficiency Boost',
    description: 'Miner efficiency increased by 2.5x!',
    duration: EVENT_DURATION,
    multiplier: 2.5,
  },
];

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      events: [],
      activeEvent: null,
      lastEventTime: 0,

      triggerRandomEvent: () => {
        const now = Date.now();
        const { lastEventTime, activeEvent } = get();

        if (activeEvent || now - lastEventTime < EVENT_COOLDOWN) {
          return;
        }

        const randomEvent = AVAILABLE_EVENTS[Math.floor(Math.random() * AVAILABLE_EVENTS.length)];
        const newEvent: GameEvent = {
          ...randomEvent,
          id: crypto.randomUUID(),
          startTime: now,
          isActive: true,
        };

        set({
          activeEvent: newEvent,
          events: [...get().events, newEvent],
          lastEventTime: now,
        });
      },

      completeEvent: () => {
        const { activeEvent } = get();
        if (!activeEvent) return;

        set((state) => ({
          activeEvent: null,
          events: state.events.map(event =>
            event.id === activeEvent.id ? { ...event, isActive: false } : event
          ),
        }));
      },

      getEventMultiplier: (type) => {
        const { activeEvent } = get();
        if (!activeEvent || activeEvent.type !== type) return 1;
        
        const now = Date.now();
        const elapsed = now - (activeEvent.startTime || 0);
        
        if (elapsed > activeEvent.duration) {
          get().completeEvent();
          return 1;
        }
        
        return activeEvent.multiplier;
      },
    }),
    {
      name: 'emsx-miner-events',
      version: 1,
    }
  )
);