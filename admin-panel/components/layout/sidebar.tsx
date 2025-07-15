'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  FolderOpen,
  Settings,
  LogOut,
  Store,
  UserPlus,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Products',
    href: '/products',
    icon: Package,
  },
  {
    name: 'Categories',
    href: '/categories',
    icon: FolderOpen,
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ShoppingCart,
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: Users,
  },
  {
    name: 'Payments',
    href: '/payments',
    icon: CreditCard,
  },
  {
    name: 'Register Admin',
    href: '/register',
    icon: UserPlus,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Store className="h-8 w-8 text-emerald-400" />
        <span className="ml-2 text-xl font-bold text-white">
          GroceryAdmin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  )}
                />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User info and logout */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.name?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'Admin'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || 'admin@grocery.com'}
            </p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}