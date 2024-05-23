import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SectionStoreState {
  sectionsOrder: string[];
  setSectionsOrder: (newOrder: string[]) => void;
}
const useSectionStore = create<SectionStoreState>(
  persist((set) => ({
    sectionsOrder: ["check1", "check2", "check3", "check4", "check5", "check6"],
    setSectionsOrder: (newOrder) =>
      set((state) => ({
        sectionsOrder: newOrder,
      })),
  }), {
    name: "section-storage"
  })
);

export default useSectionStore;
