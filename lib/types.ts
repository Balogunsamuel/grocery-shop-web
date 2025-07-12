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
}

export interface Category {
  id: number
  name: string
  icon: string
  color: string
  description?: string
  productCount?: number
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
  preferences?: {
    notifications: boolean
    marketing: boolean
    darkMode: boolean
  }
}

export interface Address {
  id: number
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
  date: string
  status: "pending" | "confirmed" | "preparing" | "out-for-delivery" | "delivered" | "cancelled"
  total: number
  items: CartItem[]
  deliveryAddress: Address
  paymentMethod: string
  deliveryMethod: string
  estimatedDelivery?: string
}

export interface Review {
  id: number
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
  verified: boolean
  helpful?: number
}

export interface PromoCode {
  code: string
  discount: number
  type: "percentage" | "fixed"
  minOrder?: number
  maxDiscount?: number
  expiryDate?: string
  usageLimit?: number
  usedCount?: number
}
