import { NextResponse } from "next/server"
import { products } from "@/lib/data"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = searchParams.get("limit")
    const search = searchParams.get("search")

    let filteredProducts = products

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter((product) => product.categoryId === Number.parseInt(category))
    }

    // Filter by search term
    if (search) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.category.toLowerCase().includes(search.toLowerCase()) ||
          product.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
      )
    }

    // Apply limit
    if (limit) {
      filteredProducts = filteredProducts.slice(0, Number.parseInt(limit))
    }

    return NextResponse.json({
      success: true,
      data: filteredProducts,
      total: filteredProducts.length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 },
    )
  }
}
