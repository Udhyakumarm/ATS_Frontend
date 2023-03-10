//@ts-nocheck

import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

let settingsStore = (set) => ({
  dark: false,
  toggleDarkMode: () => set((state) => ({ dark: !state.dark })),
})

let candiateStore = (set) => ({
  auth: 'true',
  toggleAuthMode: (id) => set((state) => ({ auth: id })),
})

// let peopleStore = (set) => ({
//   people: ['John Doe', 'Jane Doe'],
//   addPerson: (person) =>
//     set((state) => ({ people: [...state.people, person] })),
// })

let carrierId = (set) => ({
  cid: "",
  addcid: (id) =>
    set((state) => ({ cid: id })),

  orgdetail: [],orgfounderdetail: [],orggallerydetail: [],orgjobdetail: [],

  setorgdetail: (id) => set((state) => ({ orgdetail: id })),
  setorgfounderdetail: (id) => set((state) => ({ orgfounderdetail: id })),
  setorggallerydetail: (id) => set((state) => ({ orggallerydetail: id })),
  setorgjobdetail: (id) => set((state) => ({ orgjobdetail: id })),
})

let jobId = (set) => ({
  jid: "",
  jdata: {},
  addjid: (id) =>
    set((state) => ({ jid: id })),
  addjdata: (id) =>
    set((state) => ({ jdata: id })),
})

settingsStore = devtools(settingsStore)
settingsStore = persist(settingsStore, { name: 'user_settings' })

candiateStore = devtools(candiateStore)
candiateStore = persist(candiateStore, { name: 'user_settings' })

carrierId = devtools(carrierId)
carrierId = persist(carrierId, { name: 'carrier_Id' })

jobId = devtools(jobId)
jobId = persist(jobId, { name: 'job_Id' })

// peopleStore = devtools(peopleStore)

export const useSettingsStore = create(settingsStore)
export const useCandiateStore = create(candiateStore)
export const useCarrierId = create(carrierId)
export const useJobId = create(jobId)

// export const usePeopleStore = create(peopleStore)