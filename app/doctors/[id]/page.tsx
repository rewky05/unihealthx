'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Upload,
  Download,
  Check,
  X,
  Edit,
  Clock,
  Building,
  GraduationCap,
  Award,
  Activity
} from 'lucide-react';

const mockDoctor = {
  id: 1,
  name: 'Dr. Maria Santos',
  email: 'maria.santos@email.com',
  phone: '+63 917 123 4567',
  specialty: 'Cardiology',
  subSpecialty: 'Interventional Cardiology',
  clinics: [
    { name: 'Cebu Heart Center', role: 'Senior Consultant', since: '2020-01-15' },
    { name: 'Metro Manila Hospital', role: 'Visiting Consultant', since: '2021-06-01' }
  ],
  status: 'verified',
  prcId: 'PRC-123456',
  prcExpiry: '2025-12-31',
  medicalLicense: 'ML-789012',
  joinDate: '2023-01-15',
  lastLogin: '2024-01-20 14:30:00',
  avatar: null,
  personalInfo: {
    address: '123 Lahug Boulevard, Cebu City, Philippines',
    dateOfBirth: '1985-03-15',
    gender: 'Female',
    civilStatus: 'Married'
  },
  education: [
    {
      degree: 'Doctor of Medicine',
      school: 'University of the Philippines College of Medicine',
      year: '2009'
    },
    {
      degree: 'Residency in Internal Medicine',
      school: 'Philippine General Hospital',
      year: '2013'
    },
    {
      degree: 'Fellowship in Cardiology',
      school: 'Philippine Heart Center',
      year: '2015'
    }
  ],
  certifications: [
    {
      name: 'Board Certified in Internal Medicine',
      issuer: 'Philippine Board of Internal Medicine',
      date: '2013-07-15',
      expiry: '2026-07-15'
    },
    {
      name: 'Board Certified in Cardiology',
      issuer: 'Philippine Heart Association',
      date: '2015-09-20',
      expiry: '2028-09-20'
    }
  ],
  documents: [
    { name: 'PRC License', type: 'prc_license', uploadDate: '2023-01-10', status: 'verified' },
    { name: 'Medical Diploma', type: 'diploma', uploadDate: '2023-01-10', status: 'verified' },
    { name: 'Board Certificate - Internal Medicine', type: 'certification', uploadDate: '2023-01-10', status: 'verified' },
    { name: 'Board Certificate - Cardiology', type: 'certification', uploadDate: '2023-01-10', status: 'verified' }
  ],
  verificationLogs: [
    {
      date: '2023-01-15 10:30:00',
      action: 'Verified',
      admin: 'Admin User',
      notes: 'All documents verified successfully. PRC license valid until 2025.'
    },
    {
      date: '2023-01-12 14:15:00',
      action: 'Documents Reviewed',
      admin: 'Admin User',
      notes: 'Initial document review completed. All required documents present.'
    },
    {
      date: '2023-01-10 09:00:00',
      action: 'Application Submitted',
      admin: 'System',
      notes: 'Doctor application submitted with all required documents.'
    }
  ]
};

export default function DoctorDetailPage() {
  const [doctor] = useState(mockDoctor);
  const [verificationStatus, setVerificationStatus] = useState(doctor.status);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleVerificationSubmit = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Add new log entry (in real app, this would be handled by the backend)
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400';
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <DashboardLayout title={`${doctor.name} - Doctor Details`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={doctor.avatar || ''} />
              <AvatarFallback className="text-lg">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{doctor.name}</h1>
              <p className="text-lg text-muted-foreground">{doctor.specialty}</p>
              {doctor.subSpecialty && (
                <p className="text-sm text-muted-foreground">{doctor.subSpecialty}</p>
              )}
              <div className="flex items-center space-x-4 mt-2">
                <Badge className={getStatusColor(doctor.status)}>
                  {doctor.status === 'verified' && <Check className="h-3 w-3 mr-1" />}
                  {doctor.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                  {doctor.status === 'suspended' && <X className="h-3 w-3 mr-1" />}
                  <span className="capitalize">{doctor.status}</span>
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Joined {new Date(doctor.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Personal Information */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{doctor.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{doctor.personalInfo.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Born {new Date(doctor.personalInfo.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gender</p>
                      <p>{doctor.personalInfo.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Civil Status</p>
                      <p>{doctor.personalInfo.civilStatus}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">PRC ID</p>
                    <p>{doctor.prcId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">PRC Expiry</p>
                    <p>{new Date(doctor.prcExpiry).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Medical License</p>
                    <p>{doctor.medicalLicense}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                    <p>{new Date(doctor.lastLogin).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Clinic Affiliations */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Clinic Affiliations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctor.clinics.map((clinic, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{clinic.name}</h4>
                        <p className="text-sm text-muted-foreground">{clinic.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Since</p>
                        <p className="text-sm">{new Date(clinic.since).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Education & Training
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctor.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.school}</p>
                      <p className="text-sm text-muted-foreground">Graduated {edu.year}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Credentials Tab */}
          <TabsContent value="credentials" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Documents */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Documents
                  </CardTitle>
                  <CardDescription>
                    Uploaded credential documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {doctor.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getDocumentStatusColor(doc.status)}>
                            {doc.status === 'verified' && <Check className="h-3 w-3 mr-1" />}
                            {doc.status}
                          </Badge>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Document
                  </Button>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Board Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {doctor.certifications.map((cert, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-medium">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        <div className="flex justify-between mt-2 text-sm">
                          <span>Issued: {new Date(cert.date).toLocaleDateString()}</span>
                          <span>Expires: {new Date(cert.expiry).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schedules Tab */}
          <TabsContent value="schedules" className="space-y-6">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Management
                </CardTitle>
                <CardDescription>
                  Manage doctor&apos;s availability and clinic schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Schedule Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Configure weekly schedules and clinic availability
                  </p>
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Schedules
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Verification Control
                </CardTitle>
                <CardDescription>
                  Manage doctor verification status and add admin notes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="status">Verification Status</Label>
                    <Select value={verificationStatus} onValueChange={setVerificationStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending Review</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Verification Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add notes about the verification process..."
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleVerificationSubmit}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  {verificationStatus === 'verified' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">
                          <Check className="h-4 w-4 mr-2" />
                          Verify Doctor
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Verify Doctor</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to verify this doctor? This action will update their status and send them a confirmation email.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Verify</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Verification History
                </CardTitle>
                <CardDescription>
                  Complete audit trail of verification activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctor.verificationLogs.map((log, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4 pb-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{log.action}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.date).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">By: {log.admin}</p>
                      <p className="text-sm mt-1">{log.notes}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}