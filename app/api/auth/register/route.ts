import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import type { ApiResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone } = body

    if (!name || !email || !password || !phone) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "All fields are required",
        },
        { status: 400 },
      )
    }

    const result = await auth.register({ name, email, password, phone })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result,
      message: "Registration successful",
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 400 },
    )
  }
}
