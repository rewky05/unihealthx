import { ref, get, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '@/lib/firebase/config';
import type { 
  Doctor, 
  Clinic, 
  Feedback, 
  User, 
  Appointment, 
  Patient, 
  Referral, 
  DashboardStats 
} from '@/lib/types/database';

export class RealDataService {
  /**
   * Get all specialist doctors from your database
   */
  async getDoctors(): Promise<Doctor[]> {
    try {
      const snapshot = await get(ref(db, 'doctors'));
      if (!snapshot.exists()) return [];
      
      const doctors = snapshot.val();
      const allDoctors = Object.keys(doctors).map(id => ({
        id,
        ...doctors[id]
      }));
      
      // Filter to show only specialists
      return allDoctors.filter(doctor => doctor.isSpecialist === true);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time specialist doctors updates
   */
  subscribeToDoctors(callback: (doctors: Doctor[]) => void): () => void {
    const doctorsRef = ref(db, 'doctors');
    
    const unsubscribe = onValue(doctorsRef, (snapshot) => {
      const doctors: Doctor[] = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach(id => {
          const doctor = { id, ...data[id] };
          // Only include specialists
          if (doctor.isSpecialist === true) {
            doctors.push(doctor);
          }
        });
      }
      callback(doctors);
    });

    return unsubscribe;
  }

  /**
   * Get all clinics from your database
   */
  async getClinics(): Promise<Clinic[]> {
    try {
      const snapshot = await get(ref(db, 'clinics'));
      if (!snapshot.exists()) return [];
      
      const clinics = snapshot.val();
      return Object.keys(clinics).map(id => ({
        id,
        ...clinics[id]
      }));
    } catch (error) {
      console.error('Error fetching clinics:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time clinics updates
   */
  subscribeToClinics(callback: (clinics: Clinic[]) => void): () => void {
    const clinicsRef = ref(db, 'clinics');
    
    const unsubscribe = onValue(clinicsRef, (snapshot) => {
      const clinics: Clinic[] = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach(id => {
          clinics.push({ id, ...data[id] });
        });
      }
      callback(clinics);
    });

    return unsubscribe;
  }

  /**
   * Get all feedback from your database
   */
  async getFeedback(): Promise<Feedback[]> {
    try {
      const snapshot = await get(ref(db, 'feedback'));
      if (!snapshot.exists()) return [];
      
      const feedback = snapshot.val();
      return Object.keys(feedback).map(id => ({
        id,
        ...feedback[id]
      }));
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time feedback updates
   */
  subscribeToFeedback(callback: (feedback: Feedback[]) => void): () => void {
    const feedbackRef = ref(db, 'feedback');
    
    const unsubscribe = onValue(feedbackRef, (snapshot) => {
      const feedback: Feedback[] = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach(id => {
          feedback.push({ id, ...data[id] });
        });
      }
      callback(feedback);
    });

    return unsubscribe;
  }

  /**
   * Get all users from your database
   */
  async getUsers(): Promise<User[]> {
    try {
      const snapshot = await get(ref(db, 'users'));
      if (!snapshot.exists()) return [];
      
      const users = snapshot.val();
      return Object.keys(users).map(id => ({
        id,
        ...users[id]
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get all appointments from your database
   */
  async getAppointments(): Promise<Appointment[]> {
    try {
      const snapshot = await get(ref(db, 'appointments'));
      if (!snapshot.exists()) return [];
      
      const appointments = snapshot.val();
      return Object.keys(appointments).map(id => ({
        id,
        ...appointments[id]
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  /**
   * Get all patients from your database
   */
  async getPatients(): Promise<Patient[]> {
    try {
      const snapshot = await get(ref(db, 'patients'));
      if (!snapshot.exists()) return [];
      
      const patients = snapshot.val();
      return Object.keys(patients).map(id => ({
        id,
        ...patients[id]
      }));
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  }

  /**
   * Get all referrals from your database
   */
  async getReferrals(): Promise<Referral[]> {
    try {
      const snapshot = await get(ref(db, 'referrals'));
      if (!snapshot.exists()) return [];
      
      const referrals = snapshot.val();
      return Object.keys(referrals).map(id => ({
        id,
        ...referrals[id]
      }));
    } catch (error) {
      console.error('Error fetching referrals:', error);
      throw error;
    }
  }

  /**
   * Calculate dashboard statistics from your real data (specialists only)
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [doctors, clinics, feedback, appointments, patients, referrals] = await Promise.all([
        this.getDoctors(), // This now returns only specialists
        this.getClinics(),
        this.getFeedback(),
        this.getAppointments(),
        this.getPatients(),
        this.getReferrals()
      ]);

      // Calculate stats from your real data (specialists only)
      const totalDoctors = doctors.length; // This is now specialists only
      const verifiedDoctors = doctors.filter(d => d.status === 'verified').length;
      const pendingVerification = doctors.filter(d => !d.status || d.status === 'pending').length;
      const suspendedDoctors = doctors.filter(d => d.status === 'suspended').length;

      const totalClinics = clinics.length;
      const activeClinics = clinics.filter(c => c.isActive).length;

      const totalFeedback = feedback.length;
      const averageRating = feedback.length > 0 
        ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length 
        : 0;

      const totalAppointments = appointments.length;
      const completedAppointments = appointments.filter(a => a.status === 'completed').length;
      const pendingAppointments = appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length;

      return {
        totalDoctors,
        verifiedDoctors,
        pendingVerification,
        suspendedDoctors,
        totalClinics,
        activeClinics,
        totalFeedback,
        averageRating,
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        totalPatients: patients.length,
        totalReferrals: referrals.length
      };
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get specialist doctors by specialty
   */
  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    try {
      const doctors = await this.getDoctors(); // This now returns only specialists
      return doctors.filter(doctor => 
        doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    } catch (error) {
      console.error('Error fetching doctors by specialty:', error);
      throw error;
    }
  }

  /**
   * Get feedback by doctor
   */
  async getFeedbackByDoctor(doctorId: string): Promise<Feedback[]> {
    try {
      const feedback = await this.getFeedback();
      return feedback.filter(f => f.providerId === doctorId);
    } catch (error) {
      console.error('Error fetching feedback by doctor:', error);
      throw error;
    }
  }

  /**
   * Get appointments by clinic
   */
  async getAppointmentsByClinic(clinicId: string): Promise<Appointment[]> {
    try {
      const appointments = await this.getAppointments();
      return appointments.filter(a => a.clinicId === clinicId);
    } catch (error) {
      console.error('Error fetching appointments by clinic:', error);
      throw error;
    }
  }

  /**
   * Search specialist doctors by name or specialty
   */
  async searchDoctors(searchTerm: string): Promise<Doctor[]> {
    try {
      const doctors = await this.getDoctors(); // This now returns only specialists
      const term = searchTerm.toLowerCase();
      
      return doctors.filter(doctor => 
        doctor.firstName.toLowerCase().includes(term) ||
        doctor.lastName.toLowerCase().includes(term) ||
        (doctor.fullName && doctor.fullName.toLowerCase().includes(term)) ||
        doctor.specialty.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Error searching doctors:', error);
      throw error;
    }
  }

  /**
   * Get recent activity from adminActivityLogs (if exists) or fallback to system activities
   */
  async getRecentActivity(limit: number = 10): Promise<any[]> {
    try {
      // First try to get admin activity logs
      const snapshot = await get(ref(db, 'adminActivityLogs'));
      if (snapshot.exists()) {
        const activities = snapshot.val();
        const activityList = Object.keys(activities).map(id => ({ id, ...activities[id] }));
        
        // Sort by timestamp (newest first) and limit results
        return activityList
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit);
      }

      // Fallback to system activities if adminActivityLogs doesn't exist yet
      const [appointments, referrals, feedback] = await Promise.all([
        this.getAppointments(),
        this.getReferrals(),
        this.getFeedback()
      ]);

      // Combine and sort by timestamp
      const activities = [
        ...appointments.map(a => ({
          id: a.id,
          type: 'appointment',
          action: `${a.type} appointment ${a.status}`,
          user: `${a.patientFirstName} ${a.patientLastName}`,
          timestamp: a.createdAt,
          details: a
        })),
        ...referrals.map(r => ({
          id: r.id,
          type: 'referral',
          action: `Referral ${r.status}`,
          user: `${r.patientFirstName} ${r.patientLastName}`,
          timestamp: r.referralTimestamp,
          details: r
        })),
        ...feedback.map(f => ({
          id: f.id,
          type: 'feedback',
          action: `Feedback submitted (${f.rating}★)`,
          user: `${f.patientFirstName} ${f.patientLastName}`,
          timestamp: f.timestamp,
          details: f
        }))
      ];

      // Sort by timestamp (newest first) and limit
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }
}

// Export singleton instance
export const realDataService = new RealDataService();