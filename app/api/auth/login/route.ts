import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"
import type { ApiResponse } from "@/lib/types"

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

    const result = await AuthService.login(email, password)

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: result.message,
        },
        { status: 401 },
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: result.user,
        token: result.token,
      },
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
