export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  rating: number
  reviewCount: number
  category: string
  categoryId: number
  brand: string
  inStock: boolean
  stockCount: number
  description: string
  features: string[]
  nutritionFacts: {
    calories: number
    carbs: string
    fiber: string
    sugar: string
    protein: string
    fat: string
  }
  tags: string[]
  weight: string
  origin: string
}

export interface Category {
  id: number
  name: string
  icon: string
  color: string
  description: string
  productCount: number
}

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  category: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "customer" | "admin"
  avatar?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  phone?: string
  preferences?: {
    notifications: boolean
    newsletter: boolean
  }
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "preparing" | "out-for-delivery" | "delivered" | "cancelled"
  createdAt: string
  deliveryAddress: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  paymentMethod: string
  deliveryOption: "standard" | "scheduled" | "express"
  deliveryFee: number
  tax: number
  subtotal: number
}

export interface Review {
  id: number
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
  verified: boolean
  helpful: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
