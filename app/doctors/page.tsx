"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Download,
  UserCheck,
  UserX,
  Calendar,
  MapPin,
} from "lucide-react";
import Link from "next/link";

const mockDoctors = [
  {
    id: 1,
    name: "Dr. Maria Santos",
    email: "maria.santos@email.com",
    specialty: "Cardiology",
    clinics: ["Cebu Heart Center", "Metro Manila Hospital"],
    status: "verified",
    prcId: "PRC-123456",
    prcExpiry: "2025-12-31",
    phone: "+63 917 123 4567",
    joinDate: "2023-01-15",
    avatar: null,
  },
  {
    id: 2,
    name: "Dr. Juan Dela Cruz",
    email: "juan.delacruz@email.com",
    specialty: "Pediatrics",
    clinics: ["Children's Hospital Cebu"],
    status: "pending",
    prcId: "PRC-234567",
    prcExpiry: "2024-06-30",
    phone: "+63 917 234 5678",
    joinDate: "2023-03-20",
    avatar: null,
  },
  {
    id: 3,
    name: "Dr. Ana Rodriguez",
    email: "ana.rodriguez@email.com",
    specialty: "Dermatology",
    clinics: ["Skin Care Clinic", "Beauty Med Center"],
    status: "verified",
    prcId: "PRC-345678",
    prcExpiry: "2025-09-15",
    phone: "+63 917 345 6789",
    joinDate: "2022-11-10",
    avatar: null,
  },
  {
    id: 4,
    name: "Dr. Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    specialty: "Orthopedics",
    clinics: ["Bone & Joint Clinic"],
    status: "suspended",
    prcId: "PRC-456789",
    prcExpiry: "2024-03-20",
    phone: "+63 917 456 7890",
    joinDate: "2023-08-05",
    avatar: null,
  },
  {
    id: 5,
    name: "Dr. Elena Reyes",
    email: "elena.reyes@email.com",
    specialty: "Neurology",
    clinics: ["Neuro Center Cebu"],
    status: "pending",
    prcId: "PRC-567890",
    prcExpiry: "2025-01-10",
    phone: "+63 917 567 8901",
    joinDate: "2023-12-01",
    avatar: null,
  },
];

const specialties = [
  "All",
  "Cardiology",
  "Pediatrics",
  "Dermatology",
  "Orthopedics",
  "Neurology",
];
const statuses = ["All", "Verified", "Pending", "Suspended"];

export default function DoctorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState(() => {
    const statusParam = searchParams.get("status"); // <-- This gets "pending" from "/doctors?status=pending"
    if (statusParam) {
      const normalizedParam =
        statusParam.charAt(0).toUpperCase() +
        statusParam.slice(1).toLowerCase(); // Converts "pending" to "Pending"
      if (statuses.includes(normalizedParam)) { // Checks if "Pending" is in your predefined 'statuses' array
        return normalizedParam; // If yes, 'selectedStatus' is initialized to "Pending"
      }
    }
    return "All";
  });
  const [doctors] = useState(mockDoctors);
  // Update url filter status
  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    let changed = false;

    if (selectedStatus !== "All") {
      if (currentParams.get("status") !== selectedStatus.toLowerCase()) {
        currentParams.set("status", selectedStatus.toLowerCase());
        changed = true;
      }
    } else {
      if (currentParams.has("status")) {
        currentParams.delete("status");
        changed = true;
      }
    }
    if (changed) {
      router.replace(`?${currentParams.toString()}`);
    }
  }, [selectedStatus, selectedSpecialty, searchQuery, router, searchParams]);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
    const matchesStatus =
      selectedStatus === "All" ||
      doctor.status === selectedStatus.toLowerCase();

    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <UserCheck className="h-3 w-3" />;
      case "pending":
        return <Calendar className="h-3 w-3" />;
      case "suspended":
        return <UserX className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Doctor Management</h2>
            <p className="text-muted-foreground">
              Manage healthcare professionals and their credentials
            </p>
          </div>
          <Link href="/doctors/add">
            <div className="flex gap-2">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Doctor
              </Button>
            </div>
          </Link>
        </div>

        {/* Filters */}
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search doctors by name, email, or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedSpecialty}
                  onValueChange={setSelectedSpecialty}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
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

        {/* Doctors Table */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Doctors ({filteredDoctors.length})
            </CardTitle>
            <CardDescription>
              Comprehensive list of healthcare professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Clinics</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>PRC Expiry</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id} className="table-row-hover">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={doctor.avatar || ""} />
                            <AvatarFallback>
                              {doctor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{doctor.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {doctor.email}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {doctor.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doctor.specialty}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {doctor.clinics.map((clinic, index) => (
                            <div
                              key={index}
                              className="flex items-center text-sm"
                            >
                              <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                              {clinic}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doctor.status)}>
                          {getStatusIcon(doctor.status)}
                          <span className="ml-1 capitalize">
                            {doctor.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(doctor.prcExpiry).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          PRC: {doctor.prcId}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(doctor.joinDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/doctors/${doctor.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem asChild>
                              <Link href={`/doctors/${doctor.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem> */}
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
