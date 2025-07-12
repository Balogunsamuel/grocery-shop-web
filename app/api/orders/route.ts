import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import type { ApiResponse } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let orders = userId ? db.orders.findByUserId(userId) : db.orders.findAll()

    if (status) {
      orders = orders.filter((order) => order.status === status)
    }

    const total = orders.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const paginatedOrders = orders.slice(startIndex, startIndex + limit)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: paginatedOrders,
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
        error: "Failed to fetch orders",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const requiredFields = ["userId", "items", "deliveryAddress", "paymentMethod"]
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

    // Calculate totals
    const subtotal = body.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const tax = subtotal * 0.08 // 8% tax
    const shipping = subtotal > 50 ? 0 : 5.99
    const discount = body.discount || 0
    const total = subtotal + tax + shipping - discount

    const order = db.orders.create({
      ...body,
      date: new Date().toISOString(),
      status: "pending",
      subtotal,
      tax,
      shipping,
      discount,
      total,
      paymentStatus: "pending",
      deliveryMethod: body.deliveryMethod || "standard",
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: order,
      message: "Order created successfully",
    })
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to create order",
      },
      { status: 500 },
    )
  }
}
