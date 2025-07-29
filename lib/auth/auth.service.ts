import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from '@/lib/firebase/config';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  isActive: boolean;
  lastLoginAt?: number;
  createdAt: number;
}

export class AuthService {
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<AdminUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get admin user data from database
      const adminData = await this.getAdminUser(user.uid);
      
      if (!adminData || !adminData.isActive) {
        await this.signOut();
        throw new Error('Account is not active or does not have admin privileges');
      }

      // Update last login time
      await this.updateLastLogin(user.uid);

      return adminData;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Failed to sign out');
    }
  }

  /**
   * Create new admin user
   */
  async createAdminUser(
    email: string, 
    password: string, 
    displayName: string,
    role: AdminUser['role'] = 'admin'
  ): Promise<AdminUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, { displayName });

      // Send email verification
      await sendEmailVerification(user);

      // Create admin user record in database
      const adminUser: AdminUser = {
        uid: user.uid,
        email: user.email!,
        displayName,
        role,
        permissions: this.getRolePermissions(role),
        isActive: true,
        createdAt: Date.now()
      };

      await set(ref(db, `admin-users/${user.uid}`), adminUser);

      return adminUser;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Get admin user data from database
   */
  async getAdminUser(uid: string): Promise<AdminUser | null> {
    try {
      const snapshot = await get(ref(db, `admin-users/${uid}`));
      return snapshot.exists() ? snapshot.val() as AdminUser : null;
    } catch (error) {
      console.error('Error getting admin user:', error);
      return null;
    }
  }

  /**
   * Update last login time
   */
  private async updateLastLogin(uid: string): Promise<void> {
    try {
      await set(ref(db, `admin-users/${uid}/lastLoginAt`), Date.now());
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  /**
   * Get permissions for a role
   */
  private getRolePermissions(role: AdminUser['role']): string[] {
    const permissions: Record<AdminUser['role'], string[]> = {
      super_admin: [
        'doctors:read',
        'doctors:write',
        'doctors:delete',
        'feedback:read',
        'feedback:write',
        'feedback:delete',
        'schedules:read',
        'schedules:write',
        'schedules:delete',
        'clinics:read',
        'clinics:write',
        'clinics:delete',
        'admin:read',
        'admin:write',
        'admin:delete',
        'system:settings'
      ],
      admin: [
        'doctors:read',
        'doctors:write',
        'feedback:read',
        'feedback:write',
        'schedules:read',
        'schedules:write',
        'clinics:read',
        'clinics:write'
      ],
      moderator: [
        'doctors:read',
        'feedback:read',
        'feedback:write',
        'schedules:read',
        'clinics:read'
      ]
    };

    return permissions[role] || [];
  }

  /**
   * Check if user has permission
   */
  hasPermission(user: AdminUser | null, permission: string): boolean {
    if (!user || !user.isActive) return false;
    return user.permissions.includes(permission);
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: AdminUser | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const adminUser = await this.getAdminUser(firebaseUser.uid);
        callback(adminUser);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Convert Firebase auth error codes to user-friendly messages
   */
  private getAuthErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/invalid-email': 'Invalid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'An account with this email already exists',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/requires-recent-login': 'Please sign in again to complete this action'
    };

    return errorMessages[errorCode] || 'An authentication error occurred';
  }

  /**
   * Update admin user profile
   */
  async updateAdminUser(uid: string, updates: Partial<AdminUser>): Promise<void> {
    try {
      const currentData = await this.getAdminUser(uid);
      if (!currentData) {
        throw new Error('Admin user not found');
      }

      const updatedData = {
        ...currentData,
        ...updates,
        updatedAt: Date.now()
      };

      await set(ref(db, `admin-users/${uid}`), updatedData);
    } catch (error: any) {
      throw new Error('Failed to update admin user');
    }
  }

  /**
   * Deactivate admin user
   */
  async deactivateAdminUser(uid: string): Promise<void> {
    try {
      await this.updateAdminUser(uid, { isActive: false });
    } catch (error: any) {
      throw new Error('Failed to deactivate admin user');
    }
  }

  /**
   * Get all admin users
   */
  async getAllAdminUsers(): Promise<AdminUser[]> {
    try {
      const snapshot = await get(ref(db, 'admin-users'));
      if (!snapshot.exists()) {
        return [];
      }

      return Object.values(snapshot.val()) as AdminUser[];
    } catch (error) {
      console.error('Error getting admin users:', error);
      return [];
    }
  }
}

// Export singleton instance
export const authService = new AuthService();