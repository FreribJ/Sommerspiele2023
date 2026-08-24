import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Team, Game } from './model/objects';
import { AdminTeam, AdminEasterEgg } from './model/adminObjects';
import { ROActivities, ROActivity, ROGuess } from './model/restObject';

@Injectable({ providedIn: 'root' })
export class RestService {
  private readonly base = (environment.production ? '' : environment.api) + environment.apiPrefix;
  private readonly opts = { withCredentials: true };

  constructor(private http: HttpClient) {}

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.base}/teams`);
  }

  getTeam(): Observable<Team> {
    return this.http.get<Team>(`${this.base}/team`, this.opts);
  }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.base}/games`, this.opts);
  }

  getLogin(): Observable<{ admin: boolean; easterEggs: number }> {
    return this.http.get<{ admin: boolean; easterEggs: number }>(`${this.base}/checkLogin`, this.opts);
  }

  postLogin(id: number, password: string): Observable<any> {
    return this.http.post<any>(`${this.base}/login`, { id, password }, this.opts);
  }

  getActivities(): Observable<ROActivities> {
    return this.http.get<ROActivities>(`${this.base}/activities`, this.opts);
  }

  postActivity(gameId: number, opponentId: number, state: string): Observable<any> {
    return this.http.post<any>(`${this.base}/activity`, { gameId, opponentId, state }, this.opts);
  }

  putActivity(id: number, winnerId: number): Observable<any> {
    return this.http.put<any>(`${this.base}/activity/${id}`, { winnerId }, this.opts);
  }

  getGuess(): Observable<number> {
    return this.http.get<number>(`${this.base}/guess`, this.opts);
  }

  putGuess(guess: number): Observable<number> {
    return this.http.put<number>(`${this.base}/guess`, { guess }, this.opts);
  }

  getFoundEasterEggs(): Observable<{ id: number }[]> {
    return this.http.get<{ id: number }[]>(`${this.base}/eastereggs`, this.opts);
  }

  postEasterEgg(id: number): Observable<any> {
    return this.http.post<any>(`${this.base}/easteregg`, { id }, this.opts);
  }

  putTeamUpdate(updatedTeamName: string, updatedTeamMate1: string, updatedTeamMate2: string): Observable<any> {
    return this.http.put<any>(`${this.base}/team/update`, { updatedTeamName, updatedTeamMate1, updatedTeamMate2 }, this.opts);
  }

  getAdminTeams(): Observable<AdminTeam[]> {
    return this.http.get<AdminTeam[]>(`${this.base}/admin/teams`, this.opts);
  }

  getAdminActivities(): Observable<ROActivity[]> {
    return this.http.get<ROActivity[]>(`${this.base}/admin/activities`, this.opts);
  }

  getAdminActivity(id: number): Observable<ROActivity> {
    return this.http.get<ROActivity>(`${this.base}/admin/activity/${id}`, this.opts);
  }

  putAdminActivity(id: number, gameId: number, team1Id: number, team2Id: number, winnerId: number | null): Observable<any> {
    return this.http.put<any>(`${this.base}/admin/activity/${id}`, { gameId, team1Id, team2Id, winnerId }, this.opts);
  }

  deleteAdminActivity(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/admin/activity/${id}`, this.opts);
  }

  getAllGuess(): Observable<ROGuess[]> {
    return this.http.get<ROGuess[]>(`${this.base}/admin/guess`, this.opts);
  }

  getAllFoundEasterEggs(): Observable<AdminEasterEgg[]> {
    return this.http.get<AdminEasterEgg[]>(`${this.base}/admin/eastereggs`, this.opts);
  }

  getAcceptEntries(): Observable<{ acceptEntries: boolean }> {
    return this.http.get<{ acceptEntries: boolean }>(`${this.base}/admin/acceptentries`, this.opts);
  }

  putAcceptEntries(acceptEntries: boolean): Observable<{ acceptEntries: boolean }> {
    return this.http.put<{ acceptEntries: boolean }>(`${this.base}/admin/acceptentries`, { acceptEntries }, this.opts);
  }
}
