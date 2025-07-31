"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  GraduationCap,
  Award,
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { ClinicScheduleDialog } from "./clinic-schedule-dialog";
import type {
  SpecialistSchedule,
} from "@/app/doctors/add/page";
import Link from "next/link";

interface Education {
  degree: string;
  school: string;
  year: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiry: string;
}

interface AffiliationsEducationData {
  schedules: SpecialistSchedule[];
  education: Education[];
  certifications: Certification[];
}

interface AffiliationsEducationFormProps {
  data: AffiliationsEducationData;
  onUpdate: (data: Partial<AffiliationsEducationData>) => void;
}

export function AffiliationsEducationForm({
  data,
  onUpdate,
}: AffiliationsEducationFormProps) {
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  const handleAddSchedule = () => {
    setIsScheduleDialogOpen(true);
  };

  const handleEditSchedule = (schedule: SpecialistSchedule) => {
    // For now, we'll just open the dialog with all schedules
    // The dialog will handle editing individual schedules
    setIsScheduleDialogOpen(true);
  };

  const handleScheduleSave = (scheduleData: Omit<SpecialistSchedule, "id">) => {
    // This function is no longer needed as the dialog handles all schedule management
    // The onSave callback from the dialog will update all schedules at once
  };
  const handleAddEducation = () => {
    // TODO: Open education dialog
    console.log("Add education clicked");
  };

  const handleAddCertification = () => {
    // TODO: Open certification dialog
    console.log("Add certification clicked");
  };

  const removeSchedule = (index: number) => {
    const updatedSchedules = data.schedules.filter((_, i) => i !== index);
    onUpdate({ schedules: updatedSchedules });
  };

  const removeEducation = (index: number) => {
    const updatedEducation = data.education.filter((_, i) => i !== index);
    onUpdate({ education: updatedEducation });
  };

  const removeCertification = (index: number) => {
    const updatedCertifications = data.certifications.filter(
      (_, i) => i !== index
    );
    onUpdate({ certifications: updatedCertifications });
  };

  const getDayNames = (dayNumbers: number[]) => {
    if (!dayNumbers || !Array.isArray(dayNumbers)) {
      return 'No days specified';
    }
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNumbers
      .sort()
      .map((num) => dayNames[num])
      .join(", ");
  };

  return (
    <div className="space-y-6">
      {/* Schedule Management */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Management
              </CardTitle>
              <CardDescription>
                Add doctor&apos;s availability and clinic schedules
              </CardDescription>
            </div>
            <Button onClick={handleAddSchedule} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.schedules.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
              <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">
                No schedules configured
              </p>
              <p className="text-sm text-muted-foreground">
                Click &quot;Add Schedule&quot; to set up doctor availability
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.schedules.map((schedule, index) => (
                <div
                  key={schedule.id || index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{schedule.practiceLocation?.roomOrUnit || 'No room specified'}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          Clinic ID: {schedule.practiceLocation?.clinicId || 'No clinic'}
                        </Badge>
                        {schedule.isActive ? (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {getDayNames(schedule.recurrence?.dayOfWeek || [])}
                      </div>
                      {schedule.slotTemplate && Object.keys(schedule.slotTemplate).length > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {Object.keys(schedule.slotTemplate).length} time slots
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>
                              Valid from {schedule.validFrom ? new Date(schedule.validFrom).toLocaleDateString() : 'Not set'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditSchedule(schedule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSchedule(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Education & Training */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Education & Training
              </CardTitle>
              <CardDescription>
                Add medical education, residency, and fellowship information
              </CardDescription>
            </div>
            <Button onClick={handleAddEducation} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.education.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
              <GraduationCap className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">
                No education records added
              </p>
              <p className="text-sm text-muted-foreground">
                Click &quot;Add Education&quot; to add medical school, residency, or
                fellowship information
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.education.map((edu, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">
                        {edu.school}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Graduated {edu.year}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEducation(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Board Certifications */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Board Certifications
              </CardTitle>
              <CardDescription>
                Add professional board certifications and specializations
              </CardDescription>
            </div>
            <Button
              onClick={handleAddCertification}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.certifications.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
              <Award className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">
                No certifications added
              </p>
              <p className="text-sm text-muted-foreground">
                Click &quot;Add Certification&quot; to add board certifications and
                professional credentials
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">{cert.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span>
                          Issued: {new Date(cert.date).toLocaleDateString()}
                        </span>
                        <span>
                          Expires: {new Date(cert.expiry).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCertification(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Dialog */}
      {isScheduleDialogOpen && (
        <ClinicScheduleDialog
          open={isScheduleDialogOpen}
          onOpenChange={setIsScheduleDialogOpen}
          existingSchedules={data.schedules}
          onSave={(schedules) => {
            // Update all schedules at once
            onUpdate({ schedules });
          }}
        />
      )}
    </div>
  );
}
