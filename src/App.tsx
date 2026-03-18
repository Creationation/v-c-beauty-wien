import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BookingProvider } from "@/hooks/useBooking";
import Home from "@/pages/Home";
import ArtistProfile from "@/pages/ArtistProfile";
import Booking from "@/pages/Booking";
import Confirmation from "@/pages/Confirmation";
import Auth from "@/pages/Auth";
import Settings from "@/pages/Settings";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BookingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/book" element={<Booking />} />
          <Route path="/book/:artistId" element={<Booking />} />
          <Route path="/confirm" element={<Confirmation />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </BookingProvider>
  </QueryClientProvider>
);

export default App;
