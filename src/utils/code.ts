//@ts-nocheck

import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

let settingsStore = (set) => ({
  dark: false,
  toggleDarkMode: () => set((state) => ({ dark: !state.dark })),
})

let carrierStore = (set) => ({
  // auth: false, // Candiate Auth
  cname: "",//Company Name
  cid: "", // Carrier Page ID / Org Profile ID
  orgdetail: [], //Carrier Page Org Detail
  jid: "", //Job ID
  jdata: {}, //Particular Job Data

  // setauth: (id) => set((state) => ({ auth: id })),
  setcname: (id) => set((state) => ({ cname: id })),
  setcid: (id) => set((state) => ({ cid: id })),
  setorgdetail: (id) => set((state) => ({ orgdetail: id })),
  setjid: (id) => set((state) => ({ jid: id })),
  setjdata: (id) => set((state) => ({ jdata: id })),
})

let applicantStore = (set) => ({
  applicantlist: [], //applicant list
  applicantdetail: {}, //applicant list
  jobid: "",
  canid: "",
  setapplicantlist: (id) => set((state) => ({ applicantlist: id })),
  setapplicantdetail: (id) => set((state) => ({ applicantdetail: id })),
  setjobid: (id) => set((state) => ({ jobid: id })),
  setcanid: (id) => set((state) => ({ canid: id })),
})


settingsStore = devtools(settingsStore)
settingsStore = persist(settingsStore, { name: 'user_settings' })

carrierStore = devtools(carrierStore)
carrierStore = persist(carrierStore, { name: 'carrier_settings' })

applicantStore = devtools(applicantStore)
applicantStore = persist(applicantStore, { name: 'applicantStore' })


export const useSettingsStore = create(settingsStore)
export const useCarrierStore = create(carrierStore)
export const useApplicantStore = create(applicantStore)
