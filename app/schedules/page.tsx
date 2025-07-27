"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DoctorSelector } from "@/components/schedules/doctor-selector";
import { EmptyState } from "@/components/schedules/empty-state";
import { DoctorInfoBanner } from "@/components/schedules/doctor-info-banner";
import { ScheduleCard } from "@/components/schedules/schedule-card";
import { ClinicCard } from "@/components/schedules/clinic-card";
import { useScheduleData } from "@/hooks/use-schedule-data";

export default function SchedulePage() {
  const {
    doctors,
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
  } = useScheduleData();

  return (
    <DashboardLayout title="">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Schedule Management</h2>
            <p className="text-muted-foreground">
              Manage doctor availability and clinic schedules
            </p>
          </div>
          <DoctorSelector
            doctors={doctors}
            selectedDoctor={selectedDoctor}
            onDoctorSelect={handleDoctorSelect}
          />
        </div>

        {/* Content */}
        {!selectedDoctor ? (
          <EmptyState />
        ) : (
          selectedDoctorData && (
            <div className="space-y-6">
              <DoctorInfoBanner doctor={selectedDoctorData} />

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
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
}
