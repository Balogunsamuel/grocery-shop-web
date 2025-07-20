import { NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://grocery-shop-web.onrender.com';

export async function POST(request: Request) {
  try {
    const orderData = await request.json()

    // Send order to backend API
    const response = await fetch(`${API_URL}/api/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: data.data,
      message: "Order created successfully",
    })
  } catch (error) {
    console.error('Failed to create order in backend:', error)
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
    // Fetch orders from backend API
    const response = await fetch(`${API_URL}/api/orders/`, {
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
    const transformedOrders = data.data?.map((order: any) => ({
      id: order._id,
      userId: order.user_id,
      status: order.status,
      total: order.total,
      items: order.items,
      delivery_address: order.delivery_address,
      delivery_method: order.delivery_method,
      payment_method: order.payment_method,
      created_at: order.created_at,
      updated_at: order.updated_at,
    })) || []

    return NextResponse.json({
      success: true,
      data: transformedOrders,
    })
  } catch (error) {
    console.error('Failed to fetch orders from backend:', error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
      },
      { status: 500 },
    )
  }
}
