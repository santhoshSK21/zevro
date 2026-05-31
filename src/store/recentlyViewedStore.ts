import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RecentlyViewedStore {
  productIds: string[]
  addViewed: (id: string) => void
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      productIds: [],
      addViewed: (id) => set((state) => {
        const filtered = state.productIds.filter(pid => pid !== id);
        return { productIds: [id, ...filtered].slice(0, 10) };
      }),
    }),
    { name: 'zevro-recently-viewed' }
  )
)
