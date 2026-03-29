export type Flight = "A" | "B" | "C";

export interface PlayerScore {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  scores: (number | null)[];
  totalScore: number;
  totalPar: number;
  handicap: number;
  flight: Flight;
  createdAt: string;
}

const STORAGE_KEY = "golf-players";

export function getPlayers(): PlayerScore[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePlayer(player: Omit<PlayerScore, "id" | "createdAt">): PlayerScore {
  const players = getPlayers();
  const newPlayer: PlayerScore = {
    ...player,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  players.push(newPlayer);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  return newPlayer;
}

export function deletePlayer(id: string) {
  const players = getPlayers().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}
