import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPlayers, deletePlayer, PlayerScore, Flight } from "@/lib/playerStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const flightConfig: { flight: Flight; label: string; headerClass: string }[] = [
  { flight: "A", label: "FLIGHT A", headerClass: "bg-destructive text-destructive-foreground" },
  { flight: "B", label: "FLIGHT B", headerClass: "bg-primary text-primary-foreground" },
  { flight: "C", label: "FLIGHT C", headerClass: "bg-accent text-accent-foreground" },
];

export default function Leaderboard() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<PlayerScore[]>([]);

  useEffect(() => {
    setPlayers(getPlayers());
  }, []);

  const handleDelete = (id: string, name: string) => {
    deletePlayer(id);
    setPlayers(getPlayers());
    toast.success(`${name} removed`);
  };

  const getFlightPlayers = (flight: Flight) =>
    players
      .filter((p) => p.flight === flight)
      .sort((a, b) => (a.totalScore - a.handicap) - (b.totalScore - b.handicap));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-golf-dark text-primary-foreground">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-black tracking-tight">
            GOLF <span className="text-golf-gold">SCORER</span>
          </h1>
          <nav className="flex gap-2">
            <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/")}>
              📝 Score
            </Button>
            <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/flights")}>
              ✈️ Flights
            </Button>
            <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/leaderboard")}>
              🏆 Leaderboard
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-6 space-y-8">
        <h2 className="text-center text-3xl font-black text-foreground">
          ⛳ Live Leaderboard
        </h2>

        {flightConfig.map(({ flight, label, headerClass }) => {
          const flightPlayers = getFlightPlayers(flight);
          return (
            <div key={flight} className="overflow-hidden rounded-xl border border-border shadow-sm">
              <div className={`px-5 py-3 font-black text-sm tracking-wider ${headerClass}`}>
                {label}
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                    <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-xs">Player Name</th>
                    <th className="px-5 py-3 text-center font-semibold uppercase tracking-wider text-xs">Gross</th>
                    <th className="px-5 py-3 text-center font-semibold uppercase tracking-wider text-xs">HDC</th>
                    <th className="px-5 py-3 text-center font-semibold uppercase tracking-wider text-xs">Net</th>
                    <th className="px-3 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {flightPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-4 text-center text-muted-foreground italic">
                        No players in this flight
                      </td>
                    </tr>
                  ) : (
                    flightPlayers.map((p) => (
                      <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3 font-semibold text-foreground">{p.name}</td>
                        <td className="px-5 py-3 text-center font-bold text-foreground">{p.totalScore}</td>
                        <td className="px-5 py-3 text-center text-muted-foreground">{p.handicap}</td>
                        <td className="px-5 py-3 text-center font-black text-primary">{p.totalScore - p.handicap}</td>
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="text-destructive/60 hover:text-destructive text-xs font-bold transition-colors"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
      </main>
    </div>
  );
}
