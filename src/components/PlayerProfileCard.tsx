import { Course, getTotalPar } from "@/lib/courseData";
import { Flight } from "@/lib/playerStore";

interface PlayerProfileCardProps {
  name: string;
  course: Course;
  scores: (number | null)[];
}

export default function PlayerProfileCard({ name, course, scores }: PlayerProfileCardProps) {
  const totalScore = scores.reduce<number>((sum, s) => sum + (s ?? 0), 0);
  const totalPar = getTotalPar(course);
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

      <div className="mt-4 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-primary-foreground/10 p-3">
          <p className="text-[10px] uppercase tracking-wider text-primary-foreground/60">Total Par</p>
          <p className="text-xl font-bold">{totalPar}</p>
        </div>
        <div className="rounded-lg bg-primary-foreground/10 p-3">
          <p className="text-[10px] uppercase tracking-wider text-primary-foreground/60">Gross Score</p>
          <p className="text-xl font-bold">{hasScores ? totalScore : "–"}</p>
        </div>
      </div>
    </div>
  );
}
