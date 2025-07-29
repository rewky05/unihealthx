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
import { cn } from '@/lib/utils';
import type { SpecialistSchedule } from '@/app/doctors/add/page';

interface ClinicScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: SpecialistSchedule | null;
  onSave: (schedule: Omit<SpecialistSchedule, 'id'>) => void;
}

// Mock clinic data based on the provided schema
const EXISTING_CLINICS = [
  {
    id: 'clin_cebu_central_id',
    name: 'UniHealth Central Clinic',
    addressLine: 'Ayala Center Cebu, Archbishop Reyes Ave, Cebu City',
    contactNumber: '+63324123456',
    type: 'multi_specialty_clinic'
  },
  {
    id: 'clin_cebu_doctors_id',
    name: 'Cebu Doctors\' University Hospital',
    addressLine: 'Osmeña Blvd, Capitol Site, Cebu City, 6000 Cebu, Philippines',
    contactNumber: '+63322537500',
    type: 'hospital'
  },
  {
    id: 'clin_lahug_uhc_id',
    name: 'Lahug Urban Health Center',
    addressLine: 'Salinas Drive, Lahug, Cebu City, 6000 Cebu, Philippines',
    contactNumber: '+63322312345',
    type: 'community_clinic'
  },
  {
    id: 'clin_perpetual_succour_id',
    name: 'Perpetual Succour Hospital',
    addressLine: 'Gorordo Ave, Cebu City, 6000 Cebu, Philippines',
    contactNumber: '+63322338620',
    type: 'hospital'
  }
];

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

