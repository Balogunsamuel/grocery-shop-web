'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface DashboardStats {
  orders: {
    total: number;
    today: number;
    this_month: number;
    last_month: number;
  };
  revenue: {
    total: number;
    this_month: number;
  };
  products: {
    total: number;
    out_of_stock: number;
    low_stock: number;
  };
  users: {
    total: number;
    new_today: number;
  };
}

interface DashboardData {
  stats: DashboardStats;
  recent_orders: any[];
  top_products: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.getDashboard();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = data?.stats;
  const recentOrders = data?.recent_orders || [];
  const topProducts = data?.top_products || [];

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'default';
      case 'preparing':
        return 'secondary';
      case 'out_for_delivery':
        return 'default';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats?.revenue.total || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stats?.revenue.this_month || 0)} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.orders.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.orders.today || 0} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.products.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.products.low_stock || 0} low stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.users.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.users.new_today || 0} new today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alert Cards */}
        {stats && (stats.products.out_of_stock > 0 || stats.products.low_stock > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.products.out_of_stock > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Out of Stock Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700">
                    {stats.products.out_of_stock} products are currently out of stock
                  </p>
                </CardContent>
              </Card>
            )}

            {stats.products.low_stock > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-800 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Low Stock Warning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700">
                    {stats.products.low_stock} products have low stock levels
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from customers</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">Order #{order._id.slice(-6)}</p>
                          <p className="text-xs text-gray-500">
                            {formatRelativeTime(order.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(order.total_price)}
                        </p>
                        <Badge 
                          variant={getOrderStatusColor(order.status) as any}
                          className="text-xs"
                        >
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best selling products this month</CardDescription>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.slice(0, 5).map((product, index) => (
                    <div key={product._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-emerald-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            {product.total_quantity} sold
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(product.total_revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No sales data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}