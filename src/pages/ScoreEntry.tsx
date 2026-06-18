import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Course, getTotalPar } from "@/lib/courseData"; 
import { savePlayer } from "@/lib/playerStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PlayerProfileCard from "@/components/PlayerProfileCard";
import ScoreTable from "@/components/ScoreTable";
import { toast } from "sonner";
import Header from "@/components/Header";
import { DEFAULT_COURSE_PAR, getStoredConfig, calculateSystem36Hdc, calculateFlightByHdc } from "@/lib/flightUtils";

export default function ScoreEntry() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [scores, setScores] = useState<(number | null)[]>(Array(18).fill(null));
  const [flightConfig, setFlightConfig] = useState(getStoredConfig());
  const [coursePars, setCoursePars] = useState<number[]>([]);

  useEffect(() => {
    // 2. ดึงข้อมูลสนามจาก LocalStorage
    const savedCoursePar = localStorage.getItem("golf_course_par");
    const parsedPar = savedCoursePar ? JSON.parse(savedCoursePar) : DEFAULT_COURSE_PAR;
    
    if (!savedCoursePar) {
      localStorage.setItem("golf_course_par", JSON.stringify(DEFAULT_COURSE_PAR));
    }

    setCoursePars(parsedPar.map((h: any) => h.par));
    setFlightConfig(getStoredConfig());

    const dynamicCourse: Course = {
      id: "custom-profile",
      name: "Custom Course",
      holes: parsedPar.map((h: any) => ({
        number: h.hole,
        par: h.par,
        handicap: h.hole 
      }))
    };
    setSelectedCourse(dynamicCourse);
  }, []);

  // Update real-time HDC and Flight
  const currentHdc = calculateSystem36Hdc(scores, coursePars);
  const currentFlight = calculateFlightByHdc(currentHdc, flightConfig);

  const handleSave = (shouldNavigate = false) => {
    if (!playerName.trim()) {
      toast.error("Please enter a player name");
      return;
    }
    if (!selectedCourse) return;

    const totalScore = scores.reduce<number>((sum, s) => sum + (s ?? 0), 0);
    
    // บันทึกลง store (ซึ่งมักจะบันทึกลง localStorage ให้อยู่แล้ว)
    savePlayer({
      name: playerName.trim(),
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      scores: [...scores],
      totalScore,
      totalPar: getTotalPar(selectedCourse),
      handicap: 0, // Handicap is calculated on the Leaderboard
      flight: "C", // Flight is assigned on the Leaderboard
    });

    toast.success(`${playerName} saved!`);
    
    if (shouldNavigate) {
      navigate("/leaderboard");
    } else {
      setPlayerName("");
      setScores(Array(18).fill(null));
    }
  };

  if (!selectedCourse) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header>
      </Header>

      <main className="container mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Profile Card */}
        <PlayerProfileCard 
          name={playerName} 
          course={selectedCourse} 
          scores={scores} 
          handicap={currentHdc}
          flight={currentFlight}
        />

        {/* Input ข้อมูลนักกอล์ฟ */}
        <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center">
          <div className="w-full max-w-sm">
            <label className="text-xs font-bold uppercase text-muted-foreground">Player Name</label>
            <Input value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="mt-1" placeholder="Enter player name" />
          </div>
        </div>

        {/* ตารางคะแนน */}
        <div className="grid gap-4 md:grid-cols-2">
          <ScoreTable 
            holes={selectedCourse.holes.slice(0, 9)} 
            scores={scores} 
            onScoreChange={(i, v) => {
              const newScores = [...scores];
              newScores[i] = v;
              setScores(newScores);
            }} 
            startIndex={0} 
            label="Front 9" 
          />
          <ScoreTable 
            holes={selectedCourse.holes.slice(9, 18)} 
            scores={scores} 
            onScoreChange={(i, v) => {
              const newScores = [...scores];
              newScores[i] = v;
              setScores(newScores);
            }} 
            startIndex={9} 
            label="Back 9" 
          />
        </div>

        <div className="flex gap-3">
          <Button variant="default" className="flex-1 h-12 text-lg font-bold" onClick={() => handleSave(false)}>
            💾 Save & Next
          </Button>
          <Button variant="secondary" className="h-12" onClick={() => handleSave(true)}>
            🏆 Leaderboard
          </Button>
        </div>
      </main>
    </div>
  );
}