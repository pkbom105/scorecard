import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { courses, Course, getTotalPar } from "@/lib/courseData";
import { savePlayer, Flight } from "@/lib/playerStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PlayerProfileCard from "@/components/PlayerProfileCard";
import ScoreTable from "@/components/ScoreTable";
import CourseSelector from "@/components/CourseSelector";
import { toast } from "sonner";

const flights: Flight[] = ["A", "B", "C"];

export default function ScoreEntry() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0]);
  const [scores, setScores] = useState<(number | null)[]>(Array(18).fill(null));
  const [handicap, setHandicap] = useState<number>(0);
  const [flight, setFlight] = useState<Flight>("A");

  const handleCourseChange = (course: Course) => {
    setSelectedCourse(course);
    setScores(Array(18).fill(null));
  };

  const handleScoreChange = (index: number, value: number | null) => {
    setScores((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSave = () => {
    if (!playerName.trim()) {
      toast.error("Please enter a player name");
      return;
    }
    const totalScore = scores.reduce<number>((sum, s) => sum + (s ?? 0), 0);
    savePlayer({
      name: playerName.trim(),
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      scores: [...scores],
      totalScore,
      totalPar: getTotalPar(selectedCourse),
      handicap,
      flight,
    });
    toast.success(`${playerName} saved!`);
    setPlayerName("");
    setScores(Array(18).fill(null));
    setHandicap(0);
  };

  const handleSaveAndView = () => {
    if (!playerName.trim()) {
      toast.error("Please enter a player name");
      return;
    }
    const totalScore = scores.reduce<number>((sum, s) => sum + (s ?? 0), 0);
    savePlayer({
      name: playerName.trim(),
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      scores: [...scores],
      totalScore,
      totalPar: getTotalPar(selectedCourse),
      handicap,
      flight,
    });
    toast.success(`${playerName} saved!`);
    navigate("/leaderboard");
  };

  const front9 = selectedCourse.holes.slice(0, 9);
  const back9 = selectedCourse.holes.slice(9, 18);
  const totalScore = scores.reduce<number>((sum, s) => sum + (s ?? 0), 0);
  const netScore = totalScore - handicap;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-golf-dark text-primary-foreground">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-black tracking-tight">
            GOLF <span className="text-golf-gold">SCORER</span>
          </h1>
          <nav className="flex gap-2">
            <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/")}>
              📝 Score
            </Button>
            <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/leaderboard")}>
              🏆 Leaderboard
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Profile Card */}
        <PlayerProfileCard name={playerName} course={selectedCourse} scores={scores} handicap={handicap} flight={flight} />

        {/* Course Selector */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">Select Golf Course</label>
          <CourseSelector selectedCourse={selectedCourse} onSelect={handleCourseChange} />
        </div>

        {/* Player Name */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">Player Name</label>
          <Input
            placeholder="Enter player name..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="text-base font-medium"
          />
        </div>

        {/* Flight & Handicap */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Flight</label>
            <div className="flex gap-2">
              {flights.map((f) => (
                <button
                  key={f}
                  onClick={() => setFlight(f)}
                  className={`flex-1 rounded-lg border-2 py-2.5 text-sm font-bold transition-all ${
                    flight === f
                      ? f === "A"
                        ? "border-destructive bg-destructive text-destructive-foreground"
                        : f === "B"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  Flight {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Handicap (HDC)</label>
            <Input
              type="number"
              min={0}
              max={54}
              value={handicap}
              onChange={(e) => setHandicap(parseInt(e.target.value) || 0)}
              className="text-base font-bold text-center"
            />
          </div>
        </div>

        {/* Score Tables */}
        <div className="grid gap-4 md:grid-cols-2">
          <ScoreTable holes={front9} scores={scores} onScoreChange={handleScoreChange} startIndex={0} label="Front 9 (OUT)" />
          <ScoreTable holes={back9} scores={scores} onScoreChange={handleScoreChange} startIndex={9} label="Back 9 (IN)" />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="golf" size="lg" className="flex-1" onClick={handleSave}>
            💾 Save & Add Next Player
          </Button>
          <Button variant="gold" size="lg" onClick={handleSaveAndView}>
            🏆 Save & View Leaderboard
          </Button>
        </div>
      </main>
    </div>
  );
}
