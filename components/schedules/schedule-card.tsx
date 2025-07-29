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
import { Calendar, Plus, Edit, Trash2, Clock, MapPin } from "lucide-react";
import { ScheduleDialog } from "./schedule-dialog";

export interface Schedule {
  id: string;
  day: string;
  clinic: string;
  startTime: string;
  endTime: string;
}

interface ScheduleCardProps {
  schedules: Schedule[];
  onScheduleAdd: (schedule: Omit<Schedule, "id">) => void;
  onScheduleEdit: (schedule: Schedule) => void;
  onScheduleDelete: (scheduleId: string) => void;
}

export function ScheduleCard({
  schedules,
  onScheduleAdd,
  onScheduleEdit,
  onScheduleDelete,
}: ScheduleCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const handleAdd = () => {
    setEditingSchedule(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsDialogOpen(true);
  };

  const handleSave = (scheduleData: Omit<Schedule, "id">) => {
    if (editingSchedule) {
      onScheduleEdit({ ...scheduleData, id: editingSchedule.id });
    } else {
      onScheduleAdd(scheduleData);
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
                <Calendar className="h-5 w-5 mr-2" />
                Weekly Schedule
              </CardTitle>
              {/* <CardDescription>
                Manage weekly availability and time slots
              </CardDescription> */}
            </div>
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No schedules configured</p>
            </div>
          ) : (
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-sm">{schedule.day}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{schedule.clinic}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(schedule)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onScheduleDelete(schedule.id)}
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

      <ScheduleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        schedule={editingSchedule}
        onSave={handleSave}
      />
    </>
  );
}
