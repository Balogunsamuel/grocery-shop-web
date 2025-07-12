// In-memory database simulation (replace with real database in production)
import type { Product, Category, User, Order, Review, PromoCode, Analytics } from "./types"

// Mock data storage
const products: Product[] = [
  {
    id: 1,
    name: "Fresh Organic Bananas",
    price: 2.99,
    originalPrice: 3.49,
    image: "/placeholder.svg?height=200&width=200",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    rating: 4.5,
    reviewCount: 128,
    category: "Fruits",
    categoryId: 1,
    brand: "Organic Farm",
    inStock: true,
    stockCount: 50,
    description: "Fresh, organic bananas perfect for snacking or baking. Rich in potassium and natural sugars.",
    features: ["Organic", "Non-GMO", "Rich in Potassium", "Natural Energy"],
    nutritionFacts: {
      calories: 105,
      carbs: "27g",
      fiber: "3g",
      sugar: "14g",
      protein: "1g",
      fat: "0.3g",
    },
    tags: ["organic", "healthy", "fruit"],
    weight: "1 lb",
    origin: "Ecuador",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    sku: "BAN001",
  },
  {
    id: 2,
    name: "Whole Grain Bread",
    price: 4.99,
    originalPrice: 5.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.2,
    reviewCount: 89,
    category: "Bakery",
    categoryId: 2,
    brand: "Artisan Bakery",
    inStock: true,
    stockCount: 25,
    description: "Freshly baked whole grain bread with seeds and nuts. Perfect for sandwiches or toast.",
    features: ["Whole Grain", "High Fiber", "No Preservatives", "Freshly Baked"],
    tags: ["bread", "whole grain", "healthy"],
    weight: "24 oz",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    sku: "BRD001",
  },
]

const categories: Category[] = [
  {
    id: 1,
    name: "Fruits",
    icon: "🍎",
    color: "bg-red-100",
    description: "Fresh and organic fruits",
    productCount: 25,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Bakery",
    icon: "🍞",
    color: "bg-yellow-100",
    description: "Fresh baked goods",
    productCount: 15,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const users: User[] = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@grocery.com",
    phone: "+1234567890",
    role: "admin",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const orders: Order[] = []
const reviews: Review[] = []
const promoCodes: PromoCode[] = []

// Database operations
export const db = {
  // Products
  products: {
    findAll: (filters?: any) => {
      let filtered = products.filter((p) => p.isActive)

      if (filters?.category) {
        filtered = filtered.filter((p) => p.categoryId === filters.category)
      }

      if (filters?.search) {
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            p.description.toLowerCase().includes(filters.search.toLowerCase()),
        )
      }

      if (filters?.priceRange) {
        filtered = filtered.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
      }

      return filtered
    },
    findById: (id: number) => products.find((p) => p.id === id && p.isActive),
    create: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
      const newProduct: Product = {
        ...product,
        id: Math.max(...products.map((p) => p.id), 0) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      products.push(newProduct)
      return newProduct
    },
    update: (id: number, updates: Partial<Product>) => {
      const index = products.findIndex((p) => p.id === id)
      if (index !== -1) {
        products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() }
        return products[index]
      }
      return null
    },
    delete: (id: number) => {
      const index = products.findIndex((p) => p.id === id)
      if (index !== -1) {
        products[index].isActive = false
        return true
      }
      return false
    },
  },

  // Categories
  categories: {
    findAll: () => categories.filter((c) => c.isActive),
    findById: (id: number) => categories.find((c) => c.id === id && c.isActive),
    create: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
      const newCategory: Category = {
        ...category,
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      categories.push(newCategory)
      return newCategory
    },
    update: (id: number, updates: Partial<Category>) => {
      const index = categories.findIndex((c) => c.id === id)
      if (index !== -1) {
        categories[index] = { ...categories[index], ...updates, updatedAt: new Date().toISOString() }
        return categories[index]
      }
      return null
    },
    delete: (id: number) => {
      const index = categories.findIndex((c) => c.id === id)
      if (index !== -1) {
        categories[index].isActive = false
        return true
      }
      return false
    },
  },

  // Users
  users: {
    findAll: () => users.filter((u) => u.isActive),
    findById: (id: string) => users.find((u) => u.id === id && u.isActive),
    findByEmail: (email: string) => users.find((u) => u.email === email && u.isActive),
    create: (user: Omit<User, "id" | "createdAt" | "updatedAt">) => {
      const newUser: User = {
        ...user,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      users.push(newUser)
      return newUser
    },
    update: (id: string, updates: Partial<User>) => {
      const index = users.findIndex((u) => u.id === id)
      if (index !== -1) {
        users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() }
        return users[index]
      }
      return null
    },
  },

  // Orders
  orders: {
    findAll: () => orders,
    findById: (id: string) => orders.find((o) => o.id === id),
    findByUserId: (userId: string) => orders.filter((o) => o.userId === userId),
    create: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
      const newOrder: Order = {
        ...order,
        id: `order-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      orders.push(newOrder)
      return newOrder
    },
    update: (id: string, updates: Partial<Order>) => {
      const index = orders.findIndex((o) => o.id === id)
      if (index !== -1) {
        orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() }
        return orders[index]
      }
      return null
    },
  },

  // Analytics
  analytics: {
    getDashboard: (): Analytics => {
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
      const totalOrders = orders.length
      const totalCustomers = users.filter((u) => u.role === "customer").length
      const totalProducts = products.filter((p) => p.isActive).length

      return {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueGrowth: 12.5,
        orderGrowth: 8.3,
        customerGrowth: 15.2,
        topProducts: products.slice(0, 5).map((p) => ({
          id: p.id,
          name: p.name,
          sales: Math.floor(Math.random() * 100),
          revenue: p.price * Math.floor(Math.random() * 100),
        })),
        topCategories: categories.slice(0, 5).map((c) => ({
          id: c.id,
          name: c.name,
          sales: Math.floor(Math.random() * 200),
          revenue: Math.floor(Math.random() * 5000),
        })),
        recentOrders: orders.slice(-10),
        monthlyRevenue: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i).toLocaleString("default", { month: "short" }),
          revenue: Math.floor(Math.random() * 10000) + 5000,
          orders: Math.floor(Math.random() * 100) + 50,
        })),
      }
    },
  },
}
