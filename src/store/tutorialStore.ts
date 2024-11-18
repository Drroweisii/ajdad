import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  completed: boolean;
}

interface TutorialState {
  steps: TutorialStep[];
  currentStepIndex: number;
  isActive: boolean;
  startTutorial: () => void;
  completeTutorialStep: () => void;
  skipTutorial: () => void;
  resetTutorial: () => void;
}

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set, get) => ({
      steps: [
        {
          id: 'welcome',
          title: 'Welcome to EMSX Miner!',
          content: 'Let\'s learn how to become a master miner.',
          target: '.game-container',
          position: 'top',
          completed: false,
        },
        {
          id: 'purchase-miner',
          title: 'Purchase Your First Miner',
          content: 'Click here to purchase your first miner and start earning coins.',
          target: '.purchase-button',
          position: 'bottom',
          completed: false,
        },
        {
          id: 'upgrade-miner',
          title: 'Upgrade Your Miner',
          content: 'Upgrade your miner to increase its mining power and efficiency.',
          target: '.upgrade-button',
          position: 'left',
          completed: false,
        },
        {
          id: 'check-achievements',
          title: 'Track Your Progress',
          content: 'Visit your profile to check achievements and stats.',
          target: '.profile-nav',
          position: 'top',
          completed: false,
        },
      ],
      currentStepIndex: 0,
      isActive: false,

      startTutorial: () => {
        set({ isActive: true, currentStepIndex: 0 });
      },

      completeTutorialStep: () => {
        const { currentStepIndex, steps } = get();
        if (currentStepIndex >= steps.length) return;

        const newSteps = [...steps];
        newSteps[currentStepIndex].completed = true;

        set({
          steps: newSteps,
          currentStepIndex: currentStepIndex + 1,
          isActive: currentStepIndex + 1 < steps.length,
        });
      },

      skipTutorial: () => {
        set({ isActive: false });
      },

      resetTutorial: () => {
        set({
          steps: get().steps.map(step => ({ ...step, completed: false })),
          currentStepIndex: 0,
          isActive: false,
        });
      },
    }),
    {
      name: 'emsx-miner-tutorial',
      version: 1,
    }
  )
);