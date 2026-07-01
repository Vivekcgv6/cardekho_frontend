import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/Button";
import { useJourney } from "@/context/JourneyContext";
import type { VisitReason } from "@/types";

const REASONS: { value: VisitReason; label: string; hint: string }[] = [
  { value: "buying_soon", label: "Buying soon", hint: "Let's find your shortlist" },
  { value: "planning_ahead", label: "Planning ahead", hint: "No rush, let's think it through" },
  { value: "just_browsing", label: "Just browsing", hint: "Look around, no pressure" },
  { value: "no_idea", label: "I honestly have no idea", hint: "That's a perfectly good place to start" },
];

export function Landing() {
  const navigate = useNavigate();
  const { updateAnswers } = useJourney();

  const start = (reason: VisitReason) => {
    updateAnswers({ visit_reason: reason });
    navigate("/questionnaire");
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Ambient headlight-glow arcs — the automotive-night-drive signature */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,159,69,0.10) 0%, rgba(255,159,69,0) 60%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-20 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 mb-8 text-xs font-medium tracking-wide text-(--color-ember-soft)"
        >
          <Compass size={13} />
          YOUR AI CAR COMPANION
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-bold text-[2.75rem] leading-[1.08] md:text-6xl md:leading-[1.05] text-(--color-ink) tracking-tight"
        >
          Find the car that<br />
          <span className="text-(--color-ember)">feels right.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-(--color-ink-muted) text-lg leading-relaxed max-w-xl"
        >
          Whether you're buying today, planning for next year, or simply exploring—
          I'm here to help you understand what actually fits you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="mt-10 flex flex-col items-center gap-6 w-full"
        >
          <Button onClick={() => navigate("/questionnaire")} className="w-full sm:w-auto">
            Start My Journey <ArrowRight size={17} />
          </Button>
          <button
            onClick={() => start("just_browsing")}
            className="text-(--color-ink-muted) hover:text-(--color-ink) text-sm underline underline-offset-4 decoration-white/20 transition-colors"
          >
            I'm just browsing
          </button>
        </motion.div>
      </main>

      {/* First question, presented as a quiet continuation rather than a form */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative px-6 pb-16 max-w-2xl mx-auto w-full"
      >
        <p className="text-center text-xs uppercase tracking-widest text-(--color-ink-faint) mb-4">
          What brings you here today?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REASONS.map((r) => (
            <button
              key={r.value}
              onClick={() => start(r.value)}
              className="glass-panel rounded-2xl px-5 py-4 text-left hover:bg-(--color-surface-hover) hover:border-(--color-ember)/30 transition-all group"
            >
              <div className="font-display font-medium text-(--color-ink) group-hover:text-(--color-ember-soft) transition-colors">
                {r.label}
              </div>
              <div className="text-xs text-(--color-ink-faint) mt-0.5">{r.hint}</div>
            </button>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
