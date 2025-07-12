export interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  images?: string[]
  rating: number
  reviewCount: number
  category: string
  categoryId: number
  brand: string
  inStock: boolean
  stockCount: number
  description: string
  features: string[]
  nutritionFacts?: {
    calories: number
    carbs: string
    fiber: string
    sugar: string
    protein: string
    fat: string
  }
  tags?: string[]
  weight?: string
  origin?: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  sku: string
}

export interface Category {
  id: number
  name: string
  icon: string
  color: string
  description?: string
  productCount?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  inStock: boolean
  maxQuantity?: number
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  role: "admin" | "customer"
  isActive: boolean
  createdAt: string
  updatedAt: string
  preferences?: {
    notifications: boolean
    marketing: boolean
    darkMode: boolean
  }
}

export interface Address {
  id: number
  userId: string
  type: string
  street: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
  instructions?: string
}

export interface Order {
  id: string
  userId: string
  date: string
  status: "pending" | "confirmed" | "preparing" | "out-for-delivery" | "delivered" | "cancelled"
  total: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  items: CartItem[]
  deliveryAddress: Address
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  deliveryMethod: string
  estimatedDelivery?: string
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: number
  productId: number
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
  verified: boolean
  helpful?: number
  isActive: boolean
}

export interface PromoCode {
  id: number
  code: string
  discount: number
  type: "percentage" | "fixed"
  minOrder?: number
  maxDiscount?: number
  expiryDate?: string
  usageLimit?: number
  usedCount?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Analytics {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueGrowth: number
  orderGrowth: number
  customerGrowth: number
  topProducts: Array<{ id: number; name: string; sales: number; revenue: number }>
  topCategories: Array<{ id: number; name: string; sales: number; revenue: number }>
  recentOrders: Order[]
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
