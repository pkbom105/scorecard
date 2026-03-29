import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getButtonClass = (path: string) => {
    const isActive = location.pathname === path;
    return `text-primary-foreground/80 hover:text-white hover:bg-white/10 px-2 sm:px-4 ${
      isActive ? "bg-white/10 text-white font-bold" : ""
    }`;
  };

  return (
    <header className="border-b bg-golf-dark text-white p-4 sticky top-0 z-20 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="font-black text-xl tracking-tighter uppercase">
          Score <span className="text-golf-gold">Card</span>
        </h1>
        {/* Navigation Menu */}
        <nav className="flex items-center gap-1 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            className={getButtonClass("/")}
            onClick={() => navigate("/")}
          >
            <span className="mr-1.5 hidden sm:inline">📝</span>
            <span className="text-xs sm:text-sm font-bold">Score</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={getButtonClass("/flights")}
            onClick={() => navigate("/flights")}
          >
            <span className="mr-1.5 hidden sm:inline">✈️</span>
            <span className="text-xs sm:text-sm font-bold">Flights</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={getButtonClass("/leaderboard")}
            onClick={() => navigate("/leaderboard")}
          >
            <span className="mr-1.5 hidden sm:inline">🏆</span>
            <span className="text-xs sm:text-sm font-bold">Leaderboard</span>
          </Button>
          {children}
        </nav>
      </div>
    </header>
  );
}
