import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import type { ApiResponse, Analytics } from "@/lib/types"

export async function GET() {
  try {
    const orders = db.orders.findAll()
    const products = db.products.findAll()
    const users = db.users.findAll()

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = orders.length
    const totalCustomers = users.filter((u) => u.role === "customer").length
    const totalProducts = products.length

    // Calculate growth (mock data for demo)
    const revenueGrowth = 12.5
    const orderGrowth = 8.3
    const customerGrowth = 15.2

    // Top products by sales (mock data)
    const topProducts = products.slice(0, 5).map((product) => ({
      id: product.id,
      name: product.name,
      sales: Math.floor(Math.random() * 100) + 10,
      revenue: Math.floor(Math.random() * 1000) + 100,
    }))

    // Top categories by sales (mock data)
    const categories = db.categories.findAll()
    const topCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      sales: Math.floor(Math.random() * 200) + 50,
      revenue: Math.floor(Math.random() * 2000) + 500,
    }))

    // Recent orders
    const recentOrders = orders.slice(-10).reverse()

    // Monthly revenue (mock data)
    const monthlyRevenue = [
      { month: "Jan", revenue: 12000, orders: 120 },
      { month: "Feb", revenue: 15000, orders: 150 },
      { month: "Mar", revenue: 18000, orders: 180 },
      { month: "Apr", revenue: 22000, orders: 220 },
      { month: "May", revenue: 25000, orders: 250 },
      { month: "Jun", revenue: 28000, orders: 280 },
    ]

    const analytics: Analytics = {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      revenueGrowth,
      orderGrowth,
      customerGrowth,
      topProducts,
      topCategories,
      recentOrders,
      monthlyRevenue,
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: analytics,
    })
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to fetch analytics",
      },
      { status: 500 },
    )
  }
}
