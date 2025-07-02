import { supabase } from "@/integrations/supabase/client";
import { Appointment, Prescription } from "@/types";

export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        prescriptions (*)
      `)
      .order('appointment_time', { ascending: false });

    if (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }

    return (data || []) as Appointment[];
  },

  async updateAppointmentStatus(id: string, status: 'pending' | 'completed' | 'cancelled'): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }
};

export const prescriptionService = {
  async createPrescription(prescription: Omit<Prescription, 'id' | 'created_at'>): Promise<Prescription> {
    // First create the prescription
    const { data, error } = await supabase
      .from('prescriptions')
      .insert([prescription])
      .select()
      .single();

    if (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }

    // Update appointment status to completed
    await appointmentService.updateAppointmentStatus(prescription.appointment_id, 'completed');

    return data;
  }
};

export const dashboardService = {
  async getDashboardStats() {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*');

    if (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }

    const totalAppointments = appointments?.length || 0;
    const pendingAppointments = appointments?.filter(a => a.status === 'pending').length || 0;
    const completedAppointments = appointments?.filter(a => a.status === 'completed').length || 0;
    
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments?.filter(a => {
      const appointmentDate = new Date(a.appointment_time).toISOString().split('T')[0];
      return appointmentDate === today;
    }).length || 0;

    return {
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      todayAppointments
    };
  }
};