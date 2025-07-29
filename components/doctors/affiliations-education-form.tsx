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
  ClinicAffiliation,
  ClinicScheduleBlock,
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
  clinics: ClinicAffiliation[];
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
  const [isClinicDialogOpen, setIsClinicDialogOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<ClinicAffiliation | null>(
    null
  );

  const handleAddClinic = () => {
    setEditingClinic(null);
    setIsClinicDialogOpen(true);
  };

  const handleEditClinic = (clinic: ClinicAffiliation) => {
    setEditingClinic(clinic);
    setIsClinicDialogOpen(true);
  };

  const handleClinicSave = (clinicData: Omit<ClinicAffiliation, "id">) => {
    if (editingClinic) {
      const updatedClinics = data.clinics.map((c) =>
        c.id === editingClinic.id ? { ...clinicData, id: editingClinic.id } : c
      );
      onUpdate({ clinics: updatedClinics });
    } else {
      const newClinic: ClinicAffiliation = {
        ...clinicData,
        id: Date.now().toString(),
      };
      onUpdate({ clinics: [...data.clinics, newClinic] });
    }
    setIsClinicDialogOpen(false);
  };
  const handleAddEducation = () => {
    // TODO: Open education dialog
    console.log("Add education clicked");
  };

  const handleAddCertification = () => {
    // TODO: Open certification dialog
    console.log("Add certification clicked");
  };

  const removeClinic = (index: number) => {
    const updatedClinics = data.clinics.filter((_, i) => i !== index);
    onUpdate({ clinics: updatedClinics });
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
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNumbers
      .sort()
      .map((num) => dayNames[num])
      .join(", ");
  };

  return (
    <div className="space-y-6">
      {/* Clinic Affiliations */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Clinic Affiliations
              </CardTitle>
              <CardDescription>
                Add hospitals and clinics where the doctor practices
              </CardDescription>
            </div>
            <Button onClick={handleAddClinic} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Clinic
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.clinics.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
              <Building className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">
                No clinic affiliations added
              </p>
              <p className="text-sm text-muted-foreground">
                Click &quot;Add Clinic&quot; to add hospital or clinic affiliations
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.clinics.map((clinic, index) => (
                <div
                  key={clinic.id || index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                      <Building className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{clinic.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {clinic.role}
                        </Badge>
                        {clinic.newClinicDetails && (
                          <Badge variant="outline" className="text-xs">
                            New Clinic
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Since {new Date(clinic.since).toLocaleDateString()}
                      </div>
                      {clinic.schedules && clinic.schedules.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {clinic.schedules
                            .slice(0, 2)
                            .map((schedule, schedIndex) => (
                              <div
                                key={schedIndex}
                                className="flex items-center text-xs text-muted-foreground"
                              >
                                <MapPin className="h-3 w-3 mr-1" />
                                <span className="truncate mr-2">
                                  {schedule.roomOrUnit}
                                </span>
                                <Clock className="h-3 w-3 mr-1" />
                                <span>
                                  {getDayNames(schedule.dayOfWeek)}{" "}
                                  {schedule.startTime}-{schedule.endTime}
                                </span>
                              </div>
                            ))}
                          {clinic.schedules.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{clinic.schedules.length - 2} more schedule
                              {clinic.schedules.length - 2 !== 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClinic(clinic)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeClinic(index)}
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

      <ClinicScheduleDialog
        open={isClinicDialogOpen}
        onOpenChange={setIsClinicDialogOpen}
        affiliation={editingClinic}
        onSave={handleClinicSave}
      />
    </div>
  );
}
