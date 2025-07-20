import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://grocery-shop-web.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // Send login request to backend API
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: data.message || "Login failed",
        },
        { status: response.status || 401 },
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: data.data.user,
        token: data.data.access_token,
      },
      message: "Login successful",
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
