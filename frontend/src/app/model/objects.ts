export interface Team {
  id: number;
  name: string;
  partner1: string;
  partner2: string;
  clique: 'jannes' | 'mattes';
  passwordSet: boolean;
}

export interface Game {
  id: number;
  name: string;
  description: string;
}

export type ActivityState = 'won' | 'lost' | 'open';

export interface Activity {
  id: number;
  game: Game;
  opponent: Team;
  state: ActivityState;
  plan: boolean;
  timestamp?: Date;
}

export interface Easteregg {
  id: number;
  srcImage: string;
  title: string;
  text?: string;
}
