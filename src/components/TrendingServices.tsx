
import { useNavigate } from "react-router-dom";
import { useBooking } from "@/hooks/useBooking";
import { ARTISTS } from "@/data/artists";
import { SERVICES } from "@/data/services";
import type { ServiceItem } from "@/data/services";

const TRENDING: { artistId: string; serviceIdx: [number, number] }[] = [
  { artistId: "victoria", serviceIdx: [0, 0] }, // Lip Blushing
  { artistId: "victoria", serviceIdx: [0, 1] }, // Powder Brows
  { artistId: "cindy",    serviceIdx: [0, 0] }, // Braut Make-up
  { artistId: "cindy",    serviceIdx: [2, 0] }, // Lash Lifting
  { artistId: "victoria", serviceIdx: [0, 2] }, // Eyeliner
];

const GRADIENTS = [
  "linear-gradient(135deg, #F2D5D0, #E8A0B4)",
  "linear-gradient(135deg, #DEC9A0, #C9A96E)",
  "linear-gradient(135deg, #E8A0B4, #B8879B)",
  "linear-gradient(135deg, #f9c5d1, #e07090)",
  "linear-gradient(135deg, #C9A96E, #a07840)",
];

export default function TrendingServices() {
  const navigate = useNavigate();
  const booking = useBooking();

  const items = TRENDING.map(({ artistId, serviceIdx: [ci, ii] }) => {
    const artist = ARTISTS.find((a) => a.id === artistId)!;
    const service: ServiceItem = SERVICES[artistId][ci].items[ii];
    return { artist, service };
  });

  return (
    <div className="pb-6">
      <div className="section-label px-5">Trending Services</div>
      <div className="flex gap-3.5 overflow-x-auto px-5 pb-3 pt-1" style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
        {items.map(({ artist, service }, i) => (
          <div
            key={i}
            className="flex-shrink-0 rounded-2xl p-5 pb-5 cursor-pointer transition-transform hover:-translate-y-1 flex flex-col justify-between"
            style={{
              width: 175,
              minHeight: 190,
              background: GRADIENTS[i % GRADIENTS.length],
              scrollSnapAlign: "start",
              boxShadow: "0 4px 16px -4px rgba(0,0,0,0.1)",
            }}
            onClick={() => {
              booking.setArtist(artist);
              booking.setService(service);
              navigate(`/book/${artist.id}`);
            }}
          >
            <div>
              <div className="text-4xl mb-4">{service.icon}</div>
              <div className="text-[15px] font-semibold text-white leading-tight mb-1">{service.name}</div>
              <div className="text-xs text-white opacity-80 mb-3">{artist.name}</div>
            </div>
            <div
              className="inline-block text-[11px] font-bold px-3 py-1 rounded-full self-start"
              style={{ background: "rgba(255,255,255,0.3)", color: "white" }}
            >
              {service.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
