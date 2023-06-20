import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

//#######

let novusStore: any = (set: any) => ({
	animation: false,
	setanimation: (id: any) => set(() => ({ animation: id }))
});

//#######

novusStore = devtools(novusStore);
novusStore = persist(novusStore, { name: "novusStore" });
export const useNovusStore = create(novusStore);
