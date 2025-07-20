import { NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://grocery-shop-web.onrender.com';

export async function POST(request: Request) {
  try {
    const { paymentIntentId, paymentMethodId } = await request.json()

    // Send payment confirmation request to backend API
    const response = await fetch(`${API_URL}/api/payments/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentIntentId, paymentMethodId }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: data.data,
    })
  } catch (error) {
    console.error('Payment confirmation failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: "Payment failed",
      },
      { status: 500 },
    )
  }
}
