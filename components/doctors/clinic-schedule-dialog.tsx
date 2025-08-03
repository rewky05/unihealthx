'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Building, Plus, Trash2, Calendar, Clock, MapPin, Check, ChevronsUpDown } from 'lucide-react';
import { cn, formatDateToText } from '@/lib/utils';
import type { SpecialistSchedule } from '@/app/doctors/add/page';
import { useRealClinics } from '@/hooks/useRealData';

interface ClinicScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingSchedules: SpecialistSchedule[];
  onSave: (schedules: SpecialistSchedule[]) => void;
  specialistId?: string; // Add specialistId prop
}



const CLINIC_TYPES = ['hospital', 'multi_specialty_clinic', 'community_clinic', 'private_clinic'];
const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' }
];

export function ClinicScheduleDialog({ open, onOpenChange, existingSchedules, onSave, specialistId }: ClinicScheduleDialogProps) {
  const [clinicSearchOpen, setClinicSearchOpen] = useState(false);
  const [clinicSearchValue, setClinicSearchValue] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [isNewClinic, setIsNewClinic] = useState(false);
  
  // Get real clinic data from Firebase
  const { clinics, loading: clinicsLoading } = useRealClinics();
  

  
  // Fallback mapping for old hardcoded clinic IDs
  const clinicIdMapping: { [key: string]: string } = {
    'clin_cebu_central_id': 'Cebu Medical Center',
    'clin_cebu_doctors_id': 'Metro Cebu Hospital',
    'clin_lahug_uhc_id': 'Skin Care Clinic',
    'clin_perpetual_succour_id': 'Cebu Medical Center'
  };
  
  // Local state for managing schedule blocks during editing
  const [localSchedules, setLocalSchedules] = useState<SpecialistSchedule[]>([]);
  
  const [formData, setFormData] = useState({
    clinicId: '',
    roomOrUnit: '',
    dayOfWeek: [] as number[],
    startTime: '',
    endTime: '',
    slotDurationMinutes: 30,
    validFrom: '',
    isActive: true,
    newClinicDetails: {
      name: '',
      addressLine: '',
      contactNumber: '',
      type: ''
    }
  });

  // Helper function to test slotTemplate generation
  const testSlotTemplateGeneration = () => {
    // Test case: 8 AM to 10 AM with 30-minute slots
    const testStartTime = '08:00';
    const testEndTime = '10:00';
    const testDuration = 30;
    
    const startHour = parseInt(testStartTime.split(':')[0]);
    const startMinute = parseInt(testStartTime.split(':')[1]);
    const endHour = parseInt(testEndTime.split(':')[0]);
    const endMinute = parseInt(testEndTime.split(':')[1]);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    const testSlotTemplate: { [key: string]: { defaultStatus: string; durationMinutes: number } } = {};
    
    for (let time = startMinutes; time < endMinutes; time += testDuration) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      const time24h = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const time12h = convertTo12Hour(time24h);
      
      const slotEndTime = time + testDuration;
      if (slotEndTime <= endMinutes) {
        testSlotTemplate[time12h] = {
          defaultStatus: 'available',
          durationMinutes: testDuration
        };
      }
    }
    

    
    return testSlotTemplate;
  };

  // Initialize local schedules when dialog opens
  useEffect(() => {
    if (open) {
      setLocalSchedules([...existingSchedules]);
      resetForm();
      
      // Test slotTemplate generation (for development only)
      testSlotTemplateGeneration();
    }
  }, [open, existingSchedules]);

  // Helper function to convert 12-hour format to 24-hour format
  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = modifier === 'PM' ? '12' : '00';
    } else if (modifier === 'PM') {
      hours = (parseInt(hours) + 12).toString();
    } else {
      hours = hours.padStart(2, '0');
    }
    
    return `${hours}:${minutes}`;
  };

  // Helper function to convert 24-hour format to 12-hour format
  const convertTo12Hour = (time24h: string): string => {
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  // Helper function to format date consistently
  const formatDate = (dateString: string) => {
    return formatDateToText(dateString);
  };

  const resetForm = () => {
    setSelectedClinic(null);
    setIsNewClinic(false);
    setClinicSearchValue('');
    setFormData({
      clinicId: '',
      roomOrUnit: '',
      dayOfWeek: [],
      startTime: '',
      endTime: '',
      slotDurationMinutes: 30,
      validFrom: new Date().toISOString().split('T')[0],
      isActive: true,
      newClinicDetails: {
        name: '',
        addressLine: '',
        contactNumber: '',
        type: ''
      }
    });
  };

  const handleClinicSelect = (clinic: any) => {
    if (clinic) {
      setSelectedClinic(clinic);
      setIsNewClinic(false);
      setClinicSearchValue(clinic.name);
    }
    setClinicSearchOpen(false);
  };

  const handleNewClinicSelect = (name: string) => {
    setSelectedClinic(null);
    setIsNewClinic(true);
    setClinicSearchValue(name);
    setFormData(prev => ({
      ...prev,
      clinicId: '',
      roomOrUnit: '',
      dayOfWeek: [],
      startTime: '',
      endTime: '',
      slotDurationMinutes: 30,
      validFrom: new Date().toISOString().split('T')[0],
      isActive: true,
      newClinicDetails: {
        name: name,
        addressLine: '',
        contactNumber: '',
        type: ''
      }
    }));
    setClinicSearchOpen(false);
  };

  const addScheduleBlock = () => {
    if (selectedClinic && 
        formData.roomOrUnit && 
        formData.dayOfWeek && formData.dayOfWeek.length > 0 &&
        formData.startTime && 
        formData.endTime && 
        formData.validFrom) {
      
      // Generate slot template from start/end times in 12-hour format
      const slotTemplate: { [key: string]: { defaultStatus: string; durationMinutes: number } } = {};
      
      // Parse start and end times (they come in 24-hour format from the time input)
      const startHour = parseInt(formData.startTime.split(':')[0]);
      const startMinute = parseInt(formData.startTime.split(':')[1]);
      const endHour = parseInt(formData.endTime.split(':')[0]);
      const endMinute = parseInt(formData.endTime.split(':')[1]);
      
      // Convert start and end times to minutes for easier calculation
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      
      // Generate time slots based on duration
      for (let time = startMinutes; time < endMinutes; time += formData.slotDurationMinutes) {
        const hour = Math.floor(time / 60);
        const minute = time % 60;
        const time24h = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const time12h = convertTo12Hour(time24h);
        
        // Only add slot if it doesn't exceed the end time
        const slotEndTime = time + formData.slotDurationMinutes;
        if (slotEndTime <= endMinutes) {
          slotTemplate[time12h] = {
            defaultStatus: 'available',
            durationMinutes: formData.slotDurationMinutes
          };
        }
      }
      

      

      
      const newSchedule: SpecialistSchedule = {
        id: `sch_${Date.now()}`,
        specialistId: specialistId || 'temp_specialist_id',
        practiceLocation: {
          clinicId: selectedClinic?.id || '',
          roomOrUnit: formData.roomOrUnit
        },
        recurrence: {
          dayOfWeek: formData.dayOfWeek,
          type: 'weekly'
        },
        scheduleType: 'Weekly',
        slotTemplate: slotTemplate,
        validFrom: formData.validFrom,
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      // Add to local schedules instead of saving immediately
      setLocalSchedules(prev => [...prev, newSchedule]);
      
      // Reset form for next schedule block
      resetForm();
    }
  };

  const removeScheduleBlock = (scheduleId: string) => {
    setLocalSchedules(prev => prev.filter(sch => sch.id && sch.id !== scheduleId));
  };

  const handleDayToggle = (dayValue: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dayOfWeek: checked 
        ? [...(prev.dayOfWeek || []), dayValue]
        : (prev.dayOfWeek || []).filter(d => d !== dayValue)
    }));
  };

  const getDayNames = (dayNumbers: number[]) => {
    if (!dayNumbers || !Array.isArray(dayNumbers)) {
      return 'No days specified';
    }
    return dayNumbers
      .sort()
      .map(num => DAYS_OF_WEEK.find(d => d.value === num)?.label)
      .filter(Boolean)
      .join(', ');
  };

  const handleSave = () => {
    // Save all local schedules at once
    onSave(localSchedules);
    onOpenChange(false);
  };

  const isFormValid = () => {
    // Allow saving if there's at least one schedule block
    if (localSchedules.length > 0) {
      return true;
    }
    
    // If no schedule blocks yet, require form to be filled
    const hasClinic = selectedClinic || (isNewClinic && clinicSearchValue);
    const hasBasicInfo = formData.roomOrUnit && formData.dayOfWeek.length > 0 && formData.startTime && formData.endTime && formData.validFrom;
    
    return hasClinic && hasBasicInfo;
  };

  const isScheduleValid = () => {
    return selectedClinic && 
           !clinicsLoading &&
           formData.roomOrUnit && 
           formData.dayOfWeek && formData.dayOfWeek.length > 0 &&
           formData.startTime && 
           formData.endTime && 
           formData.validFrom;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Manage Schedule Blocks
          </DialogTitle>
          <DialogDescription>
            Add and manage multiple schedule blocks for this doctor. Click "Add Schedule Block" to add a new block, then "Save" when done.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Clinic Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Clinic Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Clinic *</Label>
                <Popover open={clinicSearchOpen} onOpenChange={setClinicSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={clinicSearchOpen}
                      disabled={clinicsLoading}
                      className={cn(
                        "w-full justify-between",
                        !selectedClinic && "border-red-300 focus:border-red-500"
                      )}
                    >
                      {clinicsLoading ? "Loading clinics..." : clinicSearchValue || "Search or add clinic..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Search clinics..." 
                        value={clinicSearchValue}
                        onValueChange={setClinicSearchValue}
                      />
                      <CommandList>
                        <CommandEmpty>
                          <div className="p-2">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => handleNewClinicSelect(clinicSearchValue)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add new clinic: &quot;{clinicSearchValue}&quot;
                            </Button>
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          {clinics
                            .filter(clinic => 
                              clinic.name.toLowerCase().includes(clinicSearchValue.toLowerCase())
                            )
                            .map((clinic) => (
                              <CommandItem
                                key={clinic.id}
                                onSelect={() => handleClinicSelect(clinic)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedClinic?.id === clinic.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div>
                                  <div className="font-medium">{clinic.name}</div>
                                  <div className="text-sm text-muted-foreground">{clinic.addressLine}</div>
                                </div>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedClinic && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <Check className="h-4 w-4" />
                    <span>Selected: {selectedClinic.name}</span>
                  </div>
                )}
                {!selectedClinic && (
                  <div className="text-sm text-red-600">
                    Please select a clinic to continue
                  </div>
                )}
              </div>

              {/* New Clinic Details - Only show when adding new clinic */}
              {isNewClinic && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">New Clinic Details</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Clinic Name</Label>
                      <Input
                        placeholder="Enter clinic name"
                        value={formData.newClinicDetails.name}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          newClinicDetails: { ...prev.newClinicDetails, name: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Clinic Type</Label>
                      <Select 
                        value={formData.newClinicDetails.type} 
                        onValueChange={(value) => setFormData(prev => ({ 
                          ...prev, 
                          newClinicDetails: { ...prev.newClinicDetails, type: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select clinic type" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Hospital', 'Clinic', 'Medical Center', 'Specialty Center'].map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Schedule Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Configuration
              </CardTitle>
              <CardDescription>
                Add new schedule blocks for this doctor. Each block represents a different clinic or time slot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Show existing schedules */}
              {localSchedules.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Current Schedule Blocks ({localSchedules.length})</h4>
                  {localSchedules.map((schedule, index) => (
                    <div key={schedule.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Schedule Block {index + 1}</h5>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => schedule.id && removeScheduleBlock(schedule.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                                             <div className="grid gap-2 text-sm">
                         <div><strong>Clinic:</strong> {
                           (() => {
                             const clinic = clinics.find(c => c.id === schedule.practiceLocation?.clinicId);
                             
                             if (clinic) {
                               return clinic.name;
                             } else if (schedule.practiceLocation?.clinicId && clinicIdMapping[schedule.practiceLocation.clinicId]) {
                               return clinicIdMapping[schedule.practiceLocation.clinicId];
                             } else {
                               return `Unknown Clinic (ID: ${schedule.practiceLocation?.clinicId})`;
                             }
                           })()
                         }</div>
                         <div><strong>Room:</strong> {schedule.practiceLocation?.roomOrUnit || 'Not specified'}</div>
                         <div><strong>Days:</strong> {getDayNames(schedule.recurrence?.dayOfWeek || [])}</div>
                         <div><strong>Time Slots:</strong> {Object.keys(schedule.slotTemplate || {}).length} slots</div>
                                                   <div><strong>Valid From:</strong> {schedule.validFrom ? formatDateToText(schedule.validFrom) : 'Not set'}</div>
                       </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new schedule block */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium">Add New Schedule Block</h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Room/Unit</Label>
                    <Input
                      placeholder="e.g., Cardiology Clinic, Rm 501"
                      value={formData.roomOrUnit || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, roomOrUnit: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valid From</Label>
                    <Input
                      type="date"
                      value={formData.validFrom || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Days of Week</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={(formData.dayOfWeek || []).includes(day.value)}
                          onCheckedChange={(checked) => handleDayToggle(day.value, checked as boolean)}
                        />
                        <Label htmlFor={`day-${day.value}`} className="text-sm">
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={formData.startTime || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={formData.endTime || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slot Duration (minutes)</Label>
                    <Select 
                      value={formData.slotDurationMinutes?.toString() || '30'} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, slotDurationMinutes: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={addScheduleBlock} 
                  disabled={!isScheduleValid()}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add This Schedule Block
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid()}>
            Save All Schedule Blocks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}