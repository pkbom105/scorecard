import { CourseHole } from "@/lib/courseData";
import { Input } from "@/components/ui/input";

interface ScoreTableProps {
  holes: CourseHole[];
  scores: (number | null)[];
  onScoreChange: (index: number, value: number | null) => void;
  startIndex: number;
  label: string;
}

export default function ScoreTable({ holes, scores, onScoreChange, startIndex, label }: ScoreTableProps) {
  const totalPar = holes.reduce((s, h) => s + h.par, 0);
  const totalScore = holes.reduce((s, _, i) => s + (scores[startIndex + i] ?? 0), 0);
  const hasScores = holes.some((_, i) => scores[startIndex + i] !== null);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="bg-primary/5 px-4 py-2 font-semibold text-sm text-primary">{label}</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="px-3 py-2 text-left font-medium">Hole</th>
            <th className="px-3 py-2 text-center font-medium text-primary">Par</th>
            <th className="px-3 py-2 text-center font-medium">Score</th>
          </tr>
        </thead>
        <tbody>
          {holes.map((hole, i) => {
            const idx = startIndex + i;
            const score = scores[idx];
            const diff = score !== null && score !== undefined ? score - hole.par : null;
            return (
              <tr key={hole.hole} className="border-b border-border/50 last:border-0">
                <td className="px-3 py-2 font-medium text-muted-foreground">#{hole.hole}</td>
                <td className="px-3 py-2 text-center font-bold text-primary">{hole.par}</td>
                <td className="px-3 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={15}
                      value={score ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        onScoreChange(idx, v === "" ? null : parseInt(v, 10));
                      }}
                      className="h-8 w-16 text-center font-semibold"
                    />
                    {diff !== null && (
                      <span className={`text-xs font-bold min-w-[28px] ${
                        diff < 0 ? "text-primary" : diff > 0 ? "text-destructive" : "text-muted-foreground"
                      }`}>
                        {diff === 0 ? "E" : diff > 0 ? `+${diff}` : diff}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-muted/50 font-bold">
            <td className="px-3 py-2">Total</td>
            <td className="px-3 py-2 text-center text-primary">{totalPar}</td>
            <td className="px-3 py-2 text-center">{hasScores ? totalScore : "–"}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
