import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { BookingProvider } from "@/hooks/useBooking";
import Home from "@/pages/Home";
import ArtistProfile from "@/pages/ArtistProfile";
import Booking from "@/pages/Booking";
import Confirmation from "@/pages/Confirmation";
import Auth from "@/pages/Auth";
import Settings from "@/pages/Settings";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import NotFound from "@/pages/NotFound";
import BottomNav from "@/components/BottomNav";

const queryClient = new QueryClient();

function AppRoutes() {
  const { pathname } = useLocation();
  const hideNav = pathname.startsWith("/admin");

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artist/:id" element={<ArtistProfile />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/book/:artistId" element={<Booking />} />
        <Route path="/confirm" element={<Confirmation />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BookingProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </BookingProvider>
  </QueryClientProvider>
);

export default App;
