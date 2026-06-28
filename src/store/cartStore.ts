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
  total: number; itemCount: number; savings: number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [], isDrawerOpen: false, couponCode: null, couponDiscount: 0,
      addItem: (item) => set((s) => {
        const ex = s.items.find(i => i.sku === item.sku)
        if (ex) return { items: s.items.map(i => i.sku === item.sku ? {...i, quantity: i.quantity + item.quantity} : i) }
        return { items: [...s.items, item], isDrawerOpen: true }
      }),
      removeItem: (sku) => set(s => ({ items: s.items.filter(i => i.sku !== sku) })),
      updateQuantity: (sku, qty) => set(s => ({
        items: qty <= 0 ? s.items.filter(i => i.sku !== sku) : s.items.map(i => i.sku === sku ? {...i, quantity: qty} : i)
      })),
      setCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      get total()     { return get().items.reduce((s, i) => s + i.price * i.quantity, 0) },
      get itemCount() { return get().items.reduce((s, i) => s + i.quantity, 0) },
      get savings()   { return get().items.reduce((s, i) => s + (i.originalPrice - i.price) * i.quantity, 0) + get().couponDiscount }
    }),
    { name: 'zevro-cart' }
  )
)
