import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPlayers, deletePlayer, PlayerScore } from "@/lib/playerStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PlayerList() {
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
            <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/players")}>
              🏆 Players
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">🏆 Player Scores</h2>
          <Button variant="golf" onClick={() => navigate("/")}>+ Add Player</Button>
        </div>

        {players.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-4xl mb-3">⛳</p>
            <p className="text-muted-foreground font-medium">No players yet. Start scoring!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {players.map((p) => {
              const diff = p.totalScore - p.totalPar;
              return (
                <div key={p.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.courseName} · {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-foreground">{p.totalScore}</p>
                    <p className={`text-xs font-bold ${diff < 0 ? "text-primary" : diff > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                      {diff === 0 ? "Even" : diff > 0 ? `+${diff}` : diff}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id, p.name)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    ✕
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
