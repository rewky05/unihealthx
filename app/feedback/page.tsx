'use client';

import { useState } from 'react';
import { useFeedback, useFeedbackByStatus, useFeedbackActions, useFeedbackStats } from '@/hooks';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  MessageSquare,
  Search,
  Star,
  Calendar,
  User,
  Eye,
  TrendingUp,
  TrendingDown,
  Filter
} from 'lucide-react';

const mockFeedback = [
  {
    id: 1,
    patientName: 'Juan Carlos',
    patientInitials: 'JC',
    doctorName: 'Dr. Maria Santos',
    doctorSpecialty: 'Cardiology',
    clinic: 'Cebu Heart Center',
    rating: 5,
    comment: 'Excellent service! Dr. Santos was very thorough and explained everything clearly. The clinic staff was also very accommodating.',
    date: '2024-01-20T10:30:00',
    tags: ['professional', 'thorough', 'excellent'],
    status: 'reviewed'
  },
  {
    id: 2,
    patientName: 'Maria Lopez',
    patientInitials: 'ML',
    doctorName: 'Dr. Juan Dela Cruz',
    doctorSpecialty: 'Pediatrics',
    clinic: 'Children\'s Hospital Cebu',
    rating: 4,
    comment: 'Good doctor, my child felt comfortable during the consultation. However, the waiting time was quite long.',
    date: '2024-01-19T14:15:00',
    tags: ['good', 'comfortable', 'long wait'],
    status: 'pending'
  },
  {
    id: 3,
    patientName: 'Robert Chen',
    patientInitials: 'RC',
    doctorName: 'Dr. Ana Rodriguez',
    doctorSpecialty: 'Dermatology',
    clinic: 'Skin Care Clinic',
    rating: 5,
    comment: 'Amazing results! Dr. Rodriguez solved my skin problem that I\'ve had for years. Highly recommend!',
    date: '2024-01-18T16:45:00',
    tags: ['amazing', 'effective', 'recommended'],
    status: 'reviewed'
  },
  {
    id: 4,
    patientName: 'Sarah Johnson',
    patientInitials: 'SJ',
    doctorName: 'Dr. Carlos Mendoza',
    doctorSpecialty: 'Orthopedics',
    clinic: 'Bone & Joint Clinic',
    rating: 2,
    comment: 'The doctor seemed rushed and didn\'t fully address my concerns. The treatment didn\'t help much.',
    date: '2024-01-17T11:20:00',
    tags: ['rushed', 'concerns not addressed', 'ineffective'],
    status: 'flagged'
  },
  {
    id: 5,
    patientName: 'Miguel Reyes',
    patientInitials: 'MR',
    doctorName: 'Dr. Elena Reyes',
    doctorSpecialty: 'Neurology',
    clinic: 'Neuro Center Cebu',
    rating: 4,
    comment: 'Knowledgeable doctor with good bedside manner. The diagnosis was accurate and treatment is working well.',
    date: '2024-01-16T09:30:00',
    tags: ['knowledgeable', 'accurate', 'effective'],
    status: 'reviewed'
  }
];

const ratings = ['All', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'];
const statuses = ['All', 'Pending', 'Reviewed', 'Flagged'];

export default function FeedbackPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [feedback] = useState(mockFeedback);
  const [selectedFeedback, setSelectedFeedback] = useState<typeof mockFeedback[0] | null>(null);

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.clinic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = selectedRating === 'All' || 
                         selectedRating === `${item.rating} Star${item.rating !== 1 ? 's' : ''}`;
    const matchesStatus = selectedStatus === 'All' || 
                         item.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesRating && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reviewed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400';
      case 'flagged':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const averageRating = feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length;
  const totalFeedback = feedback.length;
  const pendingReviews = feedback.filter(item => item.status === 'pending').length;
  const flaggedReviews = feedback.filter(item => item.status === 'flagged').length;

  return (
    <DashboardLayout title="">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Patient Feedback</h2>
            <p className="text-muted-foreground">
              Monitor and review patient feedback for healthcare quality assurance
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Feedback
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFeedback}</div>
              <div className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="flex items-center mt-1">
                {renderStars(Math.round(averageRating))}
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Reviews
              </CardTitle>
              <Filter className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReviews}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Require attention
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Flagged Reviews
              </CardTitle>
              <Eye className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{flaggedReviews}</div>
              <div className="text-xs text-red-600 flex items-center mt-1">
                Need immediate review
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card id="review-feedback" className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient, doctor, or clinic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {ratings.map((rating) => (
                      <SelectItem key={rating} value={rating}>
                        {rating}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Table */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Patient Reviews ({filteredFeedback.length})
            </CardTitle>
            <CardDescription>
              Comprehensive list of patient feedback and ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Clinic</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedback.map((item) => (
                    <TableRow key={item.id} className="table-row-hover">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {item.patientInitials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{item.patientName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.doctorName}</div>
                          <div className="text-sm text-muted-foreground">{item.doctorSpecialty}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{item.clinic}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className={`font-medium ${getRatingColor(item.rating)}`}>
                            {item.rating}
                          </span>
                          <div className="flex">
                            {renderStars(item.rating)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate">{item.comment}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{item.tags.length - 2} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setSelectedFeedback(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Patient Feedback Details</DialogTitle>
                              <DialogDescription>
                                Complete review from {item.patientName}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedFeedback && (
                              <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <h4 className="font-medium mb-2">Patient Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span>{selectedFeedback.patientName}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>{new Date(selectedFeedback.date).toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Healthcare Provider</h4>
                                    <div className="space-y-2 text-sm">
                                      <div>{selectedFeedback.doctorName}</div>
                                      <div className="text-muted-foreground">{selectedFeedback.doctorSpecialty}</div>
                                      <div className="text-muted-foreground">{selectedFeedback.clinic}</div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Rating</h4>
                                  <div className="flex items-center space-x-2">
                                    <div className="flex">
                                      {renderStars(selectedFeedback.rating)}
                                    </div>
                                    <span className={`font-medium ${getRatingColor(selectedFeedback.rating)}`}>
                                      {selectedFeedback.rating} out of 5
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Patient Comment</h4>
                                  <p className="text-sm bg-muted p-4 rounded-lg">
                                    {selectedFeedback.comment}
                                  </p>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Tags</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedFeedback.tags.map((tag, index) => (
                                      <Badge key={index} variant="secondary">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t">
                                  <Badge className={getStatusColor(selectedFeedback.status)}>
                                    {selectedFeedback.status}
                                  </Badge>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                      Flag for Review
                                    </Button>
                                    <Button size="sm">
                                      Mark as Reviewed
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}