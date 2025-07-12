"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, User, Address, Product } from "./types"

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

interface UserStore {
  user: User | null
  addresses: Address[]
  wishlist: number[]
  setUser: (user: User) => void
  addAddress: (address: Omit<Address, "id">) => void
  updateAddress: (id: number, address: Partial<Address>) => void
  removeAddress: (id: number) => void
  toggleWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
}

interface AppStore {
  searchQuery: string
  selectedCategory: number | null
  priceRange: [number, number]
  selectedBrands: string[]
  sortBy: string
  viewMode: "grid" | "list"
  setSearchQuery: (query: string) => void
  setSelectedCategory: (categoryId: number | null) => void
  setPriceRange: (range: [number, number]) => void
  setSelectedBrands: (brands: string[]) => void
  setSortBy: (sortBy: string) => void
  setViewMode: (mode: "grid" | "list") => void
  clearFilters: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const items = get().items
        const existingItem = items.find((item) => item.id === product.id)

        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + quantity, product.stockCount)
          set({
            items: items.map((item) => (item.id === product.id ? { ...item, quantity: newQuantity } : item)),
          })
        } else {
          const newItem: CartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: Math.min(quantity, product.stockCount),
            image: product.image,
            inStock: product.inStock,
            maxQuantity: product.stockCount,
          }
          set({ items: [...items, newItem] })
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) })
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity: Math.min(quantity, item.maxQuantity || 999) } : item,
          ),
        })
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
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
      addresses: [],
      wishlist: [],
      setUser: (user) => set({ user }),
      addAddress: (address) => {
        const addresses = get().addresses
        const newAddress = { ...address, id: Date.now() }
        set({ addresses: [...addresses, newAddress] })
      },
      updateAddress: (id, updatedAddress) => {
        set({
          addresses: get().addresses.map((addr) => (addr.id === id ? { ...addr, ...updatedAddress } : addr)),
        })
      },
      removeAddress: (id) => {
        set({ addresses: get().addresses.filter((addr) => addr.id !== id) })
      },
      toggleWishlist: (productId) => {
        const wishlist = get().wishlist
        if (wishlist.includes(productId)) {
          set({ wishlist: wishlist.filter((id) => id !== productId) })
        } else {
          set({ wishlist: [...wishlist, productId] })
        }
      },
      isInWishlist: (productId) => get().wishlist.includes(productId),
    }),
    {
      name: "user-storage",
    },
  ),
)

export const useAppStore = create<AppStore>((set) => ({
  searchQuery: "",
  selectedCategory: null,
  priceRange: [0, 100],
  selectedBrands: [],
  sortBy: "featured",
  viewMode: "grid",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
  setPriceRange: (range) => set({ priceRange: range }),
  setSelectedBrands: (brands) => set({ selectedBrands: brands }),
  setSortBy: (sortBy) => set({ sortBy }),
  setViewMode: (mode) => set({ viewMode: mode }),
  clearFilters: () =>
    set({
      searchQuery: "",
      selectedCategory: null,
      priceRange: [0, 100],
      selectedBrands: [],
      sortBy: "featured",
    }),
}))
