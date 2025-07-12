import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, User } from "./types"

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

interface UserStore {
  user: User | null
  wishlist: number[]
  setUser: (user: User | null) => void
  logout: () => void
  toggleWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity === 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },
      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      wishlist: [],
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, wishlist: [] }),
      toggleWishlist: (productId) => {
        const current = get().wishlist
        set({
          wishlist: current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
        })
      },
      isInWishlist: (productId) => get().wishlist.includes(productId),
    }),
    {
      name: "user-storage",
    },
  ),
)
