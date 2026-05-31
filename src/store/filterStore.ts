import { create } from 'zustand'

interface FilterState {
  category: string
  subcategory: string
  minPrice: number
  maxPrice: number
  sizes: string[]
  colors: string[]
  fabric: string[]
  occasion: string[]
  rating: number
  offers: string[]
  sortBy: string
  page: number
  
  setFilter: (key: keyof FilterState, value: any) => void
  clearAll: () => void
}

const initialState = {
  category: '',
  subcategory: '',
  minPrice: 0,
  maxPrice: 50000,
  sizes: [],
  colors: [],
  fabric: [],
  occasion: [],
  rating: 0,
  offers: [],
  sortBy: 'newest',
  page: 1
}

export const useFilterStore = create<FilterState>()((set) => ({
  ...initialState,
  setFilter: (key, value) => set({ [key]: value }),
  clearAll: () => set(initialState)
}))
