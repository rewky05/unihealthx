import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { authService, type AdminUser } from '@/lib/auth/auth.service';

// Auth context
interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await authService.signIn(email, password);
      // User state will be updated by the auth state listener
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await authService.signOut();
      // User state will be updated by the auth state listener
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const hasPermission = useCallback((permission: string) => {
    return authService.hasPermission(user, permission);
  }, [user]);

  const value = {
    user,
    loading,
    signIn,
    signOut,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Main auth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for login functionality
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [signIn]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    login,
    loading,
    error,
    clearError
  };
}

// Hook for logout functionality
export function useLogout() {
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  return {
    logout,
    loading
  };
}

// Hook for password reset
export function usePasswordReset() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendPasswordReset = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authService.sendPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearState = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    sendPasswordReset,
    loading,
    error,
    success,
    clearState
  };
}

// Hook for admin user management
export function useAdminUsers() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const users = await authService.getAllAdminUsers();
      setAdminUsers(users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminUsers();
  }, [fetchAdminUsers]);

  const createAdminUser = useCallback(async (
    email: string,
    password: string,
    displayName: string,
    role: AdminUser['role']
  ) => {
    try {
      const newUser = await authService.createAdminUser(email, password, displayName, role);
      setAdminUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (error) {
      throw error;
    }
  }, []);

  const updateAdminUser = useCallback(async (uid: string, updates: Partial<AdminUser>) => {
    try {
      await authService.updateAdminUser(uid, updates);
      setAdminUsers(prev => 
        prev.map(user => 
          user.uid === uid ? { ...user, ...updates } : user
        )
      );
    } catch (error) {
      throw error;
    }
  }, []);

  const deactivateAdminUser = useCallback(async (uid: string) => {
    try {
      await authService.deactivateAdminUser(uid);
      setAdminUsers(prev => 
        prev.map(user => 
          user.uid === uid ? { ...user, isActive: false } : user
        )
      );
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    adminUsers,
    loading,
    error,
    refresh: fetchAdminUsers,
    createAdminUser,
    updateAdminUser,
    deactivateAdminUser
  };
}

// Hook for checking permissions
export function usePermissions() {
  const { user, hasPermission } = useAuth();

  const canRead = useCallback((resource: string) => {
    return hasPermission(`${resource}:read`);
  }, [hasPermission]);

  const canWrite = useCallback((resource: string) => {
    return hasPermission(`${resource}:write`);
  }, [hasPermission]);

  const canDelete = useCallback((resource: string) => {
    return hasPermission(`${resource}:delete`);
  }, [hasPermission]);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';
  const isModerator = user?.role === 'moderator';

  return {
    user,
    canRead,
    canWrite,
    canDelete,
    hasPermission,
    isAdmin,
    isSuperAdmin,
    isModerator
  };
}

// Hook for protected routes
export function useRequireAuth(permission?: string) {
  const { user, loading } = useAuth();
  const { hasPermission } = usePermissions();

  const isAuthenticated = !!user;
  const hasRequiredPermission = permission ? hasPermission(permission) : true;
  const canAccess = isAuthenticated && hasRequiredPermission;

  return {
    user,
    loading,
    isAuthenticated,
    hasRequiredPermission,
    canAccess
  };
}