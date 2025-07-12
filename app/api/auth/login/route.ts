import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import type { ApiResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    const result = await auth.login({ email, password })

    if (!result) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 },
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result,
      message: "Login successful",
    })
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
