import { DashboardStats } from "@/components/DashboardStats";
import { AppointmentCard } from "@/components/AppointmentCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Users } from "lucide-react";
import { Appointment } from "@/types";
import { dashboardService } from "@/services/supabaseService";

interface DashboardProps {
  appointments: Appointment[];
  onViewAppointment: (appointment: Appointment) => void;
  onViewAllAppointments: () => void;
}

export const Dashboard = ({ appointments, onViewAppointment, onViewAllAppointments }: DashboardProps) => {
  const stats = {
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length,
    completedAppointments: appointments.filter(a => a.status === 'completed').length,
    todayAppointments: appointments.filter(appointment => {
      const today = new Date().toISOString().split('T')[0];
      const appointmentDate = new Date(appointment.appointment_time).toISOString().split('T')[0];
      return appointmentDate === today;
    }).length
  };
  
  const recentAppointments = appointments.slice(0, 3);
  const todayAppointments = appointments.filter(appointment => {
    const today = new Date().toISOString().split('T')[0];
    const appointmentDate = new Date(appointment.appointment_time).toISOString().split('T')[0];
    return appointmentDate === today;
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-variant text-primary-foreground p-8 rounded-lg shadow-primary">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to MediCare Pro</h1>
            <p className="text-primary-foreground/90 text-lg">
              Manage your appointments and patient care efficiently
            </p>
          </div>
          <div className="hidden md:block">
            <Calendar className="h-16 w-16 text-primary-foreground/20" />
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats stats={stats} />

      {/* Quick Actions & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="medical-outline" 
              className="w-full justify-start"
              onClick={onViewAllAppointments}
            >
              <Calendar className="h-4 w-4 mr-2" />
              View All Appointments
            </Button>
            <Button 
              variant="medical-outline" 
              className="w-full justify-start"
              onClick={onViewAllAppointments}
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Patients
            </Button>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card className="medical-card lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Today's Schedule</span>
              </CardTitle>
              <Button variant="medical-outline" size="sm" onClick={onViewAllAppointments}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {todayAppointments.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.map((appointment, index) => (
                  <div 
                    key={appointment.id} 
                    className="flex items-center justify-between p-4 bg-muted rounded-lg animate-card-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-primary to-primary-variant p-2 rounded-full">
                        <Users className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{appointment.patient_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appointment.appointment_time).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="medical-outline" 
                      size="sm"
                      onClick={() => onViewAppointment(appointment)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No appointments scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Recent Appointments</span>
            </CardTitle>
            <Button variant="medical-outline" size="sm" onClick={onViewAllAppointments}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentAppointments.map((appointment, index) => (
              <div 
                key={appointment.id} 
                className="animate-card-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AppointmentCard 
                  appointment={appointment} 
                  onViewDetails={onViewAppointment}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};