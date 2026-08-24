import { Team, Game } from './objects';

export interface AdminTeam extends Team {
  password: string;
}

export interface AdminActivity {
  id: number;
  game: Game;
  team1: Team;
  team2: Team;
  winner?: Team;
  plan: boolean;
  timestamp?: Date;
}

export interface AdminGuess {
  team: Team;
  guess: number;
}

export interface AdminEasterEgg {
  id: number;
  id_team: number;
}
