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
import type { ClinicAffiliation, ClinicScheduleBlock } from '@/app/doctors/add/page';

interface ClinicScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  affiliation: ClinicAffiliation | null;
  onSave: (affiliation: Omit<ClinicAffiliation, 'id'>) => void;
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

const ROLES = ['Senior Consultant', 'Visiting Consultant', 'Consultant', 'Associate', 'Resident'];
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

export function ClinicScheduleDialog({ open, onOpenChange, affiliation, onSave }: ClinicScheduleDialogProps) {
  const [clinicSearchOpen, setClinicSearchOpen] = useState(false);
  const [clinicSearchValue, setClinicSearchValue] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<typeof EXISTING_CLINICS[0] | null>(null);
  const [isNewClinic, setIsNewClinic] = useState(false);
  
  const [formData, setFormData] = useState({
    role: '',
    since: '',
    newClinicDetails: {
      name: '',
      addressLine: '',
      contactNumber: '',
      type: ''
    }
  });
  
  const [schedules, setSchedules] = useState<ClinicScheduleBlock[]>([]);
  const [currentSchedule, setCurrentSchedule] = useState<Partial<ClinicScheduleBlock>>({
    roomOrUnit: '',
    dayOfWeek: [],
    startTime: '',
    endTime: '',
    slotDurationMinutes: 30,
    validFrom: ''
  });

  useEffect(() => {
    if (affiliation) {
      setSelectedClinic(EXISTING_CLINICS.find(c => c.id === affiliation.clinicId) || null);
      setIsNewClinic(!affiliation.clinicId);
      setFormData({
        role: affiliation.role,
        since: affiliation.since,
        newClinicDetails: affiliation.newClinicDetails || {
          name: affiliation.name,
          addressLine: '',
          contactNumber: '',
          type: ''
        }
      });
      setSchedules(affiliation.schedules || []);
      setClinicSearchValue(affiliation.name);
    } else {
      resetForm();
    }
  }, [affiliation, open]);

  const resetForm = () => {
    setSelectedClinic(null);
    setIsNewClinic(false);
    setClinicSearchValue('');
    setFormData({
      role: '',
      since: '',
      newClinicDetails: {
        name: '',
        addressLine: '',
        contactNumber: '',
        type: ''
      }
    });
    setSchedules([]);
    setCurrentSchedule({
      roomOrUnit: '',
      dayOfWeek: [],
      startTime: '',
      endTime: '',
      slotDurationMinutes: 30,
      validFrom: ''
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
      newClinicDetails: {
        ...prev.newClinicDetails,
        name: name
      }
    }));
    setClinicSearchOpen(false);
  };

  const addScheduleBlock = () => {
    if (currentSchedule.roomOrUnit && 
        currentSchedule.dayOfWeek && currentSchedule.dayOfWeek.length > 0 &&
        currentSchedule.startTime && 
        currentSchedule.endTime && 
        currentSchedule.validFrom) {
      
      const newSchedule: ClinicScheduleBlock = {
        id: Date.now().toString(),
        roomOrUnit: currentSchedule.roomOrUnit,
        dayOfWeek: currentSchedule.dayOfWeek,
        startTime: currentSchedule.startTime,
        endTime: currentSchedule.endTime,
        slotDurationMinutes: currentSchedule.slotDurationMinutes || 30,
        validFrom: currentSchedule.validFrom
      };
      
      setSchedules(prev => [...prev, newSchedule]);
      setCurrentSchedule({
        roomOrUnit: '',
        dayOfWeek: [],
        startTime: '',
        endTime: '',
        slotDurationMinutes: 30,
        validFrom: ''
      });
    }
  };

  const removeScheduleBlock = (scheduleId: string) => {
    setSchedules(prev => prev.filter(s => s.id !== scheduleId));
  };

  const handleDayToggle = (dayValue: number, checked: boolean) => {
    setCurrentSchedule(prev => ({
      ...prev,
      dayOfWeek: checked 
        ? [...(prev.dayOfWeek || []), dayValue]
        : (prev.dayOfWeek || []).filter(d => d !== dayValue)
    }));
  };

  const getDayNames = (dayNumbers: number[]) => {
    return dayNumbers
      .sort()
      .map(num => DAYS_OF_WEEK.find(d => d.value === num)?.label)
      .filter(Boolean)
      .join(', ');
  };

  const handleSave = () => {
    const clinicName = selectedClinic?.name || formData.newClinicDetails.name;
    
    if (!clinicName || !formData.role || !formData.since || schedules.length === 0) {
      return;
    }

    const affiliationData: Omit<ClinicAffiliation, 'id'> = {
      clinicId: selectedClinic?.id,
      name: clinicName,
      role: formData.role,
      since: formData.since,
      schedules: schedules,
      ...(isNewClinic && {
        newClinicDetails: formData.newClinicDetails
      })
    };

    onSave(affiliationData);
    onOpenChange(false);
  };

  const isFormValid = () => {
    const hasClinic = selectedClinic || (isNewClinic && formData.newClinicDetails.name);
    const hasBasicInfo = formData.role && formData.since;
    const hasSchedules = schedules.length > 0;
    const hasNewClinicDetails = !isNewClinic || (
      formData.newClinicDetails.name &&
      formData.newClinicDetails.addressLine && 
      formData.newClinicDetails.contactNumber && 
      formData.newClinicDetails.type
    );
    
    return hasClinic && hasBasicInfo && hasSchedules && hasNewClinicDetails;
  };

  const isScheduleValid = () => {
    return currentSchedule.roomOrUnit && 
           currentSchedule.dayOfWeek && currentSchedule.dayOfWeek.length > 0 &&
           currentSchedule.startTime && 
           currentSchedule.endTime && 
           currentSchedule.validFrom;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {affiliation ? 'Edit Clinic Affiliation' : 'Add Clinic Affiliation'}
          </DialogTitle>
          <DialogDescription>
            Select or add a clinic and configure the doctor&apos;s schedule for that location.
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

              {/* New Clinic Details */}
              {isNewClinic && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-medium">New Clinic Details</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        placeholder="Clinic name"
                        value={formData.newClinicDetails.name}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          newClinicDetails: {
                            ...prev.newClinicDetails,
                            name: e.target.value
                          }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        placeholder="Complete address"
                        value={formData.newClinicDetails.addressLine}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          newClinicDetails: {
                            ...prev.newClinicDetails,
                            addressLine: e.target.value
                          }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Number</Label>
                      <Input
                        placeholder="+63 XXX XXX XXXX"
                        value={formData.newClinicDetails.contactNumber}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          newClinicDetails: {
                            ...prev.newClinicDetails,
                            contactNumber: e.target.value
                          }
                        }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Clinic Type</Label>
                    <Select 
                      value={formData.newClinicDetails.type} 
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        newClinicDetails: {
                          ...prev.newClinicDetails,
                          type: value
                        }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select clinic type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLINIC_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Role and Since */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Since</Label>
                  <Input
                    type="date"
                    value={formData.since}
                    onChange={(e) => setFormData(prev => ({ ...prev, since: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Configuration
              </CardTitle>
              <CardDescription>
                Add schedule blocks for this clinic affiliation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Schedule Form */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium">Add Schedule Block</h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Room/Unit</Label>
                    <Input
                      placeholder="e.g., Cardiology Clinic, Rm 501"
                      value={currentSchedule.roomOrUnit || ''}
                      onChange={(e) => setCurrentSchedule(prev => ({ ...prev, roomOrUnit: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valid From</Label>
                    <Input
                      type="date"
                      value={currentSchedule.validFrom || ''}
                      onChange={(e) => setCurrentSchedule(prev => ({ ...prev, validFrom: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Days of Week</Label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={(currentSchedule.dayOfWeek || []).includes(day.value)}
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
                      value={currentSchedule.startTime || ''}
                      onChange={(e) => setCurrentSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={currentSchedule.endTime || ''}
                      onChange={(e) => setCurrentSchedule(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slot Duration (minutes)</Label>
                    <Select 
                      value={currentSchedule.slotDurationMinutes?.toString() || '30'} 
                      onValueChange={(value) => setCurrentSchedule(prev => ({ ...prev, slotDurationMinutes: parseInt(value) }))}
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

              {/* Existing Schedules */}
              {schedules.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Schedule Blocks ({schedules.length})</h4>
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{schedule.roomOrUnit}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{getDayNames(schedule.dayOfWeek)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{schedule.startTime} - {schedule.endTime}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {schedule.slotDurationMinutes}min slots
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Valid from: {new Date(schedule.validFrom).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeScheduleBlock(schedule.id!)}
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid()}>
            {affiliation ? 'Update Affiliation' : 'Add Affiliation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}