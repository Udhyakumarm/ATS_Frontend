import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

//#######

let novusStore: any = (set: any) => ({
	animation: false,
	setanimation: (id: any) => set(() => ({ animation: id })),
	listOfApplicant: [],
	setlistOfApplicant: (id: any) => set(() => ({ listOfApplicant: id })),
	kanbanAID: "",
	setkanbanAID: (id: any) => set(() => ({ kanbanAID: id }))
});

let newNovusStore: any = (set: any) => ({
	visible: false,
	tvisible: () => set((state: any) => ({ visible: !state.visible })),
	nloader: true,
	tnloader: () => set((state: any) => ({ nloader: !state.nloader })),
	tab: 0,
	settab: (id: any) => set(() => ({ tab: id })),
	chat: [],
	setchat: (id: any) => set(() => ({ chat: id })),
	achat: [],
	setachat: (id: any) => set(() => ({ achat: id }))
});

//#######

novusStore = devtools(novusStore);
novusStore = persist(novusStore, { name: "novusStore" });
export const useNovusStore = create(novusStore);

newNovusStore = devtools(newNovusStore);
// newNovusStore = persist(newNovusStore, { name: "newNovusStore" });
export const useNewNovusStore = create(newNovusStore);
