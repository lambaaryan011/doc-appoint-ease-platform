import { Calendar, Clock, User, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Appointment } from "@/types";

interface AppointmentCardProps {
  appointment: Appointment;
  onViewDetails: (appointment: Appointment) => void;
}

export const AppointmentCard = ({ appointment, onViewDetails }: AppointmentCardProps) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDateTime(appointment.appointment_time);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="status-pending">Pending</Badge>;
      case 'completed':
        return <Badge className="status-completed">Completed</Badge>;
      case 'cancelled':
        return <Badge className="status-cancelled">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="medical-card hover:scale-[1.02] transition-transform duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary to-primary-variant p-2 rounded-full">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {appointment.patient_name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Age: {appointment.patient_age}</p>
            </div>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
          <Clock className="h-4 w-4 ml-2" />
          <span>{time}</span>
        </div>
        
        <div>
          <p className="text-sm font-medium text-foreground mb-1">Symptoms:</p>
          <p className="text-sm text-muted-foreground">{appointment.symptoms}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-foreground mb-1">Doctor:</p>
          <p className="text-sm text-muted-foreground">{appointment.doctor_name}</p>
        </div>
        
        {appointment.patient_email && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{appointment.patient_email}</span>
          </div>
        )}
        
        {appointment.contact_number && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{appointment.contact_number}</span>
          </div>
        )}
        
        <div className="pt-3 border-t border-border">
          <Button 
            variant="medical-outline" 
            size="sm" 
            onClick={() => onViewDetails(appointment)}
            className="w-full"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};