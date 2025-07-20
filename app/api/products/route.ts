import { NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://grocery-shop-web.onrender.com';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = searchParams.get("limit")
    const search = searchParams.get("search")

    // Build query parameters for backend API
    const params = new URLSearchParams()
    if (limit) params.append('size', limit)
    if (search) params.append('search', search)
    
    // Convert frontend category ID to backend category name
    if (category) {
      const categoryMap: { [key: string]: string } = {
        '1': 'Fruits',
        '2': 'Vegetables', 
        '3': 'Dairy',
        '4': 'Meat',
        '5': 'Bakery',
        '6': 'Beverages',
        '7': 'Snacks',
        '8': 'Frozen',
      }
      const categoryName = categoryMap[category]
      if (categoryName) {
        params.append('category', categoryName)
      }
    }

    // Fetch from backend API
    const response = await fetch(`${API_URL}/api/products?${params.toString()}`, {
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
    const transformedProducts = data.data?.map((product: any) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price || product.price,
      image: product.image || '/placeholder.svg?height=300&width=300',
      images: [product.image || '/placeholder.svg?height=300&width=300'],
      rating: product.rating || 4.5,
      reviewCount: product.review_count || 0,
      category: product.category,
      categoryId: getCategoryIdFromName(product.category),
      brand: product.brand,
      inStock: product.in_stock,
      stockCount: product.stock_count,
      description: product.description,
      features: product.features || [],
      nutritionFacts: product.nutrition_facts || {},
      tags: product.tags || [],
      weight: product.weight,
      origin: product.origin,
      sku: product.sku,
    })) || []

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      total: transformedProducts.length,
    })
  } catch (error) {
    console.error('Failed to fetch products from backend:', error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
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
