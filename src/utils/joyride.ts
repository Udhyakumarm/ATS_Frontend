import {create} from 'zustand';
import { devtools, persist } from "zustand/middleware";

interface JoyrideState {
  shouldShowJoyride: boolean;
  isJoyrideCompleted: boolean;
  showJoyride: () => void;
  completeJoyride: () => void;
  resetTour: () => void;
}

const useJoyrideStore = create<JoyrideState>()(
  persist(
    (set) => ({
      shouldShowJoyride: false,
      isJoyrideCompleted: false,
      showJoyride: () => set({ shouldShowJoyride: true }),
      completeJoyride: () => set({ isJoyrideCompleted: true, shouldShowJoyride: false }),
      resetTour: () => set({ isJoyrideCompleted: false, shouldShowJoyride: false }),
    }),
    {
      name: 'joyride-storage',
    }
  )
);

export default useJoyrideStore;