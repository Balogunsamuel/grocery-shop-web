'use client';

import { Sidebar } from './sidebar';
import { ProtectedRoute } from './protected-route';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}