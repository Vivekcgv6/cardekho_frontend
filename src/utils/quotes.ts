import type { VisitReason } from "@/types";

/**
 * Quotes are grouped by visit reason so the tone of the whole experience
 * shifts with why someone came — someone "just browsing" hears permission
 * to look around, someone "buying soon" hears something more decisive.
 * `general` is the shared pool used on screens that aren't reason-specific.
 */
const QUOTES: Record<VisitReason | "general", string[]> = {
  buying_soon: [
    "The right car isn't always the most expensive. It's the one you'll enjoy every single day.",
    "You don't need to know cars. That's my job.",
    "A good decision made quickly still counts as a good decision.",
  ],
  planning_ahead: [
    "Today's curiosity could become tomorrow's garage.",
    "Planning ahead isn't indecision. It's just decision, unhurried.",
    "The best time to understand what you want was before you needed it. The second best time is now.",
  ],
  just_browsing: [
    "Window shopping is free. Great decisions usually start here.",
    "Some people buy cars. Some simply dream. Both journeys deserve good advice.",
    "Nobody's tracking a clock. Look around as long as you'd like.",
  ],
  no_idea: [
    "Confused? Perfect. That's exactly why I exist.",
    "Not knowing where to start is a perfectly normal place to start.",
    "Cars are emotional. EMIs are practical. We'll untangle both.",
  ],
  general: [
    "Cars are emotional. EMIs are practical.",
    "Every great decision starts with someone willing to ask questions.",
    "Confidence isn't certainty. It's understanding your own reasons.",
  ],
};

export function getQuote(reason: VisitReason | null, seed?: number): string {
  const pool = reason ? QUOTES[reason] : QUOTES.general;
  const index = seed !== undefined ? seed % pool.length : Math.floor(Math.random() * pool.length);
  return pool[index];
}
