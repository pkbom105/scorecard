import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPlayers, deletePlayer, PlayerScore } from "@/lib/playerStore";
import { toast } from "sonner";
import { getStoredConfig, FlightConfig, calculateFlightByHdc, calculateSystem36Hdc } from "@/lib/flightUtils";
import { Trash2, Trophy, Medal } from "lucide-react";
import Header from "@/components/Header";

export default function Leaderboard() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<PlayerScore[]>([]);
  const [flightConfigs, setFlightConfigs] = useState<FlightConfig[]>([]);
  const [coursePars, setCoursePars] = useState<number[]>([]);

  useEffect(() => {
    setPlayers(getPlayers());
    setFlightConfigs(getStoredConfig());

    const savedCourse = localStorage.getItem("golf_course_par");
    if (savedCourse) {
      const parsed = JSON.parse(savedCourse);
      setCoursePars(parsed.map((h: any) => h.par));
    } else {
      setCoursePars(Array(18).fill(4));
    }
  }, []);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`คุณต้องการลบข้อมูลของ ${name} ใช่หรือไม่?`)) {
      deletePlayer(id);
      setPlayers(getPlayers());
      toast.success(`ลบข้อมูล ${name} เรียบร้อยแล้ว`);
    }
  };

  const getFlightPlayers = (config: FlightConfig) => {
    return players
      .map(p => {
        const calculatedHdc = calculateSystem36Hdc(p.scores, coursePars);
        return { ...p, handicap: calculatedHdc };
      })
      .filter((p) => {
        const flight = calculateFlightByHdc(p.handicap, flightConfigs);
        return flight === config.flight;
      })
      .sort((a, b) => {
        const netA = a.totalScore - a.handicap;
        const netB = b.totalScore - b.handicap;
        if (netA !== netB) return netA - netB;
        return a.handicap - b.handicap;
      });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto max-w-4xl px-4 py-8 space-y-10">
        <div className="text-center space-y-2">
          <Trophy className="w-12 h-12 mx-auto text-golf-gold" />
          <h2 className="text-3xl font-black uppercase italic">Tournament Standings</h2>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em]">Live Calculation based on Flight Rules</p>
        </div>

        {flightConfigs.map((config) => {
          const flightPlayers = getFlightPlayers(config);
          return (
            <div key={config.flight} className="rounded-3xl overflow-hidden border shadow-sm bg-white">
              <div className={`px-6 py-4 flex justify-between items-center text-white ${config.headerClass}`}>
                <div className="flex items-center gap-2">
                  <Medal className="w-5 h-5" />
                  <span className="font-black tracking-widest uppercase">{config.label}</span>
                </div>
                <span className="text-[10px] font-bold bg-black/20 px-3 py-1 rounded-full italic">
                  HDC: {config.min}-{config.max}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b">
                      <th className="px-4 py-3 text-center font-bold text-[10px]">POS</th>
                      <th className="px-4 py-3 text-left font-bold text-[10px]">PLAYER</th>
                      <th className="px-2 py-3 text-center font-bold text-[10px]">GROSS</th>
                      <th className="px-2 py-3 text-center font-bold text-[10px]">HDC</th>
                      <th className="px-4 py-3 text-right font-bold text-[10px]">NET</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {flightPlayers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-slate-400 italic">No players in this flight</td>
                      </tr>
                    ) : (
                      flightPlayers.map((p, index) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 group">
                          <td className="px-4 py-4 text-center font-black text-slate-400 italic">
                            {index + 1}
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-bold text-slate-800 uppercase">{p.name}</span>
                          </td>
                          <td className="px-2 py-4 text-center font-bold">{p.totalScore}</td>
                          <td className="px-2 py-4 text-center text-slate-800">{p.handicap}</td>
                          <td className="px-4 py-4 text-right font-black text-xl italic text-primary">
                            {p.totalScore - p.handicap}
                          </td>
                          <td className="px-2 py-4">
                            <button onClick={() => handleDelete(p.id, p.name)} className="opacity-0 group-hover:opacity-100 p-2 text-red-300 hover:text-red-500 transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}