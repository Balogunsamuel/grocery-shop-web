import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import type { ApiResponse } from "@/lib/types"

export async function GET() {
  try {
    const analytics = db.analytics.getDashboard()

    return NextResponse.json<ApiResponse>({
      success: true,
      data: analytics,
    })
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to fetch analytics",
      },
      { status: 500 },
    )
  }
}
