import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookmarkCheck, Printer } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { useJourney } from "@/context/JourneyContext";
import { journeyService } from "@/services/api";

const PRIORITY_LABELS: Record<string, string> = {
  safety: "Safety", mileage: "Mileage", performance: "Performance",
  maintenance: "Low maintenance", comfort: "Comfort", features: "Features",
  resale_value: "Resale value",
};

export function DecisionSummary() {
  const navigate = useNavigate();
  const { answers, results, markSaved, hasSavedJourney } = useJourney();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!results) navigate("/questionnaire");
  }, [results, navigate]);

  if (!results) return null;
  const top = results.recommendations[0];
  const alternatives = results.recommendations.slice(1);

  const handleSave = async () => {
    setSaving(true);
    try {
      await journeyService.save(
        answers,
        results.personality.key,
        results.recommendations.map((r) => r.car.id)
      );
    } catch {
      /* localStorage already persists everything — server save is a bonus, not a requirement */
    } finally {
      markSaved();
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-(--color-ember-soft) mb-3">Your journey summary</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-(--color-ink)">
          Here's everything, in one place.
        </h1>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryStat label="Budget" value={`₹${answers.budget_min}–${answers.budget_max}L`} />
        <SummaryStat label="Driving style" value={answers.primary_usage === "city" ? "City" : answers.primary_usage === "highway" ? "Highway" : "Mixed"} />
        <SummaryStat label="Family size" value={String(answers.family_size)} />
        <SummaryStat label="Personality" value={`${results.personality.emoji} ${results.personality.title.replace("The ", "")}`} />
      </div>

      {answers.priorities.length > 0 && (
        <GlassCard className="p-6 mb-6">
          <p className="text-xs uppercase tracking-widest text-(--color-ink-faint) mb-3">What mattered most</p>
          <div className="flex flex-wrap gap-2">
            {answers.priorities.map((p, i) => (
              <span key={p} className="text-sm glass-panel rounded-full px-3 py-1">
                {i + 1}. {PRIORITY_LABELS[p]}
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      {top && (
        <GlassCard className="p-6 mb-6" glow>
          <p className="text-xs uppercase tracking-widest text-(--color-ember-soft) mb-3">Top recommendation</p>
          <h3 className="font-display font-semibold text-xl mb-1">{top.car.brand} {top.car.model}</h3>
          <p className="text-(--color-ink-muted) text-sm mb-3">₹{top.car.price}L · {Math.round(top.score)}% confidence</p>
          <ul className="space-y-1">
            {top.confidence.reasons.slice(0, 4).map((r, i) => (
              <li key={i} className="text-sm text-(--color-ink-muted) flex gap-2">
                <span className="text-(--color-success)">✓</span> {r}
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {alternatives.length > 0 && (
        <GlassCard className="p-6 mb-8">
          <p className="text-xs uppercase tracking-widest text-(--color-ink-faint) mb-3">Also worth a look</p>
          <div className="space-y-2">
            {alternatives.map((a) => (
              <div key={a.car.id} className="flex items-center justify-between text-sm">
                <span className="text-(--color-ink)">{a.car.brand} {a.car.model}</span>
                <span className="text-(--color-ink-faint) font-mono text-xs">{Math.round(a.score)}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button variant="secondary" onClick={handleSave} disabled={saving}>
          <BookmarkCheck size={16} /> {hasSavedJourney ? "Journey saved" : saving ? "Saving..." : "Save My Journey"}
        </Button>
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer size={16} /> Download Summary
        </Button>
        <Button onClick={() => navigate("/goodbye")}>
          Finish up <ArrowRight size={17} />
        </Button>
      </div>

      {hasSavedJourney && (
        <p className="text-center text-xs text-(--color-ink-faint) mt-6">
          No pressure. We'll remember what matters to you. Come back whenever you're ready — your journey will be waiting.
        </p>
      )}
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel rounded-2xl p-4 text-center">
      <p className="text-[10px] uppercase tracking-wider text-(--color-ink-faint) mb-1">{label}</p>
      <p className="font-display font-semibold text-(--color-ink) text-sm">{value}</p>
    </div>
  );
}
