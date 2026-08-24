export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  dob?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  medicalHistory?: string | null;
  consentGiven: boolean;
  createdAt: string;
}

export interface Dentist {
  id: string;
  name: string;
}

export interface Appointment {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
  reason?: string | null;
  notes?: string | null;
  patient: { id: string; firstName: string; lastName: string; phone: string };
  dentist: { id: string; name: string };
}
