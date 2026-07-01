import { motion } from "framer-motion";

export function QuoteLine({ text }: { text: string }) {
  return (
    <motion.p
      key={text}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="font-display italic text-(--color-ink-muted) text-[15px] md:text-base leading-relaxed"
    >
      "{text}"
    </motion.p>
  );
}
