'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Activity,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  FileText,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Upload,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

const mockActivityLogs = [
  {
    id: 1,
    timestamp: '2024-01-20T14:30:00',
    action: 'Doctor Verified',
    category: 'verification',
    adminUser: 'Admin User',
    adminEmail: 'admin@unihealth.ph',
    targetDoctor: 'Dr. Maria Santos',
    targetDoctorId: 'doc_001',
    description: 'Doctor credentials verified successfully. PRC license and board certifications approved.',
    details: {
      prcId: 'PRC-123456',
      previousStatus: 'pending',
      newStatus: 'verified',
      documentsReviewed: ['PRC License', 'Medical Diploma', 'Board Certificate']
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 2,
    timestamp: '2024-01-20T13:15:00',
    action: 'Schedule Updated',
    category: 'schedule',
    adminUser: 'Admin User',
    adminEmail: 'admin@unihealth.ph',
    targetDoctor: 'Dr. Juan Dela Cruz',
    targetDoctorId: 'doc_002',
    description: 'Weekly schedule modified for Pediatrics department.',
    details: {
      clinic: 'Children\'s Hospital Cebu',
      changes: 'Added Tuesday 2:00 PM - 6:00 PM slot',
      previousSchedule: 'Mon, Wed, Fri',
      newSchedule: 'Mon, Tue, Wed, Fri'
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 3,
    timestamp: '2024-01-20T12:45:00',
    action: 'Document Uploaded',
    category: 'document',
    adminUser: 'Dr. Ana Rodriguez',
    adminEmail: 'ana.rodriguez@email.com',
    targetDoctor: 'Dr. Ana Rodriguez',
    targetDoctorId: 'doc_003',
    description: 'New board certification document uploaded.',
    details: {
      documentType: 'Board Certificate - Dermatology',
      fileName: 'dermatology_board_cert_2024.pdf',
      fileSize: '2.3 MB',
      uploadMethod: 'Web Portal'
    },
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: 4,
    timestamp: '2024-01-20T11:20:00',
    action: 'Doctor Suspended',
    category: 'verification',
    adminUser: 'Super Admin',
    adminEmail: 'superadmin@unihealth.ph',
    targetDoctor: 'Dr. Carlos Mendoza',
    targetDoctorId: 'doc_004',
    description: 'Doctor account suspended due to expired PRC license.',
    details: {
      reason: 'Expired PRC License',
      prcExpiryDate: '2024-01-15',
      previousStatus: 'verified',
      newStatus: 'suspended',
      notificationSent: true
    },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 5,
    timestamp: '2024-01-20T10:30:00',
    action: 'Profile Updated',
    category: 'profile',
    adminUser: 'Admin User',
    adminEmail: 'admin@unihealth.ph',
    targetDoctor: 'Dr. Elena Reyes',
    targetDoctorId: 'doc_005',
    description: 'Doctor profile information updated.',
    details: {
      fieldsChanged: ['phone', 'address', 'specialty'],
      previousPhone: '+63 917 111 1111',
      newPhone: '+63 917 567 8901',
      previousSpecialty: 'General Medicine',
      newSpecialty: 'Neurology'
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
];

const categories = ['All', 'Verification', 'Schedule', 'Document', 'Profile', 'System'];
const timeRanges = ['All Time', 'Today', 'This Week', 'This Month', 'Last 30 Days'];

export default function ActivityLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTimeRange, setSelectedTimeRange] = useState('All Time');
  const [logs] = useState(mockActivityLogs);
  const [selectedLog, setSelectedLog] = useState<typeof mockActivityLogs[0] | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.targetDoctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.adminUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           log.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'verification':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400';
      case 'schedule':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-400';
      case 'document':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400';
      case 'profile':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-400';
      case 'system':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'verification':
        return <UserCheck className="h-3 w-3" />;
      case 'schedule':
        return <Calendar className="h-3 w-3" />;
      case 'document':
        return <FileText className="h-3 w-3" />;
      case 'profile':
        return <Edit className="h-3 w-3" />;
      case 'system':
        return <Settings className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Verified')) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (action.includes('Suspended')) return <AlertTriangle className="h-4 w-4 text-red-600" />;
    if (action.includes('Updated')) return <Edit className="h-4 w-4 text-blue-600" />;
    if (action.includes('Uploaded')) return <Upload className="h-4 w-4 text-purple-600" />;
    if (action.includes('Deleted')) return <Trash2 className="h-4 w-4 text-red-600" />;
    return <Info className="h-4 w-4 text-gray-600" />;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <DashboardLayout title="">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Activity Logs</h2>
            <p className="text-muted-foreground">
              Track all administrative actions and system activities
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Activities
              </CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.length}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Last 30 days
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Verifications
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {logs.filter(log => log.category === 'verification').length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                This month
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Schedule Changes
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {logs.filter(log => log.category === 'schedule').length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                This week
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Documents
              </CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {logs.filter(log => log.category === 'document').length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Uploaded today
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activities, doctors, or admins..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Activity Timeline ({filteredLogs.length})
            </CardTitle>
            <CardDescription>
              Chronological list of all administrative activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="group relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-12 bottom-0 w-px bg-border group-last:hidden" />
                  
                  {/* Activity Item */}
                  <div className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-background border-2 border-border rounded-full flex items-center justify-center relative z-10">
                      {getActionIcon(log.action)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium">{log.action}</h4>
                            <Badge className={getCategoryColor(log.category)}>
                              {getCategoryIcon(log.category)}
                              <span className="ml-1 capitalize">{log.category}</span>
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {log.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{log.adminUser}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FileText className="h-3 w-3" />
                              <span>{log.targetDoctor}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimestamp(log.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setSelectedLog(log)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Activity Details</DialogTitle>
                              <DialogDescription>
                                Complete information about this administrative action
                              </DialogDescription>
                            </DialogHeader>
                            {selectedLog && (
                              <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <h4 className="font-medium mb-2">Action Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center space-x-2">
                                        {getActionIcon(selectedLog.action)}
                                        <span className="font-medium">{selectedLog.action}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Badge className={getCategoryColor(selectedLog.category)}>
                                          {getCategoryIcon(selectedLog.category)}
                                          <span className="ml-1 capitalize">{selectedLog.category}</span>
                                        </Badge>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>{new Date(selectedLog.timestamp).toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Performed By</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center space-x-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarFallback className="text-xs">
                                            {selectedLog.adminUser.split(' ').map(n => n[0]).join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span>{selectedLog.adminUser}</span>
                                      </div>
                                      <div className="text-muted-foreground">{selectedLog.adminEmail}</div>
                                      <div className="text-muted-foreground">IP: {selectedLog.ipAddress}</div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Description</h4>
                                  <p className="text-sm bg-muted p-4 rounded-lg">
                                    {selectedLog.description}
                                  </p>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Target Doctor</h4>
                                  <div className="text-sm">
                                    <div className="font-medium">{selectedLog.targetDoctor}</div>
                                    <div className="text-muted-foreground">ID: {selectedLog.targetDoctorId}</div>
                                  </div>
                                </div>

                                {selectedLog.details && (
                                  <div>
                                    <h4 className="font-medium mb-2">Additional Details</h4>
                                    <div className="bg-muted p-4 rounded-lg">
                                      <pre className="text-xs whitespace-pre-wrap">
                                        {JSON.stringify(selectedLog.details, null, 2)}
                                      </pre>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}