import type { Product, Category, User, Order, Review, PromoCode } from "./types"

// In-memory database simulation
class Database {
  private products: Product[] = [
    {
      id: 1,
      name: "Fresh Organic Apples",
      price: 4.99,
      originalPrice: 6.99,
      image: "/placeholder.svg?height=200&width=200",
      images: ["/placeholder.svg?height=400&width=400"],
      rating: 4.5,
      reviewCount: 128,
      category: "Fruits",
      categoryId: 1,
      brand: "Organic Farm",
      inStock: true,
      stockCount: 50,
      description: "Fresh, crispy organic apples perfect for snacking or baking.",
      features: ["Organic", "Fresh", "Locally Sourced"],
      nutritionFacts: {
        calories: 95,
        carbs: "25g",
        fiber: "4g",
        sugar: "19g",
        protein: "0.5g",
        fat: "0.3g",
      },
      tags: ["organic", "fresh", "healthy"],
      weight: "1 lb",
      origin: "Local Farm",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      isActive: true,
      sku: "APPLE-ORG-001",
    },
    {
      id: 2,
      name: "Premium Avocados",
      price: 3.49,
      originalPrice: 4.99,
      image: "/placeholder.svg?height=200&width=200",
      images: ["/placeholder.svg?height=400&width=400"],
      rating: 4.8,
      reviewCount: 89,
      category: "Fruits",
      categoryId: 1,
      brand: "Premium Produce",
      inStock: true,
      stockCount: 25,
      description: "Creamy, ripe avocados perfect for toast, salads, or guacamole.",
      features: ["Premium Quality", "Ready to Eat", "Rich in Healthy Fats"],
      nutritionFacts: {
        calories: 234,
        carbs: "12g",
        fiber: "10g",
        sugar: "1g",
        protein: "3g",
        fat: "21g",
      },
      tags: ["premium", "healthy", "ready-to-eat"],
      weight: "Each",
      origin: "California",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      isActive: true,
      sku: "AVOC-PREM-002",
    },
    {
      id: 3,
      name: "Organic Spinach",
      price: 2.99,
      originalPrice: 3.99,
      image: "/placeholder.svg?height=200&width=200",
      images: ["/placeholder.svg?height=400&width=400"],
      rating: 4.3,
      reviewCount: 67,
      category: "Vegetables",
      categoryId: 2,
      brand: "Green Valley",
      inStock: true,
      stockCount: 30,
      description: "Fresh organic spinach leaves, perfect for salads and cooking.",
      features: ["Organic", "Pre-washed", "Nutrient Rich"],
      nutritionFacts: {
        calories: 23,
        carbs: "4g",
        fiber: "2g",
        sugar: "0g",
        protein: "3g",
        fat: "0g",
      },
      tags: ["organic", "leafy-green", "healthy"],
      weight: "5 oz",
      origin: "Local Farm",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      isActive: true,
      sku: "SPIN-ORG-003",
    },
    {
      id: 4,
      name: "Fresh Bananas",
      price: 1.99,
      originalPrice: 2.49,
      image: "/placeholder.svg?height=200&width=200",
      images: ["/placeholder.svg?height=400&width=400"],
      rating: 4.6,
      reviewCount: 156,
      category: "Fruits",
      categoryId: 1,
      brand: "Tropical Fresh",
      inStock: true,
      stockCount: 100,
      description: "Sweet, ripe bananas perfect for snacking or smoothies.",
      features: ["Natural", "Energy Boost", "Potassium Rich"],
      nutritionFacts: {
        calories: 105,
        carbs: "27g",
        fiber: "3g",
        sugar: "14g",
        protein: "1g",
        fat: "0g",
      },
      tags: ["natural", "energy", "potassium"],
      weight: "1 bunch",
      origin: "Ecuador",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      isActive: true,
      sku: "BANA-TROP-004",
    },
    {
      id: 5,
      name: "Organic Whole Milk",
      price: 4.49,
      originalPrice: 5.99,
      image: "/placeholder.svg?height=200&width=200",
      images: ["/placeholder.svg?height=400&width=400"],
      rating: 4.7,
      reviewCount: 203,
      category: "Dairy",
      categoryId: 3,
      brand: "Farm Fresh",
      inStock: true,
      stockCount: 40,
      description: "Creamy organic whole milk from grass-fed cows.",
      features: ["Organic", "Grass-Fed", "No Hormones"],
      nutritionFacts: {
        calories: 150,
        carbs: "12g",
        fiber: "0g",
        sugar: "12g",
        protein: "8g",
        fat: "8g",
      },
      tags: ["organic", "grass-fed", "hormone-free"],
      weight: "1 gallon",
      origin: "Local Dairy",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      isActive: true,
      sku: "MILK-ORG-005",
    },
    {
      id: 6,
      name: "Artisan Bread",
      price: 3.99,
      originalPrice: 4.99,
      image: "/placeholder.svg?height=200&width=200",
      images: ["/placeholder.svg?height=400&width=400"],
      rating: 4.4,
      reviewCount: 92,
      category: "Bakery",
      categoryId: 4,
      brand: "Local Bakery",
      inStock: true,
      stockCount: 15,
      description: "Freshly baked artisan bread with a crispy crust.",
      features: ["Freshly Baked", "Artisan Quality", "No Preservatives"],
      nutritionFacts: {
        calories: 80,
        carbs: "15g",
        fiber: "1g",
        sugar: "1g",
        protein: "3g",
        fat: "1g",
      },
      tags: ["fresh", "artisan", "no-preservatives"],
      weight: "1 loaf",
      origin: "Local Bakery",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      isActive: true,
      sku: "BREAD-ART-006",
    },
  ]

