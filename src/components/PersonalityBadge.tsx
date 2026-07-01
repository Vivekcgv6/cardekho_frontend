import { motion } from "framer-motion";
import type { Personality } from "@/types";

export function PersonalityBadge({ personality, size = 220 }: { personality: Personality; size?: number }) {
  const stroke = size * 0.045;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={personality.color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * 0.12 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 14px ${personality.color}88)` }}
        />
      </svg>
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
        className="flex items-center justify-center rounded-full glass-panel"
        style={{ width: size * 0.72, height: size * 0.72, fontSize: size * 0.28 }}
      >
        {personality.emoji}
      </motion.div>
    </div>
  );
}
