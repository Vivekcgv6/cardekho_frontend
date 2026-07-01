import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Share2, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { PersonalityBadge } from "@/components/PersonalityBadge";
import { useJourney } from "@/context/JourneyContext";
import { downloadBadge } from "@/utils/badgeCanvas";

export function PersonalityReveal() {
  const navigate = useNavigate();
  const { results } = useJourney();

  useEffect(() => {
    if (!results) navigate("/questionnaire");
  }, [results, navigate]);

  if (!results) return null;
  const { personality, insight } = results;

  const handleShare = async () => {
    const text = `I'm "${personality.title}" ${personality.emoji} — ${personality.tagline} Find yours at MrWiseDrive.`;
    if (navigator.share) {
      try {
        await navigator.share({ text, title: "My MrWiseDrive Driving Personality" });
        return;
      } catch {
        /* user cancelled, fall through to clipboard */
      }
    }
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs uppercase tracking-[0.2em] text-(--color-ink-faint) mb-6"
      >
        Your driving personality
      </motion.p>

      <PersonalityBadge personality={personality} size={240} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="text-center mt-8 max-w-lg"
      >
        <h1 className="font-display font-bold text-3xl md:text-4xl text-(--color-ink)">
          {personality.title}
        </h1>
        <p className="mt-3 italic text-(--color-ink-muted)">"{personality.tagline}"</p>
        <p className="mt-4 text-(--color-ink-muted) text-sm leading-relaxed">{personality.description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex gap-3 mt-8"
      >
        <Button variant="secondary" onClick={handleShare}>
          <Share2 size={16} /> Share Result
        </Button>
        <Button variant="secondary" onClick={() => downloadBadge(personality)}>
          <Download size={16} /> Download Badge
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="w-full max-w-xl mt-12"
      >
        <GlassCard className="p-7">
          <p className="text-xs uppercase tracking-widest text-(--color-ember-soft) mb-3 font-semibold">
            AI Insight
          </p>
          <p className="text-(--color-ink) text-[15px] leading-relaxed whitespace-pre-line">{insight}</p>
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="mt-10">
        <Button onClick={() => navigate("/recommendations")}>
          Meet your cars <ArrowRight size={17} />
        </Button>
      </motion.div>
    </div>
  );
}
