'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Plus, Edit, Trash2, Stethoscope, TestTube, Scan, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MedicalServicesCatalogsProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
}

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  category?: string;
  isActive: boolean;
}

const mockSpecialties: ServiceItem[] = [
  { id: '1', name: 'Cardiology', description: 'Heart and cardiovascular system', isActive: true },
  { id: '2', name: 'Dermatology', description: 'Skin, hair, and nail conditions', isActive: true },
  { id: '3', name: 'Pediatrics', description: 'Medical care for infants, children, and adolescents', isActive: true },
  { id: '4', name: 'Orthopedics', description: 'Musculoskeletal system disorders', isActive: true },
  { id: '5', name: 'Neurology', description: 'Nervous system disorders', isActive: false }
];

const mockLabTests: ServiceItem[] = [
  { id: '1', name: 'Complete Blood Count (CBC)', description: 'Comprehensive blood analysis', category: 'Hematology', isActive: true },
  { id: '2', name: 'Lipid Profile', description: 'Cholesterol and triglyceride levels', category: 'Chemistry', isActive: true },
  { id: '3', name: 'Thyroid Function Test', description: 'TSH, T3, T4 levels', category: 'Endocrinology', isActive: true },
  { id: '4', name: 'Liver Function Test', description: 'Liver enzyme levels', category: 'Chemistry', isActive: true }
];

const mockImagingTests: ServiceItem[] = [
  { id: '1', name: 'X-Ray', description: 'Basic radiographic imaging', category: 'Radiology', isActive: true },
  { id: '2', name: 'CT Scan', description: 'Computed tomography imaging', category: 'Radiology', isActive: true },
  { id: '3', name: 'MRI', description: 'Magnetic resonance imaging', category: 'Radiology', isActive: true },
  { id: '4', name: 'Ultrasound', description: 'Ultrasonic imaging', category: 'Radiology', isActive: true }
];

const mockConsultationTypes: ServiceItem[] = [
  { id: '1', name: 'Initial Consultation', description: 'First-time patient visit', isActive: true },
  { id: '2', name: 'Follow-up Consultation', description: 'Subsequent patient visit', isActive: true },
  { id: '3', name: 'Emergency Consultation', description: 'Urgent medical consultation', isActive: true },
  { id: '4', name: 'Telemedicine Consultation', description: 'Remote video consultation', isActive: true }
];

export function MedicalServicesCatalogs({ onUnsavedChanges }: MedicalServicesCatalogsProps) {
  const { toast } = useToast();
  const [specialties, setSpecialties] = useState<ServiceItem[]>(mockSpecialties);
  const [labTests, setLabTests] = useState<ServiceItem[]>(mockLabTests);
  const [imagingTests, setImagingTests] = useState<ServiceItem[]>(mockImagingTests);
  const [consultationTypes, setConsultationTypes] = useState<ServiceItem[]>(mockConsultationTypes);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [currentTab, setCurrentTab] = useState('specialties');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: ''
  });

  const getCurrentData = () => {
    switch (currentTab) {
      case 'specialties': return specialties;
      case 'lab-tests': return labTests;
      case 'imaging-tests': return imagingTests;
      case 'consultation-types': return consultationTypes;
      default: return [];
    }
  };

  const setCurrentData = (data: ServiceItem[]) => {
    switch (currentTab) {
      case 'specialties': setSpecialties(data); break;
      case 'lab-tests': setLabTests(data); break;
      case 'imaging-tests': setImagingTests(data); break;
      case 'consultation-types': setConsultationTypes(data); break;
    }
  };

  const getTabConfig = () => {
    const configs = {
      'specialties': {
        title: 'Medical Specialties',
        icon: Stethoscope,
        hasCategory: false
      },
      'lab-tests': {
        title: 'Laboratory Tests',
        icon: TestTube,
        hasCategory: true
      },
      'imaging-tests': {
        title: 'Imaging Tests',
        icon: Scan,
        hasCategory: true
      },
      'consultation-types': {
        title: 'Consultation Types',
        icon: MessageSquare,
        hasCategory: false
      }
    };
    return configs[currentTab as keyof typeof configs];
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', category: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: ServiceItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category || ''
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const currentData = getCurrentData();
    
    if (editingItem) {
      const updatedData = currentData.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData }
          : item
      );
      setCurrentData(updatedData);
      toast({
        title: "Item updated",
        description: "The item has been updated successfully.",
      });
    } else {
      const newItem: ServiceItem = {
        id: Date.now().toString(),
        ...formData,
        isActive: true
      };
      setCurrentData([...currentData, newItem]);
      toast({
        title: "Item added",
        description: "New item has been added successfully.",
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (itemId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    const currentData = getCurrentData();
    const updatedData = currentData.filter(item => item.id !== itemId);
    setCurrentData(updatedData);
    
    toast({
      title: "Item deleted",
      description: "The item has been removed successfully.",
    });
  };

  const handleToggleStatus = (itemId: string) => {
    const currentData = getCurrentData();
    const updatedData = currentData.map(item =>
      item.id === itemId
        ? { ...item, isActive: !item.isActive }
        : item
    );
    setCurrentData(updatedData);
    
    toast({
      title: "Status updated",
      description: "Item status has been changed successfully.",
    });
  };

  const tabConfig = getTabConfig();

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Medical Services & Catalogs
        </CardTitle>
        <CardDescription>
          Manage predefined lists of medical specialties, tests, and consultation types.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="specialties">Specialties</TabsTrigger>
            <TabsTrigger value="lab-tests">Lab Tests</TabsTrigger>
            <TabsTrigger value="imaging-tests">Imaging</TabsTrigger>
            <TabsTrigger value="consultation-types">Consultations</TabsTrigger>
          </TabsList>

          {['specialties', 'lab-tests', 'imaging-tests', 'consultation-types'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <tabConfig.icon className="h-5 w-5" />
                  <h3 className="text-lg font-medium">
                    {tabConfig.title} ({getCurrentData().length})
                  </h3>
                </div>
                <Button onClick={handleAdd}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New {tabConfig.title.slice(0, -1)}
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      {tabConfig.hasCategory && <TableHead>Category</TableHead>}
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getCurrentData().map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        {tabConfig.hasCategory && (
                          <TableCell>
                            {item.category && (
                              <Badge variant="outline">{item.category}</Badge>
                            )}
                          </TableCell>
                        )}
                        <TableCell>
                          <button
                            onClick={() => handleToggleStatus(item.id)}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400'
                            }`}
                          >
                            {item.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? `Edit ${tabConfig.title.slice(0, -1)}` : `Add New ${tabConfig.title.slice(0, -1)}`}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the item information.' : 'Create a new item in the catalog.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              
              {tabConfig.hasCategory && (
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="Enter category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!formData.name || !formData.description}
              >
                {editingItem ? 'Update' : 'Add'} {tabConfig.title.slice(0, -1)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}