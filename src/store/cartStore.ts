import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string; variantId: string; sku: string
  name: string; image: string; color: string; size: string; material?: string
  quantity: number; price: number; originalPrice: number
}

interface CartStore {
  items: CartItem[]
  isDrawerOpen: boolean
  couponCode: string | null
  couponDiscount: number // in paise
  addItem: (item: CartItem) => void
  removeItem: (sku: string) => void
  updateQuantity: (sku: string, qty: number) => void
  setCoupon: (code: string | null, discount: number) => void
  clearCart: () => void
  openDrawer: () => void; closeDrawer: () => void
  // Computed selectors (not getters — getters break with persist middleware)
  getTotal: () => number
  getItemCount: () => number
  getSavings: () => number
  /** @deprecated use getTotal() */ total: number
  /** @deprecated use getItemCount() */ itemCount: number
  /** @deprecated use getSavings() */ savings: number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [], isDrawerOpen: false, couponCode: null, couponDiscount: 0,
      // Deprecated legacy getter shims — kept for backwards compat but may be stale from persist
      total: 0, itemCount: 0, savings: 0,
      addItem: (item) => set((s) => {
        const ex = s.items.find(i => i.sku === item.sku)
        const newItems = ex
          ? s.items.map(i => i.sku === item.sku ? {...i, quantity: i.quantity + item.quantity} : i)
          : [...s.items, item]
        const total = newItems.reduce((acc, i) => acc + i.price * i.quantity, 0)
        const itemCount = newItems.reduce((acc, i) => acc + i.quantity, 0)
        const savings = newItems.reduce((acc, i) => acc + (i.originalPrice - i.price) * i.quantity, 0) + s.couponDiscount
        return { items: newItems, isDrawerOpen: !ex, total, itemCount, savings }
      }),
      removeItem: (sku) => set((s) => {
        const newItems = s.items.filter(i => i.sku !== sku)
        return {
          items: newItems,
          total: newItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
          itemCount: newItems.reduce((acc, i) => acc + i.quantity, 0),
          savings: newItems.reduce((acc, i) => acc + (i.originalPrice - i.price) * i.quantity, 0) + s.couponDiscount,
        }
      }),
      updateQuantity: (sku, qty) => set((s) => {
        const newItems = qty <= 0
          ? s.items.filter(i => i.sku !== sku)
          : s.items.map(i => i.sku === sku ? {...i, quantity: qty} : i)
        return {
          items: newItems,
          total: newItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
          itemCount: newItems.reduce((acc, i) => acc + i.quantity, 0),
          savings: newItems.reduce((acc, i) => acc + (i.originalPrice - i.price) * i.quantity, 0) + s.couponDiscount,
        }
      }),
      setCoupon: (code, discount) => set((s) => ({
        couponCode: code,
        couponDiscount: discount,
        savings: s.items.reduce((acc, i) => acc + (i.originalPrice - i.price) * i.quantity, 0) + discount,
      })),
      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0, total: 0, itemCount: 0, savings: 0 }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      // Live computed selectors — always accurate, never stale
      getTotal:     () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      getItemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
      getSavings:   () => get().items.reduce((s, i) => s + (i.originalPrice - i.price) * i.quantity, 0) + get().couponDiscount,
    }),
    { name: 'zevro-cart' }
  )
)
