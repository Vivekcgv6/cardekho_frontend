import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, MessageCircleQuestion, ShieldAlert, Scale, Sparkles, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { chatService } from "@/services/api";
import type { RecommendationItem, QuestionnaireAnswers } from "@/types";

export function CarCard({
  item,
  answers,
  isSelectedForCompare,
  onToggleCompare,
  badge,
}: {
  item: RecommendationItem;
  answers: QuestionnaireAnswers;
  isSelectedForCompare: boolean;
  onToggleCompare: () => void;
  badge?: string;
}) {
  const { car, score, confidence, meet_your_car } = item;
  const [showConfidence, setShowConfidence] = useState(false);
  const [panel, setPanel] = useState<"convince" | "why_not" | null>(null);
  const [panelText, setPanelText] = useState<string>("");
  const [loadingPanel, setLoadingPanel] = useState(false);

  const stars = Math.round((score / 100) * 5);

  const openPanel = async (kind: "convince" | "why_not") => {
    if (panel === kind) {
      setPanel(null);
      return;
    }
    setPanel(kind);
    setLoadingPanel(true);
    setPanelText("");
    try {
      const message =
        kind === "convince"
          ? "Give me a genuine, honest reason to feel good about this car for my situation."
          : "Be honest with me — what's the real trade-off or catch with this car for my situation?";
      const reply = await chatService.send(message, { carId: car.id, answers });
      setPanelText(reply);
    } catch {
      setPanelText("I couldn't reach my AI service just now — try again in a moment.");
    } finally {
      setLoadingPanel(false);
    }
  };

  return (
    <GlassCard className="p-6 flex flex-col relative" glow>
      {badge && (
        <div className="absolute -top-3 left-6 rounded-full bg-(--color-ember) text-(--color-base) text-xs font-semibold px-3 py-1">
          {badge}
        </div>
      )}

      <div className="rounded-2xl overflow-hidden h-44 mb-5 bg-white/5">
        <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" loading="lazy" />
      </div>

      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="font-display font-semibold text-xl text-(--color-ink)">
            {car.brand} {car.model}
          </h3>
          <p className="text-(--color-ink-faint) text-xs">{car.variant} · ₹{car.price}L</p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} className={i < stars ? "fill-(--color-ember) text-(--color-ember)" : "text-white/15"} />
          ))}
        </div>
      </div>

      <p className="text-(--color-ink-muted) text-sm leading-relaxed mt-4">{meet_your_car.story}</p>

      <div className="grid grid-cols-2 gap-4 mt-5 text-xs">
        <div>
          <p className="text-(--color-success) font-semibold mb-1.5">Best for</p>
          <ul className="space-y-1 text-(--color-ink-muted)">
            {meet_your_car.best_for.map((b, i) => (
              <li key={i}>· {b}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-(--color-danger) font-semibold mb-1.5">Avoid if</p>
          <ul className="space-y-1 text-(--color-ink-muted)">
            {meet_your_car.avoid_if.map((a, i) => (
              <li key={i}>· {a}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={() => setShowConfidence((s) => !s)}
        className="mt-5 flex items-center justify-between text-sm font-medium text-(--color-ink) hover:text-(--color-ember-soft) transition-colors"
      >
        <span>Confidence: {Math.round(score)}%</span>
        <ChevronDown size={16} className={`transition-transform ${showConfidence ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {showConfidence && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-1.5">
              {confidence.reasons.map((r, i) => (
                <p key={i} className="text-xs text-(--color-ink-muted) flex gap-1.5">
                  <span className="text-(--color-success)">✓</span> {r}
                </p>
              ))}
              {confidence.tradeoffs.map((t, i) => (
                <p key={i} className="text-xs text-(--color-ink-faint) flex gap-1.5">
                  <span className="text-(--color-danger)">!</span> {t}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-3 gap-2 mt-6">
        <button
          onClick={() => openPanel("convince")}
          className="flex flex-col items-center gap-1 rounded-xl glass-panel py-2.5 text-[11px] text-(--color-ink-muted) hover:text-(--color-ink) hover:bg-(--color-surface-hover) transition-colors"
        >
          <Sparkles size={15} /> Convince Me
        </button>
        <button
          onClick={() => openPanel("why_not")}
          className="flex flex-col items-center gap-1 rounded-xl glass-panel py-2.5 text-[11px] text-(--color-ink-muted) hover:text-(--color-ink) hover:bg-(--color-surface-hover) transition-colors"
        >
          <ShieldAlert size={15} /> Why Not
        </button>
        <button
          onClick={onToggleCompare}
          className={`flex flex-col items-center gap-1 rounded-xl py-2.5 text-[11px] transition-colors ${
            isSelectedForCompare
              ? "bg-(--color-ember) text-(--color-base)"
              : "glass-panel text-(--color-ink-muted) hover:text-(--color-ink) hover:bg-(--color-surface-hover)"
          }`}
        >
          <Scale size={15} /> Compare
        </button>
      </div>

      <AnimatePresence>
        {panel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl bg-(--color-ember-dim) border border-(--color-ember)/20 p-4 text-[13px] text-(--color-ink) leading-relaxed flex gap-2.5">
              <MessageCircleQuestion size={15} className="shrink-0 mt-0.5 text-(--color-ember)" />
              {loadingPanel ? (
                <span className="flex items-center gap-2 text-(--color-ink-muted)">
                  <Loader2 size={13} className="animate-spin" /> Thinking it through...
                </span>
              ) : (
                <span>{panelText}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
