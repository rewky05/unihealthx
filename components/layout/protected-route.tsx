'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-states';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSuperadmin?: boolean;
}

export function ProtectedRoute({ children, requireSuperadmin = false }: ProtectedRouteProps) {
  const { user, loading, isSuperadmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { user, loading, isSuperadmin: isSuperadmin() });
    
    if (!loading) {
      if (!user) {
        console.log('No user found, redirecting to login');
        router.push('/login');
      } else if (requireSuperadmin && !isSuperadmin()) {
        console.log('User is not superadmin, redirecting to dashboard');
        router.push('/dashboard');
      }
    }
  }, [user, loading, requireSuperadmin, isSuperadmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Authenticating..." />
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute - No user, returning null');
    return null; // Will redirect to login
  }

  if (requireSuperadmin && !isSuperadmin()) {
    console.log('ProtectedRoute - User not superadmin, returning null');
    return null; // Will redirect to dashboard
  }

  console.log('ProtectedRoute - User authenticated, rendering children');
  return <>{children}</>;
} 