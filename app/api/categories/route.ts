import { type NextRequest, NextResponse } from "next/server"
import { categories } from "@/lib/data"
import type { ApiResponse } from "@/lib/types"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const requiredFields = ["name", "icon", "color"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: `${field} is required`,
          },
          { status: 400 },
        )
      }
    }

    const category = {
      id: categories.length + 1,
      ...body,
      productCount: 0,
      isActive: true,
    }

    categories.push(category)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: category,
      message: "Category created successfully",
    })
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to create category",
      },
      { status: 500 },
    )
  }
}
