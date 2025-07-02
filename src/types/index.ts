export interface Appointment {
  id: string;
  patient_name: string;
  patient_age: number;
  symptoms: string;
  appointment_time: string;
  status: 'pending' | 'completed' | 'cancelled';
  doctor_name: string;
  patient_email?: string;
  contact_number?: string;
  created_at: string;
  updated_at: string;
  prescriptions?: Prescription[];
}

export interface Prescription {
  id: string;
  appointment_id: string;
  medicine: string;
  dosage: string;
  note?: string;
  created_at: string;
}

export interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  todayAppointments: number;
}