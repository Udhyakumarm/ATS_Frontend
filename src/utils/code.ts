//@ts-nocheck

import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

let settingsStore = (set) => ({
  dark: false,
  toggleDarkMode: () => set((state) => ({ dark: !state.dark })),
})

let carrierStore = (set) => ({
  // auth: false, // Candiate Auth
  cid: "", // Carrier Page ID / Org Profile ID
  orgdetail: [], //Carrier Page Org Detail
  jid: "", //Job ID
  jdata: {}, //Particular Job Data

  // setauth: (id) => set((state) => ({ auth: id })),
  setcid: (id) => set((state) => ({ cid: id })),
  setorgdetail: (id) => set((state) => ({ orgdetail: id })),
  setjid: (id) => set((state) => ({ jid: id })),
  setjdata: (id) => set((state) => ({ jdata: id })),
})


settingsStore = devtools(settingsStore)
settingsStore = persist(settingsStore, { name: 'user_settings' })

carrierStore = devtools(carrierStore)
carrierStore = persist(carrierStore, { name: 'carrier_settings' })


export const useSettingsStore = create(settingsStore)
export const useCarrierStore = create(carrierStore)
