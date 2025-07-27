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
import { Building, Plus, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { ClinicDialog } from "./clinic-dialog";

export interface Clinic {
  id: string;
  name: string;
  days: string;
  hours: string;
  role: string;
}

interface ClinicCardProps {
  clinics: Clinic[];
  onClinicAdd: (clinic: Omit<Clinic, "id">) => void;
  onClinicEdit: (clinic: Clinic) => void;
  onClinicDelete: (clinicId: string) => void;
}

export function ClinicCard({
  clinics,
  onClinicAdd,
  onClinicEdit,
  onClinicDelete,
}: ClinicCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);

  const handleAdd = () => {
    setEditingClinic(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setIsDialogOpen(true);
  };

  const handleSave = (clinicData: Omit<Clinic, "id">) => {
    if (editingClinic) {
      onClinicEdit({ ...clinicData, id: editingClinic.id });
    } else {
      onClinicAdd(clinicData);
    }
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Clinic Affiliations
              </CardTitle>
              <CardDescription>
                Manage clinic partnerships and roles
              </CardDescription>
            </div>
            <Button onClick={handleAdd} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Clinic
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {clinics.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No clinic affiliations</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-sm">{clinic.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {clinic.role}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{clinic.days}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>{clinic.hours}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(clinic)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onClinicDelete(clinic.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ClinicDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        clinic={editingClinic}
        onSave={handleSave}
      />
    </>
  );
}
