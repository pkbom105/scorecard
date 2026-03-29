import { Flight } from "./playerStore";

export interface FlightConfig {
  flight: Flight;
  min: number;
  max: number;
  label: string;
  headerClass: string;
}

export const DEFAULT_FLIGHT_CONFIG: FlightConfig[] = [
  { flight: "A", min: 0, max: 9, label: "FLIGHT A", headerClass: "bg-destructive text-destructive-foreground" },
  { flight: "B", min: 10, max: 18, label: "FLIGHT B", headerClass: "bg-primary text-primary-foreground" },
  { flight: "C", min: 19, max: 100, label: "FLIGHT C", headerClass: "bg-accent text-accent-foreground" },
];

export const DEFAULT_COURSE_PAR = [
  { hole: 1, par: 4 }, { hole: 2, par: 4 }, { hole: 3, par: 3 }, { hole: 4, par: 5 }, { hole: 5, par: 4 }, { hole: 6, par: 4 }, 
  { hole: 7, par: 3 }, { hole: 8, par: 5 }, { hole: 9, par: 4 }, { hole: 10, par: 4 }, { hole: 11, par: 4 }, { hole: 12, par: 3 }, 
  { hole: 13, par: 5 }, { hole: 14, par: 4 }, { hole: 15, par: 4 }, { hole: 16, par: 3 }, { hole: 17, par: 5 }, { hole: 18, par: 4 }
];

export const getStoredConfig = (): FlightConfig[] => {
  if (typeof window === "undefined") return DEFAULT_FLIGHT_CONFIG;
  const saved = localStorage.getItem("golf_flight_config");
  return saved ? JSON.parse(saved) : DEFAULT_FLIGHT_CONFIG;
};

export const calculateFlightByHdc = (hdc: number, configs: FlightConfig[]): Flight => {
  const found = configs.find(c => hdc >= c.min && hdc <= c.max);
  return found ? found.flight : "C"; // Default เป็น C ถ้าไม่ตรงเงื่อนไข
};

export const calculateSystem36Hdc = (scores: (number | null)[], coursePars: number[]): number => {
  let points = 0;
  for (let i = 0; i < 18; i++) {
    const score = scores[i];
    const par = coursePars[i] || 4;
    
    // Ignore unplayed holes for points
    if (score === null || score === undefined) continue;

    const diff = score - par;
    if (diff <= 0) {
      points += 2; // Par or better
    } else if (diff === 1) {
      points += 1; // Bogey
    } else {
      points += 0; // Double bogey or worse
    }
  }
  return 36 - points;
};