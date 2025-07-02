import { useState } from "react";
import { Search, Filter, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppointmentCard } from "@/components/AppointmentCard";
import { Appointment } from "@/types";

interface AppointmentsListProps {
  appointments: Appointment[];
  onViewAppointment: (appointment: Appointment) => void;
}

export const AppointmentsList = ({ appointments, onViewAppointment }: AppointmentsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = 
      appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.appointment_time).getTime() - new Date(a.appointment_time).getTime();
      case "name":
        return a.patient_name.localeCompare(b.patient_name);
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const getStatusCount = (status: string) => {
    return appointments.filter(apt => apt.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-accent-variant text-accent-foreground p-6 rounded-lg shadow-floating">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Appointments Management</h1>
            <p className="text-accent-foreground/90">
              Manage and track all patient appointments
            </p>
          </div>
          <Calendar className="h-12 w-12 text-accent-foreground/20" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{appointments.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{getStatusCount('pending')}</p>
              </div>
              <div className="w-3 h-3 bg-warning rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">{getStatusCount('completed')}</p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-destructive">{getStatusCount('cancelled')}</p>
              </div>
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <span>Filter & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search patients, symptoms, or doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Newest First)</SelectItem>
                <SelectItem value="name">Patient Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAppointments.map((appointment, index) => (
          <div 
            key={appointment.id} 
            className="animate-card-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <AppointmentCard 
              appointment={appointment} 
              onViewDetails={onViewAppointment}
            />
          </div>
        ))}
      </div>

      {sortedAppointments.length === 0 && (
        <Card className="medical-card">
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No appointments found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "No appointments have been scheduled yet"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};