// Authentication Configuration
export const AUTH_CONFIG = {
  // Superadmin credentials (static for easy transfer)
  SUPERADMIN: {
    EMAIL: 'superadmin@unihealth.ph',
    PASSWORD: 'UniHealth2024!',
  },
  
  // Security settings
  SECURITY: {
    // Captcha settings
    CAPTCHA: {
      ENABLED: true,
      MIN_NUMBERS: 1,
      MAX_NUMBERS: 10,
      OPERATORS: ['+', '-', '×'],
    },
    
    // Session settings
    SESSION: {
      TIMEOUT_MINUTES: 480, // 8 hours
      REFRESH_INTERVAL: 300000, // 5 minutes
    },
    
    // Rate limiting
    RATE_LIMIT: {
      MAX_LOGIN_ATTEMPTS: 5,
      LOCKOUT_DURATION_MINUTES: 15,
    },
  },
  
  // Role-based access control
  ROLES: {
    SUPERADMIN: 'superadmin',
    ADMIN: 'admin',
  },
  
  // Permissions
  PERMISSIONS: {
    SUPERADMIN: [
      'doctors:read',
      'doctors:write',
      'doctors:delete',
      'clinics:read',
      'clinics:write',
      'clinics:delete',
      'feedback:read',
      'feedback:write',
      'feedback:delete',
      'schedules:read',
      'schedules:write',
      'schedules:delete',
      'activity:read',
      'settings:read',
      'settings:write',
      'users:read',
      'users:write',
      'users:delete',
    ],
    ADMIN: [
      'doctors:read',
      'doctors:write',
      'clinics:read',
      'clinics:write',
      'feedback:read',
      'feedback:write',
      'schedules:read',
      'schedules:write',
      'activity:read',
      'settings:read',
    ],
  },
} as const;

// Helper functions
export const isSuperadminEmail = (email: string): boolean => {
  return email === AUTH_CONFIG.SUPERADMIN.EMAIL;
};

export const validateSuperadminCredentials = (email: string, password: string): boolean => {
  return email === AUTH_CONFIG.SUPERADMIN.EMAIL && password === AUTH_CONFIG.SUPERADMIN.PASSWORD;
};

export const getPermissionsForRole = (role: string): string[] => {
  return [...(AUTH_CONFIG.PERMISSIONS[role as keyof typeof AUTH_CONFIG.PERMISSIONS] || [])];
}; 