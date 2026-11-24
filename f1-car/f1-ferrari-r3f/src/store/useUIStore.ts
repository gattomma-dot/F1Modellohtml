import { create } from 'zustand'

// Tipo per lo stato UI condiviso
type UIState = {
  autoRotate: boolean
  wireframe: boolean
  quality: 'ultra' | 'high' | 'medium' | 'low'
  showSpecs: boolean
}

// Azioni per modificare lo stato
type UIActions = {
  setAutoRotate: (value: boolean) => void
  setWireframe: (value: boolean) => void
  setQuality: (value: 'ultra' | 'high' | 'medium' | 'low') => void
  setShowSpecs: (value: boolean) => void
  reset: () => void
}

// Crea lo store Zustand
export const useUIStore = create<UIState & UIActions>((set) => ({
  // Stato iniziale
  autoRotate: true,
  wireframe: false,
  quality: 'high',
  showSpecs: false,

  // Azioni
  setAutoRotate: (value: boolean) => set({ autoRotate: value }),
  setWireframe: (value: boolean) => set({ wireframe: value }),
  setQuality: (value: 'ultra' | 'high' | 'medium' | 'low') => set({ quality: value }),
  setShowSpecs: (value: boolean) => set({ showSpecs: value }),
  reset: () => set({
    autoRotate: true,
    wireframe: false,
    quality: 'high',
    showSpecs: false,
  }),
}))