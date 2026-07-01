import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Send, RefreshCcw, Loader2, Scale } from "lucide-react";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { CarCard } from "@/components/CarCard";
import { useJourney } from "@/context/JourneyContext";
import { challengeService } from "@/services/api";

const CHALLENGE_SUGGESTIONS = [
  "What if my budget increases?",
  "What if I buy next year?",
  "What if fuel prices rise?",
  "What if I drive mostly highways?",
  "What if I have another child?",
  "Show me something sportier",
  "Recommend an SUV instead",
  "Recommend something underrated",
];

export function Recommendations() {
  const navigate = useNavigate();
  const { answers, results, setResults } = useJourney();
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [scenario, setScenario] = useState("");
  const [challenging, setChallenging] = useState(false);
  const [challengeNote, setChallengeNote] = useState<string | null>(null);

  useEffect(() => {
    if (!results) navigate("/questionnaire");
  }, [results, navigate]);

  if (!results) return null;

  const toggleCompare = (id: number) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const runChallenge = async (text: string) => {
    if (!text.trim()) return;
    setChallenging(true);
    setChallengeNote(null);
    try {
      const updated = await challengeService.challenge(text, answers);
      setResults(updated);
      setChallengeNote(updated.insight);
      setScenario("");
    } catch {
      setChallengeNote("Something went wrong updating your recommendations. Please try again.");
    } finally {
      setChallenging(false);
    }
  };

  const noneWork = results.recommendations.length === 0;

  return (
    <div className="min-h-screen px-6 py-16 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-(--color-ember-soft) mb-3">Meet your cars</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-(--color-ink)">
          Three cars worth your attention.
        </h1>
      </motion.div>

      {noneWork ? (
        <GlassCard className="p-10 max-w-lg mx-auto text-center">
          <h3 className="font-display text-xl mb-2">None of these feel right?</h3>
          <p className="text-(--color-ink-muted) text-sm mb-6">
            That's completely okay. The goal wasn't to sell you a car. It was to help you understand
            yourself as a buyer. Let's adjust a few priorities and try again.
          </p>
          <Button onClick={() => navigate("/questionnaire")}>Adjust my answers</Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.recommendations.map((item, i) => (
            <CarCard
              key={item.car.id}
              item={item}
              answers={answers}
              isSelectedForCompare={compareIds.includes(item.car.id)}
              onToggleCompare={() => toggleCompare(item.car.id)}
              badge={i === 0 ? "Top match" : undefined}
            />
          ))}
        </div>
      )}

      {results.surprise_pick && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-14">
          <p className="text-xs uppercase tracking-widest text-(--color-ink-faint) mb-4 text-center">
            An underrated pick most people overlook
          </p>
          <div className="max-w-sm mx-auto">
            <CarCard
              item={results.surprise_pick}
              answers={answers}
              isSelectedForCompare={compareIds.includes(results.surprise_pick.car.id)}
              onToggleCompare={() => toggleCompare(results.surprise_pick!.car.id)}
              badge="Surprise me"
            />
          </div>
        </motion.div>
      )}

      {/* Challenge My Recommendation */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-16">
        <GlassCard className="p-7 max-w-2xl mx-auto">
          <h3 className="font-display font-semibold text-lg mb-1">Challenge my recommendation</h3>
          <p className="text-(--color-ink-muted) text-sm mb-4">
            Life changes. Tell me what's different and I'll rethink this with you.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {CHALLENGE_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => runChallenge(s)}
                disabled={challenging}
                className="text-xs glass-panel rounded-full px-3 py-1.5 text-(--color-ink-muted) hover:text-(--color-ink) hover:bg-(--color-surface-hover) transition-colors disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runChallenge(scenario);
            }}
            className="flex gap-2"
          >
            <input
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="Or type your own what-if..."
              className="flex-1 rounded-full glass-panel px-4 py-2.5 text-sm text-(--color-ink) placeholder:text-(--color-ink-faint) outline-none focus:border-(--color-ember)/40"
            />
            <button
              type="submit"
              disabled={challenging}
              className="rounded-full bg-(--color-ember) text-(--color-base) w-11 h-11 flex items-center justify-center shrink-0 disabled:opacity-40"
            >
              {challenging ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>
          {challengeNote && (
            <p className="text-(--color-ember-soft) text-sm mt-4 flex items-start gap-2">
              <RefreshCcw size={14} className="mt-0.5 shrink-0" /> {challengeNote}
            </p>
          )}
        </GlassCard>
      </motion.div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14">
        {compareIds.length >= 2 && (
          <Button variant="secondary" onClick={() => navigate("/compare", { state: { carIds: compareIds } })}>
            <Scale size={16} /> Compare {compareIds.length} cars
          </Button>
        )}
        <Button onClick={() => navigate("/summary")}>
          See my journey summary <ArrowRight size={17} />
        </Button>
      </div>
    </div>
  );
}
