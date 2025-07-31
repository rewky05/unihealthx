'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoForm } from '@/components/doctors/personal-info-form';
import { ProfessionalDetailsForm } from '@/components/doctors/professional-details-form';
import { AffiliationsEducationForm } from '@/components/doctors/affiliations-education-form';
import { DocumentUploadsForm } from '@/components/doctors/document-uploads-form';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { RealDataService } from '@/lib/services/real-data.service';

export interface DoctorFormData {
  // Personal Information
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  civilStatus: string;
  avatar?: File | null;

  // Professional Details
  specialty: string;
  subSpecialty: string;
  medicalLicense: string;
  prcId: string;
  prcExpiry: string;
  professionalFee?: number; // Professional fee in Philippine pesos

  // Schedules & Education
  schedules: SpecialistSchedule[];
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiry: string;
  }>;

  // Documents
  documents: Array<{
    name: string;
    type: string;
    file: File;
  }>;
}

export interface SpecialistSchedule {
  id?: string;
  specialistId: string;
  createdAt?: string;
  isActive: boolean;
  lastUpdated?: string;
  practiceLocation: {
    clinicId: string;
    roomOrUnit: string;
  };
  recurrence: {
    dayOfWeek: number[];
    type: string;
  };
  scheduleType: string;
  slotTemplate: {
    [timeSlot: string]: {
      defaultStatus: string;
      durationMinutes: number;
    };
  };
  validFrom: string;
}

export default function AddDoctorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  const [formData, setFormData] = useState<DoctorFormData>({
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    civilStatus: '',
    avatar: null,

    // Professional Details
    specialty: '',
    subSpecialty: '',
    medicalLicense: '',
    prcId: '',
    prcExpiry: '',
    professionalFee: undefined,

    // Schedules & Education
    schedules: [],
    education: [],
    certifications: [],

    // Documents
    documents: []
  });

  const updateFormData = (section: keyof DoctorFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const realDataService = new RealDataService();
      
      // Create doctor data for Firebase
      const doctorData = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        suffix: formData.suffix,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        civilStatus: formData.civilStatus,
        specialty: formData.specialty,
        subSpecialty: formData.subSpecialty,
        medicalLicense: formData.medicalLicense,
        prcId: formData.prcId,
        prcExpiry: formData.prcExpiry,
        professionalFee: formData.professionalFee,
        isSpecialist: true, // Always true for this form
        isGeneralist: false,
        status: 'pending',
        // Add schedules data
        schedules: formData.schedules,
        // Add education and certifications
        education: formData.education,
        certifications: formData.certifications,
        // Add other fields as needed
        accreditations: [], // Can be added later
        fellowships: [], // Can be added later
        yearsOfExperience: 0 // Can be calculated or added later
      };

      // Create doctor in Firebase (users, doctors, and specialistSchedules nodes)
      const { doctorId, temporaryPassword } = await realDataService.createDoctor(doctorData);
      
      console.log('Doctor created successfully with ID:', doctorId);
      console.log('Temporary password:', temporaryPassword);
      
      // Show success message with credentials
      alert(`Doctor created successfully!\n\nEmail: ${formData.email}\nTemporary Password: ${temporaryPassword}\n\nPlease share these credentials with the doctor. They should change their password on first login.`);
      
      // Navigate back to doctors list
      router.push('/doctors');
    } catch (error) {
      console.error('Error creating doctor:', error);
      alert('Error creating doctor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.specialty,
      formData.medicalLicense,
      formData.prcId,
      formData.prcExpiry
    ];
    
    return requiredFields.every(field => field.trim() !== '');
  };

  return (
    <DashboardLayout title="">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/doctors">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <UserPlus className="h-6 w-6 mr-2" />
                Add New Doctor
              </h2>
              <p className="text-muted-foreground">
                Register a new healthcare professional in the system
              </p>
            </div>
          </div>
        </div>

        {/* Form Tabs */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Doctor Registration Form</CardTitle>
            <CardDescription>
              Complete all required information to submit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="affiliations">Schedules</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <PersonalInfoForm
                  data={{
                    firstName: formData.firstName,
                    middleName: formData.middleName,
                    lastName: formData.lastName,
                    suffix: formData.suffix,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    civilStatus: formData.civilStatus,
                    avatar: formData.avatar
                  }}
                  onUpdate={(data) => {
                    setFormData(prev => ({ ...prev, ...data }));
                  }}
                />
              </TabsContent>

              <TabsContent value="professional" className="space-y-6">
                <ProfessionalDetailsForm
                  data={{
                    specialty: formData.specialty,
                    subSpecialty: formData.subSpecialty,
                    medicalLicense: formData.medicalLicense,
                    prcId: formData.prcId,
                    prcExpiry: formData.prcExpiry
                  }}
                  onUpdate={(data) => {
                    setFormData(prev => ({ ...prev, ...data }));
                  }}
                />
              </TabsContent>

              <TabsContent value="affiliations" className="space-y-6">
                <AffiliationsEducationForm
                  data={{
                    schedules: formData.schedules,
                    education: formData.education,
                    certifications: formData.certifications
                  }}
                  onUpdate={(data) => {
                    setFormData(prev => ({ ...prev, ...data }));
                  }}
                />
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <DocumentUploadsForm
                  data={{
                    documents: formData.documents
                  }}
                  onUpdate={(data) => {
                    setFormData(prev => ({ ...prev, ...data }));
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Link href="/doctors">
            <Button variant="outline">
              Cancel
            </Button>
          </Link>
          
          <div className="flex items-center space-x-3">
            <p className="text-sm text-muted-foreground">
              {isFormValid() ? 'Ready to submit' : 'Please complete required fields'}
            </p>
            <Button 
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className="min-w-32"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}