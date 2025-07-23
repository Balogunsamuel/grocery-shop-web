import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Product } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return 'N/A'
  
  const parsedDate = new Date(date)
  if (isNaN(parsedDate.getTime())) return 'Invalid Date'
  
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate)
}

export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

export function filterProducts(
  products: Product[],
  searchQuery: string,
  categoryId: number | null,
  priceRange: [number, number],
  selectedBrands: string[],
): Product[] {
  return products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !categoryId || product.category.toLowerCase() === getCategoryName(categoryId).toLowerCase()

    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

    const matchesBrand = selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand))

    return matchesSearch && matchesCategory && matchesPrice && matchesBrand
  })
}

export function sortProducts(products: Product[], sortBy: string): Product[] {
  const sortedProducts = [...products]

  switch (sortBy) {
    case "price-low":
      return sortedProducts.sort((a, b) => a.price - b.price)
    case "price-high":
      return sortedProducts.sort((a, b) => b.price - a.price)
    case "rating":
      return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    case "name":
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
    case "newest":
      return sortedProducts.sort((a, b) => Number(b.id) - Number(a.id))
    case "discount":
      return sortedProducts.sort(
        (a, b) => calculateDiscount(b.originalPrice || b.price, b.price) - calculateDiscount(a.originalPrice || a.price, a.price),
      )
    default:
      return sortedProducts
  }
}

export function getCategoryName(categoryId: number): string {
  const categoryMap: { [key: number]: string } = {
    1: "Fruits",
    2: "Vegetables",
    3: "Dairy",
    4: "Meat",
    5: "Bakery",
    6: "Beverages",
    7: "Snacks",
    8: "Frozen",
  }
  return categoryMap[categoryId] || "All"
}

export function generateOrderId(): string {
  return "ORD-" + Date.now().toString().slice(-6)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-$$$$]{10,}$/
  return phoneRegex.test(phone)
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function getDeliveryEstimate(method: string): string {
  switch (method) {
    case "express":
      return "30 minutes"
    case "scheduled":
      return "Selected time slot"
    case "standard":
    default:
      return "2-3 business days"
  }
}

export function calculateDeliveryFee(subtotal: number, method: string): number {
  if (subtotal >= 50) return 0

  switch (method) {
    case "express":
      return 9.99
    case "scheduled":
      return 2.99
    case "standard":
    default:
      return 4.99
  }
}
