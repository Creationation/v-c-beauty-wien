
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 216, suffix: "+", label: "Kundinnen" },
  { value: 5,   suffix: ".0\u2605", label: "Bewertung" },
  { value: 8,   suffix: " J.", label: "Erfahrung" },
];

function useCountUp(target: number, duration = 1200, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatItem({ value, suffix, label, active }: { value: number; suffix: string; label: string; active: boolean }) {
  const count = useCountUp(value, 1000, active);
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="font-display text-[22px] font-semibold" style={{ color: "var(--rose-deep)" }}>
        {count}{suffix}
      </div>
      <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--txt3)" }}>
        {label}
      </div>
    </div>
  );
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="mx-5 mb-6 bg-white rounded-2xl py-5 px-4 grid grid-cols-3 divide-x divide-[var(--cream2)]" style={{ boxShadow: "var(--shadow-sm)" }}>
      {STATS.map((s) => (
        <StatItem key={s.label} {...s} active={active} />
      ))}
    </div>
  );
}
