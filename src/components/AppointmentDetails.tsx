import { ArrowLeft, Calendar, Clock, User, Mail, Phone, FileText, Pill } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Appointment } from "@/types";

interface AppointmentDetailsProps {
  appointment: Appointment;
  onBack: () => void;
  onCreatePrescription: () => void;
}

export const AppointmentDetails = ({ 
  appointment, 
  onBack, 
  onCreatePrescription 
}: AppointmentDetailsProps) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Appointments</span>
        </Button>
        {getStatusBadge(appointment.status)}
      </div>

      {/* Patient Information */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary to-primary-variant p-3 rounded-full">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {appointment.patient_name}
              </CardTitle>
              <p className="text-muted-foreground">Age: {appointment.patient_age} years</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{date}</p>
                <p className="text-sm text-muted-foreground">Appointment Date</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{time}</p>
                <p className="text-sm text-muted-foreground">Time</p>
              </div>
            </div>
            
            {appointment.patient_email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{appointment.patient_email}</p>
                  <p className="text-sm text-muted-foreground">Email</p>
                </div>
              </div>
            )}
            
            {appointment.contact_number && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{appointment.contact_number}</p>
                  <p className="text-sm text-muted-foreground">Phone</p>
                </div>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-semibold text-foreground mb-2">Assigned Doctor</h4>
            <p className="text-muted-foreground">{appointment.doctor_name}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-2">Symptoms</h4>
            <p className="text-muted-foreground leading-relaxed">{appointment.symptoms}</p>
          </div>
        </CardContent>
      </Card>

      {/* Prescription Section */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-secondary to-secondary-variant p-3 rounded-full">
                <FileText className="h-6 w-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Prescription
              </CardTitle>
            </div>
            
            {(!appointment.prescriptions || appointment.prescriptions.length === 0) && appointment.status === 'pending' && (
              <Button 
                variant="medical-secondary" 
                onClick={onCreatePrescription}
                className="flex items-center space-x-2"
              >
                <Pill className="h-4 w-4" />
                <span>Generate Prescription</span>
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {appointment.prescriptions && appointment.prescriptions.length > 0 ? (
            <div className="space-y-4">
              {appointment.prescriptions.map((prescription) => (
                <div key={prescription.id} className="bg-secondary-light p-4 rounded-lg border border-secondary/20">
                  <div className="flex items-start space-x-3">
                    <Pill className="h-5 w-5 text-secondary mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-semibold text-foreground mb-1">
                        {prescription.medicine}
                      </h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Dosage:</strong> {prescription.dosage}
                      </p>
                      {prescription.note && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Note:</strong> {prescription.note}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Created: {new Date(prescription.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {appointment.status === 'pending' 
                  ? 'No prescription created yet. Click "Generate Prescription" to create one.'
                  : 'No prescription was created for this appointment.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};