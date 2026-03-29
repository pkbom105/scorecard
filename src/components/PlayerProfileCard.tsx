import { Course, getTotalPar } from "@/lib/courseData";
import { Flight } from "@/lib/playerStore";

interface PlayerProfileCardProps {
  name: string;
  course: Course;
  scores: (number | null)[];
  handicap?: number;
  flight?: string;
}

const flightColors: Record<string, string> = {
  A: "bg-destructive text-destructive-foreground",
  B: "bg-primary text-primary-foreground",
  C: "bg-accent text-accent-foreground",
};

export default function PlayerProfileCard({ name, course, scores, handicap, flight }: PlayerProfileCardProps) {
  const totalScore = scores.reduce<number>((sum, s) => sum + (s ?? 0), 0);
  const totalPar = getTotalPar(course);
  const netScore = handicap !== undefined ? totalScore - handicap : 0;
  const hasScores = scores.some((s) => s !== null);

  return (
    <div className="rounded-xl bg-golf-dark p-5 text-primary-foreground shadow-xl">
      <p className="text-xs uppercase tracking-widest text-golf-gold/80">Player Profile</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight">
        {name || "Enter Name..."}
      </h2>
      <p className="mt-1 text-sm text-primary-foreground/70">
        Course: <span className="font-semibold text-golf-gold">{course.name}</span>
      </p>

      <div className="mt-4 grid grid-cols-4 gap-3 text-center">
        <div className="rounded-lg bg-primary-foreground/10 p-3">
          <p className="text-[10px] uppercase tracking-wider text-primary-foreground/60">Gross</p>
          <p className="text-xl font-bold">{hasScores ? totalScore : "–"}</p>
        </div>
        <div className="rounded-lg bg-primary-foreground/10 p-3">
          <p className="text-[10px] uppercase tracking-wider text-primary-foreground/60">HDC</p>
          <p className="text-xl font-bold">{hasScores && handicap !== undefined ? handicap : "–"}</p>
        </div>
        <div className="rounded-lg bg-primary-foreground/10 p-3">
          <p className="text-[10px] uppercase tracking-wider text-primary-foreground/60">Net</p>
          <p className="text-xl font-bold">{hasScores && handicap !== undefined ? netScore : "–"}</p>
        </div>
        <div className="rounded-lg bg-primary-foreground/10 p-3">
          <p className="text-[10px] uppercase tracking-wider text-primary-foreground/60">Flight</p>
          <div className="flex justify-center mt-0.5">
            <p className={`rounded px-2 py-0.5 text-xs font-black ${hasScores && flight && flightColors[flight] ? flightColors[flight] : "bg-muted text-muted-foreground"}`}>
              {hasScores && flight ? flight : "–"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
