export interface ROActivity {
  id: number;
  id_game: number;
  id_team1: number;
  id_team2: number;
  id_winner?: number;
  plan: boolean;
  timestamp?: string;
}

export interface ROActivities {
  lastUpdate: number;
  activities: ROActivity[];
}

export interface ROGuess {
  id_team: number;
  guess: number;
}

export type ActivityDto = ROActivity;
