import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import type { ApiResponse } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const priceMin = searchParams.get("priceMin")
    const priceMax = searchParams.get("priceMax")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    const filters: any = {}

    if (category) filters.category = Number.parseInt(category)
    if (search) filters.search = search
    if (priceMin && priceMax) filters.priceRange = [Number.parseFloat(priceMin), Number.parseFloat(priceMax)]

    const allProducts = db.products.findAll(filters)
    const total = allProducts.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const products = allProducts.slice(startIndex, startIndex + limit)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "price", "category", "categoryId", "brand", "stockCount", "description"]
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

    const product = db.products.create({
      ...body,
      originalPrice: body.originalPrice || body.price,
      image: body.image || "/placeholder.svg?height=200&width=200",
      rating: 0,
      reviewCount: 0,
      inStock: body.stockCount > 0,
      features: body.features || [],
      tags: body.tags || [],
      isActive: true,
      sku: body.sku || `SKU${Date.now()}`,
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: product,
      message: "Product created successfully",
    })
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to create product",
      },
      { status: 500 },
    )
  }
}
