import { NextResponse } from "next/server"

// In-memory storage for demo purposes
const orders: any[] = []

export async function POST(request: Request) {
  try {
    const orderData = await request.json()

    const newOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: "user_demo",
      ...orderData,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    }

    orders.push(newOrder)

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: "Order created successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: orders,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
      },
      { status: 500 },
    )
  }
}
