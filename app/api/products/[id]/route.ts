import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import type { ApiResponse } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const product = db.products.findById(id)

    if (!product) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: product,
    })
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to fetch product",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const product = db.products.update(id, body)

    if (!product) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: product,
      message: "Product updated successfully",
    })
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to update product",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const success = db.products.delete(id)

    if (!success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to delete product",
      },
      { status: 500 },
    )
  }
}
