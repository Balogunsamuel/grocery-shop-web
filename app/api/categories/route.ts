import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET() {
  try {
    // Fetch from backend API
    const response = await fetch(`${API_URL}/api/categories/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform backend data to match frontend format
    const transformedCategories = data.data?.map((category: any) => ({
      id: getCategoryIdFromName(category.name),
      name: category.name,
      icon: category.icon,
      color: category.color,
      description: category.description,
      productCount: category.product_count || 0,
    })) || []

    return NextResponse.json({
      success: true,
      data: transformedCategories,
    })
  } catch (error) {
    console.error('Failed to fetch categories from backend:', error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
      },
      { status: 500 },
    )
  }
}

// Helper function to map category names to IDs
function getCategoryIdFromName(categoryName: string): number {
  const categoryMap: { [key: string]: number } = {
    'Fruits': 1,
    'Vegetables': 2,
    'Dairy': 3,
    'Meat': 4,
    'Bakery': 5,
    'Beverages': 6,
    'Snacks': 7,
    'Frozen': 8,
  }
  return categoryMap[categoryName] || 1
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
