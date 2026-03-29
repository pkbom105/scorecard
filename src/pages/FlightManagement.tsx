import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPlayers, updatePlayerFlight, PlayerScore, Flight } from "@/lib/playerStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const flightConfig: { flight: Flight; label: string; headerClass: string }[] = [
  { flight: "A", label: "FLIGHT A", headerClass: "bg-destructive text-destructive-foreground" },
  { flight: "B", label: "FLIGHT B", headerClass: "bg-primary text-primary-foreground" },
  { flight: "C", label: "FLIGHT C", headerClass: "bg-accent text-accent-foreground" },
];

export default function FlightManagement() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<PlayerScore[]>([]);

  useEffect(() => {
    setPlayers(getPlayers());
  }, []);

  const handleFlightChange = (playerId: string, newFlight: Flight) => {
    updatePlayerFlight(playerId, newFlight);
    setPlayers(getPlayers());
    toast.success("Flight updated");
  };

  const getFlightPlayers = (flight: Flight) =>
    players
      .filter((p) => p.flight === flight)
      .sort((a, b) => a.name.localeCompare(b.name));

  const unassigned = players.filter((p) => !p.flight || p.flight === "A");

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
          ✈️ Flight Assignment
        </h2>

        <p className="text-center text-sm text-muted-foreground">
          Assign each player to Flight A, B, or C. This determines their leaderboard grouping.
        </p>

        {/* All players table with flight selector */}
        <div className="overflow-hidden rounded-xl border border-border shadow-sm">
          <div className="bg-golf-dark px-5 py-3 font-black text-sm tracking-wider text-primary-foreground">
            ALL PLAYERS
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-xs">Player Name</th>
                <th className="px-5 py-3 text-center font-semibold uppercase tracking-wider text-xs">Course</th>
                <th className="px-5 py-3 text-center font-semibold uppercase tracking-wider text-xs">Gross</th>
                <th className="px-5 py-3 text-center font-semibold uppercase tracking-wider text-xs">Flight</th>
              </tr>
            </thead>
            <tbody>
              {players.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground italic">
                    No players yet. Add players from the Score page first.
                  </td>
                </tr>
              ) : (
                players
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((p) => (
                    <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 font-semibold text-foreground">{p.name}</td>
                      <td className="px-5 py-3 text-center text-muted-foreground text-xs">{p.courseName}</td>
                      <td className="px-5 py-3 text-center font-bold text-foreground">{p.totalScore}</td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex gap-1.5 justify-center">
                          {flightConfig.map(({ flight, label, headerClass }) => (
                            <button
                              key={flight}
                              onClick={() => handleFlightChange(p.id, flight)}
                              className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                                p.flight === flight
                                  ? headerClass
                                  : "border border-border bg-card text-muted-foreground hover:border-primary/50"
                              }`}
                            >
                              {flight}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* Flight summary */}
        <div className="grid gap-4 md:grid-cols-3">
          {flightConfig.map(({ flight, label, headerClass }) => {
            const fp = getFlightPlayers(flight);
            return (
              <div key={flight} className="overflow-hidden rounded-xl border border-border shadow-sm">
                <div className={`px-4 py-2.5 font-black text-xs tracking-wider ${headerClass}`}>
                  {label} ({fp.length})
                </div>
                <div className="p-3 space-y-1">
                  {fp.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-2">Empty</p>
                  ) : (
                    fp.map((p) => (
                      <div key={p.id} className="flex justify-between text-xs py-1 border-b border-border/30 last:border-0">
                        <span className="font-medium text-foreground">{p.name}</span>
                        <span className="text-muted-foreground">{p.totalScore}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