  private categories: Category[] = [
    {
      id: 1,
      name: "Fruits",
      icon: "🍎",
      color: "bg-red-100",
      description: "Fresh and organic fruits",
      productCount: 3,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      name: "Vegetables",
      icon: "🥬",
      color: "bg-green-100",
      description: "Fresh vegetables and greens",
      productCount: 1,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 3,
      name: "Dairy",
      icon: "🥛",
      color: "bg-blue-100",
      description: "Fresh dairy products",
      productCount: 1,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 4,
      name: "Bakery",
      icon: "🍞",
      color: "bg-yellow-100",
      description: "Fresh baked goods",
      productCount: 1,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ]

  private users: User[] = [
    {
      id: "admin-1",
      name: "Admin User",
      email: "admin@grocery.com",
      phone: "+1234567890",
      role: "admin",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      preferences: {
        notifications: true,
        marketing: false,
        darkMode: false,
      },
    },
  ]

  private orders: Order[] = []
  private reviews: Review[] = []
  private promoCodes: PromoCode[] = []

  // Products
  products = {
    findAll: () => this.products.filter((p) => p.isActive),
    findById: (id: number) => this.products.find((p) => p.id === id && p.isActive),
    findByCategory: (categoryId: number) => this.products.filter((p) => p.categoryId === categoryId && p.isActive),
    create: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
      const newProduct = {
        ...product,
        id: Math.max(...this.products.map((p) => p.id)) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      this.products.push(newProduct)
      return newProduct
    },
    update: (id: number, updates: Partial<Product>) => {
      const index = this.products.findIndex((p) => p.id === id)
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...updates, updatedAt: new Date().toISOString() }
        return this.products[index]
      }
      return null
    },
    delete: (id: number) => {
      const index = this.products.findIndex((p) => p.id === id)
      if (index !== -1) {
        this.products[index].isActive = false
        return true
      }
      return false
    },
  }

  // Categories
  categories = {
    findAll: () => this.categories.filter((c) => c.isActive),
    findById: (id: number) => this.categories.find((c) => c.id === id && c.isActive),
    create: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
      const newCategory = {
        ...category,
        id: Math.max(...this.categories.map((c) => c.id)) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      this.categories.push(newCategory)
      return newCategory
    },
    update: (id: number, updates: Partial<Category>) => {
      const index = this.categories.findIndex((c) => c.id === id)
      if (index !== -1) {
        this.categories[index] = { ...this.categories[index], ...updates, updatedAt: new Date().toISOString() }
        return this.categories[index]
      }
      return null
    },
    delete: (id: number) => {
      const index = this.categories.findIndex((c) => c.id === id)
      if (index !== -1) {
        this.categories[index].isActive = false
        return true
      }
      return false
    },
  }

  // Users
  users = {
    findAll: () => this.users.filter((u) => u.isActive),
    findById: (id: string) => this.users.find((u) => u.id === id && u.isActive),
    findByEmail: (email: string) => this.users.find((u) => u.email === email && u.isActive),
    create: (user: Omit<User, "id" | "createdAt" | "updatedAt">) => {
      const newUser = {
        ...user,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      this.users.push(newUser)
      return newUser
    },
    update: (id: string, updates: Partial<User>) => {
      const index = this.users.findIndex((u) => u.id === id)
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...updates, updatedAt: new Date().toISOString() }
        return this.users[index]
      }
      return null
    },
  }

  // Orders
  orders = {
    findAll: () => this.orders,
    findById: (id: string) => this.orders.find((o) => o.id === id),
    findByUserId: (userId: string) => this.orders.filter((o) => o.userId === userId),
    create: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
      const newOrder = {
        ...order,
        id: `order-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      this.orders.push(newOrder)
      return newOrder
    },
    update: (id: string, updates: Partial<Order>) => {
      const index = this.orders.findIndex((o) => o.id === id)
      if (index !== -1) {
        this.orders[index] = { ...this.orders[index], ...updates, updatedAt: new Date().toISOString() }
        return this.orders[index]
      }
      return null
    },
  }
}

export const db = new Database()
