'use client';

import { useState, useEffect } from 'react';
import { ref, get, set, push, remove, onValue } from 'firebase/database';
import { db } from '@/lib/firebase/config';
import type { Schedule } from '@/components/schedules/schedule-card';
import type { Clinic } from '@/components/schedules/clinic-card';

export function useScheduleData(doctorId?: string) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load schedules and clinics for the doctor
  useEffect(() => {
    if (!doctorId) return;

    setLoading(true);
    setError(null);

    // Listen to schedules
    const schedulesRef = ref(db, `schedules/${doctorId}`);
    const schedulesUnsubscribe = onValue(schedulesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const schedulesList = Object.keys(data).map(id => ({
          id,
          ...data[id]
        }));
        setSchedules(schedulesList);
      } else {
        setSchedules([]);
      }
    }, (error) => {
      console.error('Error loading schedules:', error);
      setError('Failed to load schedules');
    });

    // Listen to clinics
    const clinicsRef = ref(db, `clinics/${doctorId}`);
    const clinicsUnsubscribe = onValue(clinicsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const clinicsList = Object.keys(data).map(id => ({
          id,
          ...data[id]
        }));
        setClinics(clinicsList);
      } else {
        setClinics([]);
      }
    }, (error) => {
      console.error('Error loading clinics:', error);
      setError('Failed to load clinics');
    });

    setLoading(false);

    return () => {
      schedulesUnsubscribe();
      clinicsUnsubscribe();
    };
  }, [doctorId]);

  const handleScheduleAdd = async (scheduleData: Omit<Schedule, 'id'>) => {
    if (!doctorId) return;

    try {
      const schedulesRef = ref(db, `schedules/${doctorId}`);
      const newScheduleRef = push(schedulesRef);
      await set(newScheduleRef, {
        ...scheduleData,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding schedule:', error);
      setError('Failed to add schedule');
    }
  };

  const handleScheduleEdit = async (updatedSchedule: Schedule) => {
    if (!doctorId) return;

    try {
      const scheduleRef = ref(db, `schedules/${doctorId}/${updatedSchedule.id}`);
      await set(scheduleRef, {
        ...updatedSchedule,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating schedule:', error);
      setError('Failed to update schedule');
    }
  };

  const handleScheduleDelete = async (scheduleId: string) => {
    if (!doctorId) return;

    try {
      const scheduleRef = ref(db, `schedules/${doctorId}/${scheduleId}`);
      await remove(scheduleRef);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      setError('Failed to delete schedule');
    }
  };

  const handleClinicAdd = async (clinicData: Omit<Clinic, 'id'>) => {
    if (!doctorId) return;

    try {
      const clinicsRef = ref(db, `clinics/${doctorId}`);
      const newClinicRef = push(clinicsRef);
      await set(newClinicRef, {
        ...clinicData,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding clinic:', error);
      setError('Failed to add clinic');
    }
  };

  const handleClinicEdit = async (updatedClinic: Clinic) => {
    if (!doctorId) return;

    try {
      const clinicRef = ref(db, `clinics/${doctorId}/${updatedClinic.id}`);
      await set(clinicRef, {
        ...updatedClinic,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating clinic:', error);
      setError('Failed to update clinic');
    }
  };

  const handleClinicDelete = async (clinicId: string) => {
    if (!doctorId) return;

    try {
      const clinicRef = ref(db, `clinics/${doctorId}/${clinicId}`);
      await remove(clinicRef);
    } catch (error) {
      console.error('Error deleting clinic:', error);
      setError('Failed to delete clinic');
    }
  };

  return {
    schedules,
    clinics,
    loading,
    error,
    handleScheduleAdd,
    handleScheduleEdit,
    handleScheduleDelete,
    handleClinicAdd,
    handleClinicEdit,
    handleClinicDelete,
  };
}
