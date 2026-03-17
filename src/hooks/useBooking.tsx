import { createContext, useContext, useState, type ReactNode } from "react";
import type { Artist } from "@/data/artists";
import type { ServiceItem } from "@/data/services";

interface BookingState {
  artist: Artist | null;
  services: ServiceItem[];
  date: Date | null;
  time: string | null;
  form: { name: string; phone: string; email: string; notes: string };
  favorites: string[];
}

interface BookingContextType extends BookingState {
  /** @deprecated use services + toggleService */
  service: ServiceItem | null;
  setArtist: (a: Artist | null) => void;
  /** @deprecated use toggleService */
  setService: (s: ServiceItem | null) => void;
  toggleService: (s: ServiceItem) => void;
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
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleService = (s: ServiceItem) =>
    setServices((prev) =>
      prev.some((x) => x.name === s.name)
        ? prev.filter((x) => x.name !== s.name)
        : [...prev, s]
    );

  const setService = (s: ServiceItem | null) => {
    if (s) setServices([s]);
    else setServices([]);
  };

  const toggleFavorite = (name: string) =>
    setFavorites((f) =>
      f.includes(name) ? f.filter((x) => x !== name) : [...f, name]
    );

  const reset = () => {
    setArtist(null);
    setServices([]);
    setDate(null);
    setTime(null);
    setForm(initialForm);
  };

  return (
    <BookingContext.Provider
      value={{
        artist,
        services,
        service: services[0] || null,
        date,
        time,
        form,
        favorites,
        setArtist,
        setService,
        toggleService,
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
