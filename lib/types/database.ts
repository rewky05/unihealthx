// Types matching your exact Firebase database structure

export interface BaseEntity {
  id?: string;
  createdAt?: string;
  lastUpdated?: string;
}

// Doctors from your database
export interface Doctor {
  id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email?: string;
  contactNumber?: string;
  specialty: string;
  isGeneralist: boolean;
  isSpecialist: boolean;
  clinicAffiliations: string[];
  
  // Extended fields for complete doctor records
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  civilStatus?: string;
  education?: Array<{
    degree: string;
    university?: string;
    institution?: string;
    year: string;
  }>;
  boardCertifications?: string[];
  fellowships?: string[];
  accreditations?: string[];
  medicalLicenseNumber?: string;
  prcId?: string;
  prcExpiryDate?: string;
  yearsOfExperience?: number;
  profileImageUrl?: string;
  status?: 'verified' | 'pending' | 'suspended' | 'rejected';
  verificationDate?: string;
  verificationNotes?: string;
  verifiedByAdminId?: string;
  lastLogin?: string;
  lastUpdated?: string;
  createdAt?: string;
}

// Clinics from your database
export interface Clinic {
  id?: string;
  name: string;
  addressLine: string;
  contactNumber: string;
  type: 'hospital' | 'multi_specialty_clinic' | 'community_clinic';
  isActive: boolean;
}

// Feedback from your database
export interface Feedback {
  id?: string;
  patientFirstName: string;
  patientLastName: string;
  patientId: string;
  providerId: string;
  providerFirstName: string;
  providerLastName: string;
  clinicId: string;
  clinicName: string;
  practiceLocationName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comments: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  clinicAppointmentId: string;
  referralId?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  submittedBy: {
    role: string;
    userId: string;
  };
  timestamp: string;
}

// Users from your database
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'generalist' | 'specialist' | 'clinic_staff' | 'lab_technician' | 'billing_clerk' | 'patient';
  clinicAffiliations?: string[];
  department?: string;
  contactNumber?: string;
  specialty?: string;
  patientId?: string;
  address?: string;
  createdAt?: string;
}

// Appointments from your database
export interface Appointment {
  id?: string;
  patientId: string;
  patientFirstName: string;
  patientLastName: string;
  doctorId?: string;
  doctorFirstName?: string;
  doctorLastName?: string;
  clinicId: string;
  clinicName: string;
  appointmentDate: string;
  appointmentTime: string;
  type: 'general_consultation' | 'emergency_assessment' | 'lab_booking' | 'walk_in';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  specialty?: string;
  notes?: string;
  patientComplaint?: string[];
  bookedByUserId: string;
  bookedByUserFirstName: string;
  bookedByUserLastName: string;
  createdAt: string;
  lastUpdated: string;
  sourceSystem: string;
  relatedReferralId?: string;
}

// Patients from your database
export interface Patient {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodType?: string;
  allergies?: string[];
  medicalConditions?: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
  lastUpdated: string;
}

// Referrals from your database
export interface Referral {
  id?: string;
  patientId: string;
  patientFirstName: string;
  patientLastName: string;
  referringGeneralistId: string;
  referringGeneralistFirstName: string;
  referringGeneralistLastName: string;
  assignedSpecialistId: string;
  assignedSpecialistFirstName: string;
  assignedSpecialistLastName: string;
  clinicAppointmentId: string;
  initialReasonForReferral: string;
  generalistNotes: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'pending_acceptance' | 'confirmed' | 'completed' | 'cancelled';
  referralTimestamp: string;
  lastUpdated: string;
  patientArrivalConfirmed: boolean;
  practiceLocation: {
    clinicId: string;
    roomOrUnit: string;
  };
  referringClinicId: string;
  referringClinicName: string;
  sourceSystem: string;
  specialistScheduleId: string;
  scheduleSlotPath: string;
}

// Dashboard stats derived from your data
export interface DashboardStats {
  totalDoctors: number;
  verifiedDoctors: number;
  pendingVerification: number;
  suspendedDoctors: number;
  totalClinics: number;
  activeClinics: number;
  totalFeedback: number;
  averageRating: number;
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  totalPatients: number;
  totalReferrals: number;
}

// Activity log for tracking changes
export interface ActivityLog {
  userId: string;
  userEmail: string;
  action: string;
  category: 'doctor' | 'clinic' | 'feedback' | 'appointment' | 'patient' | 'system';
  targetType: 'doctor' | 'clinic' | 'feedback' | 'appointment' | 'patient';
  targetId: string;
  details: Record<string, any>;
  timestamp: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Filter types
export interface DoctorFilters {
  specialty?: string;
  status?: string;
  clinic?: string;
  isGeneralist?: boolean;
  isSpecialist?: boolean;
  search?: string;
}

export interface FeedbackFilters {
  rating?: number;
  clinicId?: string;
  providerId?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface AppointmentFilters {
  status?: string;
  type?: string;
  clinicId?: string;
  doctorId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}