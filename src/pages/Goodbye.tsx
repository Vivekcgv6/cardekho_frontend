import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/Button";
import { useJourney } from "@/context/JourneyContext";

export function Goodbye() {
  const navigate = useNavigate();
  const { resetJourney } = useJourney();

  const startOver = () => {
    resetJourney();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,159,69,0.08) 0%, transparent 60%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-xl relative"
      >
        <p className="font-display text-2xl md:text-3xl leading-relaxed text-(--color-ink)">
          You came here confused.
          <br />
          Now you know exactly which three cars deserve your attention.
          <br />
          <span className="text-(--color-ink-muted)">That's progress.</span>
        </p>

        <p className="mt-8 text-(--color-ink-muted) leading-relaxed">
          Whether you buy today, next month, or next year — I hope this journey made the
          decision a little easier.
        </p>

        <p className="mt-6 font-display text-xl text-(--color-ember-soft)">Drive safe ❤️</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-12"
      >
        <Button variant="secondary" onClick={startOver}>
          <RotateCcw size={16} /> Start a new journey
        </Button>
      </motion.div>
    </div>
  );
}
