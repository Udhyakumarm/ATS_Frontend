//@ts-nocheck

import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

let settingsStore = (set) => ({
  dark: false,
  toggleDarkMode: () => set((state) => ({ dark: !state.dark })),
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
})

settingsStore = devtools(settingsStore)
settingsStore = persist(settingsStore, { name: 'user_settings' })

carrierId = devtools(carrierId)
carrierId = persist(carrierId, { name: 'carrier_Id' })

// peopleStore = devtools(peopleStore)

export const useSettingsStore = create(settingsStore)
export const useCarrierId = create(carrierId)
// export const usePeopleStore = create(peopleStore)