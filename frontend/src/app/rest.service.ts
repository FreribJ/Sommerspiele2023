import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Activity, Game, Team} from "./model/objects";
import {AdminTeam} from "./model/adminObjects";
import {ROActivities, ROActivity, ROGuess} from "./model/restObject";

@Injectable({
  providedIn: 'root'
})
export class RestService {

  BACKEND_IP = false ? "localhost" : "frenkersommerspiele.ddns.net"
  BACKEND_PORT = 8081

  constructor(private http: HttpClient) { }

  getTeam(): Observable<Team> {
    return this.http.get<Team>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/team`, {withCredentials:true})
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/teams`)
  }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/games`, {withCredentials:true})
  }

  getAdminTeams(): Observable<AdminTeam[]> {
    return this.http.get<AdminTeam[]>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/admin/teams`, {withCredentials:true})
  }

  postLogin(teamId: number, password: string): Observable<any> {
    return this.http.post<any>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/login`, {id: teamId, password}, {withCredentials: true})
  }

  getLogin(): Observable<{admin: boolean, easterEggs: number}> {
    return this.http.get<{ admin: boolean, easterEggs: number }>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/checkLogin`, {withCredentials:true})
  }
  getActivities(since: number): Observable<ROActivities> {
    if (since)
      return this.http.get<ROActivities>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/activities?since=${since}`, {withCredentials:true})
    else
      return this.http.get<ROActivities>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/activities`, {withCredentials:true})
  }

  getAdminActivities(): Observable<ROActivity[]> {
    return this.http.get<ROActivity[]>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/admin/activities`, {withCredentials:true})
  }

  postActivity(gameId: number, opponentId: number, state: 'won'|'lost'): Observable<Activity> {
    return this.http.post<Activity>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/activity`, {gameId, opponentId, state}, {withCredentials:true})
  }

  putActivity(activityId: number, winnerId: number): Observable<Activity> {
    return this.http.put<Activity>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/activity/${activityId}`, {winnerId}, {withCredentials:true})
  }

  putAdminActivity(activityId: number, gameId: number, team1Id: number, team2Id: number, winnerId: number | null): Observable<Activity> {
    return this.http.put<Activity>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/admin/activity/${activityId}`, {gameId, team1Id, team2Id, winnerId}, {withCredentials:true})
  }

  deleteAdminActivity(activityId: number) {
    return this.http.delete<any>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/admin/activity/${activityId}`, {withCredentials:true})
  }

  getGuess(): Observable<number> {
    return this.http.get<number>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/guess`, {withCredentials:true})
  }

  putGuess(guess: number): Observable<number> {
    return this.http.put<number>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/guess`, {guess}, {withCredentials:true})
  }

  getAllGuess(): Observable<ROGuess[]> {
    return this.http.get<ROGuess[]>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/admin/guess`, {withCredentials:true})
  }

  getFoundEasterEggs() {
    return this.http.get<{id: number}[]>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/eastereggs`, {withCredentials:true})
  }
  postEasterEgg(id: number) {
    return this.http.post(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/easteregg`, {id}, {withCredentials:true})
  }

  getAcceptEntries(): Observable<{acceptEntries: boolean}> {
    return this.http.get<{acceptEntries: boolean}>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/admin/acceptentries`, {withCredentials:true})
  }

  putAcceptEntries(acceptEntries: boolean)  {
    return this.http.put<{acceptEntries: boolean}>(`http://${this.BACKEND_IP}:${this.BACKEND_PORT}/admin/acceptentries`, {acceptEntries}, {withCredentials:true})
  }
}