export function ClinicScheduleDialog({ open, onOpenChange, schedule, onSave }: ClinicScheduleDialogProps) {
  const [clinicSearchOpen, setClinicSearchOpen] = useState(false);
  const [clinicSearchValue, setClinicSearchValue] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<typeof EXISTING_CLINICS[0] | null>(null);
  const [isNewClinic, setIsNewClinic] = useState(false);
  
  const [formData, setFormData] = useState({
    clinicId: '',
    roomOrUnit: '',
    dayOfWeek: [] as number[],
    startTime: '',
    endTime: '',
    slotDurationMinutes: 30,
    validFrom: '',
    isActive: true,
    newClinicDetails: { // Added for new clinic details
      name: '',
      addressLine: '',
      contactNumber: '',
      type: ''
    }
  });

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
    // Parse the date as local date to avoid timezone conversion
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = date.getDate().toString().padStart(2, '0');
    const yearStr = date.getFullYear();
    return `${monthStr}/${dayStr}/${yearStr}`;
  };

  useEffect(() => {
    if (schedule) {
      // Extract start and end times from slotTemplate
      const slotKeys = Object.keys(schedule.slotTemplate || {});
      const sortedKeys = slotKeys.sort();
      const startTime12h = sortedKeys[0] || '';
      const endTime12h = sortedKeys[sortedKeys.length - 1] || '';
      
      // Convert to 24-hour format for HTML time input
      const startTime = startTime12h ? convertTo24Hour(startTime12h) : '';
      const endTime = endTime12h ? convertTo24Hour(endTime12h) : '';
      
      // Pre-fill form with existing schedule data
      setFormData({
        clinicId: schedule.practiceLocation?.clinicId || '',
        roomOrUnit: schedule.practiceLocation?.roomOrUnit || '',
        dayOfWeek: schedule.recurrence?.dayOfWeek || [],
        startTime: startTime,
        endTime: endTime,
        slotDurationMinutes: Object.values(schedule.slotTemplate || {})[0]?.durationMinutes || 30,
        validFrom: schedule.validFrom || new Date().toISOString().split('T')[0],
        isActive: schedule.isActive,
        newClinicDetails: { // Pre-fill new clinic details if they exist
          name: '',
          addressLine: '',
          contactNumber: '',
          type: ''
        }
      });
      
      // Set selected clinic
      const clinic = EXISTING_CLINICS.find(c => c.id === schedule.practiceLocation?.clinicId);
      setSelectedClinic(clinic || null);
      setClinicSearchValue(clinic?.name || '');
    } else {
      resetForm();
    }
  }, [schedule, open]);

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

  const handleClinicSelect = (clinic: typeof EXISTING_CLINICS[0] | null) => {
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
      clinicId: '', // New clinic means no existing clinic ID
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
    if (formData.roomOrUnit && 
        formData.dayOfWeek && formData.dayOfWeek.length > 0 &&
        formData.startTime && 
        formData.endTime && 
        formData.validFrom) {
      
      const newSchedule: SpecialistSchedule = {
        id: Date.now().toString(),
        specialistId: schedule?.specialistId || '',
        practiceLocation: {
          clinicId: selectedClinic?.id || '',
          roomOrUnit: formData.roomOrUnit
        },
        recurrence: {
          dayOfWeek: formData.dayOfWeek,
          type: 'weekly'
        },
        scheduleType: 'Weekly',
        slotTemplate: {
          [formData.startTime]: {
            defaultStatus: 'available',
            durationMinutes: formData.slotDurationMinutes
          }
        },
        validFrom: formData.validFrom,
        isActive: formData.isActive
      };
      
      onSave(newSchedule);
      onOpenChange(false);
    }
  };

  const removeScheduleBlock = (scheduleId: string) => {
    // This function is no longer needed as we are working directly with SpecialistSchedule
    // The dialog will close after saving, so no need to remove blocks here.
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
    if (!formData.roomOrUnit || !formData.dayOfWeek.length || !formData.startTime || !formData.endTime || !formData.validFrom) {
      return;
    }

    // Generate slot template from start/end times in 12-hour format
    const slotTemplate: { [key: string]: { defaultStatus: string; durationMinutes: number } } = {};
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
      
      slotTemplate[time12h] = {
        defaultStatus: 'available',
        durationMinutes: formData.slotDurationMinutes
      };
    }

    const scheduleData: Omit<SpecialistSchedule, 'id'> = {
      specialistId: schedule?.specialistId || '',
      isActive: formData.isActive,
      practiceLocation: {
        clinicId: selectedClinic?.id || formData.clinicId,
        roomOrUnit: formData.roomOrUnit
      },
      recurrence: {
        dayOfWeek: formData.dayOfWeek,
        type: 'weekly'
      },
      scheduleType: 'Weekly',
      slotTemplate: slotTemplate,
      validFrom: formData.validFrom
    };

    onSave(scheduleData);
    onOpenChange(false);
  };

  const isFormValid = () => {
    const hasClinic = selectedClinic || (isNewClinic && clinicSearchValue);
    const hasBasicInfo = formData.roomOrUnit && formData.dayOfWeek.length > 0 && formData.startTime && formData.endTime && formData.validFrom;
    
    return hasClinic && hasBasicInfo;
  };

  const isScheduleValid = () => {
    return formData.roomOrUnit && 
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
            {schedule ? 'Edit Schedule' : 'Add Schedule'}
          </DialogTitle>
          <DialogDescription>
            {schedule 
              ? 'Update the schedule details for this clinic.'
              : 'Select or add a clinic and configure the doctor\'s schedule for that location.'
            }
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
                <Label>Clinic</Label>
                <Popover open={clinicSearchOpen} onOpenChange={setClinicSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={clinicSearchOpen}
                      className="w-full justify-between"
                    >
                      {clinicSearchValue || "Search or add clinic..."}
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
                          {EXISTING_CLINICS
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
                {schedule 
                  ? 'Update the schedule details for this clinic'
                  : 'Add schedule blocks for this clinic affiliation'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!schedule && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">Add Schedule Block</h4>
                
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
                  Add Schedule Block
                </Button>
              </div>
              )}

              {/* Edit Schedule Form - Only show when editing existing schedule */}
              {schedule && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">Edit Schedule Details</h4>
                
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
              </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid()}>
            {schedule ? 'Update Schedule' : 'Add Schedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}