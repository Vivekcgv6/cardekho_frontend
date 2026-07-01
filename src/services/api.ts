import axios from "axios";
import type {
  Car,
  QuestionnaireAnswers,
  RecommendResponse,
  CompareSummary,
  ChatMessage,
} from "@/types";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL,
  timeout: 20000,
});

export const carService = {
  list: async (filters?: { body_type?: string; fuel_type?: string; max_price?: number }) => {
    const { data } = await api.get<Car[]>("/cars", { params: filters });
    return data;
  },
  get: async (id: number) => {
    const { data } = await api.get<Car>(`/cars/${id}`);
    return data;
  },
};

export const recommendService = {
  recommend: async (answers: QuestionnaireAnswers) => {
    const { data } = await api.post<RecommendResponse>("/recommend", answers);
    return data;
  },
};

export const compareService = {
  compare: async (carIds: number[], answers?: QuestionnaireAnswers | null) => {
    const { data } = await api.post<CompareSummary>("/compare", {
      car_ids: carIds,
      answers: answers ?? null,
    });
    return data;
  },
};

export const chatService = {
  send: async (
    message: string,
    opts: { carId?: number; answers?: QuestionnaireAnswers | null; history?: ChatMessage[] } = {}
  ) => {
    const { data } = await api.post<{ reply: string }>("/chat", {
      message,
      car_id: opts.carId ?? null,
      answers: opts.answers ?? null,
      history: opts.history ?? [],
    });
    return data.reply;
  },
};

export const challengeService = {
  challenge: async (scenario: string, answers: QuestionnaireAnswers) => {
    const { data } = await api.post<RecommendResponse>("/challenge", { scenario, answers });
    return data;
  },
};

export const journeyService = {
  save: async (answers: QuestionnaireAnswers, personalityKey?: string, topCarIds?: number[]) => {
    const { data } = await api.post<{ journey_id: string; message: string }>("/save-journey", {
      answers,
      personality_key: personalityKey ?? null,
      top_car_ids: topCarIds ?? [],
    });
    return data;
  },
};
