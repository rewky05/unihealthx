"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DoctorSelector } from "@/components/schedules/doctor-selector";
import { EmptyState } from "@/components/schedules/empty-state";
import { DoctorInfoBanner } from "@/components/schedules/doctor-info-banner";
import { ScheduleCard } from "@/components/schedules/schedule-card";
import { ClinicCard } from "@/components/schedules/clinic-card";
import { useRealDoctors } from "@/hooks/useRealData";
import { useScheduleData } from "@/hooks/use-schedule-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/components/ui/alert-dialog";
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
  Activity,
} from "lucide-react";

export default function DoctorDetailPage() {
  const params = useParams();
  const doctorId = params.id as string;
  const { doctors, loading, error } = useRealDoctors();
  const [verificationStatus, setVerificationStatus] = useState("");
  const [verificationNotes, setVerificationNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Use the Firebase-integrated schedule data hook
  const {
    schedules,
    clinics,
    loading: scheduleLoading,
    error: scheduleError,
    handleScheduleAdd,
    handleScheduleEdit,
    handleScheduleDelete,
    handleClinicAdd,
    handleClinicEdit,
    handleClinicDelete,
  } = useScheduleData(doctorId);

  // Find the specific doctor from Firebase data
  const doctor = doctors.find(d => d.id === doctorId);

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout title="">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading doctor details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout title="">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-red-600 mb-2">Failed to load doctor details</p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show not found state
  if (!doctor) {
    return (
      <DashboardLayout title="">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-gray-500 mb-4">👤</div>
            <p className="text-gray-600 mb-2">Doctor not found</p>
            <p className="text-muted-foreground text-sm">The requested doctor could not be found.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Initialize verification status from doctor data
  useEffect(() => {
    if (doctor) {
      setVerificationStatus(doctor.status || 'pending');
    }
  }, [doctor]);

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
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400";
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <DashboardLayout title={`${doctor.firstName} ${doctor.lastName} - Doctor Details`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={doctor.profileImageUrl || ""} />
              <AvatarFallback className="text-lg">
                {`${doctor.firstName} ${doctor.lastName}`
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{`${doctor.firstName} ${doctor.lastName}`}</h1>
              <p className="text-lg text-muted-foreground">
                {doctor.specialty}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className={getStatusColor(doctor.status || 'pending')}>
                  {doctor.status === "verified" && (
                    <Check className="h-3 w-3 mr-1" />
                  )}
                  {doctor.status === "pending" && (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {doctor.status === "suspended" && (
                    <X className="h-3 w-3 mr-1" />
                  )}
                  <span className="capitalize">{doctor.status || 'pending'}</span>
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Joined {new Date(doctor.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            {/* <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button> */}
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
                    <span>{doctor.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{doctor.contactNumber}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{doctor.address || 'No address'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Born{" "}
                      {doctor.dateOfBirth ? new Date(doctor.dateOfBirth).toLocaleDateString() : 'Not specified'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Gender
                      </p>
                      <p>{doctor.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Civil Status
                      </p>
                      <p>{doctor.civilStatus || 'Not specified'}</p>
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
                    <p className="text-sm font-medium text-muted-foreground">
                      PRC ID
                    </p>
                    <p>{doctor.prcId || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      PRC Expiry
                    </p>
                    <p>{doctor.prcExpiryDate ? new Date(doctor.prcExpiryDate).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Medical License
                    </p>
                    <p>{doctor.medicalLicenseNumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Last Login
                    </p>
                    <p>{doctor.lastLogin ? new Date(doctor.lastLogin).toLocaleString() : 'Not specified'}</p>
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
                  {doctor.clinicAffiliations && doctor.clinicAffiliations.length > 0 ? (
                    doctor.clinicAffiliations.map((clinicId, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">Clinic ID: {clinicId}</h4>
                          <p className="text-sm text-muted-foreground">
                            Affiliated Clinic
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="text-sm">Active</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No clinic affiliations</p>
                  )}
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
                  {doctor.education && doctor.education.length > 0 ? (
                    doctor.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">
                          {edu.university || edu.institution || 'Institution not specified'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Graduated {edu.year}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No education information available</p>
                  )}
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
                    <p className="text-muted-foreground">Document management will be available in future updates.</p>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">PRC License</p>
                          <p className="text-xs text-muted-foreground">
                            License Document
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="text-green-600"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          verified
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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
                    {doctor.boardCertifications && doctor.boardCertifications.length > 0 ? (
                      doctor.boardCertifications.map((cert, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <h4 className="font-medium">{cert}</h4>
                          <p className="text-xs text-muted-foreground">Board Certification</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No board certifications listed</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Fellowships
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {doctor.fellowships && doctor.fellowships.length > 0 ? (
                      doctor.fellowships.map((fellow, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <h4 className="font-medium">{fellow}</h4>
                          <p className="text-xs text-muted-foreground">Fellowship</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No fellowships listed</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Accreditations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {doctor.accreditations && doctor.accreditations.length > 0 ? (
                      doctor.accreditations.map((acc, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <h4 className="font-medium">{acc}</h4>
                          <p className="text-xs text-muted-foreground">Accreditation</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No accreditations listed</p>
                    )}
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
              <DoctorInfoBanner
                doctor={{ ...doctor, id: doctor.id?.toString() || '', name: `${doctor.firstName} ${doctor.lastName}` }}
              />
              {scheduleError && (
                <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{scheduleError}</p>
                </div>
              )}
              <div className="grid gap-6 lg:grid-cols-2">
                <ScheduleCard
                  schedules={schedules}
                  onScheduleAdd={handleScheduleAdd}
                  onScheduleEdit={handleScheduleEdit}
                  onScheduleDelete={handleScheduleDelete}
                />

                <ClinicCard
                  clinics={clinics}
                  onClinicAdd={handleClinicAdd}
                  onClinicEdit={handleClinicEdit}
                  onClinicDelete={handleClinicDelete}
                />
              </div>
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
                    <Select
                      value={verificationStatus}
                      onValueChange={setVerificationStatus}
                    >
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
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  {verificationStatus === "verified" && (
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
                            Are you sure you want to verify this doctor? This
                            action will update their status and send them a
                            confirmation email.
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
                  <p className="text-muted-foreground">Verification history will be available in future updates.</p>
                  <div className="border-l-2 border-primary pl-4 pb-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Status Updated</h4>
                      <span className="text-sm text-muted-foreground">
                        {new Date().toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      By: Admin User
                    </p>
                    <p className="text-sm mt-1">Doctor status changed to verified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
