// Appointment data is now stored in Supabase (appointments table).
// This file keeps the types for TypeScript compatibility.

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  artist_id: string;
  artist_name: string;
  service: string;
  service_price: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string;
  notify_24h: boolean;
  notify_2h: boolean;
  reminder_24h_sent: boolean;
  reminder_2h_sent: boolean;
  confirmation_sent: boolean;
  created_at: string;
}

export interface NotificationSettings {
  id: number;
  resend_api_key: string;
  studio_email: string;
  artist_victoria_email: string;
  artist_cindy_email: string;
  email_confirmation_enabled: boolean;
  email_24h_enabled: boolean;
  email_2h_enabled: boolean;
}

// Legacy mock data cleared — data now lives in Supabase
export const MOCK_APPOINTMENTS: Appointment[] = [];
