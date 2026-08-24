import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { RestService } from './rest.service';
import { Team, Game, Activity, ActivityState } from './model/objects';
import { AdminActivity, AdminGuess, AdminTeam } from './model/adminObjects';
import { ROActivity } from './model/restObject';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private rest = inject(RestService);

  private readonly _games = signal<Game[]>([]);
  private readonly _teams = signal<Team[]>([]);
  private readonly _myTeam = signal<Team | null>(null);
  private readonly _activities = signal<Activity[]>([]);

  readonly games = this._games.asReadonly();
  readonly teams = this._teams.asReadonly();
  readonly myTeam = this._myTeam.asReadonly();
  readonly activities = this._activities.asReadonly();

  getGames(): Observable<Game[]> {
    if (this._games().length > 0) return of(this._games());
    return this.rest.getGames().pipe(tap(g => this._games.set(g)));
  }

  getTeams(): Observable<Team[]> {
    if (this._teams().length > 0) return of(this._teams());
    return this.rest.getTeams().pipe(tap(t => this._teams.set(t)));
  }

  getMyTeam(): Observable<Team> {
    const cached = this._myTeam();
    if (cached) return of(cached);
    return this.rest.getTeam().pipe(tap(t => this._myTeam.set(t)));
  }

  loadActivities(): Observable<Activity[]> {
    return this.rest.getActivities().pipe(
      switchMap(response =>
        forkJoin({
          games: this.getGames(),
          teams: this.getTeams(),
          myTeam: this.getMyTeam()
        }).pipe(
          map(({ games, teams, myTeam }) =>
            response.activities.map(r => this.parseROActivity(r, games, teams, myTeam))
          ),
          tap(a => this._activities.set(a))
        )
      )
    );
  }

  mergeActivity(raw: ROActivity): void {
    const games = this._games(), teams = this._teams(), myTeam = this._myTeam();
    if (!games.length || !teams.length || !myTeam) return;
    const parsed = this.parseROActivity(raw, games, teams, myTeam);
    this._activities.update(current => {
      const idx = current.findIndex(a => a.id === parsed.id);
      if (idx >= 0) {
        const next = [...current];
        next[idx] = parsed;
        return next;
      }
      return [...current, parsed];
    });
  }

  private parseROActivity(raw: ROActivity, games: Game[], teams: Team[], myTeam: Team): Activity {
    const game = games.find(g => g.id === raw.id_game)!;
    const opponent = teams.find(t => t.id !== myTeam.id && (t.id === raw.id_team1 || t.id === raw.id_team2))!;
    const state: ActivityState = !raw.id_winner ? 'open' : raw.id_winner === myTeam.id ? 'won' : 'lost';
    return {
      id: raw.id,
      game,
      opponent,
      state,
      plan: raw.plan,
      timestamp: raw.timestamp ? new Date(raw.timestamp) : undefined
    };
  }

  newActivity(gameId: number, opponentId: number, state: 'won' | 'lost'): Observable<any> {
    return this.rest.postActivity(gameId, opponentId, state);
  }

  editActivity(activityId: number, winnerId: number): Observable<any> {
    return this.rest.putActivity(activityId, winnerId);
  }

  updateTeam(name: string, m1: string, m2: string): Observable<any> {
    return this.rest.putTeamUpdate(name, m1, m2).pipe(
      tap(() => {
        const t = this._myTeam();
        if (t) this._myTeam.set({ ...t, name, partner1: m1, partner2: m2 });
      })
    );
  }

  getAdminActivities(): Observable<AdminActivity[]> {
    return forkJoin({
      raws: this.rest.getAdminActivities(),
      games: this.getGames(),
      teams: this.getTeams()
    }).pipe(
      map(({ raws, games, teams }) =>
        raws.map(r => ({
          id: r.id,
          game: games.find(g => g.id === r.id_game)!,
          team1: teams.find(t => t.id === r.id_team1)!,
          team2: teams.find(t => t.id === r.id_team2)!,
          winner: r.id_winner ? teams.find(t => t.id === r.id_winner) : undefined,
          plan: r.plan,
          timestamp: r.timestamp ? new Date(r.timestamp) : undefined
        }))
      )
    );
  }

  editAdminActivity(activityId: number, gameId: number, team1Id: number, team2Id: number, winnerId: number | null): Observable<any> {
    return this.rest.putAdminActivity(activityId, gameId, team1Id, team2Id, winnerId);
  }

  deleteAdminActivity(activityId: number): Observable<any> {
    return this.rest.deleteAdminActivity(activityId);
  }

  getAdminTeams(): Observable<AdminTeam[]> {
    return this.rest.getAdminTeams();
  }

  getGuess(): Observable<number> {
    return this.rest.getGuess();
  }

  putGuess(guess: number): Observable<number> {
    return this.rest.putGuess(guess);
  }

  getFoundEastereggs() {
    return this.rest.getFoundEasterEggs();
  }

  getAdminFoundEastereggs() {
    return this.rest.getAllFoundEasterEggs();
  }

  postEasteregg(id: number) {
    return this.rest.postEasterEgg(id);
  }

  getAdminGuesses(): Observable<AdminGuess[]> {
    return forkJoin({
      guesses: this.rest.getAllGuess(),
      teams: this.getTeams()
    }).pipe(
      map(({ guesses, teams }) =>
        guesses.map(g => ({
          team: teams.find(t => t.id === g.id_team)!,
          guess: g.guess
        }))
      )
    );
  }

  checkLogin(): Observable<{ admin: boolean; easterEggs: number }> {
    return this.rest.getLogin();
  }

  login(id: number, password: string): Observable<any> {
    return this.rest.postLogin(id, password);
  }

  getAcceptEntries() {
    return this.rest.getAcceptEntries();
  }

  setAcceptEntries(val: boolean) {
    return this.rest.putAcceptEntries(val);
  }

  reset(): void {
    this._games.set([]);
    this._teams.set([]);
    this._myTeam.set(null);
    this._activities.set([]);
  }
}
