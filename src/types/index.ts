export type VisitReason = "buying_soon" | "planning_ahead" | "just_browsing" | "no_idea";
export type UsageType = "city" | "highway" | "mixed";
export type Priority =
  | "safety"
  | "mileage"
  | "performance"
  | "maintenance"
  | "comfort"
  | "features"
  | "resale_value";

export interface Car {
  id: number;
  brand: string;
  model: string;
  variant: string;
  price: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  seating: number;
  mileage: number;
  engine: string;
  power: string;
  torque: string;
  ground_clearance: number;
  boot_space: number;
  safety_rating: number;
  features: string[];
  pros: string[];
  cons: string[];
  review_summary: string;
  image_url: string;
}

export interface QuestionnaireAnswers {
  visit_reason: VisitReason;
  budget_min: number;
  budget_max: number;
  fuel_types: string[];
  transmission: "Manual" | "Automatic" | "either";
  family_size: number;
  primary_usage: UsageType;
  daily_distance_km: number;
  body_types: string[];
  priorities: Priority[];
  brand_preference: string[] | null;
}

export interface Personality {
  key: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  color: string;
}

export interface Confidence {
  score: number;
  reasons: string[];
  tradeoffs: string[];
}

export interface MeetYourCar {
  headline: string;
  story: string;
  best_for: string[];
  avoid_if: string[];
}

export interface RecommendationItem {
  car: Car;
  score: number;
  confidence: Confidence;
  meet_your_car: MeetYourCar;
}

export interface RecommendResponse {
  personality: Personality;
  insight: string;
  recommendations: RecommendationItem[];
  surprise_pick: RecommendationItem | null;
}

export interface CompareSummary {
  narrative: string;
  cars: Car[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
