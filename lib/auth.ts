import { db } from "./database"
import type { User } from "./types"

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
}

export class AuthService {
  static async login(email: string, password: string): Promise<AuthResponse> {
    // Simple authentication - in production, use proper password hashing
    const user = db.users.findByEmail(email)

    if (!user) {
      return { success: false, message: "User not found" }
    }

    // For demo purposes, accept any password for admin@grocery.com
    if (email === "admin@grocery.com" || password === "password") {
      const token = this.generateToken(user.id)
      return { success: true, user, token }
    }

    return { success: false, message: "Invalid credentials" }
  }

  static async register(userData: {
    name: string
    email: string
    phone: string
    password: string
  }): Promise<AuthResponse> {
    const existingUser = db.users.findByEmail(userData.email)

    if (existingUser) {
      return { success: false, message: "User already exists" }
    }

    const user = db.users.create({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: "customer",
      isActive: true,
      preferences: {
        notifications: true,
        marketing: false,
        darkMode: false,
      },
    })

    const token = this.generateToken(user.id)
    return { success: true, user, token }
  }

  static generateToken(userId: string): string {
    // In production, use proper JWT
    return `token-${userId}-${Date.now()}`
  }

  static verifyToken(token: string): string | null {
    // Simple token verification - in production, use proper JWT verification
    const parts = token.split("-")
    if (parts.length === 3 && parts[0] === "token") {
      return parts[1] // Return user ID
    }
    return null
  }
}
