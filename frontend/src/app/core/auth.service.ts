import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly base = (environment.production ? '' : environment.api) + environment.apiPrefix;

  private readonly _isLoggedIn = signal<boolean | null>(null);
  private readonly _isAdmin = signal(false);
  private readonly _easterEggCount = signal(0);

  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  readonly isAdmin = this._isAdmin.asReadonly();
  readonly easterEggCount = this._easterEggCount.asReadonly();

  constructor(private http: HttpClient) {}

  checkLogin(): Observable<{ admin: boolean; easterEggs: number }> {
    return this.http.get<{ admin: boolean; easterEggs: number }>(`${this.base}/checkLogin`, {
      withCredentials: true
    }).pipe(
      tap(r => {
        this._isLoggedIn.set(true);
        this._isAdmin.set(r.admin);
        this._easterEggCount.set(r.easterEggs);
      }),
      catchError(err => {
        this._isLoggedIn.set(false);
        return throwError(() => err);
      })
    );
  }

  incrementEasterEggs(): void {
    this._easterEggCount.update(n => n + 1);
  }

  logout(): void {
    document.cookie = 'login-token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    this._isLoggedIn.set(false);
    this._isAdmin.set(false);
    this._easterEggCount.set(0);
  }
}
