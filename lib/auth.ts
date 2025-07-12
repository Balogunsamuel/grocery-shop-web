import { db } from "./database"
import type { User } from "./types"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
}

// Simple auth simulation (use proper auth in production)
export const auth = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string } | null> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = db.users.findByEmail(credentials.email)

    // Simple password check (use proper hashing in production)
    if (user && credentials.password === "password") {
      return {
        user,
        token: `token-${user.id}-${Date.now()}`,
      }
    }

    return null
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string } | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const existingUser = db.users.findByEmail(data.email)
    if (existingUser) {
      throw new Error("User already exists")
    }

    const user = db.users.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: "customer",
      isActive: true,
    })

    return {
      user,
      token: `token-${user.id}-${Date.now()}`,
    }
  },

  verifyToken: async (token: string): Promise<User | null> => {
    // Simple token verification (use proper JWT in production)
    if (token.startsWith("token-")) {
      const userId = token.split("-")[1]
      return db.users.findById(userId)
    }
    return null
  },
}
