
export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  artist: "victoria" | "cindy";
  service: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  price: string;
  notes?: string;
}

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: "1",  clientName: "Sophie M.",    clientPhone: "+43 660 111 2233", artist: "victoria", service: "Lip Blushing",       date: "2026-03-17", time: "09:00", status: "confirmed",  price: "ab 280€", notes: "Erstkunde, natural look" },
  { id: "2",  clientName: "Anna K.",      clientPhone: "+43 664 222 3344", artist: "victoria", service: "Powder Brows",       date: "2026-03-17", time: "11:00", status: "confirmed",  price: "ab 250€" },
  { id: "3",  clientName: "Maria L.",     clientPhone: "+43 699 333 4455", artist: "cindy",    service: "Braut Make-up",      date: "2026-03-17", time: "14:00", status: "pending",    price: "auf Anfrage", notes: "Hochzeit 22. April" },
  { id: "4",  clientName: "Julia W.",     clientPhone: "+43 650 444 5566", artist: "victoria", service: "Full Face Sugaring", date: "2026-03-18", time: "09:30", status: "pending",    price: "25€" },
  { id: "5",  clientName: "Lisa R.",      clientPhone: "+43 676 555 6677", artist: "cindy",    service: "Lash Lifting",       date: "2026-03-18", time: "10:00", status: "confirmed",  price: "auf Anfrage" },
  { id: "6",  clientName: "Nina H.",      clientPhone: "+43 660 666 7788", artist: "cindy",    service: "Einzelcoaching",     date: "2026-03-18", time: "13:00", status: "confirmed",  price: "auf Anfrage" },
  { id: "7",  clientName: "Eva S.",       clientPhone: "+43 664 777 8899", artist: "victoria", service: "Eyeliner",           date: "2026-03-19", time: "09:00", status: "pending",    price: "ab 200€" },
  { id: "8",  clientName: "Lena P.",      clientPhone: "+43 699 888 9900", artist: "cindy",    service: "Abend Make-up",      date: "2026-03-19", time: "15:00", status: "confirmed",  price: "auf Anfrage" },
  { id: "9",  clientName: "Clara B.",     clientPhone: "+43 650 999 0011", artist: "victoria", service: "Lip Auffrischung",   date: "2026-03-20", time: "10:00", status: "pending",    price: "ab 150€" },
  { id: "10", clientName: "Mia F.",       clientPhone: "+43 676 000 1122", artist: "cindy",    service: "Lash & Brow Kombi",  date: "2026-03-20", time: "11:30", status: "confirmed",  price: "auf Anfrage" },
  { id: "11", clientName: "Lea T.",       clientPhone: "+43 660 111 3344", artist: "victoria", service: "Deep Bikini",        date: "2026-03-21", time: "09:00", status: "completed",  price: "30€" },
  { id: "12", clientName: "Sara G.",      clientPhone: "+43 664 222 4455", artist: "cindy",    service: "Braut Hairstyling",  date: "2026-03-21", time: "13:00", status: "completed",  price: "auf Anfrage", notes: "Hochzeit am selben Tag" },
  { id: "13", clientName: "Hanna R.",     clientPhone: "+43 699 333 5566", artist: "victoria", service: "Brows Auffrischung", date: "2026-03-22", time: "10:30", status: "pending",    price: "ab 130€" },
  { id: "14", clientName: "Petra V.",     clientPhone: "+43 650 444 6677", artist: "cindy",    service: "Event Make-up",      date: "2026-03-22", time: "14:00", status: "pending",    price: "auf Anfrage" },
  { id: "15", clientName: "Kathrin W.",   clientPhone: "+43 676 555 7788", artist: "victoria", service: "Full Legs Sugaring", date: "2026-03-24", time: "09:30", status: "pending",    price: "40€" },
];
