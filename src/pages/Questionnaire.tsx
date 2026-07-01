import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { ProgressDots } from "@/components/ProgressDots";
import { QuoteLine } from "@/components/QuoteLine";
import { useJourney } from "@/context/JourneyContext";
import { getQuote } from "@/utils/quotes";
import { recommendService } from "@/services/api";
import type { Priority } from "@/types";

const FUEL_OPTIONS = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const BODY_OPTIONS = ["Hatchback", "Sedan", "SUV", "MUV"];
const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "safety", label: "Safety" },
  { value: "mileage", label: "Mileage" },
  { value: "performance", label: "Performance" },
  { value: "maintenance", label: "Low maintenance" },
  { value: "comfort", label: "Comfort" },
  { value: "features", label: "Features" },
  { value: "resale_value", label: "Resale value" },
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium border transition-all ${
        active
          ? "bg-(--color-ember) text-(--color-base) border-(--color-ember)"
          : "glass-panel text-(--color-ink-muted) hover:text-(--color-ink) hover:border-white/20"
      }`}
    >
      {children}
    </button>
  );
}

export function Questionnaire() {
  const navigate = useNavigate();
  const { answers, updateAnswers, setResults } = useJourney();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quote = useMemo(() => getQuote(answers.visit_reason, step), [answers.visit_reason, step]);

  const toggleInList = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const togglePriority = (p: Priority) => {
    const current = answers.priorities;
    if (current.includes(p)) {
      updateAnswers({ priorities: current.filter((x) => x !== p) });
    } else if (current.length < 3) {
      updateAnswers({ priorities: [...current, p] });
    }
  };

  const steps = [
    {
      title: "What's your budget?",
      subtitle: "Give me a range — nothing's locked in.",
      body: (
        <div className="space-y-6">
          <div className="flex justify-between font-mono text-(--color-ember) text-2xl font-semibold">
            <span>₹{answers.budget_min}L</span>
            <span className="text-(--color-ink-faint)">to</span>
            <span>₹{answers.budget_max}L</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-(--color-ink-faint) mb-2 block">Minimum</label>
              <input
                type="range" min={2} max={50} step={0.5}
                value={answers.budget_min}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  updateAnswers({ budget_min: v, budget_max: Math.max(v + 1, answers.budget_max) });
                }}
                className="w-full accent-(--color-ember)"
              />
            </div>
            <div>
              <label className="text-xs text-(--color-ink-faint) mb-2 block">Maximum</label>
              <input
                type="range" min={3} max={50} step={0.5}
                value={answers.budget_max}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  updateAnswers({ budget_max: v, budget_min: Math.min(v - 1, answers.budget_min) });
                }}
                className="w-full accent-(--color-ember)"
              />
            </div>
          </div>
        </div>
      ),
      valid: true,
    },
    {
      title: "Any fuel type in mind?",
      subtitle: "Pick as many as you're open to. None selected means you're open to anything.",
      body: (
        <div className="flex flex-wrap gap-2.5">
          {FUEL_OPTIONS.map((f) => (
            <Chip key={f} active={answers.fuel_types.includes(f)} onClick={() => updateAnswers({ fuel_types: toggleInList(answers.fuel_types, f) })}>
              {f}
            </Chip>
          ))}
        </div>
      ),
      valid: true,
    },
    {
      title: "Manual or automatic?",
      subtitle: "Whatever makes your daily drive easier.",
      body: (
        <div className="flex gap-3">
          {(["Manual", "Automatic", "either"] as const).map((t) => (
            <Chip key={t} active={answers.transmission === t} onClick={() => updateAnswers({ transmission: t })}>
              {t === "either" ? "No preference" : t}
            </Chip>
          ))}
        </div>
      ),
      valid: true,
    },
    {
      title: "How many people usually ride with you?",
      subtitle: "Include yourself.",
      body: (
        <div className="flex items-center gap-6">
          <button
            onClick={() => updateAnswers({ family_size: Math.max(1, answers.family_size - 1) })}
            className="w-11 h-11 rounded-full glass-panel text-xl hover:bg-(--color-surface-hover)"
          >
            −
          </button>
          <span className="font-display text-4xl font-semibold w-16 text-center">{answers.family_size}</span>
          <button
            onClick={() => updateAnswers({ family_size: Math.min(8, answers.family_size + 1) })}
            className="w-11 h-11 rounded-full glass-panel text-xl hover:bg-(--color-surface-hover)"
          >
            +
          </button>
        </div>
      ),
      valid: true,
    },
    {
      title: "Where do you drive most?",
      subtitle: "Pick the one that's closest to true.",
      body: (
        <div className="flex flex-wrap gap-3">
          {(["city", "highway", "mixed"] as const).map((u) => (
            <Chip key={u} active={answers.primary_usage === u} onClick={() => updateAnswers({ primary_usage: u })}>
              {u === "city" ? "Mostly city" : u === "highway" ? "Mostly highway" : "A mix of both"}
            </Chip>
          ))}
        </div>
      ),
      valid: true,
    },
    {
      title: "Roughly how far do you drive in a day?",
      subtitle: "A rough guess is perfectly fine.",
      body: (
        <div className="space-y-4">
          <div className="font-mono text-(--color-ember) text-2xl font-semibold">{answers.daily_distance_km} km</div>
          <input
            type="range" min={0} max={150} step={5}
            value={answers.daily_distance_km}
            onChange={(e) => updateAnswers({ daily_distance_km: Number(e.target.value) })}
            className="w-full accent-(--color-ember)"
          />
        </div>
      ),
      valid: true,
    },
    {
      title: "Any body type calling out to you?",
      subtitle: "Optional — leave it blank and I'll consider everything.",
      body: (
        <div className="flex flex-wrap gap-2.5">
          {BODY_OPTIONS.map((b) => (
            <Chip key={b} active={answers.body_types.includes(b)} onClick={() => updateAnswers({ body_types: toggleInList(answers.body_types, b) })}>
              {b}
            </Chip>
          ))}
        </div>
      ),
      valid: true,
    },
    {
      title: "What matters most to you?",
      subtitle: `Pick up to 3, in order of importance. ${answers.priorities.length}/3 selected.`,
      body: (
        <div className="flex flex-wrap gap-2.5">
          {PRIORITY_OPTIONS.map((p) => {
            const rank = answers.priorities.indexOf(p.value);
            return (
              <Chip key={p.value} active={rank !== -1} onClick={() => togglePriority(p.value)}>
                {rank !== -1 ? `${rank + 1}. ` : ""}{p.label}
              </Chip>
            );
          })}
        </div>
      ),
      valid: true,
    },
  ];

  const isLast = step === steps.length - 1;
  const current = steps[step];

  const goNext = async () => {
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const results = await recommendService.recommend(answers);
      setResults(results);
      navigate("/reveal");
    } catch {
      setError("Something went wrong reaching the recommendation engine. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    if (step === 0) navigate("/");
    else setStep((s) => s - 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-10">
          <button onClick={goBack} className="text-(--color-ink-muted) hover:text-(--color-ink) transition-colors">
            <ArrowLeft size={20} />
          </button>
          <ProgressDots total={steps.length} current={step} />
          <div className="w-5" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-8 md:p-10" glow>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-(--color-ink) mb-2">
                {current.title}
              </h2>
              <p className="text-(--color-ink-muted) text-sm mb-8">{current.subtitle}</p>
              {current.body}
            </GlassCard>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 text-center min-h-[3rem]">
          <QuoteLine text={quote} />
        </div>

        {error && <p className="text-(--color-danger) text-sm text-center mb-4">{error}</p>}

        <div className="flex justify-center mt-4">
          <Button onClick={goNext} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={17} className="animate-spin" /> Finding your matches
              </>
            ) : isLast ? (
              <>
                Reveal my matches <ArrowRight size={17} />
              </>
            ) : (
              <>
                Continue <ArrowRight size={17} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
