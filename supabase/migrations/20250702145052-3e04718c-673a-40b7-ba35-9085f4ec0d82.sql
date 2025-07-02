-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_age INTEGER NOT NULL,
  symptoms TEXT NOT NULL,
  appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
  doctor_name TEXT NOT NULL,
  patient_email TEXT,
  contact_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  medicine TEXT NOT NULL,
  dosage TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a doctor's dashboard)
CREATE POLICY "Allow all operations on appointments" 
ON public.appointments 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on prescriptions" 
ON public.prescriptions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.appointments (patient_name, patient_age, symptoms, appointment_time, status, doctor_name, patient_email, contact_number) VALUES
('Sarah Johnson', 34, 'Persistent cough, fever, fatigue', '2024-01-15T10:00:00Z', 'completed', 'Dr. Michael Chen', 'sarah.johnson@email.com', '+1-555-0123'),
('Robert Williams', 28, 'Headache, dizziness, nausea', '2024-01-15T14:30:00Z', 'pending', 'Dr. Emily Rodriguez', 'robert.williams@email.com', '+1-555-0124'),
('Maria Garcia', 45, 'High blood pressure, chest pain', '2024-01-14T09:15:00Z', 'completed', 'Dr. James Wilson', 'maria.garcia@email.com', '+1-555-0125'),
('David Brown', 52, 'Back pain, muscle stiffness', '2024-01-16T11:00:00Z', 'pending', 'Dr. Lisa Thompson', 'david.brown@email.com', '+1-555-0126'),
('Jennifer Davis', 29, 'Skin rash, itching, redness', '2024-01-16T15:45:00Z', 'pending', 'Dr. Michael Chen', 'jennifer.davis@email.com', '+1-555-0127'),
('Thomas Miller', 38, 'Stomach pain, indigestion', '2024-01-13T16:20:00Z', 'completed', 'Dr. Emily Rodriguez', 'thomas.miller@email.com', '+1-555-0128');

-- Insert sample prescriptions
INSERT INTO public.prescriptions (appointment_id, medicine, dosage, note) VALUES
((SELECT id FROM public.appointments WHERE patient_name = 'Sarah Johnson'), 'Amoxicillin 500mg', '1 tablet twice daily', 'Take with food. Complete the full course.'),
((SELECT id FROM public.appointments WHERE patient_name = 'Maria Garcia'), 'Lisinopril 10mg', '1 tablet once daily in the morning', 'Monitor blood pressure regularly. Take at the same time daily.');