import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"
import type { ApiResponse } from "@/lib/types"

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

    const result = await AuthService.register({ name, email, phone, password })

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: result.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: result.user,
        token: result.token,
      },
      message: "Registration successful",
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
