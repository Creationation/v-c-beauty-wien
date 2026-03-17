import { createContext, useContext, useState, type ReactNode } from "react";
import type { Artist } from "@/data/artists";
import type { ServiceItem } from "@/data/services";

interface BookingState {
  artist: Artist | null;
  service: ServiceItem | null;
  date: Date | null;
  time: string | null;
  form: { name: string; phone: string; email: string; notes: string };
  favorites: string[];
}

interface BookingContextType extends BookingState {
  setArtist: (a: Artist | null) => void;
  setService: (s: ServiceItem | null) => void;
  setDate: (d: Date | null) => void;
  setTime: (t: string | null) => void;
  setForm: (f: { name: string; phone: string; email: string; notes: string }) => void;
  toggleFavorite: (name: string) => void;
  reset: () => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

const initialForm = { name: "", phone: "", email: "", notes: "" };

export function BookingProvider({ children }: { children: ReactNode }) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [service, setService] = useState<ServiceItem | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (name: string) =>
    setFavorites((f) =>
      f.includes(name) ? f.filter((x) => x !== name) : [...f, name]
    );

  const reset = () => {
    setArtist(null);
    setService(null);
    setDate(null);
    setTime(null);
    setForm(initialForm);
  };

  return (
    <BookingContext.Provider
      value={{
        artist,
        service,
        date,
        time,
        form,
        favorites,
        setArtist,
        setService,
        setDate,
        setTime,
        setForm,
        toggleFavorite,
        reset,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
