import { NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: Request) {
  try {
    const { amount, currency = "usd" } = await request.json()

    // Send payment intent creation request to backend API
    const response = await fetch(`${API_URL}/api/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency }),
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
    console.error('Failed to create payment intent:', error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create payment intent",
      },
      { status: 500 },
    )
  }
}
