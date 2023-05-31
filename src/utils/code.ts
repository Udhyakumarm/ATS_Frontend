import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

let userStore: any = (set: any) => ({
	type: "",
	role: "",
	user: [],
	settype: (id: any) => set(() => ({ type: id })),
	setrole: (id: any) => set(() => ({ role: id })),
	setuser: (id: any) => set(() => ({ user: id }))
});

let dashboardStore: any = (set: any) => ({
	check1: true,
	check2: true,
	check3: true,
	check4: true,
	check5: true,
	check6: true,
	setcheck1: (id: any) => set(() => ({ check1: id })),
	setcheck2: (id: any) => set(() => ({ check2: id })),
	setcheck3: (id: any) => set(() => ({ check3: id })),
	setcheck4: (id: any) => set(() => ({ check4: id })),
	setcheck5: (id: any) => set(() => ({ check5: id })),
	setcheck6: (id: any) => set(() => ({ check6: id }))
});

let settingsStore: any = (set: any) => ({
	dark: false,
	toggleDarkMode: () => set((state: any) => ({ dark: !state.dark }))
});

let notificationStore: any = (set: any) => ({
	load: false,
	toggleLoadMode: (id: any) => set(() => ({ load: id }))
});

let versionStore: any = (set: any) => ({
	version: "basic",
	setversion: (id: any) => set(() => ({ version: id }))
});

let carrierStore: any = (set: any) => ({
	// auth: false, // Candiate Auth
	cname: "", //Company Name
	cid: "", // Carrier Page ID / Org Profile ID
	vid: "", // Carrier Page ID / Org Profile ID
	orgdetail: [], //Carrier Page Org Detail
	jid: "", //Job ID
	jdata: {}, //Particular Job Data

	// setauth: (id) => set((state) => ({ auth: id })),
	setcname: (id: any) => set(() => ({ cname: id })),
	setcid: (id: any) => set(() => ({ cid: id })),
	setvid: (id: any) => set(() => ({ vid: id })),
	setorgdetail: (id: any) => set(() => ({ orgdetail: id })),
	setjid: (id: any) => set(() => ({ jid: id })),
	setjdata: (id: any) => set(() => ({ jdata: id }))
});

let applicantStore: any = (set: any) => ({
	applicantlist: [], //applicant list
	applicantdetail: {}, //applicant list
	jobid: "",
	canid: "",
	setapplicantlist: (id: any) => set(() => ({ applicantlist: id })),
	setapplicantdetail: (id: any) => set(() => ({ applicantdetail: id })),
	setjobid: (id: any) => set(() => ({ jobid: id })),
	setcanid: (id: any) => set(() => ({ canid: id }))
});

userStore = devtools(userStore);
userStore = persist(userStore, { name: "userStore" });

dashboardStore = devtools(dashboardStore);
dashboardStore = persist(dashboardStore, { name: "dashboardStore" });

settingsStore = devtools(settingsStore);
settingsStore = persist(settingsStore, { name: "user_settings" });

notificationStore = devtools(notificationStore);
notificationStore = persist(notificationStore, { name: "notificationStore" });

versionStore = devtools(versionStore);
versionStore = persist(versionStore, { name: "versionStore" });

carrierStore = devtools(carrierStore);
carrierStore = persist(carrierStore, { name: "carrier_settings" });

applicantStore = devtools(applicantStore);
applicantStore = persist(applicantStore, { name: "applicantStore" });

export const useUserStore = create(userStore);
export const useDashboardStore = create(dashboardStore);
export const useNotificationStore = create(notificationStore);
export const useVersionStore = create(versionStore);
export const useSettingsStore = create(settingsStore);
export const useCarrierStore = create(carrierStore);
export const useApplicantStore = create(applicantStore);
