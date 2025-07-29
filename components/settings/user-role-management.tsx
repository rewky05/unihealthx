'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Plus, Edit, Trash2, Shield, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserRoleManagementProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
}

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const mockAdminUsers: AdminUser[] = [
  {
    id: '1',
    fullName: 'John Admin',
    email: 'john.admin@unihealth.ph',
    role: 'superadmin',
    status: 'active',
    lastLogin: '2024-01-20T14:30:00'
  },
  {
    id: '2',
    fullName: 'Maria Manager',
    email: 'maria.manager@unihealth.ph',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-19T16:45:00'
  },
  {
    id: '3',
    fullName: 'Carlos Clinic',
    email: 'carlos.clinic@unihealth.ph',
    role: 'clinic_admin',
    status: 'inactive',
    lastLogin: '2024-01-15T09:20:00'
  }
];

const mockRoles: Role[] = [
  {
    id: 'superadmin',
    name: 'Super Administrator',
    description: 'Full system access with all permissions',
    permissions: ['manage_users', 'manage_doctors', 'manage_clinics', 'view_reports', 'system_settings', 'data_export']
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'General administrative access',
    permissions: ['manage_doctors', 'view_reports', 'manage_feedback']
  },
  {
    id: 'clinic_admin',
    name: 'Clinic Administrator',
    description: 'Clinic-specific administrative access',
    permissions: ['manage_clinic_doctors', 'view_clinic_reports', 'manage_schedules']
  }
];

const availablePermissions = [
  { id: 'manage_users', label: 'Manage Admin Users', description: 'Create, edit, and deactivate admin users' },
  { id: 'manage_doctors', label: 'Manage Doctors', description: 'Add, verify, and manage doctor profiles' },
  { id: 'manage_clinics', label: 'Manage Clinics', description: 'Configure clinic settings and affiliations' },
  { id: 'view_reports', label: 'View Reports', description: 'Access system reports and analytics' },
  { id: 'system_settings', label: 'System Settings', description: 'Configure global system parameters' },
  { id: 'data_export', label: 'Data Export', description: 'Export system data and generate backups' },
  { id: 'manage_feedback', label: 'Manage Patient Feedback', description: 'Review and moderate patient feedback' },
  { id: 'manage_clinic_doctors', label: 'Manage Clinic Doctors', description: 'Manage doctors within assigned clinics' },
  { id: 'view_clinic_reports', label: 'View Clinic Reports', description: 'Access reports for assigned clinics' },
  { id: 'manage_schedules', label: 'Manage Schedules', description: 'Configure doctor schedules and availability' }
];

export function UserRoleManagement({ onUnsavedChanges }: UserRoleManagementProps) {
  const { toast } = useToast();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newUserData, setNewUserData] = useState({
    fullName: '',
    email: '',
    role: ''
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setNewUserData({ fullName: '', email: '', role: '' });
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setNewUserData({
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });
    setIsUserDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setAdminUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...newUserData }
          : user
      ));
      toast({
        title: "User updated",
        description: "Admin user has been updated successfully.",
      });
    } else {
      const newUser: AdminUser = {
        id: Date.now().toString(),
        ...newUserData,
        status: 'active',
        lastLogin: new Date().toISOString()
      };
      setAdminUsers(prev => [...prev, newUser]);
      toast({
        title: "User added",
        description: "New admin user has been created successfully.",
      });
    }
    setIsUserDialogOpen(false);
  };

  const handleToggleUserStatus = (userId: string) => {
    setAdminUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    toast({
      title: "User status updated",
      description: "User status has been changed successfully.",
    });
  };

  const handleEditPermissions = (role: Role) => {
    setEditingRole({ ...role });
    setIsPermissionDialogOpen(true);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (!editingRole) return;
    
    setEditingRole(prev => ({
      ...prev!,
      permissions: checked 
        ? [...prev!.permissions, permissionId]
        : prev!.permissions.filter(p => p !== permissionId)
    }));
  };

  const handleSavePermissions = () => {
    if (!editingRole) return;
    
    setRoles(prev => prev.map(role => 
      role.id === editingRole.id ? editingRole : role
    ));
    
    toast({
      title: "Permissions updated",
      description: "Role permissions have been updated successfully.",
    });
    
    setIsPermissionDialogOpen(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400';
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400';
      case 'clinic_admin':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400';
  };

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          User & Role Management
        </CardTitle>
        <CardDescription>
          Manage user accounts, define roles, and assign granular permissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Manage Admin Users</TabsTrigger>
            <TabsTrigger value="roles">Manage Roles & Permissions</TabsTrigger>
          </TabsList>

          {/* Admin Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Admin Users ({adminUsers.length})</h3>
              <Button onClick={handleAddUser}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Admin User
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {roles.find(r => r.id === user.role)?.name || user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status === 'active' ? (
                            <UserCheck className="h-3 w-3 mr-1" />
                          ) : (
                            <UserX className="h-3 w-3 mr-1" />
                          )}
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={user.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                          >
                            {user.status === 'active' ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Roles & Permissions Tab */}
          <TabsContent value="roles" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Roles & Permissions ({roles.length})</h3>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permission) => (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {availablePermissions.find(p => p.id === permission)?.label || permission}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPermissions(role)}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add/Edit User Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit Admin User' : 'Add New Admin User'}
              </DialogTitle>
              <DialogDescription>
                {editingUser ? 'Update user information and role.' : 'Create a new admin user account.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter full name"
                  value={newUserData.fullName}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, fullName: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@unihealth.ph"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUserData.role} onValueChange={(value) => setNewUserData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveUser}
                disabled={!newUserData.fullName || !newUserData.email || !newUserData.role}
              >
                {editingUser ? 'Update User' : 'Add User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Permissions Dialog */}
        <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Role Permissions</DialogTitle>
              <DialogDescription>
                Configure permissions for {editingRole?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
              {availablePermissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={permission.id}
                    checked={editingRole?.permissions.includes(permission.id) || false}
                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={permission.id} className="font-medium">
                      {permission.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePermissions}>
                Save Permissions
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}