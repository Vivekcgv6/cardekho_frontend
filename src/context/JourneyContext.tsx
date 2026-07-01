import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { QuestionnaireAnswers, RecommendResponse } from "@/types";

const STORAGE_KEY = "mrwisedrive_journey_v1";

export const DEFAULT_ANSWERS: QuestionnaireAnswers = {
  visit_reason: "no_idea",
  budget_min: 5,
  budget_max: 15,
  fuel_types: [],
  transmission: "either",
  family_size: 2,
  primary_usage: "mixed",
  daily_distance_km: 20,
  body_types: [],
  priorities: [],
  brand_preference: null,
};

interface JourneyState {
  answers: QuestionnaireAnswers;
  results: RecommendResponse | null;
  savedAt: string | null;
}

interface JourneyContextValue extends JourneyState {
  updateAnswers: (partial: Partial<QuestionnaireAnswers>) => void;
  setResults: (results: RecommendResponse | null) => void;
  resetJourney: () => void;
  markSaved: () => void;
  hasSavedJourney: boolean;
}

const JourneyContext = createContext<JourneyContextValue | undefined>(undefined);

function loadFromStorage(): JourneyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { answers: DEFAULT_ANSWERS, results: null, savedAt: null };
    const parsed = JSON.parse(raw);
    return {
      answers: { ...DEFAULT_ANSWERS, ...parsed.answers },
      results: parsed.results ?? null,
      savedAt: parsed.savedAt ?? null,
    };
  } catch {
    return { answers: DEFAULT_ANSWERS, results: null, savedAt: null };
  }
}

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<JourneyState>(loadFromStorage);

  useEffect(() => {
    // Persist quietly on every change — "Save My Journey" just confirms the
    // moment explicitly (via markSaved's timestamp), it doesn't gate storage.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateAnswers = (partial: Partial<QuestionnaireAnswers>) => {
    setState((prev) => ({ ...prev, answers: { ...prev.answers, ...partial } }));
  };

  const setResults = (results: RecommendResponse | null) => {
    setState((prev) => ({ ...prev, results }));
  };

  const resetJourney = () => {
    setState({ answers: DEFAULT_ANSWERS, results: null, savedAt: null });
  };

  const markSaved = () => {
    setState((prev) => ({ ...prev, savedAt: new Date().toISOString() }));
  };

  return (
    <JourneyContext.Provider
      value={{ ...state, updateAnswers, setResults, resetJourney, markSaved, hasSavedJourney: !!state.savedAt }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney must be used within a JourneyProvider");
  return ctx;
}
