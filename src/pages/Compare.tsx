import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { LoadingPulse } from "@/components/LoadingStates";
import { useJourney } from "@/context/JourneyContext";
import { compareService } from "@/services/api";
import type { CompareSummary } from "@/types";

const SPEC_ROWS: { key: keyof CompareSummary["cars"][number]; label: string; suffix?: string }[] = [
  { key: "price", label: "Price", suffix: "L" },
  { key: "fuel_type", label: "Fuel" },
  { key: "transmission", label: "Transmission" },
  { key: "mileage", label: "Mileage", suffix: "km/l" },
  { key: "seating", label: "Seating" },
  { key: "boot_space", label: "Boot space", suffix: "L" },
  { key: "ground_clearance", label: "Ground clearance", suffix: "mm" },
  { key: "safety_rating", label: "Safety rating", suffix: "/5" },
  { key: "power", label: "Power" },
];

export function Compare() {
  const navigate = useNavigate();
  const location = useLocation();
  const { answers } = useJourney();
  const carIds: number[] = (location.state as { carIds?: number[] })?.carIds ?? [];

  const [data, setData] = useState<CompareSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (carIds.length < 2) {
      navigate("/recommendations");
      return;
    }
    compareService
      .compare(carIds, answers)
      .then(setData)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingPulse label="Lining up the specs..." />;
  if (!data) return null;

  return (
    <div className="min-h-screen px-6 py-16 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/recommendations")}
        className="flex items-center gap-2 text-(--color-ink-muted) hover:text-(--color-ink) text-sm mb-8"
      >
        <ArrowLeft size={16} /> Back to your cars
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl text-(--color-ink) mb-6">How they compare</h1>

        <GlassCard className="p-7 mb-8" glow>
          <p className="text-(--color-ink) leading-relaxed">{data.narrative}</p>
        </GlassCard>

        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left p-4 text-(--color-ink-faint) font-medium">Spec</th>
                  {data.cars.map((c) => (
                    <th key={c.id} className="text-left p-4 font-display font-semibold text-(--color-ink)">
                      {c.brand} {c.model}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPEC_ROWS.map((row) => (
                  <tr key={row.key} className="border-b border-white/5 last:border-0">
                    <td className="p-4 text-(--color-ink-faint)">{row.label}</td>
                    {data.cars.map((c) => (
                      <td key={c.id} className="p-4 text-(--color-ink) font-mono text-[13px]">
                        {String(c[row.key])}
                        {row.suffix ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="flex justify-center mt-10">
          <Button onClick={() => navigate("/summary")}>See my journey summary</Button>
        </div>
      </motion.div>
    </div>
  );
}
