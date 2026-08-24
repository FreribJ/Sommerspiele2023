import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-admin', standalone: true,
  imports: [RouterLink, MatListModule, MatIconModule, MatCardModule],
  template: `<h2>Admin-Bereich</h2>
  <mat-nav-list>
    <a mat-list-item routerLink="teams"><mat-icon matListItemIcon>groups</mat-icon><span matListItemTitle>Teams</span></a>
    <a mat-list-item routerLink="activities"><mat-icon matListItemIcon>list</mat-icon><span matListItemTitle>Aktivitäten</span></a>
    <a mat-list-item routerLink="guessing"><mat-icon matListItemIcon>help</mat-icon><span matListItemTitle>Ratespiel</span></a>
    <a mat-list-item routerLink="result"><mat-icon matListItemIcon>leaderboard</mat-icon><span matListItemTitle>Ergebnis</span></a>
    <a mat-list-item routerLink="stats"><mat-icon matListItemIcon>bar_chart</mat-icon><span matListItemTitle>Statistiken</span></a>
  </mat-nav-list>`
})
export class AdminComponent {}
