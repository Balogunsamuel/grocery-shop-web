import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { paymentIntentId, paymentMethodId } = await request.json()

    // Simulate payment confirmation
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing time

    const confirmedPayment = {
      id: paymentIntentId,
      status: "succeeded",
      amount_received: Math.floor(Math.random() * 10000) + 1000, // Random amount
      currency: "usd",
      payment_method: paymentMethodId,
      created: Math.floor(Date.now() / 1000),
    }

    return NextResponse.json({
      success: true,
      data: confirmedPayment,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Payment failed",
      },
      { status: 500 },
    )
  }
}
