import { Course, getTotalPar } from "@/lib/courseData";
import { Flight } from "@/lib/playerStore";

interface PlayerProfileCardProps {
  name: string;
  course: Course;
  scores: (number | null)[];
  handicap: number;
  flight: Flight;
}

const flightColors: Record<Flight, string> = {
  A: "bg-destructive text-destructive-foreground",
  B: "bg-primary text-primary-foreground",
  C: "bg-accent text-accent-foreground",
};

export default function PlayerProfileCard({ name, course, scores, handicap, flight }: PlayerProfileCardProps) {
  const totalScore = scores.reduce<number>((sum, s) => sum + (s ?? 0), 0);
  const totalPar = getTotalPar(course);
  const netScore = totalScore - handicap;
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
          <p className="text-xl font-bold">{handicap}</p>
        </div>
        <div className="rounded-lg bg-primary-foreground/10 p-3">
          <p className="text-[10px] uppercase tracking-wider text-primary-foreground/60">Net</p>
          <p className="text-xl font-bold">{hasScores ? netScore : "–"}</p>
        </div>
        <div className="rounded-lg bg-primary-foreground/10 p-3">
          <p className="text-[10px] uppercase tracking-wider text-primary-foreground/60">Flight</p>
          <p className={`mt-0.5 inline-block rounded px-2 py-0.5 text-sm font-black ${flightColors[flight]}`}>
            {flight}
          </p>
        </div>
      </div>
    </div>
  );
}
