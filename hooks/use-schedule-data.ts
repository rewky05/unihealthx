'use client';

import { useState } from 'react';
import type { Schedule } from '@/components/schedules/schedule-card';
import type { Clinic } from '@/components/schedules/clinic-card';

const mockDoctors = [
  { id: 'maria', name: 'Dr. Maria Santos', specialty: 'Cardiology' },
  { id: 'juan', name: 'Dr. Juan Rodriguez', specialty: 'Pediatrics' },
  { id: 'ana', name: 'Dr. Ana Villanueva', specialty: 'Dermatology' },
];

const defaultSchedules: Schedule[] = [
  { id: '1', day: 'Monday', clinic: 'Cebu Medical Center', startTime: '09:00', endTime: '17:00' },
  { id: '2', day: 'Tuesday', clinic: 'Metro Cebu Hospital', startTime: '09:00', endTime: '17:00' },
  { id: '3', day: 'Wednesday', clinic: 'Skin Care Clinic', startTime: '09:00', endTime: '17:00' },
  { id: '4', day: 'Thursday', clinic: 'Cebu Medical Center', startTime: '09:00', endTime: '17:00' },
  { id: '5', day: 'Friday', clinic: 'Metro Cebu Hospital', startTime: '09:00', endTime: '17:00' },
];

const defaultClinics: Clinic[] = [
  {
    id: '1',
    name: 'Cebu Medical Center',
    days: 'Mon, Wed, Fri',
    hours: '09:00-17:00',
    role: 'Senior Consultant'
  },
  {
    id: '2',
    name: 'Metro Cebu Hospital',
    days: 'Tue, Thu',
    hours: '14:00-18:00',
    role: 'Visiting Consultant'
  },
  {
    id: '3',
    name: 'Skin Care Clinic',
    days: 'Sat',
    hours: '08:00-12:00',
    role: 'Consultant'
  },
];

export function useScheduleData() {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    // Simulate loading doctor's data
    if (doctorId) {
      setSchedules(defaultSchedules);
      setClinics(defaultClinics);
    } else {
      setSchedules([]);
      setClinics([]);
    }
  };

  const handleScheduleAdd = (scheduleData: Omit<Schedule, 'id'>) => {
    const newSchedule: Schedule = {
      ...scheduleData,
      id: Date.now().toString()
    };
    setSchedules(prev => [...prev, newSchedule]);
  };

  const handleScheduleEdit = (updatedSchedule: Schedule) => {
    setSchedules(prev => prev.map(s => s.id === updatedSchedule.id ? updatedSchedule : s));
  };

  const handleScheduleDelete = (scheduleId: string) => {
    setSchedules(prev => prev.filter(s => s.id !== scheduleId));
  };

  const handleClinicAdd = (clinicData: Omit<Clinic, 'id'>) => {
    const newClinic: Clinic = {
      ...clinicData,
      id: Date.now().toString()
    };
    setClinics(prev => [...prev, newClinic]);
  };

  const handleClinicEdit = (updatedClinic: Clinic) => {
    setClinics(prev => prev.map(c => c.id === updatedClinic.id ? updatedClinic : c));
  };

  const handleClinicDelete = (clinicId: string) => {
    setClinics(prev => prev.filter(c => c.id !== clinicId));
  };

  const selectedDoctorData = mockDoctors.find(doc => doc.id === selectedDoctor);

  return {
    doctors: mockDoctors,
    selectedDoctor,
    selectedDoctorData,
    schedules,
    clinics,
    handleDoctorSelect,
    handleScheduleAdd,
    handleScheduleEdit,
    handleScheduleDelete,
    handleClinicAdd,
    handleClinicEdit,
    handleClinicDelete,
  };
}