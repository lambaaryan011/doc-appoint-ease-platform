import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/pages/Dashboard";
import { AppointmentsList } from "@/pages/AppointmentsList";
import { AppointmentDetails } from "@/components/AppointmentDetails";
import { PrescriptionModal } from "@/components/PrescriptionModal";
import { Appointment, Prescription } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { appointmentService, prescriptionService } from "@/services/supabaseService";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load appointments from Supabase
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await appointmentService.getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Error loading appointments:', error);
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [toast]);

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCurrentPage("appointment-details");
  };

  const handleBackToAppointments = () => {
    setSelectedAppointment(null);
    setCurrentPage("appointments");
  };

  const handleBackToDashboard = () => {
    setSelectedAppointment(null);
    setCurrentPage("dashboard");
  };

  const handleCreatePrescription = () => {
    setIsPrescriptionModalOpen(true);
  };

  const handleSubmitPrescription = async (prescriptionData: Omit<Prescription, 'id' | 'created_at'>) => {
    try {
      const newPrescription = await prescriptionService.createPrescription(prescriptionData);

      // Refresh appointments to get updated data
      const updatedAppointments = await appointmentService.getAppointments();
      setAppointments(updatedAppointments);

      // Update selected appointment if it's the current one
      if (selectedAppointment?.id === prescriptionData.appointment_id) {
        const updatedAppointment = updatedAppointments.find(apt => apt.id === prescriptionData.appointment_id);
        if (updatedAppointment) {
          setSelectedAppointment(updatedAppointment);
        }
      }

      toast({
        title: "Prescription Created",
        description: `Prescription created successfully for ${selectedAppointment?.patient_name}`,
      });
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast({
        title: "Error",
        description: "Failed to create prescription",
        variant: "destructive"
      });
    }
  };

  const renderCurrentPage = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      );
    }

    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard 
            appointments={appointments}
            onViewAppointment={handleViewAppointment}
            onViewAllAppointments={() => setCurrentPage("appointments")}
          />
        );
      case "appointments":
        return (
          <AppointmentsList 
            appointments={appointments}
            onViewAppointment={handleViewAppointment}
          />
        );
      case "appointment-details":
        return selectedAppointment ? (
          <AppointmentDetails 
            appointment={selectedAppointment}
            onBack={handleBackToAppointments}
            onCreatePrescription={handleCreatePrescription}
          />
        ) : null;
      case "patients":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Patients Management</h2>
            <p className="text-muted-foreground">This feature is coming soon!</p>
          </div>
        );
      case "prescriptions":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Prescriptions Management</h2>
            <p className="text-muted-foreground">This feature is coming soon!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentPage()}
      </main>

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        onSubmit={handleSubmitPrescription}
        appointmentId={selectedAppointment?.id || ''}
        patientName={selectedAppointment?.patient_name || ''}
      />
    </div>
  );
};

export default Index;
