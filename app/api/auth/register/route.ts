import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json()

    if (!name || !email || !phone || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "All fields are required",
        },
        { status: 400 },
      )
    }

    // Send registration request to backend API
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, phone, password }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: data.message || "Registration failed",
        },
        { status: response.status || 400 },
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: data.data.user,
        token: data.data.access_token,
      },
      message: "Registration successful",
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
