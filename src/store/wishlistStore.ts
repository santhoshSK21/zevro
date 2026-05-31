import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  productIds: string[]
  addToWishlist: (id: string) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      addToWishlist: (id) => set((state) => ({ 
        productIds: state.productIds.includes(id) ? state.productIds : [...state.productIds, id] 
      })),
      removeFromWishlist: (id) => set((state) => ({ 
        productIds: state.productIds.filter(pid => pid !== id) 
      })),
      isInWishlist: (id) => get().productIds.includes(id)
    }),
    { name: 'zevro-wishlist' }
  )
)
