import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { amount, currency = "usd" } = await request.json()

    // Simulate Stripe payment intent creation
    const paymentIntent = {
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      client_secret: `pi_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      status: "requires_payment_method",
    }

    return NextResponse.json({
      success: true,
      data: paymentIntent,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create payment intent",
      },
      { status: 500 },
    )
  }
}
