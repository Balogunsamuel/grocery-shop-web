'use client';

import { useEffect, useState, useCallback } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiClient } from '@/lib/api';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { 
  Search, 
  Eye, 
  Truck, 
  Package, 
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  User
} from 'lucide-react';

interface Order {
  _id: string;
  user_id: string;
  items: Array<{
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total_price: number;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  status: string;
  delivery_address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
  };
  payment_method: string;
  delivery_option: string;
  created_at: string;
  updated_at: string;
}

const orderStatusConfig = {
  pending: { 
    label: 'Pending', 
    variant: 'warning', 
    icon: Clock,
    color: 'text-yellow-600 bg-yellow-100'
  },
  confirmed: { 
    label: 'Confirmed', 
    variant: 'default', 
    icon: CheckCircle,
    color: 'text-blue-600 bg-blue-100'
  },
  preparing: { 
    label: 'Preparing', 
    variant: 'secondary', 
    icon: Package,
    color: 'text-purple-600 bg-purple-100'
  },
  out_for_delivery: { 
    label: 'Out for Delivery', 
    variant: 'default', 
    icon: Truck,
    color: 'text-orange-600 bg-orange-100'
  },
  delivered: { 
    label: 'Delivered', 
    variant: 'success', 
    icon: CheckCircle,
    color: 'text-green-600 bg-green-100'
  },
  cancelled: { 
    label: 'Cancelled', 
    variant: 'destructive', 
    icon: XCircle,
    color: 'text-red-600 bg-red-100'
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getOrders(currentPage, 10, statusFilter || undefined);
      if (response.success) {
        setOrders(response.data);
        setTotalPages(response.pages);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, fetchOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await apiClient.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.delivery_address.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      out_for_delivery: orders.filter(o => o.status === 'out_for_delivery').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
    return stats;
  };

  const stats = getOrderStats();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-gray-500 mt-1">Manage customer orders and deliveries</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders by ID, customer, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Statuses</option>
            {Object.entries(orderStatusConfig).map(([status, config]) => (
              <option key={status} value={status}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          
          {Object.entries(orderStatusConfig).map(([status, config]) => {
            const count = stats[status as keyof typeof stats];
            const Icon = config.icon;
            
            return (
              <Card key={status} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-gray-600">{config.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            <CardDescription>
              Manage and track all customer orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Delivery</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => {
                      const statusConfig = orderStatusConfig[order.status as keyof typeof orderStatusConfig];
                      const StatusIcon = statusConfig?.icon || Clock;
                      
                      return (
                        <TableRow key={order._id}>
                          <TableCell>
                            <div className="font-mono text-sm">
                              #{order._id.slice(-8)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="font-mono text-sm">
                                {order.user_id.slice(-8)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.items.slice(0, 2).map(item => item.name).join(', ')}
                                {order.items.length > 2 && `...+${order.items.length - 2} more`}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{formatCurrency(order.total_price)}</div>
                              <div className="text-xs text-gray-500">
                                via {order.payment_method}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${statusConfig?.color}`}>
                                <StatusIcon className="h-3 w-3" />
                              </div>
                              <span className="text-sm font-medium">
                                {statusConfig?.label || order.status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <div className="text-sm">
                                <div>{order.delivery_address.city}</div>
                                <div className="text-xs text-gray-500">
                                  {order.delivery_option}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">{formatRelativeTime(order.created_at)}</div>
                              <div className="text-xs text-gray-500">
                                {formatDate(order.created_at)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <select
                                  value={order.status}
                                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                  className="text-xs px-2 py-1 border rounded"
                                >
                                  {Object.entries(orderStatusConfig).map(([status, config]) => (
                                    <option key={status} value={status}>
                                      {config.label}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}