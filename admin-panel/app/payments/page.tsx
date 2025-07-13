'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiClient } from '@/lib/api';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { 
  Search, 
  DollarSign, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  TrendingUp,
  Eye
} from 'lucide-react';

interface Payment {
  _id: string;
  user_id?: string;
  order_id?: string;
  session_id: string;
  amount: number;
  currency: string;
  payment_status: string;
  stripe_payment_intent_id?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

const paymentStatusConfig = {
  pending: { 
    label: 'Pending', 
    variant: 'warning', 
    icon: Clock,
    color: 'text-yellow-600'
  },
  initiated: { 
    label: 'Initiated', 
    variant: 'default', 
    icon: Clock,
    color: 'text-blue-600'
  },
  paid: { 
    label: 'Paid', 
    variant: 'success', 
    icon: CheckCircle,
    color: 'text-green-600'
  },
  failed: { 
    label: 'Failed', 
    variant: 'destructive', 
    icon: XCircle,
    color: 'text-red-600'
  },
  expired: { 
    label: 'Expired', 
    variant: 'secondary', 
    icon: AlertTriangle,
    color: 'text-gray-600'
  },
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPayments();
  }, [currentPage]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getPayments(currentPage, 10);
      if (response.success) {
        setPayments(response.data);
        setTotalPages(response.pages);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.session_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (payment.user_id && payment.user_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPaymentStats = () => {
    const stats = {
      total: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      paid: payments.filter(p => p.payment_status === 'paid').length,
      paidAmount: payments.filter(p => p.payment_status === 'paid').reduce((sum, p) => sum + p.amount, 0),
      pending: payments.filter(p => p.payment_status === 'pending' || p.payment_status === 'initiated').length,
      failed: payments.filter(p => p.payment_status === 'failed').length,
    };
    return stats;
  };

  const stats = getPaymentStats();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payments</h1>
            <p className="text-gray-500 mt-1">Track and manage payment transactions</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search payments by session ID, payment ID, or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.paidAmount)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.paid} successful payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stats.totalAmount)} total volume
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.paid} of {stats.total} payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.failed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pending} pending/processing
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Transactions ({filteredPayments.length})</CardTitle>
            <CardDescription>
              All payment transactions processed through the system
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
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Session ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => {
                      const statusConfig = paymentStatusConfig[payment.payment_status as keyof typeof paymentStatusConfig];
                      const StatusIcon = statusConfig?.icon || Clock;
                      
                      return (
                        <TableRow key={payment._id}>
                          <TableCell>
                            <div className="font-mono text-sm">
                              #{payment._id.slice(-8)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-xs text-gray-600">
                              {payment.session_id.slice(0, 20)}...
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-sm">
                              {payment.user_id ? payment.user_id.slice(-8) : 'Guest'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {formatCurrency(payment.amount)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <StatusIcon className={`h-4 w-4 ${statusConfig?.color}`} />
                              <Badge variant={statusConfig?.variant as any}>
                                {statusConfig?.label || payment.payment_status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="uppercase text-sm font-medium">
                              {payment.currency}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">{formatRelativeTime(payment.created_at)}</div>
                              <div className="text-xs text-gray-500">
                                {formatDate(payment.created_at)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
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